import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import toast from "react-hot-toast";

import { registrarPagoParent, getBancos, getConfiguracionPagosPublica } from "../../api/pagosAPI";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const METODOS_PAGO = [
  { value: 'Yape', label: '📱 Yape' },
  { value: 'Plin', label: '💳 Plin' },
  { value: 'Transferencia', label: '🏦 Transferencia Bancaria' },
  { value: 'Depósito', label: '💵 Depósito en Ventanilla/Agente' }
];

export default function PagoModal({ show, onHide, deudas = [], onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [selectedDeudas, setSelectedDeudas] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [configPago, setConfigPago] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const [formData, setFormData] = useState({
    metodo_pago: "Yape",
    numero_operacion: "",
    banco: "",
    comprobante_img: null,
  });

  // Cargar datos al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBancos, resConfig] = await Promise.all([
          getBancos(),
          getConfiguracionPagosPublica()
        ]);
        setBancos(Array.isArray(resBancos) ? resBancos : resBancos?.results || []);
        setConfigPago(resConfig);
      } catch (err) {
        console.error("Error al cargar configuración de pagos:", err);
      }
    };
    fetchData();
  }, []);

  // Resetear estados al abrir/cerrar modal
  useEffect(() => {
    if (show) {
      setSelectedDeudas([]);
      setFormData({
        metodo_pago: "Yape",
        numero_operacion: "",
        banco: "",
        comprobante_img: null,
      });
      setPreviewImg(null);
    }
  }, [show]);

  const montoTotalSeleccionado = useMemo(() => {
    return selectedDeudas.reduce((acc, deudaId) => {
      const deuda = deudas.find((d) => d.id === deudaId);
      return acc + (deuda ? parseFloat(deuda.saldo_pendiente) : 0);
    }, 0);
  }, [selectedDeudas, deudas]);

  const opcionesBancos = useMemo(() => {
    return bancos.map((b) => ({
      value: b.id,
      label: `${b.nombre} ${b.numero_cuenta ? `(${b.numero_cuenta})` : ""}`,
    }));
  }, [bancos]);

  const handleToggleDeuda = (deudaId) => {
    setSelectedDeudas((prev) =>
      prev.includes(deudaId)
        ? prev.filter((id) => id !== deudaId)
        : [...prev, deudaId]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, comprobante_img: file });
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleCopy = (text, label) => {
    if (!text) {
      toast.error(`${label} no disponible`);
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const handleSubmit = async () => {
    if (selectedDeudas.length === 0) {
      toast.error("Seleccione al menos un concepto a pagar");
      return;
    }

    const requiereBanco = ["Transferencia", "Depósito"].includes(formData.metodo_pago);

    if (requiereBanco && !formData.banco) {
      toast.error("Seleccione el banco de destino");
      return;
    }

    if (!formData.numero_operacion.trim()) {
      toast.error("Ingrese el número de operación");
      return;
    }

    if (!formData.comprobante_img) {
      toast.error("Adjunte la foto del voucher o comprobante");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("deuda_id", selectedDeudas[0]);
      selectedDeudas.forEach((id) => data.append("deudas_ids", id));
      data.append("monto", montoTotalSeleccionado.toFixed(2));
      data.append("metodo_pago", formData.metodo_pago);
      data.append("numero_operacion", formData.numero_operacion.trim());
      data.append("comprobante_img", formData.comprobante_img);

      if (requiereBanco && formData.banco) {
        data.append("banco", formData.banco);
      }

      await registrarPagoParent(data);
      toast.success("¡Pago registrado! Estaremos validándolo pronto.");

      onSuccess();
      onHide();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="modal-pago-jardin">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
          <span>💳</span> Registrar Nuevo Pago
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {/* PASO 1: SELECCIÓN DE DEUDAS */}
        <div className="mb-4">
          <label className="form-label fw-bold text-secondary text-uppercase small tracking-wide">
            1. Selecciona los conceptos a pagar
          </label>
          
          {deudas?.length === 0 ? (
            <div className="alert alert-light border text-center text-muted rounded-4 py-3">
              🎉 ¡Excelente! No tienes deudas pendientes por pagar.
            </div>
          ) : (
            <div className="d-flex flex-column gap-2" style={{ maxHeight: "220px", overflowY: "auto" }}>
              {deudas?.map((deuda) => {
                const conceptoNombre = deuda.concepto_detail?.nombre || deuda.concepto_nombre || "Concepto";
                const mesNombre = deuda.mes ? ` - ${MESES[deuda.mes - 1]} ${deuda.anio}` : "";
                const isSelected = selectedDeudas.includes(deuda.id);
                const isDisabled = deuda.tiene_pago_pendiente;

                return (
                  <div
                    key={deuda.id}
                    onClick={() => !isDisabled && handleToggleDeuda(deuda.id)}
                    className={`p-3 rounded-3 border transition-all d-flex align-items-center justify-content-between ${
                      isDisabled
                        ? "bg-light opacity-50 border-dashed cursor-not-allowed"
                        : isSelected
                        ? "border-primary bg-primary-subtle shadow-sm cursor-pointer"
                        : "border-light-subtle bg-white hover-shadow cursor-pointer"
                    }`}
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="checkbox"
                        className="form-check-input mt-0 cursor-pointer"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => {}} // Manejado por el parent div
                      />
                      <div>
                        <div className="fw-bold text-dark">
                          {conceptoNombre}{mesNombre}
                        </div>
                        {deuda.detalle_adicional && (
                          <div className="text-muted small">{deuda.detalle_adicional}</div>
                        )}
                        <div className="text-muted extra-small">
                          📅 Vence: {new Date(deuda.fecha_vencimiento).toLocaleDateString("es-PE")}
                        </div>
                        {isDisabled && (
                          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle mt-1">
                            ⏳ En proceso de revisión
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="fs-5 fw-bold text-success">
                        S/ {Number(deuda.saldo_pendiente).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RESUMEN DEL TOTAL */}
        <div className="bg-gradient-primary text-white p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between shadow-sm">
          <div>
            <span className="text-white-50 small d-block">Monto Total a Transferir:</span>
            <span className="fs-3 fw-bolder">S/ {montoTotalSeleccionado.toFixed(2)}</span>
          </div>
          <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold">
            {selectedDeudas.length} {selectedDeudas.length === 1 ? "concepto" : "conceptos"}
          </span>
        </div>

        {/* PASO 2: MÉTODO DE PAGO */}
        <div className="mb-4">
          <label className="form-label fw-bold text-secondary text-uppercase small tracking-wide">
            2. Método de pago
          </label>
          <Select
            options={METODOS_PAGO}
            value={METODOS_PAGO.find((o) => o.value === formData.metodo_pago) || null}
            onChange={(selected) =>
              setFormData({
                ...formData,
                metodo_pago: selected ? selected.value : "Yape",
                banco: selected && ["Transferencia", "Depósito"].includes(selected.value) ? formData.banco : "",
              })
            }
            classNamePrefix="react-select"
            isSearchable={false}
          />
        </div>

        {/* TARJETAS QR INTERACTIVAS (YAPE / PLIN) */}
        {formData.metodo_pago === "Yape" && configPago && (
          <div className="card border-0 bg-yape text-white p-3 rounded-4 mb-4 text-center">
            <h6 className="fw-bold mb-2">📱 Pago rápido vía Yape</h6>
            {configPago.qr_yape && (
              <div className="bg-white p-2 rounded-3 d-inline-block mx-auto mb-2 shadow-sm">
                <img src={configPago.qr_yape} alt="QR Yape" style={{ width: "130px", height: "130px", objectFit: "contain" }} />
              </div>
            )}
            <div className="fw-bold fs-5">{configPago.numero_yape || "--- --- ---"}</div>
            <div className="small opacity-75">{configPago.titular_yape}</div>
            <button
              type="button"
              className="btn btn-sm btn-light rounded-pill mt-2 fw-semibold px-3 mx-auto"
              onClick={() => handleCopy(configPago.numero_yape, "Número Yape")}
            >
              📋 Copiar Número
            </button>
          </div>
        )}

        {formData.metodo_pago === "Plin" && configPago && (
          <div className="card border-0 bg-plin text-white p-3 rounded-4 mb-4 text-center">
            <h6 className="fw-bold mb-2">💳 Pago rápido vía Plin</h6>
            {configPago.qr_plin && (
              <div className="bg-white p-2 rounded-3 d-inline-block mx-auto mb-2 shadow-sm">
                <img src={configPago.qr_plin} alt="QR Plin" style={{ width: "130px", height: "130px", objectFit: "contain" }} />
              </div>
            )}
            <div className="fw-bold fs-5">{configPago.numero_plin || "--- --- ---"}</div>
            <div className="small opacity-75">{configPago.titular_plin}</div>
            <button
              type="button"
              className="btn btn-sm btn-light rounded-pill mt-2 fw-semibold px-3 mx-auto"
              onClick={() => handleCopy(configPago.numero_plin, "Número Plin")}
            >
              📋 Copiar Número
            </button>
          </div>
        )}

        {/* BANCO (Transferencia / Depósito) */}
        {["Transferencia", "Depósito"].includes(formData.metodo_pago) && (
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary small">Seleccionar Banco de Destino</label>
            <Select
              options={opcionesBancos}
              value={opcionesBancos.find((o) => String(o.value) === String(formData.banco)) || null}
              onChange={(selected) => setFormData({ ...formData, banco: selected ? selected.value : "" })}
              placeholder="-- Elegir entidad bancaria --"
              isClearable
              noOptionsMessage={() => "No hay bancos registrados"}
            />
          </div>
        )}

        {/* PASO 3: DATOS DEL VOUCHER */}
        <div className="row g-3 mb-2">
          <div className="col-md-6">
            <label className="form-label fw-bold text-secondary text-uppercase small tracking-wide">
              3. Nº de Operación
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="Ej. 0849201"
              value={formData.numero_operacion}
              onChange={(e) => setFormData({ ...formData, numero_operacion: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold text-secondary text-uppercase small tracking-wide">
              4. Voucher / Foto
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control rounded-3"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* PREVIEW DEL COMPROBANTE */}
        {previewImg && (
          <div className="mt-3 text-center bg-light p-2 rounded-3 border">
            <span className="small text-muted d-block mb-1">Vista previa del voucher:</span>
            <img
              src={previewImg}
              alt="Voucher Preview"
              className="rounded-2 shadow-sm"
              style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }}
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 px-4 pb-4">
        <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onHide}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
          disabled={loading || selectedDeudas.length === 0}
          onClick={handleSubmit}
        >
          {loading ? "Procesando..." : "Registrar Pago"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
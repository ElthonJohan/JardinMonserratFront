import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

import { registrarPagoParent, getBancos } from "../../api/pagosAPI";
import { getConfiguracionPagosPublica } from "../../api/pagosAPI";

export default function PagoModal({ show, onHide, deudas, onSuccess }) {
  console.log("DEUDAS RECIBIDAS:", deudas);

  const [loading, setLoading] = useState(false);
  const [selectedDeudas, setSelectedDeudas] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [configPago, setConfigPago] = useState(null);


  const [formData, setFormData] = useState({
    metodo_pago: "Yape",
    numero_operacion: "",
    banco: "",
    comprobante_img: null,
  });

  // Cargar bancos al montar el componente
  useEffect(() => {
    const fetchBancos = async () => {
      try {
        const res = await getBancos();
        const bancosArray = Array.isArray(res) ? res : res?.results || [];
        setBancos(bancosArray);
      } catch (err) {
        console.error("Error al obtener bancos:", err);
      }
    };
    fetchBancos();

    const fetchConfiguracion = async () => {
  try {
    const data = await getConfiguracionPagosPublica();
    setConfigPago(data);
  } catch (err) {
    console.error(err);
  }
};
fetchConfiguracion();
  }, []);

  // Resetear estados cuando se abre/cierra el modal
  useEffect(() => {
    if (show) {
      setSelectedDeudas([]);
      setFormData({
        metodo_pago: "Yape",
        numero_operacion: "",
        banco: "",
        comprobante_img: null,
      });
    }
  }, [show]);

  const montoTotalSeleccionado = selectedDeudas.reduce((acc, deudaId) => {
    const deuda = deudas.find((d) => d.id === deudaId);
    return acc + (deuda ? parseFloat(deuda.saldo_pendiente) : 0);
  }, 0);

  const handleToggleDeuda = (deudaId) => {
    setSelectedDeudas((prev) =>
      prev.includes(deudaId)
        ? prev.filter((id) => id !== deudaId)
        : [...prev, deudaId],
    );
  };

  const handleSubmit = async () => {
    if (selectedDeudas.length === 0) {
      toast.error("Seleccione al menos una deuda");
      return;
    }

    const requiereBanco = ["Transferencia", "Depósito"].includes(
      formData.metodo_pago,
    );

    if (requiereBanco && !formData.banco) {
      toast.error("Seleccione el banco");
      return;
    }

    if (!formData.numero_operacion) {
      toast.error("Ingrese número de operación");
      return;
    }

    if (!formData.comprobante_img) {
      toast.error("Adjunte voucher");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      // Enviar deuda_id para compatibilidad con backend antiguo si existiese
      data.append("deuda_id", selectedDeudas[0]);

      // Enviar lista de ids para soporte de múltiples deudas
      selectedDeudas.forEach((id) => {
        data.append("deudas_ids", id);
      });

      data.append("monto", montoTotalSeleccionado.toFixed(2));
      data.append("metodo_pago", formData.metodo_pago);
      data.append("numero_operacion", formData.numero_operacion);
      data.append("comprobante_img", formData.comprobante_img);

      if (requiereBanco && formData.banco) {
        data.append("banco", formData.banco);
      }

      await registrarPagoParent(data);

      toast.success("Pago registrado correctamente");

      setSelectedDeudas([]);
      setFormData({
        metodo_pago: "Yape",
        numero_operacion: "",
        banco: "",
        comprobante_img: null,
      });

      onSuccess();
      onHide();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error al registrar pago");
    } finally {
      setLoading(false);
    }
  };

  console.log(configPago);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Pago</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <label className="form-label fw-bold">
            Seleccionar deudas a pagar
          </label>
          {deudas?.length === 0 ? (
            <div className="text-muted small">No hay deudas pendientes.</div>
          ) : (
            <div
              className="list-group"
              style={{ maxHeight: "250px", overflowY: "auto" }}
            >
              {deudas?.map((deuda) => {
                const getNombreMes = (num) => {
                  const meses = [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                  ];
                  return meses[num - 1] || "";
                };

                const conceptoNombre =
                  deuda.concepto_detail?.nombre ||
                  deuda.concepto_nombre ||
                  "Concepto";
                const mesNombre = deuda.mes
                  ? ` - ${getNombreMes(deuda.mes)} ${deuda.anio}`
                  : "";
                const detalleAdicional = deuda.detalle_adicional
                  ? ` (${deuda.detalle_adicional})`
                  : "";
                const isSelected = selectedDeudas.includes(deuda.id);

                return (
                  <label
                    key={deuda.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${isSelected ? "list-group-item-success" : ""}`}
                    style={{
                      cursor: deuda.tiene_pago_pendiente
                        ? "not-allowed"
                        : "pointer",
                      opacity: deuda.tiene_pago_pendiente ? 0.6 : 1,
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        checked={isSelected}
                        disabled={deuda.tiene_pago_pendiente}
                        onChange={() => handleToggleDeuda(deuda.id)}
                      />
                      <div>
                        <span className="fw-semibold small">
                          {conceptoNombre}
                          {mesNombre}
                        </span>
                        {deuda.tiene_pago_pendiente && (
                          <div className="mt-1">
                            <span className="badge bg-warning text-dark">
                              ⏳ Pago pendiente de validación
                            </span>
                          </div>
                        )}
                        {detalleAdicional && (
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {detalleAdicional}
                          </div>
                        )}
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Vence:{" "}
                          {new Date(deuda.fecha_vencimiento).toLocaleDateString(
                            "es-PE",
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="fw-bold text-success small">
                      S/ {Number(deuda.saldo_pendiente).toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Monto a pagar</label>
          <div className="p-2 bg-light border border-success rounded d-flex align-items-center justify-content-center">
            <span
              className="fw-bold text-success"
              style={{ fontSize: "1.25rem" }}
            >
              S/ {montoTotalSeleccionado.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Método de pago</label>

          <select
            className="form-select"
            value={formData.metodo_pago}
            onChange={(e) =>
              setFormData({
                ...formData,
                metodo_pago: e.target.value,
                banco: ["Transferencia", "Depósito"].includes(e.target.value)
                  ? formData.banco
                  : "",
              })
            }
          >
            <option>Yape</option>
            <option>Plin</option>
            <option>Transferencia</option>
            <option>Depósito</option>
          </select>
        </div>

        {
  formData.metodo_pago === "Yape" &&
  configPago && (

    <div className="payment-card yape-card mt-3">

      <div className="payment-header">
        📱 Pagar con Yape
      </div>

      {
        configPago.qr_yape && (
          <div className="payment-qr-container">
    <img
      src={configPago.qr_yape}
      alt="QR Yape"
      className="payment-qr"
    />
  </div>


        )
      }

      <div className="payment-info">
    <div className="payment-number">
      {configPago.numero_yape}
    </div>

    <div className="payment-owner">
      {configPago.titular_yape}
    </div>

    <div className="payment-amount">
      S/ {montoTotalSeleccionado.toFixed(2)}
    </div>
  </div>

      <button
  type="button"
  className="btn btn-outline-primary btn-sm mt-2"
  onClick={() => {
    navigator.clipboard.writeText(
      configPago.numero_yape
    );

    toast.success(
      "Número copiado"
    );
  }}
>
  Copiar número
</button>

    </div>
  )
}

{
  formData.metodo_pago === "Plin" &&
  configPago && (

    <div className="payment-card plin-card mt-3">

      <div className="payment-header">
        💳 Pagar con Plin
      </div>

      {
        configPago.qr_plin && (
          <div className="payment-qr-container">
    <img
      src={configPago.qr_plin}
      alt="QR Plin"
      className="payment-qr"
    />
  </div>
        )
      }
<div className="payment-info">
    <div className="payment-number">
      {configPago.numero_plin }
    </div>

    <div className="payment-owner">
      {configPago.titular_plin}
    </div>

    <div className="payment-amount">
      S/ {montoTotalSeleccionado.toFixed(2)}
    </div>
  </div>
     
      

      

      <button
  type="button"
  className="btn btn-outline-primary btn-sm mt-2"
  onClick={() => {
    navigator.clipboard.writeText(
      configPago.numero_plin
    );

    toast.success(
      "Número copiado"
    );
  }}
>
  Copiar número
</button>

    </div>
  )
}



        {["Transferencia", "Depósito"].includes(formData.metodo_pago) && (
          <div className="mb-3">
            <label className="form-label fw-bold">Banco</label>
            <select
              className="form-select"
              value={formData.banco}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  banco: e.target.value,
                })
              }
            >
              <option value="">-- Seleccionar banco --</option>
              {bancos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre} {b.numero_cuenta ? `- ${b.numero_cuenta}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-bold">Número operación</label>

          <input
            className="form-control"
            value={formData.numero_operacion}
            onChange={(e) =>
              setFormData({
                ...formData,
                numero_operacion: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Voucher</label>

          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) =>
              setFormData({
                ...formData,
                comprobante_img: e.target.files[0],
              })
            }
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Cancelar
        </button>

        <button
          className="btn btn-primary"
          disabled={loading || selectedDeudas.length === 0}
          onClick={handleSubmit}
        >
          {loading ? "Registrando..." : "Registrar Pago"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

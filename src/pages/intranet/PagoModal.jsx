// src/components/intranet/PagoModal.jsx

import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

import { registrarPagoParent } from "../../api/pagosAPI";

export default function PagoModal({ show, onHide, deudas, onSuccess }) {
  console.log("DEUDAS RECIBIDAS:",deudas);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    deuda_id: "",
    monto: "",
    metodo_pago: "Yape",
    numero_operacion: "",
    comprobante_img: null,
  });

  const handleSubmit = async () => {
    if (!formData.deuda_id) {
      toast.error("Seleccione una deuda");
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

      data.append("deuda_id", formData.deuda_id);

      data.append("monto", formData.monto);

      data.append("metodo_pago", formData.metodo_pago);

      data.append("numero_operacion", formData.numero_operacion);

      data.append("comprobante_img", formData.comprobante_img);

      await registrarPagoParent(data);

      toast.success("Pago registrado correctamente");

      setFormData({
        deuda_id: "",
        monto: "",
        metodo_pago: "Yape",
        numero_operacion: "",
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

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Pago</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <label>Deuda</label>

          <select
            className="form-select"
            value={formData.deuda_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                deuda_id: e.target.value,
              })
            }
          >
            <option value="">Seleccione</option>

            {deudas?.map((deuda) => (
              <option key={deuda.id} value={deuda.id}>
                {deuda.alumno_nombre}

                {" - "}

                {deuda.concepto_nombre}

                {" - S/"}

                {deuda.saldo_pendiente}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Monto a pagar</label>
            <input
              className="form-control"
                value={formData.monto}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monto: e.target.value,
                  })
                }
              />
        </div>

        <div className="mb-3">
          <label>Método de pago</label>

          <select
            className="form-select"
            value={formData.metodo_pago}
            onChange={(e) =>
              setFormData({
                ...formData,
                metodo_pago: e.target.value,
              })
            }
          >
            <option>Yape</option>

            <option>Plin</option>

            <option>Transferencia</option>

            <option>Depósito</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Número operación</label>

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
          <label>Voucher</label>

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
        <button
          className="
            btn
            btn-secondary
          "
          onClick={onHide}
        >
          Cancelar
        </button>

        <button
          className="
            btn
            btn-primary
          "
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Registrando..." : "Registrar Pago"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

import React from "react";
import { Modal } from "react-bootstrap";

import "../../styles/DetallePagoModal.css";

export default function DetallePagoModal({ show, onHide, pagoSeleccionado }) {
  const voucherUrl = pagoSeleccionado?.comprobante_img
    ? pagoSeleccionado.comprobante_img.startsWith("http")
      ? pagoSeleccionado.comprobante_img
      : `http://localhost:8000${pagoSeleccionado.comprobante_img}`
    : null;

  const getEstadoKey = (estado) => {
    switch (estado) {
      case "APROBADO": return "aprobado";
      case "RECHAZADO": return "rechazado";
      default: return "pendiente";
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case "APROBADO": return "Pago Validado";
      case "RECHAZADO": return "Pago Rechazado";
      default: return "Pendiente de Validación";
    }
  };

  const getNombreMes = (mes) => {
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    return meses[mes - 1] || "";
  };

  const estadoKey = getEstadoKey(pagoSeleccionado?.estado);

  console.log("DETALLE PAGO:", pagoSeleccionado);
console.log("USUARIO DETAIL:", pagoSeleccionado?.usuario_detail);

  return (
    <>
            <Modal show={show} onHide={onHide} centered size="lg" className="detalle-modal">
        <Modal.Header closeButton>
          <div className="detalle-modal-title">
            📄 Detalle del Pago
          </div>
        </Modal.Header>

        <Modal.Body>
          {pagoSeleccionado && (
            <>
              {/* Estado */}
              <div className="detalle-estado-bar">
                <div>
                  <div className="detalle-section-label">Estado del pago</div>
                  <p className="detalle-section-title">Información del Pago</p>
                </div>
                <span className={`detalle-badge ${estadoKey}`}>
                  {getEstadoLabel(pagoSeleccionado.estado)}
                </span>
              </div>

              {/* Monto hero */}
              <div className="detalle-monto-hero">
                <div>
                  <div className="detalle-monto-label">Total pagado</div>
                  <div className="detalle-monto-valor">
                    <span className="currency">S/</span>
                    {Number(pagoSeleccionado.monto_total_entregado).toFixed(2)}
                  </div>
                </div>
                <div className="detalle-monto-origin">
                  {pagoSeleccionado.origen === "ADMINISTRACION"
                    ? <>🏫<br />Registrado en<br />Administración</>
                    : <>📱<br />Reportado por<br />Apoderado</>}
                </div>
              </div>

              {/* Campos */}
              <div className="detalle-fields-section" style={{ margin: "20px 28px 16px" }}>
                <div className="detalle-fields-header">Datos del pago</div>
                <div className="detalle-fields-grid">
                  <div className="detalle-field">
                    <div className="detalle-field-label">Método de pago</div>
                    <div className="detalle-field-value">
                      <span className="metodo-pill">{pagoSeleccionado.metodo_pago}</span>
                    </div>
                  </div>

                  <div className="detalle-field">
                    <div className="detalle-field-label">N° Operación</div>
                    <div className="detalle-field-value mono">
                      {pagoSeleccionado.numero_operacion || "—"}
                    </div>
                  </div>

                  <div className="detalle-field">
                    <div className="detalle-field-label">Fecha de registro</div>
                    <div className="detalle-field-value">
                      {new Date(pagoSeleccionado.fecha_pago).toLocaleDateString("es-PE", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </div>
                  </div>

                  {pagoSeleccionado.usuario_detail && (
  <div className="detalle-field">
  <div className="detalle-field-label">
    Registrado por
  </div>

  <div className="detalle-field-value">
    {
      pagoSeleccionado.origen === "ADMINISTRACION"
        ? `👨‍💼 ${
            pagoSeleccionado.usuario_detail?.nombre?.trim()
              ? pagoSeleccionado.usuario_detail.nombre
              : pagoSeleccionado.usuario_detail?.username || "Administrador"
          }`
        : "👤 Apoderado"
    }
  </div>
</div>
)}

                  {pagoSeleccionado.fecha_aprobacion && (
                    <div className="detalle-field">
                      <div className="detalle-field-label">Fecha de validación</div>
                      <div className="detalle-field-value">
                        {new Date(pagoSeleccionado.fecha_aprobacion).toLocaleDateString("es-PE", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </div>
                    </div>
                  )}

                  {pagoSeleccionado.usuario_validador_detail && (
  <div className="detalle-field">
    <div className="detalle-field-label">
      Validado por
    </div>

    <div className="detalle-field-value">
      👨‍💼 {
        pagoSeleccionado.usuario_validador_detail.nombre?.trim()
          ? pagoSeleccionado.usuario_validador_detail.nombre
          : pagoSeleccionado.usuario_validador_detail.username
      }
    </div>
  </div>
)}
                </div>
              </div>

              {/* Cuotas */}
              <div className="detalle-cuotas-section">
                <div className="detalle-section-header">
                  📚 Cuotas incluidas
                </div>
                {pagoSeleccionado.asignaciones?.length > 0 ? (
                  pagoSeleccionado.asignaciones.map((item) => {
                    const detalle = item.deuda_detail;
                    const nombreConcepto = detalle.mes
                      ? `📅 ${detalle.concepto} — ${getNombreMes(detalle.mes)} ${detalle.anio}`
                      : `📚 ${detalle.concepto}`;
                    return (
                      <div key={item.id} className="cuota-item">
                        <span className="cuota-nombre">{nombreConcepto}</span>
                        <span className="cuota-monto">
                          S/ {Number(item.monto_aplicado).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="cuota-empty">
                    No se encontraron cuotas asociadas a este pago.
                  </div>
                )}
              </div>

              {/* Motivo rechazo */}
              {pagoSeleccionado.estado === "RECHAZADO" && pagoSeleccionado.motivo_rechazo && (
                <div className="detalle-rechazo-section">
                  <div className="detalle-rechazo-card">
                    <div className="detalle-rechazo-title">❌ Motivo del rechazo</div>
                    <div className="detalle-rechazo-text">{pagoSeleccionado.motivo_rechazo}</div>
                  </div>
                </div>
              )}

              {/* Voucher */}
              {voucherUrl && (
                <div className="detalle-voucher-section">
                  <div className="detalle-section-header">🧾 Voucher enviado</div>
                  <div className="detalle-voucher-card">
                    <div className="detalle-voucher-img-wrap">
                      <img src={voucherUrl} alt="Comprobante de pago" />
                    </div>
                    <div className="detalle-voucher-footer">
                      <a href={voucherUrl} target="_blank" rel="noreferrer" className="btn-ver-voucher">
                        🔍 Ver voucher completo
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button className="btn-cerrar-detalle" onClick={onHide}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
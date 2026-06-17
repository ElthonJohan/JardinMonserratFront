import React from "react";
import { Modal } from "react-bootstrap";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .detalle-modal .modal-content {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(0,0,0,0.18);
    font-family: 'Inter', sans-serif;
  }

  .detalle-modal .modal-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
    border: none;
    padding: 28px 32px 24px;
  }

  .detalle-modal .modal-header .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.8;
  }

  .detalle-modal .modal-header .btn-close:hover {
    opacity: 1;
  }

  .detalle-modal-title {
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .detalle-modal .modal-body {
    background: #f1f5f9;
    padding: 0;
    max-height: 75vh;
    overflow-y: auto;
  }

  .detalle-modal .modal-body::-webkit-scrollbar {
    width: 6px;
  }
  .detalle-modal .modal-body::-webkit-scrollbar-track { background: transparent; }
  .detalle-modal .modal-body::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .detalle-modal .modal-footer {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 16px 28px;
  }

  /* ── Sección de estado ── */
  .detalle-estado-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 28px 16px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
  }

  .detalle-section-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #94a3b8;
    margin-bottom: 2px;
  }

  .detalle-section-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .detalle-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.2px;
  }

  .detalle-badge.aprobado {
    background: #dcfce7;
    color: #15803d;
    border: 1.5px solid #bbf7d0;
  }

  .detalle-badge.rechazado {
    background: #fee2e2;
    color: #b91c1c;
    border: 1.5px solid #fecaca;
  }

  .detalle-badge.pendiente {
    background: #fef9c3;
    color: #a16207;
    border: 1.5px solid #fde68a;
  }

  .detalle-badge::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .detalle-badge.aprobado::before { background: #16a34a; }
  .detalle-badge.rechazado::before { background: #dc2626; }
  .detalle-badge.pendiente::before { background: #ca8a04; }

  /* ── Monto hero ── */
  .detalle-monto-hero {
    margin: 0 28px 0;
    border-radius: 16px;
    padding: 22px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
    color: white;
    margin-top: 20px;
  }

  .detalle-monto-label {
    font-size: 0.78rem;
    font-weight: 500;
    opacity: 0.75;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
  }

  .detalle-monto-valor {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
  }

  .detalle-monto-valor .currency {
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.8;
    margin-right: 4px;
  }

  .detalle-monto-origin {
    font-size: 0.8rem;
    opacity: 0.8;
    text-align: right;
  }

  /* ── Grid de campos ── */
  .detalle-fields-section {
    background: #ffffff;
    margin: 16px 28px;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .detalle-fields-header {
    padding: 14px 20px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #64748b;
    background: #f8fafc;
  }

  .detalle-fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .detalle-field {
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    border-right: 1px solid #f1f5f9;
  }

  .detalle-field:nth-child(even) {
    border-right: none;
  }

  .detalle-field:last-child,
  .detalle-field:nth-last-child(2):nth-child(odd) {
    border-bottom: none;
  }

  .detalle-field-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #94a3b8;
    margin-bottom: 4px;
  }

  .detalle-field-value {
    font-size: 0.88rem;
    font-weight: 600;
    color: #1e293b;
  }

  .detalle-field-value.mono {
    font-family: 'Courier New', monospace;
    font-size: 0.82rem;
    color: #475569;
    letter-spacing: 0.3px;
  }

  .detalle-field-value .metodo-pill {
    display: inline-block;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 20px;
    padding: 2px 10px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* ── Cuotas ── */
  .detalle-cuotas-section {
    margin: 0 28px 16px;
  }

  .detalle-section-header {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #64748b;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cuota-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color 0.15s;
  }

  .cuota-item:hover {
    border-color: #bfdbfe;
  }

  .cuota-item:last-child {
    margin-bottom: 0;
  }

  .cuota-nombre {
    font-size: 0.86rem;
    font-weight: 500;
    color: #334155;
  }

  .cuota-monto {
    font-size: 0.95rem;
    font-weight: 700;
    color: #059669;
    flex-shrink: 0;
  }

  .cuota-empty {
    background: #fef9c3;
    border: 1px solid #fde68a;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 0.85rem;
    color: #a16207;
    font-weight: 500;
    text-align: center;
  }

  /* ── Motivo rechazo ── */
  .detalle-rechazo-section {
    margin: 0 28px 16px;
  }

  .detalle-rechazo-card {
    background: #fff1f2;
    border: 1.5px solid #fecdd3;
    border-radius: 12px;
    padding: 16px 20px;
  }

  .detalle-rechazo-title {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #be123c;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .detalle-rechazo-text {
    font-size: 0.87rem;
    color: #9f1239;
    font-weight: 500;
    line-height: 1.5;
  }

  /* ── Voucher ── */
  .detalle-voucher-section {
    margin: 0 28px 24px;
  }

  .detalle-voucher-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
  }

  .detalle-voucher-img-wrap {
    padding: 20px;
    text-align: center;
    background: #f8fafc;
  }

  .detalle-voucher-img-wrap img {
    max-height: 300px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  }

  .detalle-voucher-footer {
    padding: 14px 20px;
    border-top: 1px solid #f1f5f9;
    text-align: center;
  }

  .btn-ver-voucher {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 20px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1.5px solid #bfdbfe;
    border-radius: 8px;
    font-size: 0.83rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.15s;
  }

  .btn-ver-voucher:hover {
    background: #dbeafe;
    color: #1e40af;
    border-color: #93c5fd;
    text-decoration: none;
  }

  /* ── Footer button ── */
  .btn-cerrar-detalle {
    padding: 9px 22px;
    background: #f1f5f9;
    color: #475569;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-cerrar-detalle:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

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
      <style>{styles}</style>
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
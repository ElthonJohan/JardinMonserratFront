import React from "react";
import { Modal } from "react-bootstrap";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .historial-modal .modal-content {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(0,0,0,0.18);
    font-family: 'Inter', sans-serif;
  }

  .historial-modal .modal-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
    border: none;
    padding: 28px 32px 24px;
    position: relative;
  }

  .historial-modal .modal-header .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.8;
    position: absolute;
    right: 24px;
    top: 24px;
  }

  .historial-modal .modal-header .btn-close:hover {
    opacity: 1;
  }

  .historial-header-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .historial-header-title {
    color: #ffffff;
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .historial-header-sub {
    color: rgba(255,255,255,0.75);
    font-size: 0.82rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .historial-header-sub span {
    color: #93c5fd;
    font-weight: 700;
    font-size: 1rem;
    text-transform: none;
    letter-spacing: 0;
  }

  .historial-modal .modal-body {
    background: #f1f5f9;
    padding: 24px 28px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .historial-modal .modal-body::-webkit-scrollbar {
    width: 6px;
  }

  .historial-modal .modal-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .historial-modal .modal-body::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .pago-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 0;
    margin-bottom: 14px;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    display: flex;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    position: relative;
  }

  .pago-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.09);
    border-color: #bfdbfe;
  }

  .pago-card:last-child {
    margin-bottom: 0;
  }

  .pago-card-accent {
    width: 5px;
    flex-shrink: 0;
    border-radius: 0;
  }

  .pago-card-accent.aprobado { background: linear-gradient(180deg, #10b981, #059669); }
  .pago-card-accent.rechazado { background: linear-gradient(180deg, #f87171, #dc2626); }
  .pago-card-accent.pendiente { background: linear-gradient(180deg, #fbbf24, #d97706); }

  .pago-card-body {
    padding: 18px 20px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .pago-info {
    flex: 1;
  }

  .pago-tipo {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 5px 0;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .pago-tipo-icon {
    font-size: 1rem;
  }

  .pago-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .pago-fecha {
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 500;
  }

  .pago-sep {
    color: #cbd5e1;
    font-size: 0.7rem;
  }

  .pago-metodo {
    font-size: 0.78rem;
    color: #64748b;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 500;
    border: 1px solid #e2e8f0;
  }

  .pago-operacion {
    font-size: 0.73rem;
    color: #94a3b8;
    margin-top: 4px;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.3px;
  }

  .pago-operacion strong {
    color: #64748b;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0;
    font-size: 0.72rem;
  }

  .pago-derecha {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
  }

  .pago-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.73rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .pago-badge.aprobado {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }

  .pago-badge.rechazado {
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }

  .pago-badge.pendiente {
    background: #fef9c3;
    color: #a16207;
    border: 1px solid #fde68a;
  }

  .pago-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pago-badge.aprobado::before { background: #16a34a; }
  .pago-badge.rechazado::before { background: #dc2626; }
  .pago-badge.pendiente::before { background: #ca8a04; }

  .pago-monto {
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .pago-monto.aprobado { color: #059669; }
  .pago-monto.rechazado { color: #dc2626; }
  .pago-monto.pendiente { color: #d97706; }

  .pago-monto-prefix {
    font-size: 0.75rem;
    font-weight: 600;
    opacity: 0.7;
    margin-right: 2px;
  }

  .historial-empty {
    text-align: center;
    padding: 56px 20px;
    color: #94a3b8;
  }

  .historial-empty-icon {
    font-size: 3rem;
    margin-bottom: 14px;
    opacity: 0.5;
  }

  .historial-empty-text {
    font-size: 1rem;
    font-weight: 500;
    color: #64748b;
    margin: 0;
  }

  .historial-empty-sub {
    font-size: 0.83rem;
    color: #94a3b8;
    margin-top: 6px;
  }
`;

export default function HistorialPagosModal({ show, onHide, pagos, onVerDetalle }) {
  const getEstadoKey = (estado) => {
    switch (estado) {
      case "APROBADO": return "aprobado";
      case "RECHAZADO": return "rechazado";
      default: return "pendiente";
    }
  };

  const getBadgeLabel = (estado) => {
    switch (estado) {
      case "APROBADO": return "Válido";
      case "RECHAZADO": return "Rechazado";
      default: return "Pendiente";
    }
  };

  const getMontoPrefijo = (estado) => {
    switch (estado) {
      case "RECHAZADO": return "−";
      default: return "+";
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Modal show={show} onHide={onHide} size="xl" centered className="historial-modal">
        <Modal.Header closeButton>
          <div className="historial-header-content">
            <h5 className="historial-header-title">
              📋 Historial Completo de Pagos
            </h5>
            <div className="historial-header-sub">
              Total de pagos registrados: <span>{pagos.length}</span>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          {pagos?.length > 0 ? (
            pagos.map((pago) => {
              const estadoKey = getEstadoKey(pago.estado);
              return (
                <div
                  key={pago.id}
                  className="pago-card"
                  onClick={() => onVerDetalle(pago)}
                >
                  <div className={`pago-card-accent ${estadoKey}`} />
                  <div className="pago-card-body">
                    <div className="pago-info">
                      <p className="pago-tipo">
                        <span className="pago-tipo-icon">
                          {pago.origen === "ADMINISTRACION" ? "🏫" : "📱"}
                        </span>
                        {pago.origen === "ADMINISTRACION"
                          ? "Pago registrado en Administración"
                          : "Pago reportado por apoderado"}
                      </p>
                      <div className="pago-meta">
                        <span className="pago-fecha">
                          {new Date(pago.fecha_pago).toLocaleDateString("es-PE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="pago-sep">•</span>
                        <span className="pago-metodo">{pago.metodo_pago}</span>
                      </div>
                      {pago.numero_operacion && (
                        <div className="pago-operacion">
                          <strong>Op. #</strong>{pago.numero_operacion}
                        </div>
                      )}
                    </div>

                    <div className="pago-derecha">
                      <span className={`pago-badge ${estadoKey}`}>
                        {getBadgeLabel(pago.estado)}
                      </span>
                      <div className={`pago-monto ${estadoKey}`}>
                        <span className="pago-monto-prefix">
                          {getMontoPrefijo(pago.estado)} S/
                        </span>
                        {Number(pago.monto_total_entregado).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="historial-empty">
              <div className="historial-empty-icon">📭</div>
              <p className="historial-empty-text">Sin pagos registrados</p>
              <p className="historial-empty-sub">Los pagos aparecerán aquí cuando se registren.</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
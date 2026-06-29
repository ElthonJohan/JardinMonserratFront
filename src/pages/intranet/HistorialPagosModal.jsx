import React from "react";
import { Modal } from "react-bootstrap";

import "../../styles/HistorialPagosModal.css";

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
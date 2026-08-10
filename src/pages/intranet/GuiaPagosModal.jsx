import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export default function GuiaPagosModal({ show, onHide }) {
  const [step, setStep] = useState(1);

  // Resetear el paso al abrir/cerrar
  React.useEffect(() => {
    if (show) setStep(1);
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">📖 Guía de Seguimiento de Pagos</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 p-md-5">
        {step === 1 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">👨‍👩‍👧‍👦</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Selector de Estudiantes</h4>
            <p className="mt-3 text-muted" style={{ fontSize: "1.1rem" }}>
              En la parte central, si tienes más de un hijo matriculado, verás botones con sus nombres.
              Al hacer clic en un estudiante, <strong className="text-dark">toda la información de deudas y pagos se actualizará</strong> automáticamente para mostrar los datos del hijo seleccionado.
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">📅</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Deudas Pendientes</h4>
            <p className="mt-3 text-muted" style={{ fontSize: "1.1rem" }}>
              Esta sección lista todos los conceptos no cancelados (matrículas, pensiones, cuotas). <br />
              Podrás ver el <strong>monto exacto</strong> a pagar y la <strong>fecha límite de vencimiento</strong> de cada uno.
            </p>
          </div>
        )}
        {step === 3 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">💳</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>¿Cómo registrar un pago?</h4>
            <div className="text-start mt-4 mx-auto" style={{ maxWidth: "450px" }}>
              <div className="mb-2"><strong>1.</strong> Haz clic en el botón verde <strong>Pagar Ahora</strong>.</div>
              <div className="mb-2"><strong>2.</strong> Marca las deudas específicas que deseas cancelar.</div>
              <div className="mb-2"><strong>3.</strong> Elige tu método de pago (Yape, Plin, Transferencia) y sube la captura de tu voucher.</div>
              <div className="mb-3"><strong>4.</strong> Ingresa el número de operación y envíalo.</div>
              <div className="p-3 bg-light rounded text-center">
                <small className="text-muted mb-0"><em>Nota: Todo pago entrará en estado "Pendiente" hasta ser validado manualmente por el colegio.</em></small>
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">📊</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Estado de Pagos</h4>
            <p className="mt-3 text-muted text-center mx-auto" style={{ fontSize: "1.1rem", maxWidth: "500px" }}>
              En la sección "Últimos Pagos" verás tus envíos con 3 posibles estados:<br /><br />
            </p>
            <div className="text-start mx-auto" style={{ maxWidth: "400px" }}>
              <div className="mb-3">
                <span className="badge bg-warning text-dark me-2 p-2" style={{ width: "80px" }}>Pendiente</span> Aún no revisado por administración.
              </div>
              <div className="mb-3">
                <span className="badge bg-success me-2 p-2" style={{ width: "80px" }}>Válido</span> Pago aprobado, tu deuda ha sido descontada.
              </div>
              <div>
                <span className="badge bg-danger me-2 p-2" style={{ width: "80px" }}>Rechazado</span> Hay un problema con tu voucher. Deberás registrarlo de nuevo.
              </div>
            </div>
          </div>
        )}

        {/* Stepper Dots */}
        <div className="d-flex justify-content-center gap-2 mt-5">
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: step === num ? '#245BDB' : '#e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setStep(num)}
            />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between border-0 pt-0 px-4 pb-4">
        <button
          className="btn btn-danger px-4 fw-bold text-white"
          onClick={() => setStep(Math.max(1, step - 1))}
          style={{ visibility: step === 1 ? 'hidden' : 'visible', borderRadius: '10px' }}
        >
          Atrás
        </button>
        {step < 4 ? (
          <button className="btn btn-primary px-4 fw-bold" style={{ borderRadius: '10px', backgroundColor: '#245BDB' }} onClick={() => setStep(step + 1)}>
            Siguiente
          </button>
        ) : (
          <button className="btn btn-success px-4 fw-bold" style={{ borderRadius: '10px' }} onClick={onHide}>
            ¡Empezar a usar!
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

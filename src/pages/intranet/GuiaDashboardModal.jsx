import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export default function GuiaDashboardModal({ show, onHide }) {
  const [step, setStep] = useState(1);

  // Resetear el paso al abrir/cerrar
  React.useEffect(() => {
    if (show) setStep(1);
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">📖 Guía del Dashboard Principal</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 p-md-5">
        {step === 1 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">📊</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Resumen Estadístico</h4>
            <div className="text-start mx-auto mt-4" style={{ maxWidth: "450px" }}>
              <p className="text-muted mb-3">En la parte superior encontrarás un vistazo rápido a tu situación general:</p>
              <div className="mb-2">👨‍🎓 <strong>Hijos Registrados:</strong> Estudiantes a tu cargo.</div>
              <div className="mb-2">💰 <strong>Pagos Reportados:</strong> Cantidad de vouchers enviados en el año.</div>
              <div className="mb-2">📄 <strong>Deuda Pendiente:</strong> Monto total que falta cancelar.</div>
              <div>🏫 <strong>Año Escolar:</strong> El ciclo académico actual.</div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">🕒</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Pagos Recientes</h4>
            <p className="mt-3 text-muted mx-auto" style={{ fontSize: "1.1rem", maxWidth: "500px" }}>
              Esta sección muestra una lista rápida de tus <strong>últimas transacciones</strong>. Aquí puedes verificar si el colegio ya revisó tu voucher o si aún está "Pendiente".<br /><br />
            </p>
            <div className="text-start mx-auto" style={{ maxWidth: "300px" }}>
              <div className="mb-2"><span className="text-success fw-bold">✅ Aprobado</span>: Pago verificado.</div>
              <div className="mb-2"><span className="text-warning fw-bold">⏳ Pendiente</span>: En revisión.</div>
              <div><span className="text-danger fw-bold">❌ Rechazado</span>: Ocurrió un error.</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">🧑‍🎓</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Estado de Cuenta por Estudiante</h4>
            <p className="mt-3 text-muted mx-auto" style={{ fontSize: "1.1rem", maxWidth: "500px" }}>
              Aquí verás una <strong>barra de progreso</strong> por cada uno de tus hijos.<br /><br />
              La barra se irá llenando de acuerdo al porcentaje del monto total anual que ya hayas cancelado. Si la barra está al 100% y en color verde, significa que no tienes ninguna deuda pendiente para ese estudiante.
            </p>
          </div>
        )}

        {/* Stepper Dots */}
        <div className="d-flex justify-content-center gap-2 mt-5">
          {[1, 2, 3].map(num => (
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
        {step < 3 ? (
          <button className="btn btn-primary px-4 fw-bold" style={{ borderRadius: '10px', backgroundColor: '#245BDB' }} onClick={() => setStep(step + 1)}>
            Siguiente
          </button>
        ) : (
          <button className="btn btn-success px-4 fw-bold text-white" style={{ borderRadius: '10px' }} onClick={onHide}>
            ¡Empezar a usar!
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

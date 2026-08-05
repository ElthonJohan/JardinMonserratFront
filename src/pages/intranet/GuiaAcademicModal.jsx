import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export default function GuiaAcademicModal({ show, onHide }) {
  const [step, setStep] = useState(1);

  // Resetear el paso al abrir/cerrar
  React.useEffect(() => {
    if (show) setStep(1);
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">📖 Guía de Seguimiento Académico</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 p-md-5">
        {step === 1 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">👨‍👩‍👧‍👦</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Selección de Estudiante</h4>
            <p className="mt-3 text-muted" style={{ fontSize: "1.1rem" }}>
              Si tienes más de un hijo matriculado, verás tarjetas con sus nombres al inicio.
              Selecciona a uno de ellos para visualizar automáticamente sus <strong>calificaciones y periodos de evaluación</strong>.
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">📅</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Periodos de Evaluación</h4>
            <p className="mt-3 text-muted" style={{ fontSize: "1.1rem" }}>
              Una vez seleccionado tu hijo, aparecerá una barra con los periodos del año (ej. I Bimestre, II Bimestre).<br />
              Haz clic en cualquier periodo para cargar su <strong>libreta de notas virtual</strong> correspondiente a ese lapso.
            </p>
          </div>
        )}
        {step === 3 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">📊</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Libreta de Calificaciones</h4>
            <p className="mt-3 text-muted" style={{ fontSize: "1.1rem" }}>
              Las notas están organizadas por <strong>Áreas Curriculares</strong> (ej. Matemáticas, Comunicación) y, dentro de ellas, por las competencias evaluadas por el docente.<br /><br />
              Las calificaciones usan el formato oficial:<br />
              <span className="badge rounded-pill me-2 mt-2" style={{ background: "#4f46e5" }}>AD</span> Logro Destacado<br />
              <span className="badge rounded-pill me-2 mt-2" style={{ background: "#059669" }}>A</span> Logro Previsto<br />
              <span className="badge rounded-pill me-2 mt-2" style={{ background: "#d97706" }}>B</span> En Proceso<br />
              <span className="badge rounded-pill me-2 mt-2" style={{ background: "#dc2626" }}>C</span> En Inicio
            </p>
          </div>
        )}
        {step === 4 && (
          <div className="text-center slide-in">
            <div style={{ fontSize: "4rem" }} className="mb-3">📝</div>
            <h4 className="fw-bold" style={{ color: "#245BDB" }}>Apreciación del Docente</h4>
            <p className="mt-3 text-muted mx-auto" style={{ fontSize: "1.1rem", maxWidth: "500px" }}>
              Al final de la libreta virtual, encontrarás un recuadro especial con las <strong>observaciones y recomendaciones cualitativas</strong> que el docente tutor ha dejado sobre el progreso y comportamiento del estudiante.
            </p>
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
          <button className="btn btn-success px-4 fw-bold text-white" style={{ borderRadius: '10px' }} onClick={onHide}>
            ¡Empezar a usar!
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

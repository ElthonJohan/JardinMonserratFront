import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/loginParent.css";
import logoJardin from "../../images/logoJardin.png";

const LoginParent = () => {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualStep, setManualStep] = useState(1);

  const { loginParent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginParent(dni, password);

      if (result.success) {
        console.log("✅ Login de padre exitoso");

        if (result.requires_password_change) {
          navigate("/change-password", { replace: true });
        } else {
          navigate("/intranet/pagos", { replace: true });
        }
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.response?.data?.detail || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar el modal manual
  const closeManualModal = () => {
    setShowManualModal(false);
    setManualStep(1); // Reiniciamos al paso 1 para la próxima vez
  };

  // Función para cerrar el modal de olvido
  const closeForgotModal = () => {
    setShowForgotModal(false);
  };

  return (
    <>
      {showForgotModal && (
        <div className="forgot-modal-overlay">
          <div className="forgot-modal">
            {/* BOTÓN DE CIERRE X - Modal de Olvido */}
            <button
              className="modal-close-btn"
              onClick={closeForgotModal}
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="forgot-icon">
              🔐
            </div>

            <h2>Recuperación de contraseña</h2>

            <p>
              Por motivos de seguridad, el restablecimiento de contraseña
              debe ser realizado por la administración del Jardín.
            </p>

            <div className="forgot-info">
              <p>
                <strong>Acérquese a Secretaría</strong> o comuníquese con la
                institución para solicitar una contraseña temporal.
              </p>

              <hr />

              <p>📍 Jardín Nuestra Señora de Montserrat</p>

              <p>🕗 Horario:</p>

              <p>Lunes a Viernes</p>

              <p>8:00 a.m. - 5:00 p.m.</p>
            </div>

            <button
              className="forgot-close-btn"
              onClick={closeForgotModal}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {showManualModal && (
        <div className="forgot-modal-overlay">
          <div className="forgot-modal manual-modal">
            {/* BOTÓN DE CIERRE X - Modal Manual */}
            <button
              className="modal-close-btn"
              onClick={closeManualModal}
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            {manualStep === 1 && (
              <>
                <div className="forgot-icon">👤</div>
                <h2>Paso 1: Credenciales</h2>
                <p>
                  Ingrese el <strong>DNI</strong> o el <strong>código</strong> proporcionado por el colegio (Ej: ES0001) junto con su contraseña temporal.
                </p>
              </>
            )}

            {manualStep === 2 && (
              <>
                <div className="forgot-icon">🔒</div>
                <h2>Paso 2: Cambio de Clave</h2>
                <p>
                  Por motivos de seguridad, en su primer ingreso el sistema le solicitará cambiar su contraseña temporal por una nueva.
                </p>
              </>
            )}

            {manualStep === 3 && (
              <>
                <div className="forgot-icon">✅</div>
                <h2>Paso 3: ¡Listo!</h2>
                <p>
                  Una vez cambiada la contraseña, podrá acceder a la intranet para visualizar sus pagos y más opciones.
                </p>
                <div className="manual-download-container">
                  <a href="/manual_padres_template.html" target="_blank" rel="noopener noreferrer" className="manual-download-btn">
                    📥 Abrir Manual Completo
                  </a>
                </div>
              </>
            )}

            <div className="manual-step-indicator">
              <span className={manualStep >= 1 ? "active" : ""}></span>
              <span className={manualStep >= 2 ? "active" : ""}></span>
              <span className={manualStep >= 3 ? "active" : ""}></span>
            </div>

            <div className="manual-buttons">
              {manualStep > 1 ? (
                <button
                  className="manual-btn-secondary"
                  onClick={() => setManualStep(prev => prev - 1)}
                >
                  Atrás
                </button>
              ) : (
                <button
                  className="manual-btn-secondary"
                  onClick={closeManualModal}
                >
                  Cancelar
                </button>
              )}

              {manualStep < 3 ? (
                <button
                  className="manual-btn-primary"
                  onClick={() => setManualStep(prev => prev + 1)}
                >
                  Siguiente
                </button>
              ) : (
                <button
                  className="manual-btn-primary"
                  onClick={closeManualModal}
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="login-page">
        <div className="login-card">
          <div className="login-inner">
            {/* HEADER */}
            <div className="login-header">
              <div className="logo-box">
                <img src={logoJardin} alt="Logo" />
              </div>

              <h1>
                Bienvenido de nuevo
              </h1>

              <p>
                Ingrese sus credenciales para
                acceder al portal.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* CODIGO */}
              <div className="form-group">
                <label className="form-label">
                  DNI
                </label>

                <div className="input-container">
                  <span className="input-icon">
                    👤
                  </span>

                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej: ES0001"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <div className="password-top">
                  <label className="form-label">
                    Contraseña
                  </label>

                  <button
                    type="button"
                    className="forgot-link"
                    onClick={() => setShowForgotModal(true)}
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>

                <div className="input-container">
                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn"
              >
                {loading
                  ? "Iniciando sesión..."
                  : "Iniciar Sesión →"}
              </button>
            </form>

            {/* LINKS */}
            <div className="login-links">
              <button
                type="button"
                className="login-link-item manual-link-btn"
                onClick={() => {
                  setShowManualModal(true);
                  setManualStep(1);
                }}
              >
                📄 Manual de Usuario
              </button>
              <button
                type="button"
                className="login-link-item manual-link-btn"
                onClick={() => navigate("/")}
              >
                Inicio
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="copyright">
            © 2026 Nuestra Señora de Montserrat.
            <br />
            Todos los derechos reservados.
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginParent;
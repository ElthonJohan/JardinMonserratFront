import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Asegúrate de exportar esta función en tu contexto
import "../../styles/loginParent.css"; // Asegúrate de crear este archivo CSS para estilos específicos
import logoJardin from "../../images/logoJardin.png"; // Asegúrate de tener esta imagen en tu proyecto

const LoginParent = () => {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { loginParent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Usamos la función del contexto que ya maneja la API y el estado
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

  return (
    <>
      {showForgotModal && (
        <div className="forgot-modal-overlay">

          <div className="forgot-modal">

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
              onClick={() => setShowForgotModal(false)}
            >
              Entendido
            </button>

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

              <a href="#" className="login-link-item">
                🛠️ Soporte Técnico
              </a>

              <a href="#" className="login-link-item">
                📄 Manual de Usuario
              </a>

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

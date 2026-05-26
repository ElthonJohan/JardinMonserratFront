import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Asegúrate de exportar esta función en tu contexto


const LoginParent = () => {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginParent } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Usamos la función del contexto que ya maneja la API y el estado
    const result = await loginParent(codigo, password);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-20" />
          <h2 className="text-3xl font-bold text-gray-800">
            Intranet de Padres
          </h2>
          <p className="text-gray-600 mt-2">
            Jardín Nuestra Señora de Monserrat
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Estudiante
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: ES0001"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-70"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          ¿Problemas para ingresar? Contacta a la administración
        </p>
      </div>
    </div>
  );
};

export default LoginParent;

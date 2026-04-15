import React, { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "admin",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/register/", form);
      toast.success("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.log(error.response);
      toast.error("Error al registrar usuario");
    }
  };

  return (
    <div className="register-container">
      <div className="card register-card shadow-lg">
        <div className="card-body">
          <h2 className="text-center mb-4">Crear Cuenta</h2>

          <form onSubmit={handleSubmit}>
            {/* Usuario */}
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Ingresa tu usuario"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Ingresa tu contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Rol */}
            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="admin">Administrador</option>
                <option value="docente">Docente</option>
                <option value="padre">Padre</option>
              </select>
            </div>

            {/* Botón */}
            <button className="btn btn-primary w-100">
              Registrarse
            </button>
          </form>

          <p className="text-center mt-3">
            ¿Ya tienes cuenta?{" "}
            <span
              className="link-login"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
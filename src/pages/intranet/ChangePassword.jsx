import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/changePassword.css';
import  axiosInstance  from '../../api/axiosConfig'; // Asegúrate de configurar esto correctamente

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await axiosInstance.post('/auth/change-password-first/', 
        
        formData,
        {headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(response.data.message);
      
      // Esperar un momento y redirigir al dashboard/intranet
      setTimeout(() => {
        navigate('/intranet');
      }, 2500);

    } catch (err) {
      console.error('Error al cambiar la contraseña:', err);
      setError(err.response?.data?.detail || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="change-password-page">

    <div className="change-password-card">

      <div className="change-password-inner">

        {/* HEADER */}
        <div className="change-header">

          <div className="change-icon">
            🔐
          </div>

          <h1>
            Cambiar Contraseña
          </h1>

          <p>
            Es tu primer inicio de sesión.
            <br />
            Por seguridad debes actualizar
            tu contraseña temporal.
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="change-form"
        >

          {/* OLD PASSWORD */}
          <div className="form-group">

            <label className="form-label">
              Contraseña Actual
            </label>

            <div className="input-container">

              <span className="input-icon">
                🔑
              </span>

              <input
                type="password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese la contraseña temporal"
                required
              />

            </div>

          </div>

          {/* NEW PASSWORD */}
          <div className="form-group">

            <label className="form-label">
              Nueva Contraseña
            </label>

            <div className="input-container">

              <span className="input-icon">
                🔒
              </span>

              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese una nueva contraseña"
                required
              />

            </div>

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">

            <label className="form-label">
              Confirmar Contraseña
            </label>

            <div className="input-container">

              <span className="input-icon">
                ✅
              </span>

              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="form-input"
                placeholder="Repita la nueva contraseña"
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

          {/* SUCCESS */}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="change-btn"
          >
            {loading
              ? 'Actualizando contraseña...'
              : 'Actualizar Contraseña'}
          </button>

        </form>

        {/* SECURITY */}
        <div className="security-box">

          <h4>
            🔒 Recomendación de seguridad
          </h4>

          <p>
            Utilice una contraseña segura
            con letras mayúsculas,
            números y caracteres especiales.
          </p>

        </div>

      </div>

    </div>

  </div>
);
};

export default ChangePassword;
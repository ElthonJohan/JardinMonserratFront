import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosConfig";

export default function EditProfileModal({
  show,
  onHide,
  userData,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    dni: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        nombres: userData.nombres || "",
        apellidos: userData.apellidos || "",
        email: userData.email || "",
        telefono: userData.telefono || "",
        direccion: userData.direccion || "",
        dni: userData.dni || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axiosInstance.put(
        "/parent/profile/",
        {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
        }
      );

      toast.success(
        "Perfil actualizado correctamente"
      );

      onSuccess?.();

      onHide();

    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        "Error al actualizar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          ✏️ Editar Perfil
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <div className="row">

          <div className="col-md-6 mb-3">
            <label className="form-label">
              DNI
            </label>

            <input
              type="text"
              className="form-control"
              value={formData.dni}
              disabled
            />

            <small className="text-muted">
              🔒 El DNI no puede modificarse.
            </small>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Teléfono
            </label>

            <input
              type="text"
              className="form-control"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Nombres
            </label>

            <input
              type="text"
              className="form-control"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Apellidos
            </label>

            <input
              type="text"
              className="form-control"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">
              Correo Electrónico
            </label>

            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">
              Dirección
            </label>

            <textarea
              className="form-control"
              rows="3"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

        </div>

      </Modal.Body>

      <Modal.Footer>

        <button
          className="btn btn-secondary"
          onClick={onHide}
        >
          Cancelar
        </button>

        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={handleSubmit}
        >
          {
            loading
              ? "Guardando..."
              : "Guardar Cambios"
          }
        </button>

      </Modal.Footer>
    </Modal>
  );
}
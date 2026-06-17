import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosConfig";

export default function ChangePasswordModal({
  show,
  onHide,
}) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const resetForm = () => {

    setFormData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

  };

  const handleSubmit = async () => {

    if (
      !formData.current_password
    ) {

      toast.error(
        "Ingrese su contraseña actual"
      );

      return;

    }

    if (
      formData.new_password.length < 8
    ) {

      toast.error(
        "La nueva contraseña debe tener al menos 8 caracteres"
      );

      return;

    }

    if (
      formData.new_password !==
      formData.confirm_password
    ) {

      toast.error(
        "Las contraseñas no coinciden"
      );

      return;

    }

    try {

      setLoading(true);

      await axiosInstance.post(
        "/parent/change-password/",
        formData
      );

      toast.success(
        "Contraseña actualizada correctamente"
      );

      resetForm();

      onHide();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        "Error al cambiar contraseña"
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
    >

      <Modal.Header closeButton>

        <Modal.Title>
          🔑 Cambiar Contraseña
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <div className="mb-3">

          <label className="form-label">
            Contraseña Actual
          </label>

          <input
            type="password"
            className="form-control"
            name="current_password"
            value={
              formData.current_password
            }
            onChange={handleChange}
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Nueva Contraseña
          </label>

          <input
            type="password"
            className="form-control"
            name="new_password"
            value={
              formData.new_password
            }
            onChange={handleChange}
          />

          <small className="text-muted">
            Mínimo 8 caracteres.
          </small>

        </div>

        <div className="mb-3">

          <label className="form-label">
            Confirmar Contraseña
          </label>

          <input
            type="password"
            className="form-control"
            name="confirm_password"
            value={
              formData.confirm_password
            }
            onChange={handleChange}
          />

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
          className="btn btn-warning"
          disabled={loading}
          onClick={handleSubmit}
        >
          {
            loading
              ? "Actualizando..."
              : "Cambiar Contraseña"
          }
        </button>

      </Modal.Footer>

    </Modal>

  );

}
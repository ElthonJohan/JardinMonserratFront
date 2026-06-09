import { useState } from "react";

export default function AgregarApoderadoModal({ onSubmit }) {
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    direccion: "",
    tipo_relacion: "PADRE",
    es_principal: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);

      // ✅ Cerrar el modal de forma simple y confiable
      const modal = document.getElementById("agregarApoderadoModal");
      if (modal) {
        const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.click(); // Simula clic en el botón de cerrar
        }
      }

      // Resetear formulario
      setFormData({
        dni: "",
        nombres: "",
        apellidos: "",
        telefono: "",
        email: "",
        direccion: "",
        tipo_relacion: "PADRE",
        es_principal: false,
      });
    } catch (error) {
      console.error("Error al guardar apoderado:", error);
      // No cerramos el modal si hay error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="agregarApoderadoModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Nuevo Apoderado</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Tu formulario aquí (mismo de antes) */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">DNI <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="dni" value={formData.dni} onChange={handleChange} required />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Nombres <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="nombres" value={formData.nombres} onChange={handleChange} required />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Apellidos <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Relación</label>
                  <select className="form-select" name="tipo_relacion" value={formData.tipo_relacion} onChange={handleChange}>
                    <option value="PADRE">Padre</option>
                    <option value="MADRE">Madre</option>
                    <option value="TUTOR">Tutor</option>
                    <option value="ABUELO">Abuelo/a</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Dirección</label>
                  <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} />
                </div>

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="es_principal" checked={formData.es_principal} onChange={handleChange} />
                    <label className="form-check-label fw-semibold">Apoderado Principal</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>
                    Guardar Apoderado
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
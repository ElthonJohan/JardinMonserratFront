import { useState, useEffect } from "react";

export default function AulaForm({ onSubmit, initialData, isEditMode }) {
  const initialFormState = {
    nombre: "",
    capacidad: "",
    edad_min: "",
    edad_max: "",
  };

  const [form, setForm] = useState( initialFormState );

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialFormState,
        ...initialData,
      });
    } else {
      setForm(initialFormState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="card-custom">
      <h5 className="mb-3">
        {isEditMode ? "Editar Aula" : "Nueva Aula"}
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              name="nombre"
              className="form-control mb-2"
              placeholder="Ej: 3 años"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="capacidad"
              className="form-control mb-2"
              placeholder="Capacidad máxima"
              value={form.capacidad}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              name="edad_min"
              className="form-control mb-2"
              placeholder="Edad mínima"
              value={form.edad_min}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              name="edad_max"
              className="form-control mb-2"
              placeholder="Edad máxima"
              value={form.edad_max}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="text-end">
            <button className="btn btn-primary px-4">
              {isEditMode ? "Actualizar" : "Crear"}
            </button>
        </div>
      </form>
    </div>
  );
}

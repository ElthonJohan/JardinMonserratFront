import { useState, useEffect } from "react";

export default function AulaForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    nombre: "",
    capacidad: "",
    edad_min: "",
    edad_max: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="card p-3 mb-4">
      <h5>{initialData ? "Editar Aula" : "Nueva Aula"}</h5>

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          className="form-control mb-2"
          placeholder="Ej: 3 años"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          type="number"
          name="capacidad"
          className="form-control mb-2"
          placeholder="Capacidad"
          value={form.capacidad}
          onChange={handleChange}
        />

        <input
          type="number"
          name="edad_min"
          className="form-control mb-2"
          placeholder="Edad mínima"
          value={form.edad_min}
          onChange={handleChange}
        />

        <input
          type="number"
          name="edad_max"
          className="form-control mb-2"
          placeholder="Edad máxima"
          value={form.edad_max}
          onChange={handleChange}
        />

        <button className="btn btn-primary">
          {initialData ? "Actualizar" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
import { useState, useEffect } from "react";

export default function ApoderadoForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "dni" && e.target.value.length > 8) {
      setError("El DNI no puede tener más de 8 dígitos");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.dni.length > 8) {
      setError("El DNI no puede tener más de 8 dígitos");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <div className="card p-3 mb-4">
      <h5>{initialData ? "Editar Apoderado" : "Nuevo Apoderado"}</h5>

      <form onSubmit={handleSubmit}>
        <input name="nombres" className="form-control mb-2" placeholder="Nombres completos" onChange={handleChange} value={form.nombres} />
        <input name="apellidos" className="form-control mb-2" placeholder="Apellidos completos" onChange={handleChange} value={form.apellidos} />
        <input name="dni" className="form-control mb-2" placeholder="DNI" onChange={handleChange} value={form.dni} />
        {error && <div className="text-danger mb-2">{error}</div>}
        <input name="telefono" className="form-control mb-2" placeholder="Teléfono" onChange={handleChange} value={form.telefono} />
        <input name="email" className="form-control mb-2" placeholder="Email" onChange={handleChange} value={form.email} />
        <textarea name="direccion" className="form-control mb-2" placeholder="Dirección" onChange={handleChange} value={form.direccion} />
        <button className="btn btn-primary">
          {initialData ? "Actualizar" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
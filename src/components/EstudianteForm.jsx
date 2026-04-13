import { useEffect, useState } from "react";

export default function EstudianteForm({ onSubmit, initialData, aulas, apoderados }) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    aula: "",
    apoderado: "",
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
      <h5>{initialData ? "Editar Estudiante" : "Nuevo Estudiante"}</h5>

      <form onSubmit={handleSubmit}>
        <input name="nombres" className="form-control mb-2" placeholder="Nombres" onChange={handleChange} value={form.nombres} />

        <input name="apellidos" className="form-control mb-2" placeholder="Apellidos" onChange={handleChange} value={form.apellidos} />

        <input type="date" name="fecha_nacimiento" className="form-control mb-2" onChange={handleChange} value={form.fecha_nacimiento} />

        <select name="aula" className="form-select mb-2" onChange={handleChange} value={form.aula}>
          <option value="">Seleccione aula</option>
          {Array.isArray(aulas) && aulas.map(a => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>

        <select name="apoderado" className="form-select mb-2" onChange={handleChange} value={form.apoderado}>
          <option value="">Seleccione apoderado</option>
          {apoderados.map(a => (
            <option key={a.id} value={a.id}>{a.nombres}</option>
          ))}
        </select>

        <button className="btn btn-primary">
          {initialData ? "Actualizar" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
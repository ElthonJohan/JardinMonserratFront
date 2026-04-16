import { useEffect, useState } from "react";

export default function EstudianteForm({
  onSubmit,
  initialData,
  aulas,
  apoderados,
}) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    aula: "",
    apoderado: {
      nombres: "",
      apellidos: "",
      telefono: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("apoderado.")) {
      const key = name.split(".")[1];
      setForm({
        ...form,
        apoderado: {
          ...form.apoderado,
          [key]: value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="card p-3 mb-4">
      <h5>{initialData ? "Editar Estudiante" : "Nuevo Estudiante"}</h5>

      <form onSubmit={handleSubmit}>
        <input
          name="nombres"
          className="form-control mb-2"
          placeholder="Nombres"
          onChange={handleChange}
          value={form.nombres}
        />

        <input
          name="apellidos"
          className="form-control mb-2"
          placeholder="Apellidos"
          onChange={handleChange}
          value={form.apellidos}
        />

        <input
          type="date"
          name="fecha_nacimiento"
          className="form-control mb-2"
          onChange={handleChange}
          value={form.fecha_nacimiento}
        />

        <select
          name="aula"
          className="form-select mb-2"
          onChange={handleChange}
          value={form.aula}
        >
          <option value="">Seleccione aula</option>
          {Array.isArray(aulas) &&
            aulas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
        </select>

        <h5>Datos del Apoderado</h5>

        <input
          name="apoderado.nombres"
          placeholder="Nombres"
          onChange={handleChange}
        />

        <input
          name="apoderado.apellidos"
          placeholder="Apellidos"
          onChange={handleChange}
        />

        <input
          name="apoderado.apellidos"
          placeholder="Apellidos"
          onChange={handleChange}
        />
        <input
          name="apoderado.dni"
          placeholder="DNI"
          onChange={handleChange}
        />

        <input
          name="apoderado.telefono"
          placeholder="Teléfono"
          onChange={handleChange}
        />

        <input
          name="apoderado.direccion"
          placeholder="Dirección"
          onChange={handleChange}
        />

        {/* <select name="apoderado" className="form-select mb-2" onChange={handleChange} value={form.apoderado}>
          <option value="">Seleccione apoderado</option>
          {apoderados.map(a => (
            <option key={a.id} value={a.id}>{a.nombres}</option>
          ))}
        </select> */}

        <button className="btn btn-primary">
          {initialData ? "Actualizar" : "Guardar"}
        </button>
      </form>
    </div>
  );
}

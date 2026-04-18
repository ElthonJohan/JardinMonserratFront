import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

export default function EstudianteForm({ onSubmit, initialData, aulas }) {
  const initialFormState = {
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    aula: "",
    apoderado: {
      nombres: "",
      apellidos: "",
      telefono: "",
      direccion: "",
      email: "",
      dni: "",
    },
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialFormState,
        ...initialData,
        apoderado: {
          ...initialFormState.apoderado,
          ...(initialData.apoderado || {}),
        },
      });
    } else {
      setForm(initialFormState);
    }
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
    <div className="card-custom">
      <h5 className="mb-3">
        {initialData ? "Editar Estudiante" : "Nuevo Estudiante"}
      </h5>

      <form onSubmit={handleSubmit}>
        {/* DATOS DEL ESTUDIANTE */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              name="nombres"
              className="form-control"
              placeholder="Nombres"
              onChange={handleChange}
              value={form.nombres}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="apellidos"
              className="form-control"
              placeholder="Apellidos"
              onChange={handleChange}
              value={form.apellidos}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="date"
              name="fecha_nacimiento"
              className="form-control"
              onChange={handleChange}
              value={form.fecha_nacimiento}
            />
          </div>

          <div className="col-md-6 mb-3">
            <select
              name="aula"
              className="form-select"
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
          </div>
        </div>

        {/* SEPARADOR */}
        <hr />

        {/* DATOS DEL APODERADO */}
        <h6 className="mb-3">Datos del Apoderado</h6>

        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              name="apoderado.nombres"
              className="form-control"
              placeholder="Nombres"
              onChange={handleChange}
              value={form.apoderado.nombres}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="apoderado.apellidos"
              className="form-control"
              placeholder="Apellidos"
              onChange={handleChange}
              value={form.apoderado.apellidos}
            />
          </div>

          <div className="col-md-8 mb-3">
            <input
              name="apoderado.email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              value={form.apoderado.email}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              name="apoderado.dni"
              className="form-control"
              placeholder="DNI"
              onChange={handleChange}
              value={form.apoderado.dni || ""}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              name="apoderado.telefono"
              className="form-control"
              placeholder="Teléfono"
              onChange={handleChange}
              value={form.apoderado.telefono}
            />
          </div>

          <div className="col-md-8 mb-3">
            <input
              name="apoderado.direccion"
              className="form-control"
              placeholder="Dirección"
              onChange={handleChange}
              value={form.apoderado.direccion}
            />
          </div>
        </div>

        {/* BOTÓN */}
        <div className="text-end">
          <button className="btn btn-primary px-4">
            {initialData ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

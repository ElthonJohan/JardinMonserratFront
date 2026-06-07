import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

export default function EstudianteForm({ onSubmit, initialData, aulas, apoderados, isEditMode, errors }) {
  const initialFormState = {
    nombres: "",
    apellidos: "",
    codigo_estudiante: "",
    dni: "",
    fecha_nacimiento: "",
    aula: "",
    apoderado: {
      id: null,
      nombres: "",
      apellidos: "",
      telefono: "",
      direccion: "",
      email: "",
      dni: "",
    },
  };

  const [form, setForm] = useState(initialFormState);
  const [selectedApoderadoId, setSelectedApoderadoId] = useState("");

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
      setSelectedApoderadoId(initialData.apoderado?.id || "");
    } else {
      setForm(initialFormState);
    }
  }, [initialData]);
  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación preventiva: Solo permitir números en el DNI
    if (name === "apoderado.dni") {
      if (value !== "" && !/^\d+$/.test(value)) return;
    }

    if (name === "dni") {
      if (value !== "" && !/^\d+$/.test(value)) return;
    }

    if (name === "codigo_estudiante") {
      if (value !== "" && !/^[A-Za-z0-9]+$/.test(value)) return;
    }

    if (name.startsWith("apoderado.")) {
      const key = name.split(".")[1];
      setForm({
        ...form,
        apoderado: {
          ...form.apoderado,
          [key]: value,
        },
      });
      // If user edits apoderado fields, clear selectedApoderadoId to indicate a custom/new apoderado
      if (name !== "apoderado.dni") setSelectedApoderadoId("");
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSelectApoderado = (e) => {
    const val = e.target.value;
    setSelectedApoderadoId(val);

    if (!val) {
      // Nuevo apoderado
      setForm({
        ...form,
        apoderado: { ...initialFormState.apoderado },
      });
      return;
    }

    const existing = Array.isArray(apoderados)
      ? apoderados.find((a) => String(a.id) === String(val))
      : null;

    if (existing) {
      setForm({
        ...form,
        apoderado: {
          id: existing.id,
          nombres: existing.nombres || "",
          apellidos: existing.apellidos || "",
          telefono: existing.telefono || "",
          direccion: existing.direccion || "",
          email: existing.email || "",
          dni: existing.dni || "",
        },
      });
    } else {
      setForm({ ...form, apoderado: { ...initialFormState.apoderado } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If an existing apoderado was selected, send only `apoderado_id` to avoid nested validation
    const payload = { ...form };
    if (selectedApoderadoId) {
      payload.apoderado_id = selectedApoderadoId;
      // remove nested apoderado object to avoid confusion
      delete payload.apoderado;
    }

    onSubmit(payload);
  };

  return (
    <div className="card-custom">
      <h5 className="mb-3">
        {isEditMode ? "Editar Estudiante" : "Nuevo Estudiante"}
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
              type="text"
              required
              autoFocus
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="apellidos"
              className="form-control"
              placeholder="Apellidos"
              onChange={handleChange}
              value={form.apellidos}
              type="text"
              required
              minLength={3}
              maxLength={50}
            />
          </div>


          <div className="col-md-6 mb-3">
            <input
              name="dni"
              className={`form-control ${errors?.dni ? 'is-invalid' : ''}`}
              placeholder="DNI Estudiante"
              onChange={handleChange}
              value={form.dni || ""}
              type="text"
              maxLength={8}
            />
            {errors?.dni && (
              <div className="invalid-feedback">
                {errors.dni[0]}
              </div>
            )}
          </div>

          {isEditMode && (
            <div className="col-md-6 mb-3">
              <input
                name="codigo_estudiante"
                className="form-control"
                placeholder="Código de estudiante"
                onChange={handleChange}
                value={form.codigo_estudiante}
                type="text"
                required
                minLength={3}
                maxLength={20}
                readOnly
              />
            </div>
          )}
          
          {/* // Colocar un label para el campo de fecha de nacimiento */}
          <div className="col-md-6 mb-3">
            <label htmlFor="fecha_nacimiento" className="form-label mb-1 fw-bold text-secondary small">
              Fecha de nacimiento
            </label>
            <input

              type="date"
              name="fecha_nacimiento"
              className="form-control"
              placeholder="Fecha de nacimiento"
              onChange={handleChange}
              value={form.fecha_nacimiento}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="aula" className="form-label mb-1 fw-bold text-secondary small">
              Aula
            </label>
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
          <div className="col-md-12 mb-3">
            <label className="form-label small">Apoderado existente</label>
            <select
              className="form-select"
              value={selectedApoderadoId}
              onChange={handleSelectApoderado}
            >
              <option value="">-- Nuevo apoderado --</option>
              {Array.isArray(apoderados) &&
                apoderados.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombres} {a.apellidos} {a.dni ? `- ${a.dni}` : ""}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="apoderado.nombres"
              className="form-control"
              placeholder="Nombres"
              onChange={handleChange}
              value={form.apoderado.nombres}
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="apoderado.apellidos"
              className="form-control"
              placeholder="Apellidos"
              onChange={handleChange}
              value={form.apoderado.apellidos}
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="col-md-8 mb-3">
            <input
              name="apoderado.email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              value={form.apoderado.email}
              required
              type="email"
              minLength={3}
              maxLength={50}
            />
          </div>

                {/*Validar que dni sea único*/}
          <div className="col-md-4 mb-3">
            <input
              name="apoderado.dni"
              className="form-control"
              placeholder="DNI"
              onChange={handleChange}
              value={form.apoderado.dni || ""}
              type="text"
              required
              minLength={8}
              maxLength={8}
              
            />
            {errors?.apoderado?.dni && (
              <div className="text-danger small mt-1">
                {errors.apoderado.dni[0]}
              </div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <input
              name="apoderado.telefono"
              className="form-control"
              placeholder="Teléfono"
              onChange={handleChange}
              value={form.apoderado.telefono}
              required
              minLength={9}
              maxLength={9}
              type="tel"
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
            {isEditMode ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { buscarApoderadoPorDni } from "../../api/estudiantesAPI";
import toast from "react-hot-toast";

export default function EstudianteForm({
  onSubmit,
  initialData,
  isEditMode,
  errors,
}) {
  const initialFormState = {
    estudiante: {
      nombres: "",
      apellidos: "",
      dni: "",
      fecha_nacimiento: "",
    },

    apoderado: {
      nombres: "",
      apellidos: "",
      telefono: "",
      direccion: "",
      email: "",
      dni: "",
    },

    tipo_relacion: "MADRE",
    es_principal: true,
  };

  const [form, setForm] = useState(initialFormState);


  const buscarApoderado = async (dni) => {

  if (dni.length !== 8) return;

  try {

    const response =
      await buscarApoderadoPorDni(dni);

    if (response.exists) {

      

      setForm(prev => ({
        ...prev,
        apoderado: {
          ...response.data
        }
      }));

      toast.success(
        "Apoderado encontrado"
      );
    }

  } catch (error) {

    console.log(
      "Apoderado no encontrado"
    );
    toast.error(
      "No se encontró un apoderado con ese DNI"
    );
  }
};

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

  useEffect(() => {

  const dni = form.apoderado.dni;

  if (dni.length !== 8) return;

  const timer = setTimeout(() => {
    buscarApoderado(dni);
  }, 500);

  return () => clearTimeout(timer);

}, [form.apoderado.dni]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación preventiva: Solo permitir números en el DNI
    if (name === "apoderado.dni") {
        
      setForm(prev => ({
        ...prev,
        apoderado: {
            ...prev.apoderado,
            id: undefined,
            dni: value
        }
    }));
        return;
    }

    if (name === "estudiante.dni") {
  if (value !== "" && !/^\d+$/.test(value)) return;
}

    if (name === "estudiante.codigo_estudiante") {
      if (value !== "" && !/^[A-Za-z0-9]+$/.test(value)) return;
    }

    if (name.startsWith("estudiante.")) {
      const field = name.split(".")[1];

      setForm((prev) => ({
        ...prev,
        estudiante: {
          ...prev.estudiante,
          [field]: value,
        },
      }));

      return;
    }

    if (name.startsWith("apoderado.")) {
      const field = name.split(".")[1];

      setForm((prev) => ({
        ...prev,
        apoderado: {
          ...prev.apoderado,
          [field]: value,
        },
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


const handleSubmit = (e) => {

  e.preventDefault();

  onSubmit(form);
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
              name="estudiante.nombres"
              className="form-control"
              placeholder="Nombres"
              onChange={handleChange}
              value={form.estudiante.nombres}
              type="text"
              required
              autoFocus
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="estudiante.apellidos"
              className="form-control"
              placeholder="Apellidos"
              onChange={handleChange}
              value={form.estudiante.apellidos}
              type="text"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="estudiante.dni"
              className={`form-control ${errors?.dni ? "is-invalid" : ""}`}
              placeholder="DNI Estudiante"
              onChange={handleChange}
              value={form.estudiante.dni || ""}
              type="text"
              maxLength={8}
            />
            {errors?.dni && (
              <div className="invalid-feedback">{errors.dni[0]}</div>
            )}
          </div>

          {isEditMode && (
            <div className="col-md-6 mb-3">
              <input
                name="estudiante.codigo_estudiante"
                className="form-control"
                placeholder="Código de estudiante"
                onChange={handleChange}
                value={form.estudiante.codigo_estudiante}
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
            <label
              htmlFor="fecha_nacimiento"
              className="form-label mb-1 fw-bold text-secondary small"
            >
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="estudiante.fecha_nacimiento"
              className="form-control"
              placeholder="Fecha de nacimiento"
              onChange={handleChange}
              value={form.estudiante.fecha_nacimiento}
              required
            />
          </div>

          
        </div>

        {/* SEPARADOR */}
        <hr />

        {/* DATOS DEL APODERADO */}
        <h6 className="mb-3">Datos del Apoderado</h6>

        <div className="row">
          {/* <div className="col-md-12 mb-3">
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
          </div> */}

{/*Validar que dni sea único*/}
          <div className="col-md-4 mb-3">
            <input
              name="apoderado.dni"
              className="form-control"
              value={form.apoderado.dni}
              placeholder="DNI Apoderado"
              required
              maxLength={8}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            {errors?.apoderado?.dni && (
              <div className="text-danger small mt-1">
                {errors.apoderado.dni[0]}
              </div>
            )}
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

        <div className="col-md-6 mb-3">
          <label className="form-label">Relación</label>

          <select
            className="form-select"
            name="tipo_relacion"
            value={form.tipo_relacion}
            onChange={handleChange}
          >
            <option value="MADRE">Madre</option>
            <option value="PADRE">Padre</option>
            <option value="TUTOR">Tutor</option>
            <option value="ABUELO">Abuelo</option>
            <option value="OTRO">Otro</option>
          </select>
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

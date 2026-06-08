import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EstudianteForm from "../components/estudiantes/EstudianteForm";
import EstudianteTable from "../components/estudiantes/EstudianteTable";
import ApoderadosModal from "../components/estudiantes/ApoderadoModal";
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getAulas,
  getApoderados,
  createRegistroAlumno,
} from "../api/estudiantesAPI";
import {
  agregarApoderado,
  getApoderadosEstudiante,
  cambiarPrincipal,
  eliminarRelacion,
} from "../api/apoderadosAPI";
import axiosInstance from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/estudiantes.css";
import toast from "react-hot-toast";
import { Modal } from "bootstrap";
import { AppNavbar, Loading } from "../components/shared";
import AgregarApoderadoModal from "../components/estudiantes/AgregarApoderadoModal";

export default function EstudiantesPage() {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [studentParents, setStudentParents] = useState([]);

  const loadData = async () => {
    try {
      const [estRes] = await Promise.all([getEstudiantes()]);

      // 🔥 NORMALIZAR TODO
      const estudiantesData = estRes.results || estRes.data;

      setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : []);
    } catch (error) {
      console.error("ERROR COMPLETO 👉", error);

      console.error("ERROR 👉", error.response?.data);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setSelectedEstudiante({});
    setIsEditMode(false);
    setServerErrors({}); // Limpiar errores previos al abrir el modal

    const modal = new Modal(document.getElementById("estudianteModal"));
    modal.show();
  };

  const handleSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateEstudiante(selectedEstudiante.id, data);
        toast.success("Actualizado correctamente");
      } else {
        const res = await createRegistroAlumno(data);

        // Si el backend devolvió credenciales (porque se creó un usuario nuevo)
        if (res && res.generated_credentials) {
          setNewCredentials({
            ...res.generated_credentials,
            apoderado: `${res.apoderado?.nombres} ${res.apoderado?.apellidos}`,
            estudiante: `${res.nombres} ${res.apellidos}`,
          });
          // Abrimos el modal de credenciales después de que se cree el estudiante
          const credModal = new Modal(
            document.getElementById("credentialsModal"),
          );
          credModal.show();
        }
        toast.success("Estudiante registrado correctamente");
      }

      const modalElement = document.getElementById("estudianteModal");
      const modal = Modal.getInstance(modalElement);
      modal.hide();

      loadData();
      // Si tiene éxito, limpiar errores y cerrar modal/limpiar form
      setServerErrors({});
    } catch (error) {
      console.log("ERROR COMPLETO 👉", error.response?.data);
      if (error.response && error.response.status === 400) {
        // Guardamos los errores que vienen de Django (como el de DNI único)
        setServerErrors(error.response.data);
        toast.error("Por favor, revisa los campos marcados.");
      } else {
        toast.error("Ocurrió un error inesperado.");
      }
    }
  };

  const handleEdit = (estudiante) => {
    // 1. Buscamos en 'apoderados' (nombre de relación en el modelo) o 'apoderados_detail'
    const listaApoderados =
      estudiante.apoderados || estudiante.apoderados_detail || [];

    const relPrincipal =
      listaApoderados.find((rel) => rel.es_principal) || listaApoderados[0];

    // 2. Mapeamos a la estructura que espera EstudianteForm (nombres, apellidos, apoderado, etc)
    const dataMapped = {
      id: estudiante.id, // Para que updateEstudiante sepa qué ID usar
      estudiante: {
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        dni: estudiante.dni,
        fecha_nacimiento: estudiante.fecha_nacimiento,
        codigo_estudiante: estudiante.codigo_estudiante,
      },
      apoderado: relPrincipal
        ? { ...relPrincipal.apoderado }
        : {
            nombres: "",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
          },
      tipo_relacion: relPrincipal ? relPrincipal.tipo_relacion : "MADRE",
      es_principal: relPrincipal ? relPrincipal.es_principal : true,
    };

    setSelectedEstudiante(dataMapped);
    setIsEditMode(true);
    setServerErrors({}); // Limpiar errores previos al editar

    const modal = new Modal(document.getElementById("estudianteModal"));
    modal.show();
  };

  const handleMatricula = (estudiante) => {
    // Redirigir a la página de matrículas con el estado para auto-abrir el registro
    navigate("/matriculas", {
      state: {
        autoOpen: true,
        alumnoId: estudiante.id,
      },
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar estudiante?")) {
      try {
        await deleteEstudiante(id);
        toast.success("Eliminado");
        loadData();
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("No se pudo eliminar el estudiante");
      }
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    try {
      // Usamos axiosInstance para que use la URL base y el token de autenticación
      const response = await axiosInstance.get(
        `/estudiantes/${term ? `?search=${term}` : ""}`,
      );
      // Normalizamos la respuesta considerando si viene paginada (results) o no
      const data = response.data.results || response.data;
      setEstudiantes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error buscando:", error);
    }
  };

 const handleApoderados = async (
  estudiante
) => {

  try {

    const data =
      await getApoderadosEstudiante(
        estudiante.id
      );

    setSelectedStudent(
      estudiante
    );

    setStudentParents(
      data
    );

    const modal = new Modal(
      document.getElementById(
        "apoderadosModal"
      )
    );

    modal.show();

  } catch (error) {

    console.error(error);

    toast.error(
      "Error cargando apoderados"
    );

  }
};

const handleCreateParent = async (data) => {
  try {

    await agregarApoderado(
      selectedStudent.id,
      data
    );

    toast.success("Apoderado agregado");

  } catch (error) {

    console.log("ERROR COMPLETO");
    console.log(error.response?.data);

    toast.error(
      JSON.stringify(error.response?.data)
    );
  }
};
  const handleMakePrincipal =
  async (relacionId) => {

    try {

      await cambiarPrincipal(
        relacionId
      );

      toast.success(
        "Apoderado principal actualizado"
      );

      const data =
        await getApoderadosEstudiante(
          selectedStudent.id
        );

      setStudentParents(data);

    } catch (error) {

      toast.error(
        "No se pudo actualizar"
      );

    }
};

const handleDeleteParent =
  async (relacionId) => {

    const confirmar =
      window.confirm(
        "¿Eliminar relación con este apoderado?"
      );

    if (!confirmar) return;

    try {

      await eliminarRelacion(
        relacionId
      );

      toast.success(
        "Relación eliminada"
      );

      const data =
        await getApoderadosEstudiante(
          selectedStudent.id
        );

      setStudentParents(data);

    } catch (error) {

      toast.error(
        error.response?.data?.error ||
        "No se pudo eliminar"
      );

    }
};



const openAddParentModal = () => {

  const modal = new Modal(
    document.getElementById(
      "agregarApoderadoModal"
    )
  );

  modal.show();
};
  return (
    <>
      <AppNavbar />

      <div className="container container-custom">
        <h1 className="text-2xl font-bold mb-4">Gestión de Estudiantes</h1>
        <button className="btn btn-primary mb-3" onClick={openCreateModal}>
          + Nuevo Estudiante
        </button>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar por nombre o DNI apoderado..."
          onChange={handleSearch}
        />
        <EstudianteTable
          data={estudiantes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMatricula={handleMatricula}
          onApoderados={handleApoderados}
        />

        <div className="modal fade" id="estudianteModal" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Editar Estudiante" : "Nuevo Estudiante"}
                </h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                <EstudianteForm
                  key={selectedEstudiante ? selectedEstudiante.id : Date.now()} // 🔥 FORZAR RECREACIÓN
                  onSubmit={handleSubmit}
                  initialData={selectedEstudiante}
                  isEditMode={isEditMode}
                  errors={serverErrors} // PASAR ERRORES AL FORMULARIO
                />
              </div>
              
            </div>
          </div>
        </div>

        {/* Modal de Credenciales Generadas (Solo se muestra tras creación exitosa) */}
        <div
          className="modal fade"
          id="credentialsModal"
          tabIndex="-1"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">✅ Usuario de Apoderado Creado</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="text-muted mb-4">
                  Se ha generado automáticamente una cuenta de acceso para el
                  apoderado.
                  <strong className="d-block text-danger mt-2">
                    Por favor, comparta estos datos ahora. Por seguridad, la
                    contraseña no se volverá a mostrar.
                  </strong>
                </p>

                <div className="bg-light p-3 rounded border text-start mb-3">
                  <div className="mb-2 text-truncate">
                    <strong>Apoderado:</strong> {newCredentials?.apoderado}
                  </div>
                  <div className="mb-2 text-truncate">
                    <strong>Estudiante:</strong> {newCredentials?.estudiante}
                  </div>
                  <hr />
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="text-secondary">Usuario:</span>
                    <code className="fs-5 text-dark fw-bold bg-white px-2 border">
                      {newCredentials?.username}
                    </code>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-secondary">Contraseña:</span>
                    <code className="fs-5 text-dark fw-bold bg-white px-2 border font-monospace">
                      {newCredentials?.password}
                    </code>
                  </div>
                </div>
                <div className="alert alert-info mb-0 small">
                  💡 El apoderado podrá ingresar con su código de estudiante y
                  esta contraseña temporal.
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  data-bs-dismiss="modal"
                >
                  Confirmar y Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Apoderados */}
        <ApoderadosModal
    selectedStudent={selectedStudent}
    studentParents={studentParents}
    onMakePrincipal={handleMakePrincipal}
    onDeleteParent={handleDeleteParent}
    onAddParent={openAddParentModal}
/>
<AgregarApoderadoModal
  onSubmit={handleCreateParent}
/>
      </div>
    </>
  );
}

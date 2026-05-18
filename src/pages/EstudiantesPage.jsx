import { useEffect, useState } from "react";
import EstudianteForm from "../components/estudiantes/EstudianteForm";
import EstudianteTable from "../components/estudiantes/EstudianteTable";
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getAulas,
  getApoderados,
} from "../api/estudiantesAPI";
import axiosInstance from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/estudiantes.css";
import toast from "react-hot-toast";
import { Modal } from "bootstrap";
import { AppNavbar, Loading } from '../components/shared';

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const loadData = async () => {
    try {
      const [estRes, aulaRes, apoRes] = await Promise.all([
        getEstudiantes(),
        getAulas(),
        getApoderados(),
      ]);

      // 🔥 NORMALIZAR TODO
      const estudiantesData = estRes.results || estRes.data;
      const aulasData = aulaRes.results || aulaRes.data;
      const apoderadosData = apoRes.results || apoRes.data;

      setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : []);
      setAulas(Array.isArray(aulasData) ? aulasData : []);
      setApoderados(Array.isArray(apoderadosData) ? apoderadosData : []);
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
        await createEstudiante(data);
        toast.success("Creado correctamente");
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
    // 🔥 CLONAR el objeto (evita que React reutilice la referencia)
    const copia = JSON.parse(JSON.stringify(estudiante));

    setSelectedEstudiante(copia);
    setIsEditMode(true);
    setServerErrors({}); // Limpiar errores previos al editar

    const modal = new Modal(document.getElementById("estudianteModal"));
    modal.show();
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
      const response = await axiosInstance.get(`/estudiantes/${term ? `?search=${term}` : ''}`);
      // Normalizamos la respuesta considerando si viene paginada (results) o no
      const data = response.data.results || response.data;
      setEstudiantes(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error buscando:", error);
  }
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
                aulas={aulas}
                apoderados={apoderados}
                isEditMode={isEditMode}
                errors={serverErrors} // PASAR ERRORES AL FORMULARIO
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </> 
  );
}

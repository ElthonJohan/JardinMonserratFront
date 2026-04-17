import { useEffect, useState } from "react";
import EstudianteForm from "../components/EstudianteForm";
import EstudianteTable from "../components/EstudianteTable";
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getAulas,
  getApoderados,
} from "../services/estudianteService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/estudiantes.css";
import toast from "react-hot-toast";

import { Modal } from "bootstrap";

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadData = async () => {
    try {
      const [estRes, aulaRes, apoRes] = await Promise.all([
        getEstudiantes(),
        getAulas(),
        getApoderados(),
      ]);

      console.log("ESTUDIANTES 👉", estRes);
      console.log("AULAS 👉", aulaRes);
      console.log("APODERADOS 👉", apoRes);

      // 🔥 NORMALIZAR TODO
      const estudiantesData = estRes.data?.results || estRes.data;
      const aulasData = aulaRes.data?.results || aulaRes.data;
      const apoderadosData = apoRes.data?.results || apoRes.data;

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
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleEdit = (estudiante) => {
    // 🔥 CLONAR el objeto (evita que React reutilice la referencia)
    const copia = JSON.parse(JSON.stringify(estudiante));

    setSelectedEstudiante(copia);
    setIsEditMode(true);

    const modal = new Modal(document.getElementById("estudianteModal"));
    modal.show();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar estudiante?")) {
      await deleteEstudiante(id);
      toast.success("Eliminado");
      loadData();
    }
  };


  return (
    <div className="container container-custom">
      <h1 className="text-2xl font-bold mb-4">Gestión de Estudiantes</h1>
      <button className="btn btn-primary mb-3" onClick={openCreateModal}>
        + Nuevo Estudiante
      </button>

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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  getAulas,
  createAula,
  updateAula,
  deleteAula,
} from "../services/aulaService";

import AulaForm from "../components/AulaForm";
import AulaTable from "../components/AulaTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/aulas.css";
import toast from "react-hot-toast";

import { Modal } from "bootstrap";

export default function AulasPage() {
  const [aulas, setAulas] = useState([]);

  const [selectedAula, setSelectedAula] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadData = async () => {
    const res = await getAulas();

    console.log("AULAS 👉", res);

    setAulas(res.data.results || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setSelectedAula(null);
    setIsEditMode(false);

    const modal = new Modal(document.getElementById("aulaModal"));
    modal.show();
  };

  const handleSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateAula(selectedAula.id, data);
        toast.success("Actualizado correctamente");
      } else {
        await createAula(data);
        toast.success("Creado correctamente");
      }

      const modalElement = document.getElementById("aulaModal");
      const modal = Modal.getInstance(modalElement);
      modal.hide();
      loadData();
    } catch (error) {
      console.error("ERROR COMPLETO 👉", error);
      toast.error("Error al guardar el aula");
    }
  };

  const handleEdit = (item) => {
    const copia = JSON.parse(JSON.stringify(item));

    setSelectedAula(copia);
    setIsEditMode(true);

    const modal = new Modal(document.getElementById("aulaModal"));
    modal.show();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar aula?")) {
      try {
        await deleteAula(id);
        toast.success("Eliminado");
        loadData();
      } catch (error) {
        console.error("ERROR COMPLETO 👉", error);
        toast.error("Error al eliminar el aula");
      }
    }
  };

  return (
    <div className="container container-custom">
      <h1 className="text-2xl font-bold mb-4">Gestión de Aulas</h1>
      <button className="btn btn-primary mb-3" onClick={openCreateModal}>
        + Nueva Aula
      </button>

      <AulaTable data={aulas} onEdit={handleEdit} onDelete={handleDelete} />

      <div className="modal fade" id="aulaModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditMode ? "Editar Aula" : "Nueva Aula"}
              </h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <AulaForm
                key={selectedAula ? selectedAula.id : Date.now()} // 🔥 FORZAR RECREACIÓN// 🔥 FORZAR RECREACIÓN
                onSubmit={handleSubmit}
                initialData={selectedAula || {}}
                isEditMode={isEditMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

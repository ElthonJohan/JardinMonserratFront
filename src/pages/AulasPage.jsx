import { useEffect, useState } from "react";
import {
  getAulas,
  createAula,
  updateAula,
  deleteAula,
} from "../api/aulasAPI";

import AulaForm from "../components/aulas/AulaForm";
import AulaTable from "../components/aulas/AulaTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/aulas.css";
import toast from "react-hot-toast";

import { Modal } from "bootstrap";
import { AppNavbar, Loading } from '../components/shared';
import axios from "axios";
import axiosInstance from "../api/axiosConfig";


export default function AulasPage() {
  const [aulas, setAulas] = useState([]);

  const [selectedAula, setSelectedAula] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadData = async () => {
    const res = await getAulas();

    console.log("AULAS 👉", res);

    setAulas(res.results || []);
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
    if (window.confirm("¿Estás seguro que quieres eliminar esta aula?")) {
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

  const handleSearch = async (e) => {
    const term = e.target.value;
    try {
      const response = await axiosInstance.get(`/aulas/${term ? `?search=${term}` : ""}`);
      const data = response.data.results || response.data;
      setAulas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error buscando:", error);
    }
  };


  return (
    <>
      <AppNavbar />
      <div className="matriculas-container">
        <div className="container-matriculas">
          {/* HEADER */}
          <div className="matriculas-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h1>🏫 Gestión de Aulas</h1>
                <p className="text-muted mb-0">Administra los grados, secciones y capacidades de aulas de la institución.</p>
              </div>
              <button className="btn-nueva-matricula" onClick={openCreateModal}>
                ➕ Nueva Aula
              </button>
            </div>
          </div>

          {/* SEARCH CARD */}
          <div className="search-card mb-4">
            <label>Buscar Aula</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre de aula..."
                onChange={handleSearch}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <AulaTable data={aulas} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>


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
                key={selectedAula ? selectedAula.id : Date.now()}
                onSubmit={handleSubmit}
                initialData={selectedAula || {}}
                isEditMode={isEditMode}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


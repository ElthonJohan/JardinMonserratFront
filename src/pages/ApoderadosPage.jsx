import { useEffect, useState, useMemo } from "react";
import {
  getApoderados,
  createApoderado,
  updateApoderado,
  deleteApoderado,
} from "../api/apoderadosApi.js";

import ApoderadoForm from "../components/apoderados/ApoderadoForm.jsx";
import ApoderadoTable from "../components/apoderados/ApoderadoTable.jsx";
import { AppNavbar, Loading } from "../components/shared";
import { Modal } from "bootstrap";
import toast from "react-hot-toast";

export default function ApoderadosPage() {
  const [apoderados, setApoderados] = useState([]);
  const [selectedApoderado, setSelectedApoderado] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getApoderados();
      setApoderados(res && res.results ? res.results : res || []);
    } catch (error) {
      toast.error("Error al cargar la lista de apoderados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (apoderado = null) => {
    if (apoderado) {
      setSelectedApoderado(apoderado);
      setIsEditMode(true);
    } else {
      setSelectedApoderado(null);
      setIsEditMode(false);
    }
    const modal = new Modal(document.getElementById("apoderadoModal"));
    modal.show();
  };

  const handleSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateApoderado(selectedApoderado.id, data);
        toast.success("Apoderado actualizado correctamente");
      } else {
        await createApoderado(data);
        toast.success("Apoderado registrado correctamente");
      }

      const modalElement = document.getElementById("apoderadoModal");
      const modal = Modal.getInstance(modalElement);
      modal.hide();
      loadData();
    } catch (error) {
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este apoderado?")) {
      try {
        await deleteApoderado(id);
        toast.success("Apoderado eliminado con éxito");
        loadData();
      } catch (error) {
        toast.error("No se pudo eliminar el apoderado");
      }
    }
  };

  const filteredApoderados = useMemo(() => {
    return apoderados.filter((apo) => {
      const search = searchTerm.toLowerCase();
      return (
        apo.nombres?.toLowerCase().includes(search) ||
        apo.apellidos?.toLowerCase().includes(search) ||
        apo.dni?.includes(search) ||
        apo.email?.toLowerCase().includes(search)
      );
    });
  }, [apoderados, searchTerm]);

  return (
    <>
      <AppNavbar />
      <div className="container container-custom mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-2xl font-bold">👥 Gestión de Apoderados</h1>
          <button className="btn btn-primary shadow-sm" onClick={() => openModal()}>
            + Nuevo Apoderado
          </button>
        </div>

        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body bg-light rounded">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">🔍</span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Buscar por nombre, apellidos, DNI o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <span className="text-muted small">
                  Total: <strong>{filteredApoderados.length}</strong> encontrados
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading message="Cargando apoderados..." />
        ) : (
          <ApoderadoTable
            data={filteredApoderados}
            onEdit={openModal}
            onDelete={handleDelete}
          />
        )}

        {/* Modal de Creación/Edición */}
        <div className="modal fade" id="apoderadoModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {isEditMode ? "✏️ Editar Apoderado" : "👤 Nuevo Apoderado"}
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body p-4">
                <ApoderadoForm
                  key={selectedApoderado ? selectedApoderado.id : "new-apo"}
                  onSubmit={handleSubmit}
                  initialData={selectedApoderado}
                  isEditMode={isEditMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
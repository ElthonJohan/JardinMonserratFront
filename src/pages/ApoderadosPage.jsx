import { useEffect, useState, useMemo } from "react";
import {
  getApoderados,
  createApoderado,
  updateApoderado,
  deleteApoderado,
  resetPassword,
} from "../api/apoderadosApi.js";

import ApoderadoForm from "../components/apoderados/ApoderadoForm.jsx";
import ApoderadoTable from "../components/apoderados/ApoderadoTable.jsx";
import { AppNavbar, Loading } from "../components/shared";
import { Modal } from "bootstrap";
import toast from "react-hot-toast";
import "../styles/MatriculasPage.css";

export default function ApoderadosPage() {
  const [apoderados, setApoderados] = useState([]);
  const [selectedApoderado, setSelectedApoderado] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetResult, setResetResult] = useState(null);

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

  const handleResetPassword = async (apoderado) => {

    if (
      !window.confirm(
        `¿Desea restablecer la contraseña de ${apoderado.nombres} ${apoderado.apellidos}?`
      )
    ) {
      return;
    }

    try {

      const data = await resetPassword(apoderado.id);

      setResetResult(data);

      setShowResetModal(true);

      toast.success("Contraseña restablecida correctamente");

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "No se pudo restablecer la contraseña."
      );

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
      <div className="matriculas-container">
        <div className="container-matriculas">
          {/* ─── HEADER ─── */}
          <div className="matriculas-header">
            <div className="matriculas-header-top">
              <h1>👥 Gestión de Apoderados</h1>
            </div>
            <p>Administra los datos de los padres y tutores registrados en el sistema.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-nueva-matricula" onClick={() => openModal()}>
                ➕ Nuevo Apoderado
              </button>
            </div>
          </div>

          {/* ─── SEARCH & STATS SECTION ─── */}
          <div className="matriculas-search-section">
            <div className="search-card">
              <label>Buscar Apoderado</label>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, apellidos, DNI o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div className="stats-card">
              <div className="stats-card-content">
                <div className="stats-card-text">
                  <span className="stats-label">Total Apoderados</span>
                  <div className="stats-number">{apoderados.length}</div>
                </div>
                <div className="stats-icon">👥</div>
              </div>
              <div className="stats-badges">
                <span className="stats-badge active">
                   Encontrados: {filteredApoderados.length}
                </span>
              </div>
            </div>
          </div>

          <div className="table-container">
            <div className="table-wrapper">

        {loading ? (
          <Loading message="Cargando apoderados..." />
        ) : (
          <ApoderadoTable
            data={filteredApoderados}
            onEdit={openModal}
            onDelete={handleDelete}
            onResetPassword={handleResetPassword}
            tableClassName="matriculas-table"
          />
        )}
        </div>
      </div>

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
      </div>
      {/* ══════════════════════════════════════
          MODAL: Reset Password
      ══════════════════════════════════════ */}
      {showResetModal && resetResult && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">✅ Contraseña Restablecida</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowResetModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p>Las nuevas credenciales para <strong>{resetResult.apoderado}</strong> son:</p>
                <div className="alert alert-info">
                  <strong>Usuario:</strong> {resetResult.username} <br />
                  <strong>Contraseña:</strong> {resetResult.password}
                </div>
                <small className="text-danger">⚠️ Por favor, comparta estos datos ahora. La contraseña no se volverá a mostrar.</small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => {
                  navigator.clipboard.writeText(`Usuario: ${resetResult.username}\nContraseña: ${resetResult.password}`);
                  toast.success("Credenciales copiadas al portapapeles");
                }}>
                  📋 Copiar
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowResetModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
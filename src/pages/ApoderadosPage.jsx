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
  const [apoderadoToReset, setApoderadoToReset] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleResetPassword = (apoderado) => {
    setApoderadoToReset(apoderado);
    setResetResult(null);
  };

  const executeResetPassword = async () => {
    if (!apoderadoToReset || isResetting) return;

    setIsResetting(true);
    try {
      const result = await resetPassword(apoderadoToReset.id);
      setResetResult(result);
      setShowResetModal(true);
      setApoderadoToReset(null);
      toast.success("Contraseña restablecida correctamente");
    } catch (error) {
      console.error(error);
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      
      let message = "No se pudo restablecer la contraseña. Inténtalo nuevamente.";
      if (status === 401) {
        message = "Tu sesión ha expirado. Inicia sesión nuevamente.";
      } else if (status === 403) {
        message = "No tienes permisos para restablecer contraseñas.";
      } else if (status === 404) {
        message = "Este apoderado no tiene una cuenta de acceso asociada.";
      } else if (status === 500) {
        message = "No se pudo restablecer la contraseña. Inténtalo nuevamente.";
      } else if (detail) {
        message = detail;
      }
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  const closeResetResultModal = () => {
    setShowResetModal(false);
    setResetResult(null);
  };

  const copyToClipboard = () => {
    if (resetResult?.password) {
      navigator.clipboard.writeText(resetResult.password);
      toast.success("Contraseña copiada");
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
      {/* ══════════════════════════════════════
          MODAL: Confirm Reset Password
      ══════════════════════════════════════ */}
      {apoderadoToReset && !resetResult && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">🔑 Restablecer contraseña</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  disabled={isResetting}
                  onClick={() => setApoderadoToReset(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <p className="mb-3 fs-5">¿Está seguro de que desea restablecer la contraseña de este apoderado?</p>
                <div className="card bg-light border-0 p-3 mb-3">
                  <div className="mb-2">
                    <strong>Apoderado:</strong> {apoderadoToReset.nombres} {apoderadoToReset.apellidos}
                  </div>
                  {apoderadoToReset.dni && (
                    <div>
                      <strong>DNI:</strong> {apoderadoToReset.dni}
                    </div>
                  )}
                </div>
                <div className="alert alert-warning py-2 mb-0">
                  <small>Esta acción generará una contraseña temporal y obligará al apoderado a cambiarla en su próximo inicio de sesión.</small>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  disabled={isResetting}
                  onClick={() => setApoderadoToReset(null)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-warning text-dark fw-bold" 
                  disabled={isResetting}
                  onClick={executeResetPassword}
                >
                  {isResetting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    "Restablecer contraseña"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          MODAL: Result Reset Password
      ══════════════════════════════════════ */}
      {showResetModal && resetResult && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">✅ Contraseña Restablecida</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeResetResultModal}></button>
              </div>
              <div className="modal-body text-center p-4">
                <div className="mb-3 text-success" style={{ fontSize: '3rem' }}>🔑</div>
                <p className="fs-5 mb-3 fw-semibold">Contraseña restablecida correctamente</p>
                <p className="text-muted">Las nuevas credenciales de acceso para <strong>{resetResult?.apoderado}</strong> son:</p>
                <div className="alert alert-info py-3 my-3">
                  <div className="mb-2"><strong>Usuario:</strong> <span className="font-monospace">{resetResult?.username}</span></div>
                  <div><strong>Contraseña temporal:</strong> <span className="font-monospace fw-bold text-danger fs-5">{resetResult?.password}</span></div>
                </div>
                <div className="alert alert-warning py-2 mb-0">
                  <small className="text-dark">⚠️ Esta contraseña es temporal. El apoderado deberá cambiarla obligatoriamente al iniciar sesión.</small>
                </div>
              </div>
              <div className="modal-footer bg-light justify-content-center">
                <button type="button" className="btn btn-success px-4 fw-semibold" onClick={copyToClipboard}>
                  📋 Copiar contraseña
                </button>
                <button type="button" className="btn btn-secondary px-4" onClick={closeResetResultModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
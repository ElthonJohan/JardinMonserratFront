import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EstudianteForm from "../components/estudiantes/EstudianteForm";
import EstudianteTable from "../components/estudiantes/EstudianteTable";
import ApoderadosModal from "../components/estudiantes/ApoderadoModal";
import AgregarApoderadoModal from "../components/estudiantes/AgregarApoderadoModal";
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
} from "../api/apoderadosApi";
import axiosInstance from "../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/estudiantes.css";
import toast from "react-hot-toast";
import { Modal } from "bootstrap";
import { AppNavbar, Loading } from "../components/shared";

export default function EstudiantesPage() {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes]       = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [serverErrors, setServerErrors]     = useState({});
  const [isEditMode, setIsEditMode]         = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentParents, setStudentParents] = useState([]);

  /* ── load ── */
  const loadData = async () => {
    try {
      const [estRes] = await Promise.all([getEstudiantes()]);
      const estudiantesData = estRes.results || estRes.data;
      setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : []);
    } catch (error) {
      console.error("ERROR 👉", error.response?.data);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* ── helpers ── */
  const openModal   = (id) => new Modal(document.getElementById(id)).show();
  const hideModal   = (id) => Modal.getInstance(document.getElementById(id))?.hide();

  /* ── CRUD ── */
  const openCreateModal = () => {
    setSelectedEstudiante({});
    setIsEditMode(false);
    setServerErrors({});
    openModal("estudianteModal");
  };

  const handleSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateEstudiante(selectedEstudiante.id, data);
        toast.success("Actualizado correctamente");
      } else {
        const res = await createRegistroAlumno(data);
        if (res?.generated_credentials) {
          setNewCredentials({
            ...res.generated_credentials,
            apoderado:  `${data.apoderado?.nombres} ${data.apoderado?.apellidos}`,
            estudiante: `${data.estudiante?.nombres} ${data.estudiante?.apellidos}`,
          });
          openModal("credentialsModal");
        }
        toast.success("Estudiante registrado correctamente");
      }
      hideModal("estudianteModal");
      loadData();
      setServerErrors({});
    } catch (error) {
      if (error.response?.status === 400) {
        setServerErrors(error.response.data);
        toast.error("Por favor, revisa los campos marcados.");
      } else {
        toast.error("Ocurrió un error inesperado.");
      }
    }
  };

  const handleEdit = (estudiante) => {
    const listaApoderados = estudiante.apoderados || estudiante.apoderados_detail || [];
    const relPrincipal    = listaApoderados.find(r => r.es_principal) || listaApoderados[0];
    setSelectedEstudiante({
      id: estudiante.id,
      estudiante: {
        nombres: estudiante.nombres, apellidos: estudiante.apellidos,
        dni: estudiante.dni, fecha_nacimiento: estudiante.fecha_nacimiento,
        codigo_estudiante: estudiante.codigo_estudiante,
      },
      apoderado: relPrincipal ? { ...relPrincipal.apoderado }
        : { nombres: "", apellidos: "", dni: "", telefono: "", email: "", direccion: "" },
      tipo_relacion: relPrincipal?.tipo_relacion ?? "MADRE",
      es_principal:  relPrincipal?.es_principal  ?? true,
    });
    setIsEditMode(true);
    setServerErrors({});
    openModal("estudianteModal");
  };

  const handleMatricula = (estudiante) => {
    navigate("/matriculas", { state: { autoOpen: true, alumnoId: estudiante.id } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar estudiante?")) return;
    try {
      await deleteEstudiante(id);
      toast.success("Eliminado");
      loadData();
    } catch {
      toast.error("No se pudo eliminar el estudiante");
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    try {
      const response = await axiosInstance.get(`/estudiantes/${term ? `?search=${term}` : ""}`);
      const data = response.data.results || response.data;
      setEstudiantes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error buscando:", error);
    }
  };

  /* ── Apoderados ── */
  const handleApoderados = async (estudiante) => {
    try {
      const data = await getApoderadosEstudiante(estudiante.id);
      setSelectedStudent(estudiante);
      setStudentParents(data);
      openModal("apoderadosModal");
    } catch {
      toast.error("Error cargando apoderados");
    }
  };

  const handleCreateParent = async (data) => {
    try {
      await agregarApoderado(selectedStudent.id, data);
      toast.success("Apoderado agregado");
    } catch (error) {
      toast.error(JSON.stringify(error.response?.data));
    }
  };

  const handleMakePrincipal = async (relacionId) => {
    try {
      await cambiarPrincipal(relacionId);
      toast.success("Apoderado principal actualizado");
      setStudentParents(await getApoderadosEstudiante(selectedStudent.id));
    } catch {
      toast.error("No se pudo actualizar");
    }
  };

  const handleDeleteParent = async (relacionId) => {
    if (!window.confirm("¿Eliminar relación con este apoderado?")) return;
    try {
      await eliminarRelacion(relacionId);
      toast.success("Relación eliminada");
      setStudentParents(await getApoderadosEstudiante(selectedStudent.id));
    } catch (error) {
      toast.error(error.response?.data?.error || "No se pudo eliminar");
    }
  };

  const openAddParentModal = () => openModal("agregarApoderadoModal");

  /* ────────────────── RENDER ────────────────── */
  return (
    <>
      <AppNavbar />

      <div className="container-fluid container-custom">

        {/* ── Page header ── */}
        <div className="d-flex flex-column gap-2 mb-4">
          <h1 className="page-title">Gestión de Estudiantes</h1>
        </div>

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <button className="btn-nuevo" onClick={openCreateModal}>
            <span style={{ fontSize: 15 }}>＋</span> Nuevo Estudiante
          </button>

          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre o DNI apoderado..."
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="table-section">
          <div className="table-section-header">
            <h3>Lista de Estudiantes</h3>
          </div>

          <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
            {/* EstudianteTable ya existente — le pasamos la clase via wrapper.
                Si quieres, puedes refactorizar EstudianteTable para usar est-table
                directamente. Por ahora el wrapper aplica los estilos. */}
            <EstudianteTable
              data={estudiantes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMatricula={handleMatricula}
              onApoderados={handleApoderados}
              tableClassName="est-table"
            />
          </div>

          {/* Pagination info */}
          <div className="table-pagination">
            <span>
              Mostrando {estudiantes.length} estudiante{estudiantes.length !== 1 ? 's' : ''}
            </span>
            <div className="pagination-pages">
              <button className="page-btn" disabled>‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn" disabled>›</button>
            </div>
          </div>
        </div>

      </div>{/* /container-custom */}

      {/* ══════════════════════════════════════
          MODAL: Crear / Editar Estudiante
      ══════════════════════════════════════ */}
      <div className="modal fade" id="estudianteModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditMode ? "✏️ Editar Estudiante" : "➕ Nuevo Estudiante"}
              </h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <EstudianteForm
                key={selectedEstudiante ? selectedEstudiante.id : Date.now()}
                onSubmit={handleSubmit}
                initialData={selectedEstudiante}
                isEditMode={isEditMode}
                errors={serverErrors}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MODAL: Credenciales generadas
      ══════════════════════════════════════ */}
      <div className="modal fade" id="credentialsModal" tabIndex="-1" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header" style={{ background: '#146c2e' }}>
              <h5 className="modal-title">✅ Usuario de Apoderado Creado</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>

            <div className="modal-body">
              <p style={{
                fontSize: 14, color: 'var(--on-surface-variant)',
                marginBottom: 16, textAlign: 'center',
              }}>
                Se ha generado automáticamente una cuenta de acceso para el apoderado.
                <strong style={{ display: 'block', color: 'var(--error)', marginTop: 8 }}>
                  Por favor, comparta estos datos ahora. La contraseña no se volverá a mostrar.
                </strong>
              </p>

              <div className="cred-box">
                <div className="cred-row">
                  <span className="cred-label">Apoderado</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{newCredentials?.apoderado}</span>
                </div>
                <div className="cred-row">
                  <span className="cred-label">Estudiante</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{newCredentials?.estudiante}</span>
                </div>
                <div className="cred-row" style={{ marginTop: 8 }}>
                  <span className="cred-label">Usuario</span>
                  <span className="cred-value">{newCredentials?.username}</span>
                </div>
                <div className="cred-row">
                  <span className="cred-label">Contraseña</span>
                  <span className="cred-value">{newCredentials?.password}</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(0,149,217,0.08)',
                border: '1px solid rgba(0,149,217,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontSize: 13,
                color: 'var(--info)',
              }}>
                💡 El apoderado podrá ingresar con su código de estudiante y esta contraseña temporal.
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-modal-primary" data-bs-dismiss="modal">
                Confirmar y Cerrar
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MODAL: Apoderados
      ══════════════════════════════════════ */}
      <ApoderadosModal
        selectedStudent={selectedStudent}
        studentParents={studentParents}
        onMakePrincipal={handleMakePrincipal}
        onDeleteParent={handleDeleteParent}
        onAddParent={openAddParentModal}
      />

      <AgregarApoderadoModal onSubmit={handleCreateParent} />
    </>
  );
}
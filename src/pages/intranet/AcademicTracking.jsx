import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import { getPeriodos, getLibretaVirtual } from "../../api/academicoAPI";
import { Spinner, Card, Table, Badge, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .academic-page {
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    background: #f8fafc;
    min-height: 100vh;
    padding: 10px 10px 40px;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── Header Banner ── */
  .academic-header-banner {
    background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
    border-radius: 20px;
    padding: 30px 40px;
    color: white;
    margin-bottom: 30px;
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.15);
    position: relative;
    overflow: hidden;
  }

  .academic-header-banner::after {
    content: '';
    position: absolute;
    width: 250px;
    height: 250px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    right: -50px;
    bottom: -100px;
  }

  .academic-header-banner h1 {
    font-weight: 800;
    font-size: 1.8rem;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .academic-header-banner p {
    font-weight: 400;
    opacity: 0.9;
    margin-bottom: 0;
    font-size: 0.95rem;
  }

  /* ── Section Title ── */
  .section-title {
    font-weight: 700;
    font-size: 1.1rem;
    color: #1e293b;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Child Selector Cards ── */
  .hijos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 30px;
  }

  .hijo-card {
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .hijo-card:hover {
    transform: translateY(-3px);
    border-color: #93c5fd;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.08);
  }

  .hijo-card.active {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-color: #3b82f6;
    box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.15);
  }

  .hijo-avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: #475569;
    transition: all 0.25s;
  }

  .hijo-card.active .hijo-avatar {
    background: #3b82f6;
    color: white;
  }

  .hijo-info {
    flex: 1;
    min-width: 0;
  }

  .hijo-name {
    font-weight: 700;
    font-size: 0.95rem;
    color: #1e293b;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hijo-meta {
    font-size: 0.78rem;
    color: #64748b;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .hijo-meta strong {
    color: #475569;
  }

  /* ── Evaluation Periods Bar ── */
  .periodos-tabs-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
    background: #f1f5f9;
    padding: 6px;
    border-radius: 12px;
    width: fit-content;
  }

  .periodo-tab-btn {
    border: none;
    background: transparent;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .periodo-tab-btn:hover {
    color: #1e293b;
    background: rgba(255,255,255,0.5);
  }

  .periodo-tab-btn.active {
    background: white;
    color: #2563eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  }

  /* ── Legend Container ── */
  .legend-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 18px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    font-size: 0.82rem;
    color: #64748b;
  }

  .legend-title {
    font-weight: 700;
    color: #475569;
    margin-right: 6px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── Report Card (Areas & Competencias) ── */
  .report-card-container {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
    overflow: hidden;
    margin-bottom: 24px;
    animation: fadeIn 0.3s ease-out;
  }

  .area-header {
    background: #f8fafc;
    border-bottom: 1.5px solid #e2e8f0;
    padding: 16px 24px;
    font-weight: 700;
    font-size: 1.05rem;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .area-icon {
    font-size: 1.2rem;
  }

  .competencia-table {
    margin-bottom: 0;
  }

  .competencia-table th {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
    background: #ffffff;
    padding: 12px 24px;
    border-bottom-width: 1px;
  }

  .competencia-table td {
    padding: 16px 24px;
    vertical-align: middle;
    font-size: 0.9rem;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
  }

  .competencia-desc {
    font-weight: 500;
    line-height: 1.4;
  }

  /* ── Grade Badges ── */
  .grade-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    font-size: 0.95rem;
    font-weight: 800;
    text-shadow: 0 1px 1px rgba(0,0,0,0.05);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  .grade-badge.grade-ad {
    background: linear-gradient(135deg, #818cf8 0%, #4f46e5 100%);
    color: white;
  }

  .grade-badge.grade-a {
    background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    color: white;
  }

  .grade-badge.grade-b {
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    color: white;
  }

  .grade-badge.grade-c {
    background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
    color: white;
  }

  .grade-badge.grade-none {
    background: #cbd5e1;
    color: #64748b;
    box-shadow: none;
  }

  /* ── Teacher Appreciation Card ── */
  .appreciation-card {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1.5px dashed #cbd5e1;
    border-radius: 16px;
    padding: 24px;
    position: relative;
    margin-top: 30px;
  }

  .appreciation-card::before {
    content: '“';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 4rem;
    font-family: Georgia, serif;
    color: #cbd5e1;
    line-height: 1;
  }

  .appreciation-title {
    font-weight: 700;
    font-size: 0.95rem;
    color: #475569;
    margin-bottom: 8px;
    padding-left: 24px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .appreciation-content {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #1e293b;
    font-style: italic;
    padding-left: 24px;
  }

  .appreciation-empty {
    color: #64748b;
    font-size: 0.88rem;
    font-style: normal;
  }

  /* ── Empty State ── */
  .empty-state {
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  }

  .empty-state-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    display: inline-block;
  }

  .empty-state h3 {
    font-weight: 700;
    font-size: 1.15rem;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .empty-state p {
    color: #64748b;
    font-size: 0.88rem;
    margin-bottom: 0;
  }

  /* ── Loading Wrapper ── */
  .loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #64748b;
  }
`;

const getHijoAvatarEmoji = (nombre) => {
  const code = nombre.charCodeAt(0) + nombre.charCodeAt(nombre.length - 1);
  return code % 2 === 0 ? "👦" : "👧";
};

const AcademicTracking = () => {
  const [profileData, setProfileData] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [libreta, setLibreta] = useState(null);

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);
  const [loadingLibreta, setLoadingLibreta] = useState(false);

  // Fetch Parent profile containing children
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await axiosInstance.get("/parent/profile/");
      setProfileData(res.data);
      const hijos = res.data.hijos || [];
      if (hijos.length > 0) {
        setSelectedChild(hijos[0]);
      }
    } catch (error) {
      console.error("Error al obtener perfil del apoderado:", error);
      toast.error("No se pudo cargar el perfil del apoderado.");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch Evaluation Periods when student is selected
  useEffect(() => {
    if (!selectedChild) {
      setPeriodos([]);
      setSelectedPeriod(null);
      return;
    }

    if (!selectedChild.periodo_academico_id) {
      setPeriodos([]);
      setSelectedPeriod(null);
      setLibreta(null);
      return;
    }

    const fetchPeriodosEvaluacion = async () => {
      try {
        setLoadingPeriodos(true);
        setLibreta(null);
        const res = await getPeriodos({
          periodo_matricula: selectedChild.periodo_academico_id,
          activo: true,
        });
        const listPeriodos = Array.isArray(res) ? res : res.results || [];
        setPeriodos(listPeriodos);
        if (listPeriodos.length > 0) {
          setSelectedPeriod(listPeriodos[0]);
        } else {
          setSelectedPeriod(null);
        }
      } catch (error) {
        console.error("Error al cargar periodos de evaluación:", error);
        toast.error("Error al cargar los periodos de evaluación.");
      } finally {
        setLoadingPeriodos(false);
      }
    };

    fetchPeriodosEvaluacion();
  }, [selectedChild]);

  // Fetch Virtual Report Card (libreta) when period is selected
  useEffect(() => {
    if (!selectedChild || !selectedPeriod) {
      setLibreta(null);
      return;
    }

    const fetchLibreta = async () => {
      try {
        setLoadingLibreta(true);
        const data = await getLibretaVirtual({
          alumno_id: selectedChild.id,
          periodo_evaluacion_id: selectedPeriod.id,
        });
        setLibreta(data);
      } catch (error) {
        console.error("Error al cargar libreta virtual:", error);
        toast.error("Error al cargar las calificaciones.");
        setLibreta(null);
      } finally {
        setLoadingLibreta(false);
      }
    };

    fetchLibreta();
  }, [selectedChild, selectedPeriod]);

  // Render Grade Badge
  const renderGradeBadge = (nota) => {
    if (!nota) return <span className="grade-badge grade-none">-</span>;
    const notaUpper = nota.toUpperCase();
    let badgeClass = "grade-none";
    if (notaUpper === "AD") badgeClass = "grade-ad";
    else if (notaUpper === "A") badgeClass = "grade-a";
    else if (notaUpper === "B") badgeClass = "grade-b";
    else if (notaUpper === "C") badgeClass = "grade-c";

    return <span className={`grade-badge ${badgeClass}`}>{notaUpper}</span>;
  };

  if (loadingProfile) {
    return (
      <div className="academic-page d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando información familiar...</p>
        </div>
      </div>
    );
  }

  const hijos = profileData?.hijos || [];

  return (
    <>
      <style>{styles}</style>
      <div className="academic-page">
        {/* Banner */}
        <div className="academic-header-banner">
          <h1>Seguimiento Académico</h1>
          <p>
            Consulte la libreta virtual de calificaciones y apreciaciones pedagógicas registradas por los docentes.
          </p>
        </div>

        {/* 1. Selección de Hijos */}
        <div className="section-title">
          <span>👨‍👩‍👧‍👦</span> Seleccione el estudiante
        </div>

        {hijos.length === 0 ? (
          <div className="empty-state mb-4">
            <span className="empty-state-icon">📭</span>
            <h3>No se encontraron alumnos</h3>
            <p>No tienes hijos registrados o asociados a tu cuenta de apoderado actualmente.</p>
          </div>
        ) : (
          <div className="hijos-grid">
            {hijos.map((hijo) => {
              const isActive = selectedChild && selectedChild.id === hijo.id;
              const avatar = getHijoAvatarEmoji(hijo.nombre);
              return (
                <div
                  key={hijo.id}
                  className={`hijo-card ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedChild(hijo)}
                >
                  <div className="hijo-avatar">{avatar}</div>
                  <div className="hijo-info">
                    <div className="hijo-name">{hijo.nombre}</div>
                    <div className="hijo-meta">
                      <span>Cód: <strong>{hijo.codigo_estudiante || hijo.id}</strong></span>
                      <span>Aula: <strong>{hijo.aula_nombre || "No matriculado"}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Si el alumno seleccionado no está matriculado */}
        {selectedChild && !selectedChild.periodo_academico_id && (
          <div className="empty-state mb-4">
            <span className="empty-state-icon">⚠️</span>
            <h3>Alumno no matriculado</h3>
            <p>
              El estudiante <strong>{selectedChild.nombre}</strong> no registra una matrícula activa para el presente periodo escolar.
            </p>
          </div>
        )}

        {/* 2. Barra de Periodos */}
        {selectedChild && selectedChild.periodo_academico_id && (
          <>
            <div className="section-title">
              <span>📅</span> Periodos de Evaluación ({selectedChild.periodo_academico_nombre})
            </div>

            {loadingPeriodos ? (
              <div className="loading-wrapper">
                <Spinner animation="border" size="sm" variant="secondary" className="mb-2" />
                <span>Cargando periodos del año escolar...</span>
              </div>
            ) : periodos.length === 0 ? (
              <div className="empty-state mb-4">
                <span className="empty-state-icon">🗓️</span>
                <h3>Sin periodos de evaluación</h3>
                <p>No hay periodos de evaluación configurados o activos para este año escolar.</p>
              </div>
            ) : (
              <div className="periodos-tabs-bar">
                {periodos.map((period) => {
                  const isActive = selectedPeriod && selectedPeriod.id === period.id;
                  return (
                    <button
                      key={period.id}
                      className={`periodo-tab-btn ${isActive ? "active" : ""}`}
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period.nombre}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* 3. Visualización de Libreta / Calificaciones */}
        {selectedChild && selectedPeriod && (
          <>
            <div className="section-title">
              <span>📊</span> Libreta Informativa - {selectedPeriod.nombre}
            </div>

            {loadingLibreta ? (
              <div className="loading-wrapper bg-white rounded-4 border p-5 shadow-sm">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <span>Cargando notes y apreciación del docente...</span>
              </div>
            ) : !libreta || !libreta.areas || libreta.areas.length === 0 ? (
              <div className="empty-state mb-4">
                <span className="empty-state-icon">📝</span>
                <h3>Aún no se registran notas</h3>
                <p>
                  El docente todavía no ha publicado calificaciones ni apreciaciones para <strong>{selectedChild.nombre}</strong> en el periodo <strong>{selectedPeriod.nombre}</strong>.
                </p>
              </div>
            ) : (
              <div>
                {/* Leyenda de Notas */}
                <div className="legend-box shadow-sm">
                  <span className="legend-title">Leyenda de Calificaciones:</span>
                  <div className="legend-item">
                    <span className="badge rounded-pill" style={{ background: "#4f46e5" }}>AD</span> Logro Destacado
                  </div>
                  <div className="legend-item">
                    <span className="badge rounded-pill" style={{ background: "#059669" }}>A</span> Logro Previsto
                  </div>
                  <div className="legend-item">
                    <span className="badge rounded-pill" style={{ background: "#d97706" }}>B</span> En Proceso
                  </div>
                  <div className="legend-item">
                    <span className="badge rounded-pill" style={{ background: "#dc2626" }}>C</span> En Inicio
                  </div>
                </div>

                {/* Renderizar cada Área */}
                {libreta.areas.map((areaData, idx) => (
                  <div key={idx} className="report-card-container shadow-sm">
                    <div className="area-header">
                      <span className="area-icon">⭐</span>
                      <span>{areaData.area}</span>
                    </div>

                    <Table responsive hover className="competencia-table">
                      <thead>
                        <tr>
                          <th>Competencia Evaluada</th>
                          <th style={{ width: "110px", textAlign: "center" }}>Calificación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {areaData.competencias.map((comp, cIdx) => (
                          <tr key={cIdx}>
                            <td>
                              <div className="competencia-desc">{comp.descripcion}</div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {renderGradeBadge(comp.nota)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ))}

                {/* Comentarios de Apreciación */}
                <div className="appreciation-card shadow-sm">
                  <h4 className="appreciation-title">Apreciación del Docente Tutor</h4>
                  {libreta.apreciacion ? (
                    <div className="appreciation-content">
                      {libreta.apreciacion}
                    </div>
                  ) : (
                    <div className="appreciation-content appreciation-empty">
                      No se han registrado comentarios u observaciones apreciativas para este periodo de evaluación.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AcademicTracking;

import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import { getPeriodos, getLibretaVirtual } from "../../api/academicoAPI";
import { Spinner, Card, Table, Badge, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";

import "../../styles/AcademicTracking.css";

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

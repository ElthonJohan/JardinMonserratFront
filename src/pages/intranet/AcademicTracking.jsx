import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../api/axiosConfig";
import { getPeriodos, getLibretaVirtual } from "../../api/academicoAPI";
import { Spinner, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import GuiaAcademicModal from "./GuiaAcademicModal";

import "../../styles/AcademicTracking.css";

// Mapea notas cualitativas a porcentajes visuales para las barras de progreso
const getProgressPercent = (nota) => {
  if (!nota) return 0;
  const n = nota.toUpperCase();
  if (n === "AD") return 100;
  if (n === "A") return 80;
  if (n === "B") return 55;
  if (n === "C") return 30;
  return 0;
};

// Mapea nota a etiqueta ejecutiva
const getGradeLabel = (nota) => {
  if (!nota) return "Sin evaluar";
  const n = nota.toUpperCase();
  if (n === "AD") return "AD (Excelente)";
  if (n === "A") return "A (Previsto)";
  if (n === "B") return "B (En Proceso)";
  if (n === "C") return "C (En Inicio)";
  return nota;
};

const AcademicTracking = () => {
  const [profileData, setProfileData] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [libreta, setLibreta] = useState(null);

  // Estados de carga
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);
  const [loadingLibreta, setLoadingLibreta] = useState(false);
  const [showGuia, setShowGuia] = useState(false);

  // Cargar Perfil
  useEffect(() => {
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
        console.error("Error al obtener perfil:", error);
        toast.error("No se pudo cargar el perfil del usuario.");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // Cargar Periodos al cambiar estudiante
  useEffect(() => {
    if (!selectedChild || !selectedChild.periodo_academico_id) {
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
        const listPeriodos = Array.isArray(res) ? res : res?.results || [];
        setPeriodos(listPeriodos);
        if (listPeriodos.length > 0) {
          setSelectedPeriod(listPeriodos[0]);
        } else {
          setSelectedPeriod(null);
        }
      } catch (error) {
        console.error("Error al cargar periodos:", error);
        toast.error("Error al obtener los periodos académicos.");
      } finally {
        setLoadingPeriodos(false);
      }
    };

    fetchPeriodosEvaluacion();
  }, [selectedChild]);

  // Cargar Libreta al cambiar Periodo o Alumno
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
        console.error("Error al cargar libreta:", error);
        toast.error("No se pudieron obtener las calificaciones.");
        setLibreta(null);
      } finally {
        setLoadingLibreta(false);
      }
    };

    fetchLibreta();
  }, [selectedChild, selectedPeriod]);

  // Cálculo de resumen KPI
  const statsSummary = useMemo(() => {
    if (!libreta || !libreta.areas) return { totalAreas: 0, evaluadas: 0, promedioText: "-" };
    const totalAreas = libreta.areas.length;
    let totalComps = 0;
    let totalAD = 0;
    let totalA = 0;

    libreta.areas.forEach((area) => {
      area.competencias.forEach((comp) => {
        if (comp.nota) {
          totalComps++;
          if (comp.nota.toUpperCase() === "AD") totalAD++;
          if (comp.nota.toUpperCase() === "A") totalA++;
        }
      });
    });

    const destacadas = totalComps > 0 ? Math.round(((totalAD + totalA) / totalComps) * 100) : 0;
    return {
      totalAreas,
      evaluadas: totalComps,
      promedioText: totalComps > 0 ? `${destacadas}% Satisfactorio` : "Sin datos",
    };
  }, [libreta]);

  if (loadingProfile) {
    return (
      <div className="pro-tracking-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="sm" />
          <p className="mt-2 text-muted small">Cargando plataforma académica...</p>
        </div>
      </div>
    );
  }

  const hijos = profileData?.hijos || [];

  return (
    <div className="pro-tracking-wrapper px-4 py-4">
      {/* HEADER TOP BAR */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Seguimiento Académico</h4>
          <p className="text-muted small mb-0">
            Seguimiento de rendimiento académico y observaciones pedagógicas por asignatura.
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* SELECTOR DE HIJO ESTILO DASHBOARD */}
          {hijos.length > 0 && (
            <div className="dropdown">
              <button
                className="btn btn-white border rounded-3 px-3 py-2 text-start d-flex align-items-center gap-2 shadow-sm"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="avatar-circle-sm bg-primary-subtle text-primary fw-bold">
                  {selectedChild?.nombre.charAt(0)}
                </div>
                <div>
                  <div className="fw-bold text-dark extra-small lh-1">{selectedChild?.nombre}</div>
                  <div className="text-muted extra-small">Aula: {selectedChild?.aula_nombre || "General"}</div>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-1">
                {hijos.map((hijo) => (
                  <li key={hijo.id}>
                    <button
                      className={`dropdown-item text-small ${selectedChild?.id === hijo.id ? "fw-bold text-primary" : ""}`}
                      onClick={() => setSelectedChild(hijo)}
                    >
                      {hijo.nombre} - <span className="text-muted">{hijo.aula_nombre}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="btn btn-outline-secondary rounded-3 px-3 py-2 extra-small fw-semibold d-flex align-items-center gap-2"
            onClick={() => setShowGuia(true)}
          >
            <span>📄</span> Guía Informativa
          </button>
        </div>
      </div>

      {/* RESTRICCIÓN MATRÍCULA */}
      {selectedChild && !selectedChild.periodo_academico_id ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3 my-4">
          <p className="text-muted mb-0">
            El estudiante <strong>{selectedChild.nombre}</strong> no se encuentra matriculado en el periodo académico activo.
          </p>
        </div>
      ) : (
        <>
          {/* KPI CARDS HEADER */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-3 p-3 kpi-card kpi-purple">
                <span className="text-uppercase text-muted extra-small fw-bold">Rendimiento Destacado</span>
                <div className="fs-4 fw-bolder text-dark mt-1">{statsSummary.promedioText}</div>
                <div className="text-muted extra-small mt-2">Nivel de cumplimiento general</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-3 p-3 kpi-card kpi-indigo">
                <span className="text-uppercase text-muted extra-small fw-bold">Asignaturas Evaluadas</span>
                <div className="fs-4 fw-bolder text-dark mt-1">{statsSummary.totalAreas} Áreas</div>
                <div className="text-muted extra-small mt-2">Criterios registrados en libreta</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-3 p-3 kpi-card kpi-blue">
                <span className="text-uppercase text-muted extra-small fw-bold">Periodo de Evaluación</span>
                <div className="d-flex align-items-center gap-2 mt-1">
                  {loadingPeriodos ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <select
                      className="form-select form-select-sm border-0 fw-bold fs-6 p-0 text-primary cursor-pointer bg-transparent shadow-none"
                      value={selectedPeriod?.id || ""}
                      onChange={(e) => {
                        const found = periodos.find((p) => String(p.id) === e.target.value);
                        if (found) setSelectedPeriod(found);
                      }}
                    >
                      {periodos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="text-muted extra-small mt-2">Periodo escolar vigente</div>
              </div>
            </div>
          </div>

          {/* DETAILED SUBJECTS SECTION */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold text-dark mb-0">
Temas y competencias detallados</h6>
          </div>

          {loadingLibreta ? (
            <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3">
              <Spinner animation="border" variant="primary" size="sm" className="mb-2 mx-auto" />
              <span className="text-muted extra-small">Cargando reporte de calificaciones...</span>
            </div>
          ) : !libreta || !libreta.areas || libreta.areas.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3">
              <p className="text-muted small mb-0">
                No se registran calificaciones publicadas para este periodo de evaluación.
              </p>
            </div>
          ) : (
            <div className="row g-3 mb-4">
              {libreta.areas.map((areaData, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 subject-card">
                    {/* Header de la materia */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold text-dark mb-0">{areaData.area}</h6>
                        <span className="text-muted extra-small">Docente / Tutor a cargo</span>
                      </div>
                    </div>

                    {/* Competencias asociadas */}
                    <div className="my-2">
                      {areaData.competencias.map((comp, cIdx) => {
                        const percent = getProgressPercent(comp.nota);
                        return (
                          <div key={cIdx} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center extra-small mb-1">
                              <span className="text-dark fw-semibold text-truncate pe-2" style={{ maxWidth: "75%" }}>
                                {comp.descripcion}
                              </span>
                              <span className="badge bg-primary-subtle text-primary fw-bold">
                                {comp.nota ? comp.nota.toUpperCase() : "-"}
                              </span>
                            </div>

                            {/* Barra de Progreso */}
                            <div className="progress rounded-pill" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-primary rounded-pill"
                                role="progressbar"
                                style={{ width: `${percent}%` }}
                                aria-valuenow={percent}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <div className="d-flex justify-content-between extra-small text-muted mt-1">
                              <span>Progreso</span>
                              <span>{getGradeLabel(comp.nota)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* APRECIACIÓN PEDAGÓGICA (Comentario del Profesor) */}
          {libreta && libreta.apreciacion && (
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
              <h6 className="fw-bold text-dark mb-2">Retroalimentación pedagógica del docente
</h6>
              <div className="p-3 bg-light rounded-3 text-secondary extra-small border-start border-3 border-primary">
                "{libreta.apreciacion}"
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL DE AYUDA */}
      <GuiaAcademicModal show={showGuia} onHide={() => setShowGuia(false)} />
    </div>
  );
};

export default AcademicTracking;
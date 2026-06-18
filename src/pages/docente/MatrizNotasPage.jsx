import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Form, Badge, Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { AppNavbar } from '../../components/shared';
import {
  getMisCursos,
  getCompetencias,
  getPeriodos,
  getCalificaciones,
  bulkGuardarCalificaciones,
  getApreciaciones,
  createApreciacion,
  updateApreciacion
} from '../../api/academicoAPI';

export default function MatrizNotasPage() {
  const { asignacionId } = useParams();
  const navigate = useNavigate();

  // Todos los cursos/asignaciones del profesor
  const [allAsignaciones, setAllAsignaciones] = useState([]);
  
  // Asignación seleccionada actualmente
  const [currentAsignacion, setCurrentAsignacion] = useState(null);
  
  // Selectores de Aula y Área
  const [selectedAulaId, setSelectedAulaId] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('');
  
  // Listas de datos para el aula/área actual
  const [competencias, setCompetencias] = useState([]);
  const [periodosEvaluacion, setPeriodosEvaluacion] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [alumnos, setAlumnos] = useState([]);

  // Calificaciones y apreciaciones vigentes (estado de edición)
  const [grades, setGrades] = useState({}); // { [alumnoId]: { [competenciaId]: 'A' } }
  const [comments, setComments] = useState({}); // { [alumnoId]: { id: X, comentario: '...' } }

  // Respaldos originales (para saber si hay cambios sin guardar)
  const [originalGrades, setOriginalGrades] = useState({});
  const [originalComments, setOriginalComments] = useState({});

  // Cargas y bloqueos
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Determinar si hay cambios sin guardar
  const hasChanges = JSON.stringify(grades) !== JSON.stringify(originalGrades) ||
                    JSON.stringify(comments) !== JSON.stringify(originalComments);

  // Alerta nativa de navegador antes de recargar/cerrar pestaña
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = ''; // Requerido por navegadores modernos
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // 1. Cargar asignaciones del docente
  useEffect(() => {
    const fetchAsignacionesDocente = async () => {
      try {
        const cursos = await getMisCursos();
        const listCursos = Array.isArray(cursos) ? cursos : cursos.results || [];
        setAllAsignaciones(listCursos);
      } catch (err) {
        console.error('Error fetching teacher assignments:', err);
        setError('No se pudo establecer conexión para cargar sus asignaciones de cursos.');
      }
    };
    fetchAsignacionesDocente();
  }, []);

  // 2. Sincronizar selectores y cargar datos de la asignación actual
  useEffect(() => {
    if (allAsignaciones.length === 0) return;

    const initAsignacion = async () => {
      setLoading(true);
      setError(null);
      try {
        const matchingAsignacion = allAsignaciones.find(a => a.id === Number(asignacionId));

        if (!matchingAsignacion) {
          setError('La asignación solicitada no existe o no tiene autorización para editarla.');
          setLoading(false);
          return;
        }

        setCurrentAsignacion(matchingAsignacion);
        setSelectedAulaId(String(matchingAsignacion.aula));
        setAlumnos(matchingAsignacion.alumnos || []);

        const areas = matchingAsignacion.areas_detalle || [];
        if (areas.length > 0) {
          const hasSelectedArea = areas.some(a => String(a.id) === selectedAreaId);
          if (!hasSelectedArea) {
            setSelectedAreaId(String(areas[0].id));
          }
        } else {
          setSelectedAreaId('');
        }

        // Cargar periodos de evaluación
        const resPeriodos = await getPeriodos({ periodo_matricula: matchingAsignacion.periodo_matricula, activo: true });
        const listPeriodos = Array.isArray(resPeriodos) ? resPeriodos : resPeriodos.results || [];
        setPeriodosEvaluacion(listPeriodos);

        if (listPeriodos.length > 0) {
          setSelectedPeriodo(String(listPeriodos[0].id));
        } else {
          toast.error('No se detectaron periodos de evaluación activos para este curso.');
        }

      } catch (err) {
        console.error('Error initializing grade sheet:', err);
        setError('Error al sincronizar los datos de calificaciones.');
      } finally {
        setLoading(false);
      }
    };

    initAsignacion();
  }, [asignacionId, allAsignaciones]);

  // 3. Cargar competencias cuando cambia el area seleccionada
  useEffect(() => {
    if (!selectedAreaId) return;

    const fetchComp = async () => {
      try {
        const resCompetencias = await getCompetencias({ area: selectedAreaId, activo: true });
        const listCompetencias = Array.isArray(resCompetencias) ? resCompetencias : resCompetencias.results || [];
        const sortedCompetencias = [...listCompetencias].sort((a, b) => a.orden - b.orden);
        setCompetencias(sortedCompetencias);
      } catch (err) {
        console.error('Error fetching competencies:', err);
        toast.error('Error al cargar competencias.');
      }
    };
    fetchComp();
  }, [selectedAreaId]);

  // 4. Cargar calificaciones y apreciaciones del periodo seleccionado
  useEffect(() => {
    if (!selectedPeriodo || !currentAsignacion) return;

    const fetchGradesAndComments = async () => {
      try {
        // Cargar calificaciones guardadas
        const resCalificaciones = await getCalificaciones({ periodo_evaluacion: selectedPeriodo });
        const listCalificaciones = Array.isArray(resCalificaciones) ? resCalificaciones : resCalificaciones.results || [];
        
        const loadedGrades = {};
        listCalificaciones.forEach(c => {
          if (!loadedGrades[c.alumno]) loadedGrades[c.alumno] = {};
          loadedGrades[c.alumno][c.competencia] = c.valor;
        });

        // Cargar apreciaciones guardadas
        const resApreciaciones = await getApreciaciones({ periodo_evaluacion: selectedPeriodo });
        const listApreciaciones = Array.isArray(resApreciaciones) ? resApreciaciones : resApreciaciones.results || [];

        const loadedComments = {};
        listApreciaciones.forEach(a => {
          loadedComments[a.alumno] = { id: a.id, comentario: a.comentario };
        });

        // Inicializar estados principales
        setGrades(loadedGrades);
        setComments(loadedComments);

        // Respaldar copias originales
        setOriginalGrades(JSON.parse(JSON.stringify(loadedGrades)));
        setOriginalComments(JSON.parse(JSON.stringify(loadedComments)));

      } catch (err) {
        console.error('Error fetching grades and appreciations:', err);
        toast.error('Error al precargar registros guardados.');
      }
    };

    fetchGradesAndComments();
  }, [selectedPeriodo, currentAsignacion]);

  // Cambio de Aula
  const handleAulaChange = (newAulaId) => {
    if (hasChanges && !window.confirm('Tiene cambios sin guardar en esta matriz. ¿Desea descartarlos y cambiar de aula?')) {
      return;
    }

    const matched = allAsignaciones.find(a => a.aula === Number(newAulaId));
    if (matched) {
      navigate(`/docente/evaluar/${matched.id}`);
    }
  };

  // Cambio en celdas
  const handleGradeChange = (alumnoId, competenciaId, val) => {
    setGrades(prev => ({
      ...prev,
      [alumnoId]: {
        ...(prev[alumnoId] || {}),
        [competenciaId]: val
      }
    }));
  };

  const handleCommentChange = (alumnoId, val) => {
    setComments(prev => ({
      ...prev,
      [alumnoId]: {
        ...(prev[alumnoId] || {}),
        comentario: val
      }
    }));
  };

  // Guardar datos
  const handleSave = async () => {
    if (!selectedPeriodo) {
      toast.error('Debe seleccionar un periodo de evaluación.');
      return;
    }

    setSaving(true);
    try {
      // 1. Armar payload de calificaciones
      const payloadCalificaciones = [];
      Object.keys(grades).forEach(alumnoId => {
        Object.keys(grades[alumnoId]).forEach(competenciaId => {
          const valor = grades[alumnoId][competenciaId];
          if (valor && valor !== '-') {
            payloadCalificaciones.push({
              alumno_id: Number(alumnoId),
              competencia_id: Number(competenciaId),
              periodo_evaluacion_id: Number(selectedPeriodo),
              valor: valor
            });
          }
        });
      });

      // 2. Enviar calificaciones masivamente
      if (payloadCalificaciones.length > 0) {
        await bulkGuardarCalificaciones(payloadCalificaciones);
      }

      // 3. Enviar apreciaciones
      const apreciacionPromises = Object.keys(comments).map(async (alumnoId) => {
        const item = comments[alumnoId];
        const commentText = (item.comentario || '').trim();

        if (item.id) {
          // Si ya existe
          return updateApreciacion(item.id, {
            comentario: commentText,
            alumno: Number(alumnoId),
            periodo_evaluacion: Number(selectedPeriodo)
          });
        } else if (commentText) {
          // Si es nuevo y tiene texto
          return createApreciacion({
            comentario: commentText,
            alumno: Number(alumnoId),
            periodo_evaluacion: Number(selectedPeriodo)
          });
        }
      });

      await Promise.all(apreciacionPromises.filter(Boolean));

      toast.success('¡Registro académico guardado exitosamente!');

      // Sincronizar estado original con los datos guardados
      setOriginalGrades(JSON.parse(JSON.stringify(grades)));
      
      // Recargar comentarios para obtener sus IDs asignados en BD
      const resApreciaciones = await getApreciaciones({ periodo_evaluacion: selectedPeriodo });
      const listApreciaciones = Array.isArray(resApreciaciones) ? resApreciaciones : resApreciaciones.results || [];
      const updatedComments = {};
      listApreciaciones.forEach(a => {
        updatedComments[a.alumno] = { id: a.id, comentario: a.comentario };
      });
      setComments(updatedComments);
      setOriginalComments(JSON.parse(JSON.stringify(updatedComments)));

    } catch (err) {
      console.error('Error al guardar datos:', err);
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Ocurrió un error al persistir los cambios.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Generar listas únicas de Aulas
  const uniqueAulas = [];
  const aulaIds = new Set();
  allAsignaciones.forEach(a => {
    if (!aulaIds.has(a.aula)) {
      aulaIds.add(a.aula);
      uniqueAulas.push({ id: a.aula, nombre: a.aula_nombre });
    }
  });

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <AppNavbar title="Portal Calificaciones" />

      <Container fluid className="py-5 px-4 px-lg-5">
        {error ? (
          <Alert variant="danger" className="shadow-sm rounded-4 mb-4">
            <Alert.Heading>Asignación no Sincronizada</Alert.Heading>
            <p className="mb-3">{error}</p>
            <Button variant="danger" onClick={() => navigate('/docente/mis-cursos')}>
              Regresar a mis cursos
            </Button>
          </Alert>
        ) : loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <Spinner animation="border" variant="primary" style={{ width: '3.5rem', height: '3.5rem' }} />
            <p className="mt-3 text-muted">Cargando hoja de calificaciones...</p>
          </div>
        ) : (
          <>
            {/* Control Panel: Selectores Superiores de Aula y Periodo */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <Row className="g-4 align-items-end">
                <Col md={4}>
                  <Form.Group controlId="selectAula">
                    <Form.Label className="fw-bold text-secondary">Aula (Salón)</Form.Label>
                    <Form.Select
                      value={selectedAulaId}
                      onChange={e => handleAulaChange(e.target.value)}
                      className="rounded-3 py-2 border-secondary-subtle font-semibold"
                    >
                      {uniqueAulas.map(a => (
                        <option key={a.id} value={a.id}>{a.nombre}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="selectPeriodo">
                    <Form.Label className="fw-bold text-secondary">Trimestre / Periodo</Form.Label>
                    <Form.Select
                      value={selectedPeriodo}
                      onChange={e => setSelectedPeriodo(e.target.value)}
                      className="rounded-3 py-2 border-secondary-subtle font-semibold"
                    >
                      {periodosEvaluacion.map(pe => (
                        <option key={pe.id} value={pe.id}>{pe.nombre}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4} className="d-flex flex-column flex-md-row gap-3 justify-content-md-end align-items-stretch">
                  <Button
                    variant="outline-secondary"
                    className="fw-bold py-2 rounded-3"
                    onClick={() => navigate('/docente/mis-cursos')}
                  >
                    ⬅ Salir
                  </Button>
                  <Button
                    variant="primary"
                    className="fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                    style={{ background: '#0d3b66', border: 'none' }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Guardar Todo</span>
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Aviso Flotante de Cambios sin Guardar */}
            {hasChanges && (
              <Alert variant="warning" className="border-warning shadow-sm rounded-3 py-2 px-3 mb-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <span className="fw-semibold text-warning-emphasis">
                    Tiene modificaciones locales que no han sido persistidas en el servidor.
                  </span>
                </div>
                <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold rounded-pill shadow-sm">
                  Cambios Pendientes
                </Badge>
              </Alert>
            )}

            {/* Sistema de Pestañas de Áreas */}
            {currentAsignacion?.areas_detalle && currentAsignacion.areas_detalle.length > 0 && (
              <Tabs
                id="area-tabs"
                activeKey={selectedAreaId}
                onSelect={(k) => setSelectedAreaId(k)}
                className="mb-3 border-bottom-0 custom-nav-tabs"
                style={{ fontSize: '1.1rem' }}
              >
                {currentAsignacion.areas_detalle.map((area) => (
                  <Tab
                    key={area.id}
                    eventKey={String(area.id)}
                    title={
                      <span className="fw-semibold px-2 py-1">
                        📚 {area.nombre}
                      </span>
                    }
                  />
                ))}
              </Tabs>
            )}

            {/* Cuadrícula de Hoja de Cálculo */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="table-responsive">
                <Table bordered hover className="align-middle mb-0" style={{ minWidth: '900px' }}>
                  <thead style={{ background: '#1e293b' }}>
                    <tr className="border-0">
                      <th className="py-3 ps-4 text-white uppercase fw-bold border-0" style={{ width: '25%' }}>
                        Estudiante
                      </th>
                      {competencias.map((comp, idx) => (
                        <th
                           key={comp.id}
                           className="py-3 text-center text-white uppercase fw-bold border-0"
                           title={comp.descripcion}
                           style={{ cursor: 'help', width: `${45 / (competencias.length || 1)}%` }}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <span>Comp. {idx + 1}</span>
                            <span className="text-white-50 small fw-normal text-truncate" style={{ maxWidth: '140px' }}>
                              {comp.descripcion}
                            </span>
                          </div>
                        </th>
                      ))}
                      <th className="py-3 ps-3 text-white uppercase fw-bold border-0" style={{ width: '30%' }}>
                        Apreciación del Docente
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.length === 0 ? (
                      <tr>
                        <td colSpan={competencias.length + 2} className="text-center py-5 text-muted">
                          No hay alumnos activos registrados para el aula y periodo seleccionado.
                        </td>
                      </tr>
                    ) : competencias.length === 0 ? (
                      <tr>
                        <td colSpan={competencias.length + 2} className="text-center py-5 text-muted">
                          No hay competencias activas configuradas para esta área académica.
                        </td>
                      </tr>
                    ) : (
                      alumnos.map((alumno) => {
                        const alumnoId = alumno.id;
                        const studentName = `${alumno.apellidos}, ${alumno.nombres}`;
                        const currentComment = comments[alumnoId]?.comentario || '';

                        return (
                          <tr key={alumnoId}>
                            <td className="ps-4 fw-semibold text-dark">
                              {studentName}
                              <div className="text-muted small fw-normal">DNI: {alumno.dni}</div>
                            </td>
                            {competencias.map((comp) => {
                              const compId = comp.id;
                              const currentVal = grades[alumnoId]?.[compId] || '-';

                              return (
                                <td key={compId} className="text-center py-3">
                                  <Form.Select
                                    value={currentVal}
                                    onChange={e => handleGradeChange(alumnoId, compId, e.target.value)}
                                    className="mx-auto rounded-3 text-center font-bold border-secondary-subtle"
                                    style={{
                                      maxWidth: '90px',
                                      backgroundColor: 
                                        currentVal === 'AD' ? '#d4edda' :
                                        currentVal === 'A' ? '#cce5ff' :
                                        currentVal === 'B' ? '#fff3cd' :
                                        currentVal === 'C' ? '#f8d7da' : '#fff',
                                      color:
                                        currentVal === 'AD' ? '#155724' :
                                        currentVal === 'A' ? '#004085' :
                                        currentVal === 'B' ? '#856404' :
                                        currentVal === 'C' ? '#721c24' : '#495057',
                                    }}
                                  >
                                    <option value="-">-</option>
                                    <option value="AD">AD</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                  </Form.Select>
                                </td>
                              );
                            })}
                            <td className="pe-4 py-3">
                              <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Comentario general sobre el aprendizaje..."
                                value={currentComment}
                                onChange={e => handleCommentChange(alumnoId, e.target.value)}
                                className="rounded-3 border-secondary-subtle"
                                style={{ fontSize: '13px', resize: 'vertical' }}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>

            {/* Bottom Actions */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button
                variant="outline-secondary"
                className="fw-bold py-2 px-4 rounded-3"
                onClick={() => navigate('/docente/mis-cursos')}
              >
                Volver a Mis Cursos
              </Button>
              <Button
                variant="primary"
                className="fw-bold py-2 px-5 rounded-3 d-flex align-items-center justify-content-center gap-2"
                style={{ background: '#0d3b66', border: 'none' }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Guardando registro...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Guardar Registro Académico</span>
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

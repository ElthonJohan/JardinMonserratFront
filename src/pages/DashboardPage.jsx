import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Form, ProgressBar, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/shared';
import { getDashboardStats } from '../api/dashboardAPI';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());
  const [showAulasModal, setShowAulasModal] = useState(false);
  const [data, setData] = useState({
    kpis: {
      total_alumnos_activos: 0,
      matriculas_anio: 0,
      pagos_pendientes_cantidad: 0,
      pagos_pendientes_monto: 0,
      recaudacion_actual: 0,
      recaudacion_anterior: 0
    },
    distribucion_aulas: [],
    estado_matriculas: [],
    top_deudores: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      setLoading(true);
      try {
        const stats = await getDashboardStats(anioFiltro);
        setData(stats);
      } catch (error) {
        console.error('Error al cargar las estadísticas del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [anioFiltro]);

  const difRecaudacion = data.kpis.recaudacion_actual - data.kpis.recaudacion_anterior;
  const indicadorRecaudacion = difRecaudacion >= 0 ? `+ S/ ${difRecaudacion.toFixed(2)}` : `- S/ ${Math.abs(difRecaudacion).toFixed(2)}`;

  return (
    <div className="dashboard-container">
      <AppNavbar />

      <Container fluid className="py-5 px-4">
        <Row className="mb-4 align-items-center">
          <Col md={8}>
            <h2 className="fw-bold">Centro de Operaciones</h2>
            <p className="text-muted">Análisis y estado en tiempo real del periodo lectivo</p>
          </Col>
          <Col md={4} className="d-flex justify-content-md-end">
            <Form.Group className="d-flex align-items-center">
              <Form.Label className="mb-0 me-2 fw-bold text-nowrap">Año Escolar:</Form.Label>
              <Form.Control 
                type="number" 
                value={anioFiltro} 
                onChange={(e) => setAnioFiltro(e.target.value)} 
                style={{ width: '100px' }}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* KPIs Ejecutivos */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <Card className="dashboard-card card-hover h-100" onClick={() => setShowAulasModal(true)}>
              <Card.Body className="text-center">
                <div className="card-icon mb-3">👥</div>
                <h5>Alumnos</h5>
                {loading ? <Spinner animation="border" variant="primary" size="sm" /> : (
                  <Badge bg="primary" className="fs-5">{data.kpis.total_alumnos_activos}</Badge>
                )}
                <p className="text-muted small mt-2 mb-0">Activos en {anioFiltro}</p>
                <small className="text-primary mt-1 d-block">Ver desglose por aula &rarr;</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="dashboard-card card-hover h-100" onClick={() => navigate('/matriculas')}>
              <Card.Body className="text-center">
                <div className="card-icon mb-3">📚</div>
                <h5>Matrículas</h5>
                {loading ? <Spinner animation="border" variant="success" size="sm" /> : (
                  <Badge bg="success" className="fs-5">{data.kpis.matriculas_anio}</Badge>
                )}
                <p className="text-muted small mt-2">Nuevas matriculas {anioFiltro}</p>
                <small className="text-success mt-1 d-block">Ir a gestión &rarr;</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="dashboard-card card-hover h-100" onClick={() => navigate('/pagos')}>
              <Card.Body className="text-center">
                <div className="card-icon mb-3">💰</div>
                <h5>Deudas Pendientes</h5>
                {loading ? <Spinner animation="border" variant="danger" size="sm" /> : (
                  <>
                    <Badge bg="danger" className="fs-5 me-2">{data.kpis.pagos_pendientes_cantidad} rcbs</Badge>
                    <Badge bg="warning" text="dark" className="fs-5">S/ {data.kpis.pagos_pendientes_monto.toFixed(2)}</Badge>
                  </>
                )}
                <p className="text-muted small mt-2">Capital por recuperar</p>
                <small className="text-danger mt-1 d-block">Ir a gestión de pagos &rarr;</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="dashboard-card h-100" style={{ borderTopColor: '#28a745' }}>
              <Card.Body className="text-center">
                <div className="card-icon mb-3">📈</div>
                <h5>Recaudado del Mes</h5>
                {loading ? <Spinner animation="border" variant="success" size="sm" /> : (
                  <>
                    <Badge bg="success" className="fs-5">S/ {data.kpis.recaudacion_actual.toFixed(2)}</Badge>
                    <p className={`small fw-bold mt-2 mb-0 ${difRecaudacion >= 0 ? 'text-success' : 'text-danger'}`}>
                      {difRecaudacion >= 0 ? '▲' : '▼'} {indicadorRecaudacion} vs mes ant.
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Alertas de Tesorería */}
          <Col lg={8}>
            <Card className="h-100 dashboard-card" style={{ borderTopColor: '#dc3545' }}>
              <Card.Header className="bg-transparent fw-bold text-danger pt-4 pb-2 border-bottom-0 fs-5">
                🚨 Top 5 Deudas Críticas
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center p-5"><Spinner animation="border" variant="danger" /></div>
                ) : data.top_deudores.length === 0 ? (
                  <div className="text-center p-5 text-muted">🎉 No hay alumnos con deudas pendientes.</div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0 align-middle">
                      <thead className="table-light text-secondary">
                        <tr>
                          <th className="ps-4">Alumno</th>
                          <th className="text-end">Monto Adeudado</th>
                          <th className="text-center pe-4">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.top_deudores.map((deudor) => (
                          <tr key={deudor.alumno__id} className="deuda-critica-row">
                            <td className="ps-4 fw-500">{deudor.nombre_completo}</td>
                            <td className="text-end text-danger fw-bold">S/ {parseFloat(deudor.deuda_total).toFixed(2)}</td>
                            <td className="text-center pe-4">
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => navigate('/pagos')}
                              >
                                Cobrar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Actions */}
          <Col lg={4}>
            <Card className="h-100 dashboard-card p-3" style={{ borderTopColor: '#ffc107' }}>
              <Card.Header className="bg-transparent fw-bold pt-2 border-bottom-0 fs-5">
                ⚡ Acceso Rápido
              </Card.Header>
              <Card.Body className="d-flex flex-column justify-content-center gap-3">
                  <Button variant="primary" size="lg" className="w-100 shadow-sm text-start ps-4" onClick={() => navigate('/estudiantes')}>
                    <span className="me-2 fs-4">👥</span> Gestión de Alumnos
                  </Button>
                  <Button variant="success" size="lg" className="w-100 shadow-sm text-start ps-4" onClick={() => navigate('/matriculas')}>
                    <span className="me-2 fs-4">📚</span> Nueva Matrícula
                  </Button>
                  <Button variant="warning" size="lg" className="w-100 shadow-sm text-start ps-4 text-dark" onClick={() => navigate('/pagos')}>
                    <span className="me-2 fs-4">💰</span> Operaciones de Tesorería
                  </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal: Distribución por Aulas */}
      <Modal show={showAulasModal} onHide={() => setShowAulasModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>📊 Distribución Académica - Año {anioFiltro}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <h6 className="text-muted mb-4">Carga actual de aulas y disponibilidad</h6>
          {data.distribucion_aulas.length === 0 ? (
            <p className="text-muted text-center py-4">No hay alumnos registrados en aulas para el año {anioFiltro}.</p>
          ) : (
            data.distribucion_aulas.map((aula, i) => {
              const porcentaje = (aula.total / aula.capacidad) * 100;
              const variant = porcentaje > 90 ? "danger" : porcentaje > 75 ? "warning" : "success";
              return (
                <div key={i} className="mb-4">
                  <div className="progress-label mb-1">
                    <span className="fw-bold">Aula {aula.nombre_aula}</span>
                    <span className={`badge bg-${variant}`}>
                      {aula.total} / {aula.capacidad} alumnos
                    </span>
                  </div>
                  <ProgressBar 
                    now={porcentaje} 
                    variant={variant}
                    label={`${Math.round(porcentaje)}%`} 
                    style={{ height: '1.2rem' }}
                  />
                </div>
              );
            })
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAulasModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
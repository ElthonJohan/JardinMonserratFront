import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Spinner,
  Table, Modal, Button, ProgressBar
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboardAPI';
import { AppNavbar } from '../components/shared';
import "../styles/DashboardPage.css";

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate();
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    kpis: {
      total_alumnos_activos: 0,
      matriculas_anio: 0,
      pagos_pendientes_cantidad: 0,
      pagos_pendientes_monto: 0,
      recaudacion_actual: 0,
      recaudacion_anterior: 0,
    },
    distribucion_aulas: [],
    top_deudores: [],
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const stats = await getDashboardStats(anioFiltro);
        setData(stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [anioFiltro]);

  const { kpis } = data;
  const dif = kpis.recaudacion_actual - kpis.recaudacion_anterior;
  const deltaLabel = dif >= 0
    ? `▲ + S/ ${dif.toFixed(2)} vs mes ant.`
    : `▼ - S/ ${Math.abs(dif).toFixed(2)} vs mes ant.`;

  return (
    <div className="dashboard-container">
      <AppNavbar />

      <Container fluid className="py-5 px-4 px-lg-5">

        {/* ── PAGE HEADER ── */}
        <div className="page-header-card d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h1>Centro de Operaciones</h1>
            <p>Análisis y estado en tiempo real del periodo lectivo</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="year-label">Año Escolar:</span>
            <select
              className="year-select"
              value={anioFiltro}
              onChange={e => setAnioFiltro(Number(e.target.value))}
            >
              {[2026, 2025, 2024].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* ── KPI CARDS ── */}
        <Row className="g-4 mb-4">

          {/* Alumnos */}
          <Col md={6} xl={3}>
            <Card className="kpi-card kpi-blue h-100" onClick={() => setShowModal(true)}>
              <Card.Body className="text-center py-4">
                <div className="kpi-icon-wrap blue">👥</div>
                <h5>Alumnos</h5>
                {loading
                  ? <Spinner animation="border" size="sm" />
                  : <div className="kpi-badge blue">{kpis.total_alumnos_activos}</div>
                }
                <p className="kpi-sub">Activos en {anioFiltro}</p>
                <a className="kpi-link blue" onClick={e => { e.preventDefault(); setShowModal(true); }}>
                  Ver desglose por aula →
                </a>
              </Card.Body>
            </Card>
          </Col>

          {/* Matrículas */}
          <Col md={6} xl={3}>
            <Card className="kpi-card kpi-green h-100" onClick={() => navigate('/matriculas')}>
              <Card.Body className="text-center py-4">
                <div className="kpi-icon-wrap green">📚</div>
                <h5>Matrículas</h5>
                {loading
                  ? <Spinner animation="border" size="sm" />
                  : <div className="kpi-badge green">{kpis.matriculas_anio}</div>
                }
                <p className="kpi-sub">Nuevas matrículas {anioFiltro}</p>
                <a className="kpi-link green" onClick={e => { e.preventDefault(); navigate('/matriculas'); }}>
                  Ir a gestión →
                </a>
              </Card.Body>
            </Card>
          </Col>

          {/* Deudas */}
          <Col md={6} xl={3}>
            <Card className="kpi-card kpi-amber h-100" onClick={() => navigate('/pagos')}>
              <Card.Body className="text-center py-4">
                <div className="kpi-icon-wrap amber">💰</div>
                <h5>Deudas Pendientes</h5>
                {loading
                  ? <Spinner animation="border" size="sm" />
                  : (
                    <div className="d-flex justify-content-center gap-2 mb-2">
                      <span className="kpi-badge danger">{kpis.pagos_pendientes_cantidad} rcbs</span>
                      <span className="kpi-badge warning">S/ {kpis.pagos_pendientes_monto.toFixed(2)}</span>
                    </div>
                  )
                }
                <p className="kpi-sub">Capital por recuperar</p>
                <a className="kpi-link red" onClick={e => { e.preventDefault(); navigate('/pagos'); }}>
                  Ir a gestión de pagos →
                </a>
              </Card.Body>
            </Card>
          </Col>

          {/* Recaudado */}
          <Col md={6} xl={3}>
            <Card className="kpi-card kpi-teal h-100">
              <Card.Body className="text-center py-4">
                <div className="kpi-icon-wrap teal">📈</div>
                <h5>Recaudado del Mes</h5>
                {loading
                  ? <Spinner animation="border" size="sm" />
                  : (
                    <>
                      <div className="kpi-badge teal">S/ {kpis.recaudacion_actual.toFixed(2)}</div>
                      <p className={`kpi-delta ${dif >= 0 ? 'text-success' : 'text-danger'}`}>
                        {deltaLabel}
                      </p>
                    </>
                  )
                }
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* ── BOTTOM ROW ── */}
        <Row className="g-4">

          {/* Deudas críticas */}
          <Col lg={8}>
            <Card className="section-card h-100">
              <Card.Header>
                <div className="section-header-icon danger">🚨</div>
                <Card.Title className="section-card text-danger" style={{ color: 'var(--error)' }}>
                  Top 5 Deudas Críticas
                </Card.Title>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="empty-state">
                    <Spinner animation="border" />
                  </div>
                ) : data.top_deudores.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon-wrap">✅</div>
                    <p>🎉 No hay alumnos con deudas pendientes.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table className="deuda-table mb-0">
                      <thead>
                        <tr>
                          <th className="ps-4">Alumno</th>
                          <th className="text-end">Monto Adeudado</th>
                          <th className="text-center pe-4">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.top_deudores.map((d) => (
                          <tr key={d.alumno__id}>
                            <td className="ps-4 deuda-alumno">{d.nombre_completo}</td>
                            <td className="text-end deuda-monto">
                              S/ {parseFloat(d.deuda_total).toFixed(2)}
                            </td>
                            <td className="text-center pe-4">
                              <button className="btn-cobrar" onClick={() => navigate('/pagos')}>
                                Cobrar
                              </button>
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

          {/* Acceso rápido */}
          <Col lg={4}>
            <Card className="section-card h-100">
              <Card.Header>
                <div className="section-header-icon primary">⚡</div>
                <Card.Title>Acceso Rápido</Card.Title>
              </Card.Header>
              <Card.Body className="d-flex flex-column justify-content-center gap-3 p-4">
                <button className="quick-btn" onClick={() => navigate('/estudiantes')}>
                  <span className="quick-btn-icon blue">👥</span>
                  Gestión de Alumnos
                  <span className="quick-arrow">→</span>
                </button>
                <button className="quick-btn" onClick={() => navigate('/matriculas')}>
                  <span className="quick-btn-icon green">📚</span>
                  Nueva Matrícula
                  <span className="quick-arrow">→</span>
                </button>
                <button className="quick-btn" onClick={() => navigate('/pagos')}>
                  <span className="quick-btn-icon amber">💰</span>
                  Operaciones de Tesorería
                  <span className="quick-arrow">→</span>
                </button>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>

      {/* ── MODAL: Distribución por aulas ── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary-custom">
          <Modal.Title className="modal-title-custom">
            📊 Distribución Académica — Año {anioFiltro}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-muted mb-4" style={{ fontSize: 14 }}>
            Carga actual de aulas y disponibilidad
          </p>
          {data.distribucion_aulas.length === 0 ? (
            <p className="text-center text-muted py-4">
              No hay alumnos registrados en aulas para el año {anioFiltro}.
            </p>
          ) : (
            data.distribucion_aulas.map((aula, i) => {
              const pct = (aula.total / aula.capacidad) * 100;
              const variant = pct > 90 ? 'danger' : pct > 75 ? 'warning' : 'success';
              return (
                <div key={i} className="mb-4">
                  <div className="aula-label">
                    <span className="aula-name">Aula {aula.nombre_aula}</span>
                    <span className={`badge bg-${variant}`}>
                      {aula.total} / {aula.capacidad} alumnos
                    </span>
                  </div>
                  <ProgressBar
                    now={pct}
                    variant={variant}
                    label={`${Math.round(pct)}%`}
                    style={{ height: '1.1rem', borderRadius: 999 }}
                  />
                </div>
              );
            })
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid var(--outline-variant)' }}>
          <Button
            style={{
              background: 'var(--surface-container)',
              color: 'var(--on-surface)',
              border: 'none',
              borderRadius: 999,
              fontWeight: 600,
              padding: '8px 24px',
            }}
            onClick={() => setShowModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
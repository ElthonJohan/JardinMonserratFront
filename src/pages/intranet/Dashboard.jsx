import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Spinner } from 'react-bootstrap';
import GuiaDashboardModal from './GuiaDashboardModal';
import '../../styles/dashboard.css';

// Iconos vectoriales
const StudentIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const DebtIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
);
const GradeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGuia, setShowGuia] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/pagos/parent/pagos/');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('No se pudo cargar la información del panel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Cargando información del panel...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="error-card">
        <h4>⚠️ Error de Carga</h4>
        <p>{error || 'No se pudieron cargar los datos del dashboard.'}</p>
        <button className="retry-btn" onClick={fetchDashboardData}>
          Reintentar
        </button>
      </div>
    );
  }

  // Recopilar y ordenar pagos recientes
  const recentPayments = [];
  data.alumnos.forEach((al) => {
    if (al.pagos_recientes) {
      al.pagos_recientes.forEach((pago) => {
        recentPayments.push({ ...pago, alumno_nombre: al.nombre });
      });
    }
  });

  recentPayments.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
  const topRecentPayments = recentPayments.slice(0, 5);

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'APROBADO':
        return <span className="status-badge approved">Aprobado</span>;
      case 'RECHAZADO':
        return <span className="status-badge rejected">Rechazado</span>;
      default:
        return <span className="status-badge pending">Pendiente</span>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* BANNER / WELCOME HEADER */}
      <div className="welcome-header">
        <div>
          <h1>Bienvenido de nuevo, {data.apoderado_nombre?.split(' ')[0]}</h1>
          <p>Aquí tienes el resumen del progreso académico y tareas administrativas de tus hijos.</p>
        </div>
        <div className="header-actions">
          <button className="help-btn" onClick={() => setShowGuia(true)}>
            <HelpIcon />
            <span>Ayuda / Guía</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="kpi-grid">
        {/* CARD 1: Hijos Registrados */}
        <div className="kpi-card border-indigo">
          <div className="kpi-top">
            <div className="kpi-icon-bg indigo">
              <StudentIcon />
            </div>
            <span className="status-pill active">Activo</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-title">Alumnos Matriculados</span>
            <h2 className="kpi-value">{data.cantidad_hijos}</h2>
          </div>
        </div>

        {/* CARD 2: Deuda Pendiente */}
        <div className="kpi-card border-red">
          <div className="kpi-top">
            <div className="kpi-icon-bg red">
              <DebtIcon />
            </div>
            {data.total_pendiente > 0 ? (
              <span className="status-pill warning">Acción Requerida</span>
            ) : (
              <span className="status-pill active">Al Día</span>
            )}
          </div>
          <div className="kpi-body">
            <span className="kpi-title">Deuda Pendiente</span>
            <h2 className="kpi-value">S/ {data.total_pendiente.toFixed(2)}</h2>
          </div>
        </div>

        {/* CARD 3: Año Escolar / Estado */}
        <div className="kpi-card border-blue">
          <div className="kpi-top">
            <div className="kpi-icon-bg blue">
              <GradeIcon />
            </div>
            <span className="status-pill info">Ciclo Activo</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-title">Año Académico</span>
            <h2 className="kpi-value">{new Date().getFullYear()}</h2>
          </div>
        </div>
      </div>

      {/* CONTENT GRID: PERFILES DE ESTUDIANTES + HISTORIAL */}
      <div className="dashboard-content-grid">
        {/* COLUMNA IZQUIERDA: Perfiles de los Hijos */}
        <div className="panel-section">
          <div className="panel-header">
            <h3>Perfil de los Estudiantes</h3>
          </div>

          <div className="students-list">
            {data.alumnos.length === 0 ? (
              <p className="empty-msg">No hay alumnos asignados a esta cuenta.</p>
            ) : (
              data.alumnos.map((alumno) => {
                const progress = alumno.porcentaje_progreso ?? 100;
                return (
                  <div key={alumno.id} className="student-card">
                    <div className="student-info-main">
                      <div className="student-avatar">
                        {alumno.nombre.charAt(0)}
                      </div>
                      <div className="student-details">
                        <div className="student-name-row">
                          <h4>{alumno.nombre}</h4>
                          <span className={`standing-pill ${progress === 100 ? 'good' : 'due'}`}>
                            {progress === 100 ? 'Al Día' : 'Pago Pendiente'}
                          </span>
                        </div>
                        <p className="student-sub">Código: {alumno.codigo}</p>
                      </div>
                    </div>

                    <div className="student-progress-section">
                      <div className="progress-labels">
                        <span>Pensiones Pagadas</span>
                        <span className="percent-num">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className={`progress-bar-fill ${progress === 100 ? 'green' : 'red'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Actividad / Pagos Recientes */}
        <div className="panel-section">
          <div className="panel-header">
            <h3>Reportados Recientemente</h3>
          </div>

          <div className="activity-feed">
            {topRecentPayments.length === 0 ? (
              <p className="empty-msg">No hay transacciones registradas.</p>
            ) : (
              topRecentPayments.map((pago) => (
                <div key={pago.id} className="activity-item">
                  <div className="activity-icon-container">
                    <DebtIcon />
                  </div>
                  <div className="activity-details">
                    <div className="activity-title-row">
                      <p className="activity-title">
                        S/ {parseFloat(pago.monto_total_entregado).toFixed(2)} — {pago.alumno_nombre}
                      </p>
                      {getStatusBadge(pago.estado)}
                    </div>
                    <p className="activity-sub">
                      Método: {pago.metodo_pago} {pago.numero_operacion ? `• Op: ${pago.numero_operacion}` : ''}
                    </p>
                    <span className="activity-date">
                      {new Date(pago.fecha_pago).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <GuiaDashboardModal
        show={showGuia}
        onHide={() => setShowGuia(false)}
      />
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import '../../styles/dashboard.css';
import { Spinner } from 'react-bootstrap';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando información del panel...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">⚠️ Error</h4>
          <p>{error || 'No se pudieron cargar los datos del dashboard.'}</p>
          <hr />
          <button className="btn btn-outline-danger btn-sm" onClick={fetchDashboardData}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Cálculos estadísticos reales
  const totalPagosReportados = data.alumnos.reduce(
    (acc, al) => acc + (al.pagos_recientes?.length || 0),
    0
  );

  const totalDeudasPendientes = data.alumnos.reduce(
    (acc, al) => acc + (al.deudas?.length || 0),
    0
  );

  // Recopilar y ordenar pagos recientes de todos los alumnos
  const recentPayments = [];
  data.alumnos.forEach((al) => {
    if (al.pagos_recientes) {
      al.pagos_recientes.forEach((pago) => {
        recentPayments.push({
          ...pago,
          alumno_nombre: al.nombre,
        });
      });
    }
  });

  // Ordenar de más reciente a más antiguo
  recentPayments.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
  const topRecentPayments = recentPayments.slice(0, 5);

  const currentYear = new Date().getFullYear();

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'APROBADO':
        return '✅';
      case 'RECHAZADO':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusLabel = (pago) => {
    switch (pago.estado) {
      case 'APROBADO':
        return 'Aprobado';
      case 'RECHAZADO':
        return `Rechazado${pago.motivo_rechazo ? `: ${pago.motivo_rechazo}` : ''}`;
      default:
        return 'Pendiente de validación';
    }
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'APROBADO':
        return 'text-success fw-bold';
      case 'RECHAZADO':
        return 'text-danger fw-bold';
      default:
        return 'text-warning fw-bold';
    }
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>
            Bienvenido, <strong>{data.apoderado_nombre}</strong>. Aquí tienes el resumen financiero y académico de tu familia.
          </p>
        </div>

        <div className="dashboard-date">
          📅 {new Date().toLocaleDateString('es-PE')}
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        {/* CARD 1 */}
        <div className="stat-card card-blue">
          <div className="stat-icon blue-icon">👨‍🎓</div>
          <div className="stat-content">
            <p className="stat-title">Hijos Registrados</p>
            <h2 className="stat-value">{data.cantidad_hijos}</h2>
            <p className="stat-description">Estudiantes bajo tu tutela</p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="stat-card card-green">
          <div className="stat-icon green-icon">💰</div>
          <div className="stat-content">
            <p className="stat-title">Pagos Reportados</p>
            <h2 className="stat-value">{totalPagosReportados}</h2>
            <p className="stat-description">Transacciones registradas</p>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="stat-card card-orange">
          <div className="stat-icon orange-icon">📄</div>
          <div className="stat-content">
            <p className="stat-title">Deuda Pendiente</p>
            <h2 className="stat-value">S/ {data.total_pendiente.toFixed(2)}</h2>
            <p className="stat-description">{totalDeudasPendientes} concepto(s) por regularizar</p>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="stat-card card-purple">
          <div className="stat-icon purple-icon">🏫</div>
          <div className="stat-content">
            <p className="stat-title">Año Escolar</p>
            <h2 className="stat-value">{currentYear}</h2>
            <p className="stat-description">Gestión académica activa</p>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="dashboard-grid">
        {/* ACTIVIDADES - PAGOS RECIENTES */}
        <div className="dashboard-panel">
          <h3 className="panel-title">Pagos Reportados Recientemente</h3>

          {topRecentPayments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No tienes transacciones registradas recientemente.</p>
            </div>
          ) : (
            topRecentPayments.map((pago) => (
              <div key={pago.id} className="activity-item">
                <div className="activity-icon">
                  {getStatusIcon(pago.estado)}
                </div>

                <div>
                  <h4 className="activity-title">
                    Pago de S/ {parseFloat(pago.monto_total_entregado).toFixed(2)}
                  </h4>

                  <p className="activity-text">
                    Alumno: <strong>{pago.alumno_nombre}</strong> <br />
                    Método: {pago.metodo_pago} {pago.numero_operacion ? `• Op: ${pago.numero_operacion}` : ''} <br />
                    <span className={getStatusClass(pago.estado)}>
                      {getStatusLabel(pago)}
                    </span>
                  </p>

                  <p className="activity-time">
                    {new Date(pago.fecha_pago).toLocaleDateString('es-PE')} {new Date(pago.fecha_pago).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* STATUS POR HIJO */}
        <div className="dashboard-panel">
          <h3 className="panel-title">Estado de Cuenta por Estudiante</h3>

          {data.alumnos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No hay alumnos registrados.</p>
            </div>
          ) : (
            data.alumnos.map((alumno) => {
              const progress = alumno.porcentaje_progreso ?? 100;
              const pendingDeudasCount = alumno.deudas?.length || 0;
              return (
                <div key={alumno.id} className="payment-status">
                  <div className="payment-top">
                    <span className="payment-name fw-bold">
                      {alumno.nombre}
                    </span>
                    <span className={`payment-percent fw-semibold ${progress === 100 ? 'text-success' : 'text-warning'}`}>
                      {progress.toFixed(0)}% pagado
                    </span>
                  </div>

                  <div className="small text-muted mb-2">
                    Código: {alumno.codigo} • Pagado: <strong>S/ {alumno.total_pagado.toFixed(2)}</strong> de <strong>S/ {alumno.total_monto.toFixed(2)}</strong>
                    {pendingDeudasCount > 0 && (
                      <span className="text-danger ms-1">
                        (Pendiente: S/ {alumno.total_pendiente.toFixed(2)})
                      </span>
                    )}
                  </div>

                  <div className="progress-bar" style={{ height: '8px' }}>
                    <div
                      className={`progress-fill ${progress === 100 ? 'fill-green' : 'fill-orange'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
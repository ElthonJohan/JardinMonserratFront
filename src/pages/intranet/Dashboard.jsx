import React from 'react';

import '../../styles/dashboard.css';

const Dashboard = () => {

  return (

    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">

        <div className="dashboard-title">

          <h1>
            Dashboard
          </h1>

          <p>
            Bienvenido al panel principal
            de la intranet.
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

          <div className="stat-icon blue-icon">
            👨‍🎓
          </div>

          <p className="stat-title">
            Estudiantes
          </p>

          <h2 className="stat-value">
            120
          </h2>

          <p className="stat-description">
            Estudiantes registrados
          </p>

        </div>

        {/* CARD 2 */}
        <div className="stat-card card-green">

          <div className="stat-icon green-icon">
            💰
          </div>

          <p className="stat-title">
            Pagos Realizados
          </p>

          <h2 className="stat-value">
            85%
          </h2>

          <p className="stat-description">
            Cumplimiento mensual
          </p>

        </div>

        {/* CARD 3 */}
        <div className="stat-card card-orange">

          <div className="stat-icon orange-icon">
            📄
          </div>

          <p className="stat-title">
            Pensiones Pendientes
          </p>

          <h2 className="stat-value">
            18
          </h2>

          <p className="stat-description">
            Pagos por regularizar
          </p>

        </div>

        {/* CARD 4 */}
        <div className="stat-card card-purple">

          <div className="stat-icon purple-icon">
            🏫
          </div>

          <p className="stat-title">
            Año Escolar
          </p>

          <h2 className="stat-value">
            2026
          </h2>

          <p className="stat-description">
            Gestión académica activa
          </p>

        </div>

      </div>

      {/* GRID */}
      <div className="dashboard-grid">

        {/* ACTIVIDADES */}
        <div className="dashboard-panel">

          <h3 className="panel-title">
            Actividad Reciente
          </h3>

          {/* ITEM */}
          <div className="activity-item">

            <div className="activity-icon">
              💳
            </div>

            <div>

              <h4 className="activity-title">
                Pago registrado
              </h4>

              <p className="activity-text">
                Se registró correctamente
                el pago de la pensión
                del mes de abril.
              </p>

              <p className="activity-time">
                Hace 2 horas
              </p>

            </div>

          </div>

          {/* ITEM */}
          <div className="activity-item">

            <div className="activity-icon">
              📢
            </div>

            <div>

              <h4 className="activity-title">
                Nuevo comunicado
              </h4>

              <p className="activity-text">
                Se publicó un nuevo aviso
                para todos los padres.
              </p>

              <p className="activity-time">
                Hace 1 día
              </p>

            </div>

          </div>

          {/* ITEM */}
          <div className="activity-item">

            <div className="activity-icon">
              📚
            </div>

            <div>

              <h4 className="activity-title">
                Actualización académica
              </h4>

              <p className="activity-text">
                Se actualizaron las notas
                del segundo bimestre.
              </p>

              <p className="activity-time">
                Hace 3 días
              </p>

            </div>

          </div>

        </div>

        {/* STATUS */}
        <div className="dashboard-panel">

          <h3 className="panel-title">
            Estado Financiero
          </h3>

          {/* ITEM */}
          <div className="payment-status">

            <div className="payment-top">

              <span className="payment-name">
                Pensiones Pagadas
              </span>

              <span className="payment-percent">
                90%
              </span>

            </div>

            <div className="progress-bar">
              <div className="progress-fill fill-blue"></div>
            </div>

          </div>

          {/* ITEM */}
          <div className="payment-status">

            <div className="payment-top">

              <span className="payment-name">
                Matrículas
              </span>

              <span className="payment-percent">
                75%
              </span>

            </div>

            <div className="progress-bar">
              <div className="progress-fill fill-green"></div>
            </div>

          </div>

          {/* ITEM */}
          <div className="payment-status">

            <div className="payment-top">

              <span className="payment-name">
                Pagos Pendientes
              </span>

              <span className="payment-percent">
                45%
              </span>

            </div>

            <div className="progress-bar">
              <div className="progress-fill fill-orange"></div>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;
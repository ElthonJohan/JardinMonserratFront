import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CampanitaNotificaciones from "../../components/shared/CampanitaNotificaciones";

import "../../styles/intranetLayout.css";

const IntranetLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="intranet-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* LOGO */}
        <div className="sidebar-header">
          <h1>Intranet</h1>
          <p>Jardín Monserrat</p>
        </div>

        {/* USER */}
        <div className="user-card">
          <p className="user-role">Apoderado</p>
          <h2 className="user-name">{user?.full_name}</h2>
        </div>

        {/* MENU */}
        <nav className="nav-menu">
          <Link
            to="/intranet/dashboard"
            className={`nav-link ${
              location.pathname === "/intranet/dashboard" ? "active" : ""
            }`}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/intranet/pagos"
            className={`nav-link ${
              location.pathname === "/intranet/pagos" ? "active" : ""
            }`}
          >
            <span>💰</span>
            <span>Seguimiento de Pagos</span>
          </Link>

          <Link
            to="/intranet/profile"
            className={`nav-link ${
              location.pathname === "/intranet/profile" ? "active" : ""
            }`}
          >
            <span>👤</span>
            <span>Perfil</span>
          </Link>
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <h2>Panel de Control</h2>
            <p>Bienvenido nuevamente 👋</p>
          </div>

          <div className="topbar-user">
            <CampanitaNotificaciones />

            <div className="user-info">
              <h4>{user?.full_name}</h4>
              <span>Apoderado</span>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default IntranetLayout;

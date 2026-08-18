import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CampanitaNotificaciones from "../../components/shared/CampanitaNotificaciones";
import "../../styles/intranetLayout.css";


// Iconos SVG limpios en línea (puedes reemplazar por lucide-react o react-icons)
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const PaymentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
);
const AcademicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

const IntranetLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/intranet/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/intranet/pagos", label: "Pagos", icon: <PaymentsIcon /> },
    { path: "/intranet/academic-tracking", label: "Notas", icon: <AcademicIcon /> },
    { path: "/intranet/profile", label: "Perfil", icon: <ProfileIcon /> },
  ];

  const getInitials = (name) => {
    if (!name) return "AP";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="intranet-layout">
      {/* SIDEBAR (Desktop) */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">M</div>
          <div className="brand-text">
            <h3>Montserrat</h3>
            <span>Intranet</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            <LogoutIcon />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-wrapper">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-brand-mobile">
            <div className="mobile-logo">M</div>
            <h2>Montserrat Intranet</h2>
          </div>

          <div className="topbar-title-desktop">
            <h2>Portal de Padres</h2>
          </div>

          <div className="topbar-actions">
            <CampanitaNotificaciones />
            <div className="user-avatar-badge" title={user?.full_name}>
              {getInitials(user?.full_name)}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="page-content">
          <Outlet />
        </main>

        {/* BOTTOM NAVIGATION (Mobile) */}
        <nav className="bottom-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`bottom-nav-item ${isActive ? "active" : ""}`}
              >
                <div className="bottom-icon-wrapper">
                  {item.icon}
                </div>
                <span className="bottom-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default IntranetLayout;
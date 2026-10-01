import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CampanitaNotificaciones from './CampanitaNotificaciones';
import { getPagosPendientesCount } from '../../api/pagosAPI';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Estudiantes', path: '/estudiantes' },
  { label: 'Matrículas', path: '/matriculas' },
  { label: 'Pagos', path: '/pagos' },
];

const AppNavbar = ({ title = 'Jardín Monserrat' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendientesCount, setPendientesCount] = useState(0);
  const [dropOpen, setDropOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const canValidate = user?.permissions?.includes('view_pago');
  const canViewAcademico =
    user?.role === 'admin' ||
    user?.role === 'director' ||
    user?.permissions?.includes('view_asignaciondocente') ||
    user?.permissions?.includes('view_periodoacademico');

  let linksToRender = [];
  if (user?.isTeacher) {
    linksToRender = [{ label: 'Mis Cursos', path: '/docente/mis-cursos' }];
  } else {
    linksToRender = [...NAV_LINKS];
    if (canViewAcademico) {
      linksToRender.push({ label: 'Académico', path: '/academico' });
      linksToRender.push({ label: 'Libretas', path: '/reportes/libretas' });
    }
  }

  useEffect(() => {
    if (canValidate) {
      getPagosPendientesCount()
        .then(res => setPendientesCount(res.count || 0))
        .catch(() => { });
    }
  }, [canValidate]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  const handleNavClick = (path) => {
    navigate(path);
    setExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={(isExpanded) => setExpanded(isExpanded)}
      className="app-navbar sticky-top"
    >
      <Container fluid className="px-3 px-md-4">
        {/* Brand */}
        <Navbar.Brand
          href={user?.isTeacher ? '/docente/mis-cursos' : '/dashboard'}
          className="app-navbar-brand me-2 me-md-4"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(user?.isTeacher ? '/docente/mis-cursos' : '/dashboard');
          }}
        >
          <div className="app-brand-icon">🏫</div>
          <span className="app-brand-title">{title}</span>
        </Navbar.Brand>

        {/* Action icons right next to hamburger on mobile */}
        <div className="d-flex align-items-center gap-2 order-lg-3 ms-auto ms-lg-0">
          {user && (
            <>
              <CampanitaNotificaciones />

              {/* User Dropdown */}
              <div className="position-relative">
                <button
                  className="app-user-pill"
                  onClick={() => setDropOpen((o) => !o)}
                  type="button"
                >
                  <div className="app-avatar">{initials}</div>
                  <span className="app-username d-none d-sm-inline">
                    {user.username || 'Usuario'}
                  </span>
                  <span className="app-arrow">▾</span>
                </button>

                {dropOpen && (
                  <>
                    <div
                      className="app-dropdown-backdrop"
                      onClick={() => setDropOpen(false)}
                    />
                    <div className="app-dropdown-menu">
                      {!user?.isTeacher && (
                        <button
                          className="app-dropdown-item"
                          onClick={() => {
                            handleNavClick('/configuracion');
                            setDropOpen(false);
                          }}
                        >
                          ⚙️ Configuración
                        </button>
                      )}
                      <div className="app-dropdown-divider" />
                      <button
                        className="app-dropdown-item danger"
                        onClick={() => {
                          handleLogout();
                          setDropOpen(false);
                        }}
                      >
                        🚪 Cerrar Sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Mobile Hamburger Toggle */}
          <Navbar.Toggle
            aria-controls="app-navbar-nav"
            className="app-navbar-toggle border-0 ms-1"
          />
        </div>

        {/* Collapsible Nav Links */}
        <Navbar.Collapse id="app-navbar-nav" className="order-lg-2">
          <Nav className="me-auto app-nav-links my-2 my-lg-0">
            {linksToRender.map(({ label, path }) => {
              const isActive = location.pathname === path;
              const badge = path === '/pagos' && canValidate ? pendientesCount : 0;
              return (
                <button
                  key={path}
                  className={`app-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(path)}
                  type="button"
                >
                  <span>{label}</span>
                  {badge > 0 && <span className="app-badge-pill">{badge}</span>}
                </button>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
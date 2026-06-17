import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CampanitaNotificaciones from './CampanitaNotificaciones';
import { getPagosPendientesCount } from '../../api/pagosAPI';

const NAV_LINKS = [
  { label: 'Dashboard',   path: '/dashboard'   },
  { label: 'Estudiantes', path: '/estudiantes' },
  { label: 'Matrículas',  path: '/matriculas'  },
  { label: 'Pagos',       path: '/pagos'       },
];

const S = {
  navbar: {
    backgroundColor: '#0d3b66',
    boxShadow: '0 4px 16px rgba(13,59,102,0.22)',
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 1030,
  },
  brand: {
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 700,
    fontSize: '1.15rem',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  brandIcon: {
    background: '#fff',
    borderRadius: '50%',
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16,
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    flexShrink: 0,
  },
  navLink: (isActive, isHovered) => ({
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: 14,
    fontWeight: 600,
    color: isActive ? '#fff' : 'rgba(255,255,255,0.72)',
    padding: '6px 14px',
    borderRadius: 9999,
    background: isActive || isHovered ? 'rgba(255,255,255,0.14)' : 'transparent',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  }),
  badgePill: {
    background: '#ef4444',
    color: '#fff',
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 700,
    padding: '1px 7px',
    lineHeight: '18px',
  },
  rightWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  dropdownToggle: (isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: 9999,
    padding: '5px 14px 5px 5px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    color: '#fff',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: 14,
    fontWeight: 600,
  }),
  avatarCircle: {
    width: 30, height: 30,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.22)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, color: '#fff', fontSize: 13,
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    flexShrink: 0,
  },
  dropdownMenu: {
    background: '#ffffff',
    borderRadius: '1rem',
    border: '1px solid rgba(0,0,0,0.08)',
    boxShadow: '0 8px 32px rgba(13,59,102,0.15)',
    padding: '8px',
    minWidth: 180,
    fontFamily: 'Quicksand, sans-serif',
  },
  dropdownItem: (isHovered) => ({
    borderRadius: '0.5rem',
    padding: '8px 14px',
    fontSize: 14,
    fontWeight: 600,
    color: isHovered ? '#0d3b66' : '#191b23',
    background: isHovered ? '#f0f3ff' : 'transparent',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  }),
  dropdownItemDanger: (isHovered) => ({
    borderRadius: '0.5rem',
    padding: '8px 14px',
    fontSize: 14,
    fontWeight: 600,
    color: isHovered ? '#fff' : '#ba1a1a',
    background: isHovered ? '#ba1a1a' : 'transparent',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  }),
  divider: {
    borderTop: '1px solid #e8edf9',
    margin: '4px 0',
  },
};

/* Small hook for hover state on individual items */
function useHover() {
  const [hovered, setHovered] = useState(false);
  return [hovered, { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }];
}

function NavLinkItem({ label, path, badge }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const isActive  = location.pathname === path;
  const [hov, hovProps] = useHover();

  return (
    <span
      onClick={() => navigate(path)}
      style={S.navLink(isActive, hov)}
      {...hovProps}
    >
      {label}
      {badge > 0 && <span style={S.badgePill}>{badge}</span>}
    </span>
  );
}

function DropdownItemCustom({ children, onClick, danger }) {
  const [hov, hovProps] = useHover();
  return (
    <div
      style={danger ? S.dropdownItemDanger(hov) : S.dropdownItem(hov)}
      onClick={onClick}
      {...hovProps}
    >
      {children}
    </div>
  );
}

const AppNavbar = ({ title = 'Jardín Monserrat' }) => {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const [pendientesCount, setPendientesCount] = useState(0);
  const [dropOpen, setDropOpen]               = useState(false);
  const [togHov, togHovProps]                 = useHover();

  const canValidate = user?.permissions?.includes('view_pago');

  useEffect(() => {
    if (canValidate) {
      getPagosPendientesCount()
        .then(res => setPendientesCount(res.count || 0))
        .catch(() => {});
    }
  }, [canValidate]);

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div style={S.navbar}>
      <Container fluid style={{ padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Brand */}
        <a href="/dashboard" style={S.brand} onClick={e => { e.preventDefault(); navigate('/dashboard'); }}>
          <div style={S.brandIcon}>🏫</div>
          {title}
        </a>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(({ label, path }) => (
            <NavLinkItem
              key={path}
              label={label}
              path={path}
              badge={path === '/pagos' && canValidate ? pendientesCount : 0}
            />
          ))}
        </nav>

        {/* Right side */}
        {user && (
          <div style={S.rightWrap}>

            {/* Campanita — se mantiene tu componente existente */}
            <CampanitaNotificaciones />

            {/* User dropdown */}
            <div style={{ position: 'relative' }}>
              <div
                style={S.dropdownToggle(togHov)}
                onClick={() => setDropOpen(o => !o)}
                {...togHovProps}
              >
                <div style={S.avatarCircle}>{initials}</div>
                <span>{user.username || 'Usuario'}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>▾</span>
              </div>

              {dropOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                    onClick={() => setDropOpen(false)}
                  />
                  <div style={{ ...S.dropdownMenu, position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 1000 }}>
                    <DropdownItemCustom onClick={() => { navigate('/perfil');        setDropOpen(false); }}>
                      👤 Perfil
                    </DropdownItemCustom>
                    <DropdownItemCustom onClick={() => { navigate('/configuracion'); setDropOpen(false); }}>
                      ⚙️ Configuración
                    </DropdownItemCustom>
                    <div style={S.divider} />
                    <DropdownItemCustom danger onClick={() => { handleLogout(); setDropOpen(false); }}>
                      🚪 Cerrar Sesión
                    </DropdownItemCustom>
                  </div>
                </>
              )}
            </div>

          </div>
        )}
      </Container>
    </div>
  );
};

export default AppNavbar;
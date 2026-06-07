import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CampanitaNotificaciones from './CampanitaNotificaciones';
import { getPagosPendientesCount } from '../../api/pagosAPI';
import './Navbar.css';

const AppNavbar = ({ title = 'Jardín Monserrat' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendientesCount, setPendientesCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Simplificación básica de chequeo de roles para mostrar u ocultar links
  const canValidate = user && user.permissions && user.permissions.includes('view_pago');

  useEffect(() => {
    if (canValidate) {
      getPagosPendientesCount()
        .then(res => setPendientesCount(res.count || 0))
        .catch(err => console.error("Error fetching pendientes count", err));
    }
  }, [canValidate]);

  return (
    <Navbar bg="primary" data-bs-theme="dark" className="navbar-custom" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/dashboard" className="fw-bold">
          🏫 {title}
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center">
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/estudiantes">Estudiantes</Nav.Link>
          <Nav.Link href="/matriculas">Matrículas</Nav.Link>
          <Nav.Link href="/pagos" className="d-flex align-items-center gap-2">
            Pagos
            {canValidate && pendientesCount > 0 && (
              <Badge bg="danger" pill>
                {pendientesCount}
              </Badge>
            )}
          </Nav.Link>

          {user && (
            <div className="d-flex align-items-center ms-3">
              <CampanitaNotificaciones />
              <Dropdown className="ms-3">
              <Dropdown.Toggle
                variant="outline-light"
                id="dropdown-basic"
                className="d-flex align-items-center gap-2"
              >
                👤 {user.username || 'Usuario'}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item href="/perfil">Perfil</Dropdown.Item>
                <Dropdown.Item href="/configuracion">Configuración</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

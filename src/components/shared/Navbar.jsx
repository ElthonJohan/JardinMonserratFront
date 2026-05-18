import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const AppNavbar = ({ title = 'Jardín Monserrat' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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
          <Nav.Link href="/pagos">Pagos</Nav.Link>

          {user && (
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
                <Dropdown.Item href="/conceptos">Conceptos de Pago</Dropdown.Item>
                <Dropdown.Item href="/configuracion">Configuración</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/shared';
import { useAuth } from '../context/AuthContext';
import './ConfiguracionPage.css';

const ConfiguracionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="configuracion-container">
      {/* 2. AppNavbar rendered at the top of the view */}
      <AppNavbar title="Configuración - Jardín Monserrat" />

      <Container className="py-5">
        {/* Responsive Header Card */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="configuracion-header-card p-4 text-center">
              <Card.Body>
                <span className="fs-1">⚙️</span>
                <h1 className="fw-bold mt-2 display-5 text-dark">Configuración General</h1>
                <p className="text-muted fs-5 mb-0">
                  Panel central para administrar las tablas maestras y datos maestros del sistema.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Short-cut Cards for static data management */}
        <Row className="justify-content-center g-4 mt-2">

          

          {/* Card 1: Gestión de Aulas */}
          <Col md={4}>
            <Card 
              className="configuracion-card h-100 p-3" 
              onClick={() => handleNavigation('/aulas')}
            >
              <Card.Body className="d-flex flex-column text-center">
                <div className="config-card-icon-wrapper">
                  <span>🏫</span>
                </div>
                <Card.Title className="configuracion-card-title">
                  Gestión de Aulas
                </Card.Title>
                <Card.Text className="configuracion-card-desc flex-grow-1">
                  Administrar grados, secciones, capacidades y la asignación física de las aulas para el alumnado.
                </Card.Text>
                <Button 
                  variant="primary" 
                  className="config-btn-action mt-3 w-100 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation('/aulas');
                  }}
                >
                  Entrar a Aulas
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 2: Gestión de Apoderados */}
          <Col md={4}>
            <Card 
              className="configuracion-card h-100 p-3" 
              onClick={() => handleNavigation('/apoderados')}
            >
              <Card.Body className="d-flex flex-column text-center">
                <div className="config-card-icon-wrapper">
                  <span>👨‍👩‍👧‍👦</span>
                </div>
                <Card.Title className="configuracion-card-title">
                  Gestión de Apoderados
                </Card.Title>
                <Card.Text className="configuracion-card-desc flex-grow-1">
                  Administrar información personal, documentos DNI, contactos y correos de los padres o tutores de los estudiantes.
                </Card.Text>
                <Button 
                  variant="success" 
                  className="config-btn-action mt-3 w-100 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation('/apoderados');
                  }}
                >
                  Entrar a Apoderados
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 3: Conceptos de Pago */}
          <Col md={4}>
            <Card 
              className="configuracion-card h-100 p-3" 
              onClick={() => handleNavigation('/conceptos')}
            >
              <Card.Body className="d-flex flex-column text-center">
                <div className="config-card-icon-wrapper">
                  <span>💰</span>
                </div>
                <Card.Title className="configuracion-card-title">
                  Conceptos de Pago
                </Card.Title>
                <Card.Text className="configuracion-card-desc flex-grow-1">
                  Administrar los conceptos de cobros, montos base, matrículas, pensiones mensuales y cargos extraordinarios.
                </Card.Text>
                <Button 
                  variant="warning" 
                  className="config-btn-action text-white mt-3 w-100 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation('/conceptos');
                  }}
                >
                  Entrar a Conceptos
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card: Periodos Académicos */}
          {user?.permissions?.includes('view_periodoacademico') && (
            <Col md={4} className="mt-md-0 mt-4">
              <Card 
                className="configuracion-card h-100 p-3" 
                onClick={() => handleNavigation('/periodos')}
              >
                <Card.Body className="d-flex flex-column text-center">
                  <div className="config-card-icon-wrapper">
                    <span>📅</span>
                  </div>
                  <Card.Title className="configuracion-card-title">
                    Periodos Académicos
                  </Card.Title>
                  <Card.Text className="configuracion-card-desc flex-grow-1">
                    Configurar los años lectivos, fechas de inicio, fin y estados de apertura para los procesos de matrícula.
                  </Card.Text>
                  <Button 
                    variant="info" 
                    className="config-btn-action text-white mt-3 w-100 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation('/periodos');
                    }}
                  >
                    Entrar a Periodos
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Card 4: Gestión de Usuarios */}
          {user?.permissions?.includes('view_usuario') && (
            <Col md={4} className="mt-4">
              <Card 
                className="configuracion-card h-100 p-3" 
                onClick={() => handleNavigation('/usuarios')}
              >
                <Card.Body className="d-flex flex-column text-center">
                  <div className="config-card-icon-wrapper">
                    <span>👥</span>
                  </div>
                  <Card.Title className="configuracion-card-title">
                    Gestión de Usuarios
                  </Card.Title>
                  <Card.Text className="configuracion-card-desc flex-grow-1">
                    Administrar accesos y cuentas del personal y apoderados del sistema.
                  </Card.Text>
                  <Button 
                    variant="danger" 
                    className="config-btn-action text-white mt-3 w-100 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation('/usuarios');
                    }}
                  >
                    Entrar a Usuarios
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Card 5: Gestión de Roles */}
          {user?.permissions?.includes('view_group') && (
            <Col md={4} className="mt-4">
              <Card 
                className="configuracion-card h-100 p-3" 
                onClick={() => handleNavigation('/roles')}
              >
                <Card.Body className="d-flex flex-column text-center">
                  <div className="config-card-icon-wrapper">
                    <span>🔐</span>
                  </div>
                  <Card.Title className="configuracion-card-title">
                    Gestión de Roles
                  </Card.Title>
                  <Card.Text className="configuracion-card-desc flex-grow-1">
                    Configurar grupos de acceso y asignar permisos a los módulos.
                  </Card.Text>
                  <Button 
                    variant="danger" 
                    className="config-btn-action text-white mt-3 w-100 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation('/roles');
                    }}
                  >
                    Entrar a Roles
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            
          )}


          
        </Row>
      </Container>
    </div>
  );
};

export default ConfiguracionPage;

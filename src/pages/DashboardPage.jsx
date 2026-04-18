import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/shared';
import { getEstudiantes } from '../services/estudianteService';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();

  const numAlumnos = getEstudiantes(); // Aquí se debería obtener el número real de alumnos desde el backend
  const numMatriculas = 0;

  return (
    <div className="dashboard-container">
      <AppNavbar />

      <Container fluid className="py-5">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">Dashboard</h2>
            <p className="text-muted">Panel de control del sistema</p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6} lg={3}>
            <Card className="dashboard-card h-100">
              <Card.Body className="text-center">
                <div className="card-icon mb-3">👥</div>
                <h5>Alumnos</h5>
                <Badge bg="primary" className="fs-5">{numAlumnos.length}</Badge>
                <p className="text-muted small mt-2">Total registrado</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="dashboard-card h-100">
              <Card.Body className="text-center">
                <div className="card-icon mb-3">📚</div>
                <h5>Matrículas</h5>
                <Badge bg="success" className="fs-5">0</Badge>
                <p className="text-muted small mt-2">Este año</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="dashboard-card h-100">
              <Card.Body className="text-center">
                <div className="card-icon mb-3">💰</div>
                <h5>Pagos</h5>
                <Badge bg="warning" className="fs-5">0</Badge>
                <p className="text-muted small mt-2">Pendientes</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="dashboard-card h-100">
              <Card.Body className="text-center">
                <div className="card-icon mb-3">📊</div>
                <h5>Reportes</h5>
                <Badge bg="info" className="fs-5">0</Badge>
                <p className="text-muted small mt-2">Disponibles</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Card>
              <Card.Header className="bg-light fw-bold">
                Acciones Rápidas
              </Card.Header>
              <Card.Body>
                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    variant="primary" 
                    size="sm"

                    onClick={() => navigate('/estudiantes')}
                  >
                    ➕ Nuevo Alumno
                  </Button>
                  <Button variant="primary" size="sm"
                    onClick={() => navigate('/aulas')}
                  >
                    ➕ Nueva Aula
                  </Button>
                  <Button variant="secondary" size="sm"
                    onClick={() => navigate('/apoderados')}
                  >
                    ➕ Nuevo Apoderado
                  </Button>
                  <Button variant="success" size="sm">
                    ➕ Nueva Matrícula
                  </Button>
                  <Button variant="warning" size="sm">
                    💰 Registrar Pago
                  </Button>
                  <Button variant="info" size="sm">
                    📊 Ver Reportes
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppNavbar } from '../../components/shared';
import { getMisCursos } from '../../api/academicoAPI';

export default function PanelDocentePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      setLoading(true);
      try {
        const data = await getMisCursos();
        setCursos(data);
      } catch (err) {
        console.error('Error fetching teacher assignments:', err);
        setError('No se pudieron cargar los cursos asignados. Por favor, intente de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  const docenteNombre = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'Docente';

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <AppNavbar title="Portal Docente" />

      <Container className="py-5 px-4">
        {/* Banner de Bienvenida */}
        <div 
          className="mb-5 p-5 rounded-4 text-white shadow-lg d-flex align-items-center justify-content-between position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0d3b66 0%, #0056b3 100%)',
          }}
        >
          <div className="position-relative" style={{ zIndex: 2 }}>
            <h1 className="display-5 fw-bold mb-2">¡Bienvenido(a), {docenteNombre}!</h1>
            <p className="lead mb-0 opacity-85">
              Aquí puede gestionar sus cursos asignados, registrar las calificaciones y dar seguimiento académico a sus alumnos.
            </p>
          </div>
          <div 
            className="d-none d-lg-flex align-items-center justify-content-center bg-white text-primary rounded-circle shadow-sm"
            style={{ width: '90px', height: '90px', fontSize: '2.5rem', fontWeight: 'bold', zIndex: 2 }}
          >
            🏫
          </div>
          {/* Círculo decorativo de fondo */}
          <div 
            className="position-absolute rounded-circle opacity-10"
            style={{
              width: '300px',
              height: '300px',
              background: '#fff',
              right: '-100px',
              top: '-100px',
              zIndex: 1
            }}
          />
        </div>

        <h3 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
          <span>📚</span> Mis Cursos Asignados
        </h3>

        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Cargando asignaciones académicas...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="rounded-3 shadow-sm">
            <Alert.Heading>Error de Conexión</Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        ) : cursos.length === 0 ? (
          <Card className="text-center py-5 border-0 shadow-sm rounded-4">
            <Card.Body className="py-5">
              <div style={{ fontSize: '4rem' }} className="mb-3">📂</div>
              <h4 className="fw-bold text-muted">No tiene asignaciones activas</h4>
              <p className="text-secondary mb-0">
                Actualmente no cuenta con cursos o aulas asignadas en este periodo escolar.
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {cursos.map((curso) => {
              const totalAlumnos = curso.alumnos ? curso.alumnos.length : 0;
              return (
                <Col key={curso.id}>
                  <Card 
                    className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative"
                    style={{
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                    }}
                  >
                    {/* Indicador de color arriba de la tarjeta */}
                    <div 
                      style={{
                        height: '6px',
                        background: 'linear-gradient(90deg, #3a86c8 0%, #0d3b66 100%)'
                      }}
                    />
                    
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="badge bg-light text-primary px-3 py-2 rounded-pill fw-bold border">
                          {curso.periodo_nombre || 'Periodo Activo'}
                        </span>
                        <span className="text-muted small fw-semibold">
                          ID: #{curso.id}
                        </span>
                      </div>

                      <Card.Title className="fw-bold text-dark mb-2" style={{ fontSize: '1.4rem' }}>
                        🏫 {curso.aula_nombre || 'Aula'}
                      </Card.Title>

                      <div className="text-secondary mb-4 flex-grow-1">
                        <div className="mb-3">
                          <strong className="d-block mb-1 text-secondary small uppercase fw-bold">Áreas Asignadas:</strong>
                          <div className="d-flex flex-wrap gap-1">
                            {curso.areas_detalle && curso.areas_detalle.map(area => (
                              <Badge key={area.id} bg="danger" className="fw-semibold px-2.5 py-1.5 rounded-3" style={{ background: '#e63946', fontSize: '12px' }}>
                                {area.nombre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="me-2">👥</span>
                          <span><strong>Estudiantes:</strong> {totalAlumnos} inscritos</span>
                        </div>
                      </div>

                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 mt-auto"
                        style={{
                          background: '#0d3b66',
                          border: 'none',
                          transition: 'background 0.2s',
                        }}
                        onClick={() => navigate(`/docente/evaluar/${curso.id}`)}
                      >
                        <span>📝</span> Evaluar Aula
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
}

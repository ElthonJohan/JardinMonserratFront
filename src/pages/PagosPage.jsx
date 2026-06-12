import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Tabs, Tab, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import '../styles/PagosPage.css';
import RegistroPago from '../components/pagos/RegistroPago';
import GestionCaja from '../components/pagos/GestionCaja';
import AuditoriaAlumno from '../components/pagos/AuditoriaAlumno';
import ValidacionPagos from '../components/pagos/ValidacionPagos';
import { AppNavbar, ErrorBoundary } from '../components/shared';
import { getEstudiantes } from '../api/estudiantesAPI';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PagosPage() {
  const [alumnos, setAlumnos] = useState([]);
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

const activeTab =
  searchParams.get("tab") || "registro";

  const cargarAlumnos = async () => {
    setLoading(true);
    try {
      const response = await getEstudiantes();
      const estudiantesArray = Array.isArray(response) ? response : response?.results || [];
      setAlumnos(estudiantesArray);
    } catch (error) {
      toast.error('Error al cargar alumnos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const handlePagoRegistrado = () => {
    // Aquí puedes agregar lógica para refrescar datos si es necesario
  };

  const handleCajaChange = (abierta) => {
    setCajaAbierta(abierta);
  };

  return (
    <ErrorBoundary>
      <AppNavbar />
      <Container className="mt-4 mb-5" style={{ maxWidth: '1200px' }}>
        <Row className="mb-4">
          <Col>
            <h1 className="display-5 fw-bold">Tesorería - Gestión de Pagos</h1>
            <p className="text-muted">
              Registro de pagos y control de caja diaria
            </p>
          </Col>
        </Row>

        <Tabs
  activeKey={activeTab}
  onSelect={(tab) => {
    navigate(`/pagos?tab=${tab}`);
  }}
  className="mb-4"
  id="pagos-tabs"
>
          <Tab eventKey="registro" title="📝 Registro de Pago">
            <Card className="mt-3">
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                  </div>
                ) : (
                  <ErrorBoundary>
                    <RegistroPago
                      alumnos={alumnos}
                      cajaAbierta={cajaAbierta}
                      onPagoRegistrado={handlePagoRegistrado}
                    />
                  </ErrorBoundary>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="caja" title="💼 Gestión de Caja">
            <Card className="mt-3">
              <Card.Body>
                <ErrorBoundary>
                  <GestionCaja onCajaChange={handleCajaChange} />
                </ErrorBoundary>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="auditoria" title="📊 Auditoría de Pagos">
            <Card className="mt-3">
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                  </div>
                ) : (
                  <ErrorBoundary>
                    <AuditoriaAlumno alumnos={alumnos} />
                  </ErrorBoundary>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="validacion" title="✅ Validación de Pagos">
            <Card className="mt-3">
              <Card.Body>
                <ErrorBoundary>
                  <ValidacionPagos />
                </ErrorBoundary>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </ErrorBoundary>
  );
}

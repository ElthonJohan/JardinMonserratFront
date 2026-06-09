import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Table, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { abrirCaja, cerrarCaja, getMiEstadoCaja, getResumenIngresos, getPagosByAlumno } from '../../api/pagosAPI';

export default function GestionCaja({ onCajaChange = null }) {
  const [cajaActual, setCajaActual] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [montoInicialForm, setMontoInicialForm] = useState('0.00');
  const [showAbrirForm, setShowAbrirForm] = useState(false);
  const [pagosRecientes, setPagosRecientes] = useState([]);

  const cargarEstadoCaja = async () => {
    setLoading(true);
    try {
      const response = await getMiEstadoCaja();
      setCajaActual(response.caja || null);

      if (response.caja && response.caja.estado === 'Abierta') {
        const [resumenData, pagosData] = await Promise.all([
          getResumenIngresos(response.caja.id),
          getPagosByAlumno(null) // Obtener todos los pagos del día
        ]);

        setResumen(resumenData);

        // Filtrar pagos del día actual en la caja abierta
        const hoy = new Date().toDateString();
        if (pagosData && pagosData.results) {
          const pagosDelDia = pagosData.results.filter((p) => {
            const fechaPago = new Date(p.fecha_pago).toDateString();
            return fechaPago === hoy;
          }).slice(0, 10); // Últimos 10 pagos
          setPagosRecientes(pagosDelDia);
        }
      } else {
        setResumen(null);
        setPagosRecientes([]);
      }

      if (onCajaChange) {
        onCajaChange(response.caja || null);
      }
    } catch (error) {
      console.error(error);
      setCajaActual(null);
      setResumen(null);
      setPagosRecientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadoCaja();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAbrirCaja = async (e) => {
    e.preventDefault();
    const monto = parseFloat(montoInicialForm) || 0;

    try {
      setLoading(true);
      const result = await abrirCaja(monto);
      toast.success('Caja abierta correctamente');
      setCajaActual(result.caja);
      setShowAbrirForm(false);
      setMontoInicialForm('0.00');

      if (onCajaChange) {
        onCajaChange(result.caja);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al abrir la caja';
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCerrarCaja = async () => {
    if (!cajaActual) return;

    if (window.confirm('¿Deseas cerrar la caja? Esta acción no se puede deshacer.')) {
      try {
        setLoading(true);
        const result = await cerrarCaja(cajaActual.id);

        toast.success('Caja cerrada correctamente');
        setCajaActual(result.caja);
        setResumen(null);

        if (onCajaChange) {
          onCajaChange(null);
        }
      } catch (error) {
        toast.error('Error al cerrar la caja');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    cargarEstadoCaja();
  };

  if (loading && !cajaActual) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="gestion-caja-container mt-4">
      {cajaActual ? (
        cajaActual.estado === 'Abierta' ? (
          <>
            <Card className="mb-4 border-success">
              <Card.Header className="bg-success text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="mb-0">✅ Caja Abierta</Card.Title>
                    <small className="fw-bold">ID: {cajaActual.id}</small>
                  </div>
                  <div className="d-flex gap-4 align-items-center">
                    <div className="text-end">
                      <div className="fw-bold" style={{ fontSize: '1.3rem' }}>
                        S/ {parseFloat(cajaActual.monto_inicial || 0).toFixed(2)}
                      </div>
                      <small>Monto Inicial</small>
                    </div>
                    {resumen && (
                      <div className="text-end border-start border-white-50 ps-4">
                        <div className="fw-bold" style={{ fontSize: '1.3rem', color: '#fff' }}>
                          S/ {parseFloat(resumen.total_con_inicial || 0).toFixed(2)}
                        </div>
                        <small className="text-white fw-bold">Total en Caja</small>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Fecha de Apertura:</strong><br />
                      {new Date(cajaActual.fecha_apertura).toLocaleString('es-PE')}
                    </p>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button
                      variant="danger"
                      onClick={handleCerrarCaja}
                      disabled={loading}
                      className="me-2"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Cerrando...
                        </>
                      ) : (
                        '🔒 Cerrar Caja'
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={handleRefresh}
                      disabled={loading}
                    >
                      🔄 Actualizar
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {resumen && (
              <>
                <Card className="mb-4">
                  <Card.Header className="bg-info text-white">
                    <Card.Title className="mb-0">📊 Resumen de Ingresos</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-4">
                      <Col md={4} className="text-center">
                        <div className="p-3 bg-light rounded">
                          <small className="text-muted">Monto Inicial</small>
                          <div className="fw-bold" style={{ fontSize: '1.3rem', color: '#666' }}>
                            S/ {parseFloat(resumen.monto_inicial || 0).toFixed(2)}
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="text-center">
                        <div className="p-3 bg-light rounded">
                          <small className="text-muted">Recaudado</small>
                          <div className="fw-bold" style={{ fontSize: '1.3rem', color: '#28a745' }}>
                            S/ {parseFloat(resumen.total_recaudado || 0).toFixed(2)}
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="text-center">
                        <div className="p-3 bg-light rounded">
                          <small className="text-muted">Total con Inicial</small>
                          <div className="fw-bold" style={{ fontSize: '1.3rem', color: '#0066cc' }}>
                            S/ {parseFloat(resumen.total_con_inicial || 0).toFixed(2)}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <h6 className="mb-3">Desglose por Método de Pago</h6>
                    {resumen.resumen_por_metodo && resumen.resumen_por_metodo.length > 0 ? (
                      <div className="table-responsive">
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Método de Pago</th>
                              <th className="text-end">Cantidad</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resumen.resumen_por_metodo.map((metodo, idx) => (
                              <tr key={idx}>
                                <td>
                                  <strong>{metodo.metodo_pago}</strong>
                                </td>
                                <td className="text-end">{metodo.cantidad}</td>
                                <td className="text-end fw-bold">
                                  S/ {parseFloat(metodo.total).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <Alert variant="info" className="mb-0">
                        No hay transacciones registradas aún.
                      </Alert>
                    )}

                    <div className="mt-3 text-muted small">
                      <p>
                        <strong>Total de Pagos:</strong> {resumen.cantidad_pagos || 0}
                      </p>
                    </div>
                  </Card.Body>
                </Card>

                {pagosRecientes.length > 0 && (
                  <Card className="mb-4 border-success">
                    <Card.Header className="bg-success text-white">
                      <Card.Title className="mb-0">⏰ Últimos Pagos de Hoy</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Hora</th>
                              <th>Alumno</th>
                              <th>Método</th>
                              <th className="text-end">Monto</th>
                              <th>Operación</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pagosRecientes.map((pago) => (
                              <tr key={pago.id}>
                                <td className="text-nowrap">
                                  {new Date(pago.fecha_pago).toLocaleTimeString('es-PE', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td>
                                  {pago.alumno_detail
                                    ? `${pago.alumno_detail.nombres} ${pago.alumno_detail.apellidos}`
                                    : `Alumno #${pago.alumno}`}
                                </td>
                                <td>
                                  <Badge
                                    bg={
                                      pago.metodo_pago === 'Efectivo'
                                        ? 'success'
                                        : pago.metodo_pago === 'Yape'
                                          ? 'warning'
                                          : 'info'
                                    }
                                  >
                                    {pago.metodo_pago}
                                  </Badge>
                                </td>
                                <td className="text-end fw-bold">
                                  S/ {parseFloat(pago.monto_total_entregado).toFixed(2)}
                                </td>
                                <td className="text-muted small">{pago.numero_operacion || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}
          </>
        ) : (
          <Card className="border-secondary mb-4">
            <Card.Header className="bg-secondary text-white">
              <Card.Title className="mb-0">🔒 Caja Cerrada</Card.Title>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-3">
                La caja fue cerrada el {new Date(cajaActual.fecha_cierre).toLocaleString('es-PE')}
              </Alert>
              <Button variant="primary" onClick={() => setShowAbrirForm(true)}>
                🔓 Abrir Nueva Caja
              </Button>
            </Card.Body>
          </Card>
        )
      ) : (
        <Card className="border-warning mb-4">
          <Card.Header className="bg-warning text-dark">
            <Card.Title className="mb-0">ℹ️ Sin Caja Abierta</Card.Title>
          </Card.Header>
          <Card.Body>
            <Alert variant="warning" className="mb-3">
              No hay una caja abierta. Abre una nueva caja para comenzar a registrar pagos.
            </Alert>
            <Button variant="primary" onClick={() => setShowAbrirForm(true)}>
              🔓 Abrir Caja
            </Button>
          </Card.Body>
        </Card>
      )}

      {showAbrirForm && (
        <Card className="mt-4 border-primary">
          <Card.Header className="bg-primary text-white">
            <Card.Title className="mb-0">Abrir Nueva Caja</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleAbrirCaja}>
              <Form.Group className="mb-3">
                <Form.Label>Monto Inicial (Opcional)</Form.Label>
                <Form.Control
                  type="number"
                  value={montoInicialForm}
                  onChange={(e) => setMontoInicialForm(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                <Form.Text className="text-muted">
                  Ingresa el monto con el que inicias la caja hoy.
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Abriendo...
                    </>
                  ) : (
                    '✅ Abrir Caja'
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowAbrirForm(false);
                    setMontoInicialForm('0.00');
                  }}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

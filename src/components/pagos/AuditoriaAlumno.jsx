import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { DataTable } from '../shared';
import { getDeudasHistoricas, getPagosByAlumno } from '../../api/pagosAPI';
import ModalNuevoCargo from './ModalNuevoCargo';

const getAlumnoLabel = (a) => {
  if (!a) return '';
  const full = `${a.nombres || ''} ${a.apellidos || ''}`.trim();
  return `#${a.id} - ${full}`;
};

export default function AuditoriaAlumno({ alumnos = [] }) {
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPagoId, setExpandedPagoId] = useState(null);
  const [showModalNuevoCargo, setShowModalNuevoCargo] = useState(false);

  const handleNuevoCargoSuccess = () => {
    cargarDatos(alumnoSeleccionado.id);
  };

  const cargarDatos = async (alumnoId) => {
    setLoading(true);
    try {
      const [pagosRes, deudasRes] = await Promise.all([
        getPagosByAlumno(alumnoId),
        getDeudasHistoricas(alumnoId)
      ]);

      const pagosArray = Array.isArray(pagosRes) ? pagosRes : pagosRes?.results || [];
      const deudasArray = Array.isArray(deudasRes) ? deudasRes : deudasRes?.results || [];

      setPagos(pagosArray);
      setDeudas(deudasArray);

      // Eliminamos el toast.info para que no se perciba como error cuando es un estado normal.
    } catch (error) {
      toast.error('Error al cargar datos de auditoría');
      console.error(error);
      setPagos([]);
      setDeudas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAlumnoChange = (e) => {
    const alumnoId = e.target.value;
    if (!alumnoId) {
      setAlumnoSeleccionado(null);
      setPagos([]);
      setDeudas([]);
      return;
    }

    const alumno = alumnos.find((a) => String(a.id) === String(alumnoId));
    setAlumnoSeleccionado(alumno);
    cargarDatos(alumnoId);
  };

  const calcularTotalesPorAlumno = () => {
    const totalFacturado = deudas.reduce((sum, d) => sum + parseFloat(d.monto_total || 0), 0);
    const totalPagado = deudas.reduce((sum, d) => sum + parseFloat(d.monto_pagado || 0), 0);
    const totalPendiente = deudas.reduce(
      (sum, d) => sum + parseFloat(d.saldo_pendiente || 0),
      0
    );
    return { totalFacturado, totalPagado, totalPendiente };
  };

  const pagosColumns = [
    {
      key: 'fecha_pago',
      label: 'Fecha',
      render: (val) => new Date(val).toLocaleString('es-PE')
    },
    {
      key: 'metodo_pago',
      label: 'Método',
      render: (val) => (
        <Badge bg={val === 'Efectivo' ? 'success' : val === 'Yape' ? 'warning' : 'info'}>
          {val}
        </Badge>
      )
    },
    {
      key: 'numero_operacion',
      label: 'Operación',
      render: (val) => val || '—'
    },
    {
      key: 'monto_total_entregado',
      label: 'Monto Entregado',
      render: (val) => `S/ ${parseFloat(val).toFixed(2)}`
    }
  ];

  const deudasColumns = [
    {
      key: 'concepto_detail',
      label: 'Concepto',
      render: (val, row) => {
        const nombre = val?.nombre || 'N/A';
        return row.detalle_adicional ? `${nombre} - ${row.detalle_adicional}` : nombre;
      }
    },
    {
      key: 'mes',
      label: 'Mes',
      render: (val) => {
        if (!val) return 'Anual';
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return meses[val - 1] || val;
      }
    },
    {
      key: 'fecha_vencimiento',
      label: 'Vencimiento',
      render: (val) => new Date(val).toLocaleDateString('es-PE')
    },
    {
      key: 'monto_total',
      label: 'Facturado',
      render: (val) => `S/ ${parseFloat(val).toFixed(2)}`
    },
    {
      key: 'monto_pagado',
      label: 'Pagado',
      render: (val) => `S/ ${parseFloat(val).toFixed(2)}`
    },
    {
      key: 'saldo_pendiente',
      label: 'Saldo Pendiente',
      render: (val) => `S/ ${parseFloat(val).toFixed(2)}`
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => (
        <Badge
          bg={val === 'Pendiente' ? 'danger' : val === 'Parcial' ? 'warning' : 'success'}
        >
          {val}
        </Badge>
      )
    }
  ];

  const { totalFacturado, totalPagado, totalPendiente } = calcularTotalesPorAlumno();

  return (
    <div className="auditoria-alumno-container">
      <Row className="mb-4 align-items-end">
        <Col md={8}>
          <Form.Group>
            <Form.Label className="fw-bold">Selecciona Alumno para Auditoría</Form.Label>
            <Form.Select
              value={alumnoSeleccionado?.id || ''}
              onChange={handleAlumnoChange}
              size="sm"
            >
              <option value="">-- Seleccionar alumno --</option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {getAlumnoLabel(a)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4} className="mt-2 mt-md-0">
          {alumnoSeleccionado && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => cargarDatos(alumnoSeleccionado.id)}
              disabled={loading}
              className="d-flex align-items-center gap-1"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Cargando...
                </>
              ) : (
                <>🔄 Actualizar Datos</>
              )}
            </Button>
          )}
        </Col>
      </Row>

      {alumnoSeleccionado && (
        <>
          <Card className="mb-4 border-info">
            <Card.Header className="bg-info text-white">
              <Card.Title className="mb-0">
                📊 Resumen Financiero - {getAlumnoLabel(alumnoSeleccionado)}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted">Total Facturado</small>
                    <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#666' }}>
                      S/ {totalFacturado.toFixed(2)}
                    </div>
                  </div>
                </Col>
                <Col md={3} className="text-center">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted">Total Pagado</small>
                    <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#28a745' }}>
                      S/ {totalPagado.toFixed(2)}
                    </div>
                  </div>
                </Col>
                <Col md={3} className="text-center">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted">Saldo Pendiente</small>
                    <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#dc3545' }}>
                      S/ {totalPendiente.toFixed(2)}
                    </div>
                  </div>
                </Col>
                <Col md={3} className="text-center">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted">% Pagado</small>
                    <div
                      className="fw-bold"
                      style={{
                        fontSize: '1.5rem',
                        color: totalFacturado > 0 ? '#0066cc' : '#999'
                      }}
                    >
                      {totalFacturado > 0 ? ((totalPagado / totalFacturado) * 100).toFixed(0) : 0}%
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <Card.Title className="mb-0">💳 Historial de Pagos</Card.Title>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                </div>
              ) : pagos.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th style={{ width: '150px' }}>Fecha</th>
                        <th style={{ width: '100px' }}>Método</th>
                        <th>Operación</th>
                        <th style={{ width: '100px' }}>Estado</th>
                        <th style={{ width: '120px' }}>Monto</th>
                        <th style={{ width: '80px' }}>Detalles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagos.map((pago) => (
                        <React.Fragment key={pago.id}>
                          <tr
                            style={{
                              cursor: 'pointer',
                              backgroundColor:
                                expandedPagoId === pago.id ? '#f0f8ff' : 'transparent'
                            }}
                          >
                            <td>{new Date(pago.fecha_pago).toLocaleString('es-PE')}</td>
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
                            <td>{pago.numero_operacion || '—'}</td>
                            <td>
                              <Badge
                                bg={
                                  pago.estado === 'APROBADO'
                                    ? 'success'
                                    : pago.estado === 'RECHAZADO'
                                      ? 'danger'
                                      : 'secondary'
                                }
                              >
                                {pago.estado || 'REGISTRADO'}
                              </Badge>
                              {pago.estado === 'RECHAZADO' && pago.motivo_rechazo && (
                                <div className="mt-1 text-danger" style={{ fontSize: '0.75rem', maxWidth: '150px' }}>
                                  <strong>Motivo:</strong> {pago.motivo_rechazo}
                                </div>
                              )}
                            </td>
                            <td className="fw-bold">S/ {parseFloat(pago.monto_total_entregado).toFixed(2)}</td>
                            <td className="text-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  setExpandedPagoId(expandedPagoId === pago.id ? null : pago.id)
                                }
                              >
                                {expandedPagoId === pago.id ? '▼' : '▶'}
                              </Button>
                            </td>
                          </tr>
                          {expandedPagoId === pago.id && pago.asignaciones && (
                            <tr>
                              <td colSpan="6">
                                <div className="p-3 bg-light rounded">
                                  <h6 className="mb-3">📋 Desglose de Asignación Manual</h6>
                                  {pago.asignaciones.length > 0 ? (
                                    <div className="table-responsive">
                                      <Table size="sm" bordered className="mb-0">
                                        <thead>
                                          <tr style={{ backgroundColor: '#e7f3ff' }}>
                                            <th>Concepto</th>
                                            <th>Mes</th>
                                            <th>Vencimiento</th>
                                            <th>Monto Facturado</th>
                                            <th>Monto Aplicado</th>
                                            <th>Saldo Restante</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pago.asignaciones.map((asignacion, idx) => (
                                            <tr key={idx}>
                                              <td>
                                                <strong>{asignacion.deuda_detail?.concepto}</strong>
                                              </td>
                                              <td>
                                                {asignacion.deuda_detail?.mes
                                                  ? (() => {
                                                      const meses = [
                                                        'Enero',
                                                        'Febrero',
                                                        'Marzo',
                                                        'Abril',
                                                        'Mayo',
                                                        'Junio',
                                                        'Julio',
                                                        'Agosto',
                                                        'Septiembre',
                                                        'Octubre',
                                                        'Noviembre',
                                                        'Diciembre'
                                                      ];
                                                      return meses[
                                                        asignacion.deuda_detail.mes - 1
                                                      ];
                                                    })()
                                                  : 'Anual'}
                                              </td>
                                              <td>
                                                {asignacion.deuda_detail?.monto_total
                                                  ? '—'
                                                  : '—'}
                                              </td>
                                              <td>
                                                S/ {parseFloat(asignacion.deuda_detail?.monto_total).toFixed(2)}
                                              </td>
                                              <td className="fw-bold text-success">
                                                + S/ {parseFloat(asignacion.monto_aplicado).toFixed(2)}
                                              </td>
                                              <td>
                                                S/ {parseFloat(asignacion.deuda_detail?.saldo_pendiente).toFixed(2)}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </Table>
                                    </div>
                                  ) : (
                                    <Alert variant="warning" className="mb-0">
                                      Sin asignaciones registradas
                                    </Alert>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info" className="mb-0">
                  No hay pagos registrados para este alumno
                </Alert>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">📄 Estado de Cuenta Completo</Card.Title>
              <Button 
                variant="outline-dark" 
                size="sm"
                onClick={() => setShowModalNuevoCargo(true)}
              >
                + Nuevo Cargo
              </Button>
            </Card.Header>
            <Card.Body>
              <DataTable
                columns={deudasColumns}
                data={deudas}
                loading={loading}
                striped
                bordered
                hover
                paginated
              />
            </Card.Body>
          </Card>
          
          <ModalNuevoCargo
            show={showModalNuevoCargo}
            handleClose={() => setShowModalNuevoCargo(false)}
            alumnoId={alumnoSeleccionado.id}
            onSuccess={handleNuevoCargoSuccess}
          />
        </>
      )}
    </div>
  );
}

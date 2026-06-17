import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
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
      <div className="pagos-loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="pagos-caja-container">
      {cajaActual ? (
        cajaActual.estado === 'Abierta' ? (
          <>
            {/* Caja Abierta Card */}
            <div className="pagos-table-container" style={{ marginBottom: '20px' }}>
              <div className="pagos-deudas-header" style={{ background: '#d1fae5', borderColor: '#a7f3d0' }}>
                <div className="pagos-deudas-header-icon" style={{ background: '#10b981', color: '#fff' }}>✅</div>
                <div style={{ flex: 1 }}>
                  <h5 className="pagos-deudas-title">Caja Abierta</h5>
                  <p className="pagos-deudas-subtitle">ID: {cajaActual.id}</p>
                </div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Quicksand', fontSize: '1.3rem', fontWeight: 700, color: '#065f46' }}>
                      S/ {parseFloat(cajaActual.monto_inicial || 0).toFixed(2)}
                    </div>
                    <small style={{ color: '#6b7280', fontSize: 12, fontWeight: 600 }}>Monto Inicial</small>
                  </div>
                  {resumen && (
                    <div style={{ textAlign: 'right', borderLeft: '1px solid #a7f3d0', paddingLeft: '24px' }}>
                      <div style={{ fontFamily: 'Quicksand', fontSize: '1.3rem', fontWeight: 700, color: '#0d3b66' }}>
                        S/ {parseFloat(resumen.total_con_inicial || 0).toFixed(2)}
                      </div>
                      <small style={{ color: '#6b7280', fontSize: 12, fontWeight: 600 }}>Total en Caja</small>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <Row>
                  <Col md={6}>
                    <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
                      <strong>Fecha de Apertura:</strong><br />
                      {new Date(cajaActual.fecha_apertura).toLocaleString('es-PE')}
                    </p>
                  </Col>
                  <Col md={6} className="text-end">
                    <button
                      className="btn-registrar-pago"
                      style={{ background: '#ba1a1a' }}
                      onClick={handleCerrarCaja}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          Cerrando...
                        </>
                      ) : (
                        '🔒 Cerrar Caja'
                      )}
                    </button>
                    <button
                      className="btn-limpiar"
                      style={{ marginLeft: 8 }}
                      onClick={handleRefresh}
                      disabled={loading}
                    >
                      🔄 Actualizar
                    </button>
                  </Col>
                </Row>
              </div>
            </div>

            {resumen && (
              <>
                {/* Resumen de Ingresos */}
                <div className="pagos-table-container" style={{ marginBottom: '20px' }}>
                  <div className="pagos-deudas-header">
                    <div className="pagos-deudas-header-icon" style={{ background: 'rgba(0,149,217,0.15)', color: '#0095d9' }}>📊</div>
                    <h5 className="pagos-deudas-title">Resumen de Ingresos</h5>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <Row className="mb-4">
                      <Col md={4} className="text-center">
                        <div className="pagos-monto-card" style={{ minHeight: 'auto', padding: '16px', borderStyle: 'solid', borderColor: 'var(--surface-container-high)' }}>
                          <span className="pagos-monto-label">Monto Inicial</span>
                          <div style={{ fontFamily: 'Quicksand', fontSize: '1.5rem', fontWeight: 700, color: 'var(--outline)' }}>
                            S/ {parseFloat(resumen.monto_inicial || 0).toFixed(2)}
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="text-center">
                        <div className="pagos-monto-card" style={{ minHeight: 'auto', padding: '16px', borderStyle: 'solid', borderColor: '#a7f3d0' }}>
                          <span className="pagos-monto-label">Recaudado</span>
                          <div style={{ fontFamily: 'Quicksand', fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                            S/ {parseFloat(resumen.total_recaudado || 0).toFixed(2)}
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="text-center">
                        <div className="pagos-monto-card" style={{ minHeight: 'auto', padding: '16px', borderStyle: 'solid', borderColor: 'rgba(170,125,254,0.3)' }}>
                          <span className="pagos-monto-label">Total con Inicial</span>
                          <div style={{ fontFamily: 'Quicksand', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-container)' }}>
                            S/ {parseFloat(resumen.total_con_inicial || 0).toFixed(2)}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <h6 style={{ fontFamily: 'Quicksand', fontWeight: 700, marginBottom: 16 }}>
                      Desglose por Método de Pago
                    </h6>
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
                      <div className="pagos-instructions">
                        ℹ️ No hay transacciones registradas aún.
                      </div>
                    )}

                    <div style={{ marginTop: 12, fontSize: 13, color: 'var(--on-surface-variant)' }}>
                      <strong>Total de Pagos:</strong> {resumen.cantidad_pagos || 0}
                    </div>
                  </div>
                </div>

                {/* Últimos Pagos */}
                {pagosRecientes.length > 0 && (
                  <div className="pagos-table-container">
                    <div className="pagos-deudas-header" style={{ background: '#d1fae5' }}>
                      <div className="pagos-deudas-header-icon" style={{ background: '#10b981', color: '#fff' }}>⏰</div>
                      <h5 className="pagos-deudas-title">Últimos Pagos de Hoy</h5>
                    </div>
                    <div style={{ padding: '0' }}>
                      <div className="table-responsive">
                        <Table striped bordered hover size="sm" className="mb-0">
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
                                  <span className={`pagos-badge ${
                                    pago.metodo_pago === 'Efectivo'
                                      ? 'success'
                                      : pago.metodo_pago === 'Yape'
                                        ? 'warning'
                                        : 'info'
                                  }`}>
                                    {pago.metodo_pago}
                                  </span>
                                </td>
                                <td className="text-end fw-bold">
                                  S/ {parseFloat(pago.monto_total_entregado).toFixed(2)}
                                </td>
                                <td style={{ color: 'var(--outline)', fontSize: 13 }}>
                                  {pago.numero_operacion || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          /* Caja Cerrada */
          <div className="pagos-table-container">
            <div className="pagos-deudas-header" style={{ background: 'var(--surface-container-high)' }}>
              <div className="pagos-deudas-header-icon" style={{ background: 'var(--outline)', color: '#fff' }}>🔒</div>
              <h5 className="pagos-deudas-title">Caja Cerrada</h5>
            </div>
            <div style={{ padding: '24px' }}>
              <div className="pagos-instructions" style={{ background: 'rgba(0,149,217,0.06)', marginTop: 0, marginBottom: 16 }}>
                ℹ️ La caja fue cerrada el {new Date(cajaActual.fecha_cierre).toLocaleString('es-PE')}
              </div>
              <button
                className="btn-registrar-pago"
                onClick={() => setShowAbrirForm(true)}
              >
                🔓 Abrir Nueva Caja
              </button>
            </div>
          </div>
        )
      ) : (
        /* Sin Caja */
        <div className="pagos-table-container">
          <div className="pagos-deudas-header" style={{ background: '#fef3c7' }}>
            <div className="pagos-deudas-header-icon" style={{ background: '#f59e0b', color: '#fff' }}>ℹ️</div>
            <h5 className="pagos-deudas-title">Sin Caja Abierta</h5>
          </div>
          <div style={{ padding: '24px' }}>
            <div className="pagos-instructions" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)', color: '#92400e', marginTop: 0, marginBottom: 16 }}>
              ⚠️ No hay una caja abierta. Abre una nueva caja para comenzar a registrar pagos.
            </div>
            <button
              className="btn-registrar-pago"
              onClick={() => setShowAbrirForm(true)}
            >
              🔓 Abrir Caja
            </button>
          </div>
        </div>
      )}

      {showAbrirForm && (
        <div className="pagos-table-container" style={{ marginTop: '20px' }}>
          <div className="pagos-deudas-header">
            <div className="pagos-deudas-header-icon" style={{ background: 'rgba(52,4,138,0.15)', color: 'var(--primary-container)' }}>🏦</div>
            <h5 className="pagos-deudas-title">Abrir Nueva Caja</h5>
          </div>
          <div className="pagos-form-section" style={{ padding: '24px' }}>
            <Form onSubmit={handleAbrirCaja}>
              <Form.Group className="mb-3">
                <label className="pagos-form-label">Monto Inicial (Opcional)</label>
                <Form.Control
                  type="number"
                  value={montoInicialForm}
                  onChange={(e) => setMontoInicialForm(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                <Form.Text style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>
                  Ingresa el monto con el que inicias la caja hoy.
                </Form.Text>
              </Form.Group>

              <div className="pagos-actions" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
                <button
                  type="submit"
                  className="btn-registrar-pago"
                  style={{ background: '#10b981' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Abriendo...
                    </>
                  ) : (
                    '✅ Abrir Caja'
                  )}
                </button>
                <button
                  type="button"
                  className="btn-limpiar"
                  onClick={() => {
                    setShowAbrirForm(false);
                    setMontoInicialForm('0.00');
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

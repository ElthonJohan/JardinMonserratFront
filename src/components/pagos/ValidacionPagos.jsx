import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { getPagosPendientesAprobacion, procesarAprobacionPago, getMiEstadoCaja } from '../../api/pagosAPI';

export default function ValidacionPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cajaActiva, setCajaActiva] = useState(null);

  // Estados para Modales
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [pagoAprobar, setPagoAprobar] = useState(null);

  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [pagoRechazar, setPagoRechazar] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesando, setProcesando] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const [pagosRes, cajaRes] = await Promise.all([
        getPagosPendientesAprobacion(),
        getMiEstadoCaja()
      ]);
      
      const pagosArray = Array.isArray(pagosRes) ? pagosRes : pagosRes?.results || [];
      setPagos(pagosArray);
      
      if (cajaRes.caja && cajaRes.caja.estado === 'Abierta') {
        setCajaActiva(cajaRes.caja);
      } else {
        setCajaActiva(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los pagos pendientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleAprobar = async () => {
    if (!cajaActiva) {
      toast.error('Necesitas una caja abierta para aprobar el pago.');
      return;
    }
    setProcesando(true);
    try {
      await procesarAprobacionPago(pagoAprobar.id, {
        estado: 'APROBADO',
        caja_id: cajaActiva.id
      });
      toast.success('Pago aprobado exitosamente.');
      setShowAprobarModal(false);
      fetchDatos();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al aprobar el pago.');
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      toast.error('Debes escribir un motivo de rechazo.');
      return;
    }
    setProcesando(true);
    try {
      await procesarAprobacionPago(pagoRechazar.id, {
        estado: 'RECHAZADO',
        motivo_rechazo: motivoRechazo
      });
      toast.success('Pago rechazado y notificado al creador.');
      setShowRechazarModal(false);
      setMotivoRechazo('');
      fetchDatos();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al rechazar el pago.');
    } finally {
      setProcesando(false);
    }
  };

  const pagosFiltrados = pagos.filter((pago) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const alumnoNombre = pago.alumno_detail?.nombres?.toLowerCase() || '';
    const alumnoApellido = pago.alumno_detail?.apellidos?.toLowerCase() || '';
    const apoderadoNombre = pago.apoderado_nombre?.toLowerCase() || '';
    
    return alumnoNombre.includes(searchLower) || 
           alumnoApellido.includes(searchLower) || 
           apoderadoNombre.includes(searchLower);
  });

  return (
    <div className="validacion-pagos-container mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0">Validación de Pagos (Intranet)</Card.Title>
          <Button variant="light" size="sm" onClick={fetchDatos} disabled={loading}>
            🔄 Refrescar
          </Button>
        </Card.Header>
        <Card.Body>
          {!cajaActiva && (
             <div className="alert alert-warning">
               ⚠️ No tienes una Caja abierta en este momento. Podrás rechazar pagos, pero <strong>necesitas abrir una caja para poder Aprobarlos</strong>.
             </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Cargando pagos pendientes...</p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="🔍 Buscar por nombre de alumno o apoderado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shadow-sm border-info"
                />
              </div>
              
              {pagosFiltrados.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <h4>No se encontraron pagos</h4>
                  <p>Intenta con otra búsqueda o aún no hay pagos pendientes.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Alumno</th>
                        <th>Apoderado</th>
                        <th>Concepto</th>
                        <th>Monto</th>
                        <th>Método</th>
                        <th>Fecha</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosFiltrados.map((pago) => {
                        const alumnoNombre = pago.alumno_detail
                          ? `${pago.alumno_detail.nombres} ${pago.alumno_detail.apellidos}`
                          : `ID: ${pago.alumno}`;
                        
                        const conceptoNombre = pago.asignaciones && pago.asignaciones.length > 0
                          ? pago.asignaciones.map(a => {
                              const detail = a.deuda_detail;
                              const mesName = detail?.mes ? ` (${detail.mes})` : '';
                              return `${detail?.concepto || 'N/A'}${mesName}`;
                            }).join(', ')
                          : 'N/A';

                        return (
                          <tr key={pago.id}>
                            <td>{alumnoNombre}</td>
                            <td>{pago.apoderado_nombre || 'N/A'}</td>
                            <td>{conceptoNombre}</td>
                            <td>
                              S/ {parseFloat(pago.monto_total_entregado).toFixed(2)}
                            </td>
                            <td>
                              <Badge bg={pago.metodo_pago === 'Efectivo' ? 'success' : 'info'}>
                                {pago.metodo_pago}
                              </Badge>
                              {pago.banco_detail && (
                                <div className="mt-1 small text-muted">
                                  {pago.banco_detail.nombre}
                                </div>
                              )}
                            </td>
                            <td>
                              {new Date(pago.fecha_pago).toLocaleDateString('es-PE')}
                            </td>
                            <td className="text-center">
                              {pago.comprobante_img && (
                                <button
                                  className="btn btn-info btn-sm me-2 text-white"
                                  onClick={() => {
                                    setCurrentImage(pago.comprobante_img);
                                    setShowImageModal(true);
                                  }}
                                  title="Ver Voucher"
                                >
                                  👁
                                </button>
                              )}
                              <button
                                className="btn btn-success btn-sm me-2"
                                disabled={!cajaActiva}
                                onClick={() => {
                                  setPagoAprobar(pago);
                                  setShowAprobarModal(true);
                                }}
                                title="Aprobar Pago"
                              >
                                ✓
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  setPagoRechazar(pago);
                                  setShowRechazarModal(true);
                                }}
                                title="Rechazar Pago"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modal Ver Imagen */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Voucher del Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {currentImage && (
            <img 
              src={currentImage} 
              alt="Voucher" 
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Aprobar Pago */}
      <Modal show={showAprobarModal} onHide={() => setShowAprobarModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Confirmar Aprobación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pagoAprobar && (
            <>
              <p>¿Estás seguro de que deseas <strong>Aprobar</strong> el pago de S/ {parseFloat(pagoAprobar.monto_total_entregado).toFixed(2)}?</p>
              <p>Al aprobar, se actualizarán los saldos de la deuda del alumno y el dinero entrará en tu caja abierta actual (<strong>Caja ID: {cajaActiva?.id}</strong>).</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAprobarModal(false)} disabled={procesando}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAprobar} disabled={procesando}>
            {procesando ? <Spinner size="sm" animation="border" /> : 'Confirmar Aprobación'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Rechazar Pago */}
      <Modal show={showRechazarModal} onHide={() => setShowRechazarModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Rechazar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>El pago será rechazado y los saldos del alumno no serán descontados. Se enviará una notificación al usuario que registró el pago.</p>
          <Form.Group>
            <Form.Label className="fw-bold">Motivo del Rechazo *</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Ej. El número de operación no coincide, la imagen está borrosa, el monto depositado es incorrecto..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRechazarModal(false)} disabled={procesando}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRechazar} disabled={procesando || !motivoRechazo.trim()}>
            {procesando ? <Spinner size="sm" animation="border" /> : 'Confirmar Rechazo'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

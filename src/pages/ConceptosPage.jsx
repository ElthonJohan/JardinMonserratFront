import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Table, Modal, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { getConceptosPago, createConceptoPago, updateConceptoPago } from '../api/pagosAPI';
import { AppNavbar } from '../components/shared';

export default function ConceptosPage() {
  const [conceptos, setConceptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    tipo: 'OTROS',
    monto_base: '',
    activo: true,
  });

  const cargarConceptos = async () => {
    setLoading(true);
    try {
      const data = await getConceptosPago();
      const items = Array.isArray(data) ? data : data.results || [];
      setConceptos(items);
    } catch (error) {
      toast.error('Error al cargar los conceptos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConceptos();
  }, []);

  const handleOpenModal = (concepto = null) => {
    if (concepto) {
      setEditMode(true);
      setFormData({
        id: concepto.id,
        nombre: concepto.nombre,
        tipo: concepto.tipo,
        monto_base: concepto.monto_base,
        activo: concepto.activo,
      });
    } else {
      setEditMode(false);
      setFormData({
        id: null,
        nombre: '',
        tipo: 'OTROS',
        monto_base: '',
        activo: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.monto_base) {
      toast.error('Nombre y Monto Base son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        monto_base: parseFloat(formData.monto_base),
        activo: formData.activo
      };

      if (editMode) {
        await updateConceptoPago(formData.id, payload);
        toast.success('Concepto actualizado correctamente');
      } else {
        await createConceptoPago(payload);
        toast.success('Concepto creado correctamente');
      }
      
      handleCloseModal();
      cargarConceptos();
    } catch (error) {
      const errorMsg = error.response?.data?.nombre?.[0] || 'Error al guardar el concepto';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="conceptos-page bg-light min-vh-100">
      <AppNavbar />
      <Container className="py-4">
        <Row className="mb-4">
          <Col className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold mb-0">Gestión de Conceptos de Pago</h2>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              + Nuevo Concepto
            </Button>
          </Col>
        </Row>

        <Card className="shadow-sm border-0">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Monto Base</th>
                      <th>Estado</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conceptos.length > 0 ? (
                      conceptos.map(c => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td className="fw-medium">{c.nombre}</td>
                          <td>
                            <Badge bg="secondary">{c.tipo}</Badge>
                          </td>
                          <td>S/ {parseFloat(c.monto_base).toFixed(2)}</td>
                          <td>
                            <Badge bg={c.activo ? 'success' : 'danger'}>
                              {c.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td className="text-end">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleOpenModal(c)}
                            >
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No hay conceptos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal para Crear/Editar Concepto */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Concepto' : 'Nuevo Concepto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Concepto *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Uniforme Escolar"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo *</Form.Label>
              <Form.Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="CUOTA_INGRESO">Cuota de Ingreso (Único)</option>
                <option value="MATRICULA">Matrícula (Anual)</option>
                <option value="PENSION">Pensión (Mensual)</option>
                <option value="OTROS">Otros Pagos</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Monto Base (S/) *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="monto_base"
                value={formData.monto_base}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </Form.Group>

            {editMode && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="activo-switch"
                  name="activo"
                  label={formData.activo ? 'Concepto Activo' : 'Concepto Inactivo'}
                  checked={formData.activo}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" animation="border" /> : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

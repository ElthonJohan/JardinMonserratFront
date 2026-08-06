import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { getConceptosPago, createConceptoPago, updateConceptoPago } from '../api/pagosAPI';
import { AppNavbar, DataTable } from '../components/shared';

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

  const columns = useMemo(
    () => [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Nombre', render: (val) => <span className="fw-medium">{val}</span> },
      { key: 'tipo', label: 'Tipo', render: (val) => <Badge bg="secondary">{val}</Badge> },
      { key: 'monto_base', label: 'Monto Base', render: (val) => `S/ ${parseFloat(val).toFixed(2)}` },
      { key: 'activo', label: 'Estado', render: (val) => <Badge bg={val ? 'success' : 'danger'}>{val ? 'Activo' : 'Inactivo'}</Badge> },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_v, row) => (
          <div className="text-end">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => handleOpenModal(row)}
            >
              Editar
            </Button>
          </div>
        )
      }
    ],
    []
  );

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
            <DataTable
              columns={columns}
              data={conceptos}
              loading={loading}
              paginated={true}
            />
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
              <Select
                options={[
                  { value: 'CUOTA_INGRESO', label: 'Cuota de Ingreso (Único)' },
                  { value: 'MATRICULA', label: 'Matrícula (Anual)' },
                  { value: 'PENSION', label: 'Pensión (Mensual)' },
                  { value: 'OTROS', label: 'Otros Pagos' }
                ]}
                value={
                  [
                    { value: 'CUOTA_INGRESO', label: 'Cuota de Ingreso (Único)' },
                    { value: 'MATRICULA', label: 'Matrícula (Anual)' },
                    { value: 'PENSION', label: 'Pensión (Mensual)' },
                    { value: 'OTROS', label: 'Otros Pagos' }
                  ].find(o => o.value === formData.tipo) || null
                }
                onChange={selected => handleChange({ target: { name: 'tipo', value: selected ? selected.value : 'OTROS' } })}
                placeholder="Seleccionar..."
                isSearchable={false}
              />
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

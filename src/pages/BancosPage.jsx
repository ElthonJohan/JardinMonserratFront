import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { AppNavbar, DataTable, ErrorBoundary } from '../components/shared';
import { getBancos, createBanco, updateBanco, deleteBanco } from '../api/pagosAPI';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BancosPage = () => {
  const { user } = useAuth();
  const [bancos, setBancos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('CREATE'); // CREATE, EDIT
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    numero_cuenta: '',
    cci: '',
    activo: true
  });
  const [saving, setSaving] = useState(false);

  const fetchBancos = async () => {
    setLoading(true);
    try {
      // Pasamos false para que devuelva todos (activos e inactivos)
      const data = await getBancos(false);
      setBancos(Array.isArray(data) ? data : data?.results || []);
    } catch (error) {
      toast.error('Error al cargar la lista de bancos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBancos();
  }, []);

  const handleOpenModal = (type, banco = null) => {
    setModalType(type);
    if (banco) {
      setFormData({ ...banco });
    } else {
      setFormData({ id: null, nombre: '', numero_cuenta: '', cci: '', activo: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        numero_cuenta: formData.numero_cuenta,
        cci: formData.cci,
        activo: formData.activo
      };

      if (modalType === 'CREATE') {
        await createBanco(payload);
        toast.success('Banco creado correctamente');
      } else {
        await updateBanco(formData.id, payload);
        toast.success('Banco actualizado correctamente');
      }
      handleCloseModal();
      fetchBancos();
    } catch (error) {
      toast.error('Error al guardar el banco');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (banco) => {
    try {
      await updateBanco(banco.id, { activo: !banco.activo });
      toast.success(`Banco ${!banco.activo ? 'activado' : 'desactivado'} correctamente`);
      fetchBancos();
    } catch (error) {
      toast.error('Error al cambiar el estado del banco');
      console.error(error);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'numero_cuenta', label: 'N° Cuenta', render: (val) => val || '—' },
    { key: 'cci', label: 'CCI', render: (val) => val || '—' },
    {
      key: 'activo',
      label: 'Estado',
      render: (val) => (
        <Badge bg={val ? 'success' : 'secondary'}>
          {val ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    }
  ];

  const canEdit = user?.permissions?.includes('change_banco');
  const canAdd = user?.permissions?.includes('add_banco');

  return (
    <div className="bancos-page">
      <AppNavbar />
      <Container className="py-5" style={{ maxWidth: '1000px' }}>
        <ErrorBoundary>
          <Row className="mb-4">
            <Col className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="fw-bold">Gestión de Bancos</h1>
                <p className="text-muted">Administración de cuentas bancarias de la institución.</p>
              </div>
              <div>
                <Button 
                  variant="outline-secondary" 
                  className="me-2"
                  onClick={() => window.history.back()}
                >
                  Volver
                </Button>
                {canAdd && (
                  <Button variant="primary" onClick={() => handleOpenModal('CREATE')}>
                    + Nuevo Banco
                  </Button>
                )}
              </div>
            </Col>
          </Row>

          <Card className="shadow-sm">
            <Card.Body>
              <DataTable
                columns={columns}
                data={bancos}
                loading={loading}
                onEdit={canEdit ? (banco) => handleOpenModal('EDIT', banco) : null}
                onDelete={canEdit ? (banco) => handleToggleActive(banco) : null}
              />
              {canEdit && (
                <div className="mt-2 small text-muted text-end">
                  💡 <em>Usa el botón de la papelera / lápiz para modificar o (des)activar un banco.</em>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Modal de Creación/Edición */}
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>{modalType === 'CREATE' ? 'Nuevo Banco' : 'Editar Banco'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la Entidad *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej. BCP, BBVA, Interbank"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Número de Cuenta</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="numero_cuenta"
                    value={formData.numero_cuenta}
                    onChange={handleInputChange}
                    placeholder="193-XXXXXXX-X-XX"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>CCI</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="cci"
                    value={formData.cci}
                    onChange={handleInputChange}
                    placeholder="002-193-XXXXXXXXXXXX-1X"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check 
                    type="switch"
                    id="activo-switch"
                    label="Banco Activo (visible para registrar pagos)"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Banco'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

        </ErrorBoundary>
      </Container>
    </div>
  );
};

export default BancosPage;

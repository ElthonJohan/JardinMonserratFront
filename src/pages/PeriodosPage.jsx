import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Table, Modal, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosConfig';
import { AppNavbar } from '../components/shared';

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    anio: new Date().getFullYear(),
    fecha_inicio: '',
    fecha_fin: '',
    activo: true,
  });

  const cargarPeriodos = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/matriculas/periodos-academicos/');
      const data = response.data;
      setPeriodos(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      toast.error('Error al cargar los periodos académicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPeriodos();
  }, []);

  const handleOpenModal = (periodo = null) => {
    if (periodo) {
      setEditMode(true);
      setFormData({
        id: periodo.id,
        nombre: periodo.nombre,
        anio: periodo.anio,
        fecha_inicio: periodo.fecha_inicio,
        fecha_fin: periodo.fecha_fin,
        activo: periodo.activo,
      });
    } else {
      setEditMode(false);
      setFormData({
        id: null,
        nombre: '',
        anio: new Date().getFullYear(),
        fecha_inicio: '',
        fecha_fin: '',
        activo: true,
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
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
        anio: parseInt(formData.anio),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        activo: formData.activo
      };

      if (editMode) {
        await axiosInstance.put(`/matriculas/periodos-academicos/${formData.id}/`, payload);
        toast.success('Periodo actualizado correctamente');
      } else {
        await axiosInstance.post('/matriculas/periodos-academicos/', payload);
        toast.success('Periodo creado correctamente');
      }
      setShowModal(false);
      cargarPeriodos();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al guardar el periodo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <AppNavbar />
      <Container className="py-4">
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="fw-bold mb-0">📅 Gestión de Periodos Académicos</h2>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => handleOpenModal()}>+ Nuevo Periodo</Button>
          </Col>
        </Row>
        <Card className="shadow-sm border-0">
          <Card.Body>
            {loading ? <div className="text-center py-5"><Spinner animation="border" /></div> : (
              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="fw-bold fs-5">Periodo</th>
                    <th>Año</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Cierre</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {periodos.map(p => (
                    <tr key={p.id}>
                        <td>{p.nombre}</td>
                      <td className="fw-bold fs-5">{p.anio}</td>
                      <td>{p.fecha_inicio}</td>
                      <td>{p.fecha_fin}</td>
                      <td><Badge bg={p.activo ? 'success' : 'danger'}>{p.activo ? 'Abierto' : 'Cerrado'}</Badge></td>
                      <td className="text-end">
                        <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal(p)}>Editar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton><Modal.Title>{editMode ? 'Editar Periodo' : 'Nuevo Periodo'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Periodo *</Form.Label><Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Año Lectivo *</Form.Label><Form.Control type="number" name="anio" value={formData.anio} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Fecha de Inicio *</Form.Label><Form.Control type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Fecha de Cierre *</Form.Label><Form.Control type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Check type="switch" label={formData.activo ? 'Periodo Abierto' : 'Periodo Cerrado'} name="activo" checked={formData.activo} onChange={handleChange} /></Form.Group>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button variant="primary" type="submit" disabled={saving}>{saving ? <Spinner size="sm" animation="border" /> : 'Guardar'}</Button></Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
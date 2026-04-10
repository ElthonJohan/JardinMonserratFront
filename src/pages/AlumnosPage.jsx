import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { AppNavbar, DataTable, Loading, Modal } from '../components';
import {
  getAlumnos,
  createAlumno,
  updateAlumno,
  deleteAlumno
} from '../api';
import './AlumnosPage.css';

const AlumnosPage = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nro_matricula: '',
    dni: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    email_apoderado: '',
    nombre_apoderado: '',
    telefono_apoderado: '',
    estado: 'Activo'
  });

  // Cargar alumnos
  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    setLoading(true);
    try {
      const data = await getAlumnos();
      setAlumnos(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      toast.error('Error al cargar alumnos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Abrir modal para crear/editar
  const handleOpenModal = (alumno = null) => {
    if (alumno) {
      setEditingId(alumno.id);
      setFormData(alumno);
    } else {
      setEditingId(null);
      setFormData({
        nro_matricula: '',
        dni: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        direccion: '',
        telefono: '',
        email_apoderado: '',
        nombre_apoderado: '',
        telefono_apoderado: '',
        estado: 'Activo'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  // Guardar alumno
  const handleSaveAlumno = async () => {
    // Validación básica
    if (!formData.nombres || !formData.apellidos || !formData.dni) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateAlumno(editingId, formData);
        toast.success('Alumno actualizado correctamente');
      } else {
        await createAlumno(formData);
        toast.success('Alumno creado correctamente');
      }
      handleCloseModal();
      fetchAlumnos();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al guardar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar alumno
  const handleDeleteAlumno = async (alumno) => {
    if (window.confirm(`¿Eliminar a ${alumno.nombres} ${alumno.apellidos}?`)) {
      setLoading(true);
      try {
        await deleteAlumno(alumno.id);
        toast.success('Alumno eliminado correctamente');
        fetchAlumnos();
      } catch (error) {
        toast.error('Error al eliminar');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Columnas para la tabla
  const columns = [
    { key: 'nro_matricula', label: 'Matrícula' },
    { key: 'dni', label: 'DNI' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'telefono', label: 'Teléfono' },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span className={`badge bg-${value === 'Activo' ? 'success' : 'danger'}`}>
          {value}
        </span>
      )
    }
  ];

  // Filtrar alumnos por búsqueda
  const filteredAlumnos = alumnos.filter(alumno =>
    alumno.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.dni.includes(searchTerm)
  );

  if (loading && alumnos.length === 0) {
    return <Loading message="Cargando alumnos..." />;
  }

  return (
    <>
      <AppNavbar />
      <Container fluid className="py-4 alumnos-page">
        <Row className="mb-4">
          <Col>
            <h1>📚 Gestión de Alumnos</h1>
          </Col>
          <Col className="text-end">
            <Button
              variant="success"
              onClick={() => handleOpenModal()}
              className="btn-icon"
            >
              ➕ Nuevo Alumno
            </Button>
          </Col>
        </Row>

        <Card className="mb-4 filter-card">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Buscar</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre, apellido o DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="text-end">
                <Form.Label className="invisible">.</Form.Label>
                <p className="text-muted mb-0">
                  Total: <strong>{filteredAlumnos.length}</strong> alumnos
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <DataTable
          columns={columns}
          data={filteredAlumnos}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDeleteAlumno}
        />

        {/* Modal de Crear/Editar */}
        <Modal
          show={showModal}
          title={editingId ? 'Editar Alumno' : 'Nuevo Alumno'}
          onClose={handleCloseModal}
          onSave={handleSaveAlumno}
          loading={loading}
          size="lg"
        >
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nro. Matrícula</Form.Label>
                  <Form.Control
                    type="text"
                    name="nro_matricula"
                    value={formData.nro_matricula}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>DNI *</Form.Label>
                  <Form.Control
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos *</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre del Apoderado</Form.Label>
              <Form.Control
                type="text"
                name="nombre_apoderado"
                value={formData.nombre_apoderado}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Apoderado</Form.Label>
                  <Form.Control
                    type="email"
                    name="email_apoderado"
                    value={formData.email_apoderado}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono Apoderado</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono_apoderado"
                    value={formData.telefono_apoderado}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="Activo">Activo</option>
                <option value="Retirado">Retirado</option>
                <option value="Egresado">Egresado</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default AlumnosPage;

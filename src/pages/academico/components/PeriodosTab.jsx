import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { createPeriodo, updatePeriodo, deletePeriodo } from '../../../api/academicoAPI';

export default function PeriodosTab({ periodos, periodosAcademicos, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    periodo_matricula: '',
    fecha_inicio: '',
    fecha_fin: '',
    activo: true
  });

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        nombre: item.nombre || '',
        periodo_matricula: item.periodo_matricula || '',
        fecha_inicio: item.fecha_inicio || '',
        fecha_fin: item.fecha_fin || '',
        activo: item.activo !== undefined ? item.activo : true
      });
    } else {
      setFormData({
        nombre: '',
        periodo_matricula: '',
        fecha_inicio: '',
        fecha_fin: '',
        activo: true
      });
    }
    setShowModal(true);
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
    setLoadingForm(true);
    try {
      const payload = {
        nombre: formData.nombre,
        periodo_matricula: parseInt(formData.periodo_matricula),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        activo: formData.activo
      };
      if (editingItem) {
        await updatePeriodo(editingItem.id, payload);
        toast.success('Periodo de evaluación actualizado');
      } else {
        await createPeriodo(payload);
        toast.success('Periodo de evaluación creado');
      }
      onRefresh();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Error al guardar periodo';
      toast.error(detail);
    } finally {
      setLoadingForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este periodo de evaluación?')) {
      try {
        await deletePeriodo(id);
        toast.success('Periodo de evaluación eliminado');
        onRefresh();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar el periodo de evaluación');
      }
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4 mt-3">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold m-0 text-dark">Periodos de Evaluación</h4>
              <p className="text-muted small m-0">Administrar bimestres o trimestres lectivos</p>
            </div>
            <Button variant="success" className="rounded-3 px-4 py-2" onClick={() => handleOpenModal()}>
              + Nuevo Periodo
            </Button>
          </div>
          <Table responsive hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0">Nombre</th>
                <th className="border-0">Periodo Lectivo</th>
                <th className="border-0">Fecha Inicio</th>
                <th className="border-0">Fecha Fin</th>
                <th className="border-0 text-center">Estado</th>
                <th className="border-0 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {periodos.map((item) => {
                const periodoMat = periodosAcademicos.find(p => p.id === item.periodo_matricula);
                return (
                  <tr key={item.id}>
                    <td className="fw-semibold">{item.nombre}</td>
                    <td className="text-muted">{periodoMat ? periodoMat.nombre : 'Periodo Académico no encontrado'}</td>
                    <td>{item.fecha_inicio}</td>
                    <td>{item.fecha_fin}</td>
                    <td className="text-center">
                      <Badge bg={item.activo ? 'success' : 'secondary'} className="px-3 py-2 rounded-pill">
                        {item.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" className="rounded-3 me-2" onClick={() => handleOpenModal(item)}>
                        Editar
                      </Button>
                      <Button variant="outline-danger" size="sm" className="rounded-3" onClick={() => handleDelete(item.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {periodos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    No hay periodos de evaluación registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingItem ? 'Editar Periodo de Evaluación' : 'Crear Periodo de Evaluación'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingForm ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2 text-muted">Guardando cambios...</p>
              </div>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Periodo *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. I Bimestre, II Bimestre, Trimestre 1..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Periodo Lectivo (Matrícula) *</Form.Label>
                  <Form.Select
                    name="periodo_matricula"
                    value={formData.periodo_matricula}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione Periodo Lectivo...</option>
                    {periodosAcademicos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Inicio *</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Fin *</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    id="periodo-activo-checkbox"
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loadingForm}>
              Cancelar
            </Button>
            <Button variant="danger" type="submit" disabled={loadingForm}>
              {editingItem ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

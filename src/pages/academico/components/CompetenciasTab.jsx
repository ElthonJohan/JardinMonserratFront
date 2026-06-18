import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { createCompetencia, updateCompetencia, deleteCompetencia } from '../../../api/academicoAPI';

export default function CompetenciasTab({ competencias, areas, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  
  const [formData, setFormData] = useState({
    descripcion: '',
    area: '',
    orden: 1,
    activo: true
  });

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        descripcion: item.descripcion || '',
        area: item.area || '',
        orden: item.orden !== undefined ? item.orden : 1,
        activo: item.activo !== undefined ? item.activo : true
      });
    } else {
      setFormData({
        descripcion: '',
        area: '',
        orden: 1,
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
        descripcion: formData.descripcion,
        area: parseInt(formData.area),
        orden: parseInt(formData.orden),
        activo: formData.activo
      };
      if (editingItem) {
        await updateCompetencia(editingItem.id, payload);
        toast.success('Competencia actualizada');
      } else {
        await createCompetencia(payload);
        toast.success('Competencia creada');
      }
      onRefresh();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Error al guardar competencia';
      toast.error(detail);
    } finally {
      setLoadingForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta competencia?')) {
      try {
        await deleteCompetencia(id);
        toast.success('Competencia eliminada');
        onRefresh();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar la competencia');
      }
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4 mt-3">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold m-0 text-dark">Competencias</h4>
              <p className="text-muted small m-0">Configurar las competencias asociadas a cada área</p>
            </div>
            <Button variant="danger" className="rounded-3 px-4 py-2" onClick={() => handleOpenModal()}>
              + Nueva Competencia
            </Button>
          </div>
          <Table responsive hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0">Área</th>
                <th className="border-0">Orden</th>
                <th className="border-0">Descripción</th>
                <th className="border-0 text-center">Estado</th>
                <th className="border-0 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {competencias.map((item) => {
                const areaObj = areas.find(a => a.id === item.area);
                return (
                  <tr key={item.id}>
                    <td className="text-muted">{areaObj ? areaObj.nombre : 'Área no encontrada'}</td>
                    <td>{item.orden}</td>
                    <td className="text-wrap">{item.descripcion}</td>
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
              {competencias.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-5">
                    No hay competencias registradas.
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
            <Modal.Title>{editingItem ? 'Editar Competencia' : 'Crear Competencia'}</Modal.Title>
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
                  <Form.Label>Descripción de Competencia *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. Resuelve problemas de cantidad..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Área Académica Asociada *</Form.Label>
                  <Form.Select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione Área...</option>
                    {areas.map(a => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Orden *</Form.Label>
                  <Form.Control
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleInputChange}
                    required
                    min={1}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    id="competencia-activo-checkbox"
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

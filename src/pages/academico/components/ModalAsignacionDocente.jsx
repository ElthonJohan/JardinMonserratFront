import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner, Card } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { createAsignacion, updateAsignacion } from '../../../api/academicoAPI';

export default function ModalAsignacionDocente({
  show,
  onHide,
  editingItem,
  docentes,
  aulas,
  areas,
  periodosAcademicos,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  
  // Single edit mode form state
  const [singleForm, setSingleForm] = useState({
    docente: '',
    aula: '',
    areas: [], // Array of IDs
    periodo_matricula: '',
    activo: true
  });

  // Batch creation mode states
  const [selectedDocente, setSelectedDocente] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [selectedAulas, setSelectedAulas] = useState([]); // Array of IDs
  const [selectedAreas, setSelectedAreas] = useState([]); // Array of IDs
  const [batchActivo, setBatchActivo] = useState(true);

  // Synchronize state when modal opens or editingItem changes
  useEffect(() => {
    if (show) {
      if (editingItem) {
        setSingleForm({
          docente: editingItem.docente || '',
          aula: editingItem.aula || '',
          areas: editingItem.areas || [],
          periodo_matricula: editingItem.periodo_matricula || '',
          activo: editingItem.activo !== undefined ? editingItem.activo : true
        });
      } else {
        // Reset batch states
        setSelectedDocente('');
        setSelectedPeriodo('');
        setSelectedAulas([]);
        setSelectedAreas([]);
        setBatchActivo(true);
      }
    }
  }, [show, editingItem]);

  const handleSingleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSingleForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSingleAreaCheckboxChange = (areaId, checked) => {
    setSingleForm(prev => {
      const currentAreas = prev.areas || [];
      if (checked) {
        return { ...prev, areas: [...currentAreas, areaId] };
      } else {
        return { ...prev, areas: currentAreas.filter(id => id !== areaId) };
      }
    });
  };

  const handleAulaCheckboxChange = (aulaId, checked) => {
    setSelectedAulas(prev => {
      if (checked) {
        return [...prev, aulaId];
      } else {
        return prev.filter(id => id !== aulaId);
      }
    });
  };

  const handleAreaCheckboxChange = (areaId, checked) => {
    setSelectedAreas(prev => {
      if (checked) {
        return [...prev, areaId];
      } else {
        return prev.filter(id => id !== areaId);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        // Mode 1: Edit single assignment
        if (singleForm.areas.length === 0) {
          toast.error('Debe seleccionar al menos una Área Curricular.');
          setLoading(false);
          return;
        }

        const payload = {
          docente: parseInt(singleForm.docente),
          aula: parseInt(singleForm.aula),
          areas: singleForm.areas.map(id => parseInt(id)),
          periodo_matricula: parseInt(singleForm.periodo_matricula),
          activo: singleForm.activo
        };
        await updateAsignacion(editingItem.id, payload);
        toast.success('Asignación docente actualizada exitosamente');
        onSuccess();
        onHide();
      } else {
        // Mode 2: Batch creation
        if (!selectedDocente || !selectedPeriodo) {
          toast.error('Debe seleccionar el docente y el periodo lectivo.');
          setLoading(false);
          return;
        }

        if (selectedAulas.length === 0 || selectedAreas.length === 0) {
          toast.error('Debe seleccionar al menos una Aula y una Área Académica.');
          setLoading(false);
          return;
        }

        // Generate payloads for each selected Classroom
        const payloads = selectedAulas.map(aulaId => ({
          docente: parseInt(selectedDocente),
          aula: parseInt(aulaId),
          areas: selectedAreas.map(id => parseInt(id)),
          periodo_matricula: parseInt(selectedPeriodo),
          activo: batchActivo
        }));

        // Run creation requests in parallel
        await Promise.all(payloads.map(payload => createAsignacion(payload)));

        toast.success(`Se crearon ${payloads.length} asignaciones de aula correctamente.`);
        onSuccess();
        onHide();
      }
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Error al procesar la asignación';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size={editingItem ? 'md' : 'lg'}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? 'Editar Asignación Docente' : 'Asignación Docente Masiva'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-2 text-muted">Procesando asignaciones...</p>
            </div>
          ) : editingItem ? (
            /* ================= SINGLE EDIT FORM ================= */
            <>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Docente *</Form.Label>
                <Form.Select
                  name="docente"
                  value={singleForm.docente}
                  onChange={handleSingleInputChange}
                  required
                >
                  <option value="">Seleccione Docente...</option>
                  {docentes.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.first_name || d.last_name ? `${d.first_name} ${d.last_name}`.trim() : d.username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Aula *</Form.Label>
                <Form.Select
                  name="aula"
                  value={singleForm.aula}
                  onChange={handleSingleInputChange}
                  required
                >
                  <option value="">Seleccione Aula...</option>
                  {aulas.map(a => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Periodo Lectivo (Matrícula) *</Form.Label>
                <Form.Select
                  name="periodo_matricula"
                  value={singleForm.periodo_matricula}
                  onChange={handleSingleInputChange}
                  required
                >
                  <option value="">Seleccione Periodo...</option>
                  {periodosAcademicos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Card className="border shadow-sm rounded-3">
                  <Card.Header className="bg-light fw-bold text-dark py-2">
                    📚 Áreas Curriculares *
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }} className="p-3">
                    {areas.map(area => (
                      <Form.Group key={area.id} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          id={`edit-area-${area.id}`}
                          label={area.nombre}
                          checked={singleForm.areas.includes(area.id)}
                          onChange={e => handleSingleAreaCheckboxChange(area.id, e.target.checked)}
                        />
                      </Form.Group>
                    ))}
                  </Card.Body>
                </Card>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Activo"
                  name="activo"
                  checked={singleForm.activo}
                  onChange={handleSingleInputChange}
                  id="edit-asignacion-activo"
                />
              </Form.Group>
            </>
          ) : (
            /* ================= BATCH CREATION FORM ================= */
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Docente *</Form.Label>
                    <Form.Select
                      value={selectedDocente}
                      onChange={e => setSelectedDocente(e.target.value)}
                      required
                    >
                      <option value="">Seleccione Docente...</option>
                      {docentes.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.first_name || d.last_name ? `${d.first_name} ${d.last_name}`.trim() : d.username}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Periodo Lectivo (Matrícula) *</Form.Label>
                    <Form.Select
                      value={selectedPeriodo}
                      onChange={e => setSelectedPeriodo(e.target.value)}
                      required
                    >
                      <option value="">Seleccione Periodo...</option>
                      {periodosAcademicos.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                {/* Checkboxes Aulas */}
                <Col md={6}>
                  <Card className="border shadow-sm rounded-3">
                    <Card.Header className="bg-light fw-bold text-dark py-2">
                      🏫 Seleccionar Aulas
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '250px', overflowY: 'auto' }} className="p-3">
                      {aulas.length === 0 ? (
                        <p className="text-muted small mb-0">No hay aulas registradas.</p>
                      ) : (
                        aulas.map(aula => (
                          <Form.Group key={aula.id} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              id={`batch-aula-${aula.id}`}
                              label={aula.nombre}
                              checked={selectedAulas.includes(aula.id)}
                              onChange={e => handleAulaCheckboxChange(aula.id, e.target.checked)}
                            />
                          </Form.Group>
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Checkboxes Áreas */}
                <Col md={6}>
                  <Card className="border shadow-sm rounded-3">
                    <Card.Header className="bg-light fw-bold text-dark py-2">
                      📚 Seleccionar Áreas Curriculares
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '250px', overflowY: 'auto' }} className="p-3">
                      {areas.length === 0 ? (
                        <p className="text-muted small mb-0">No hay áreas registradas.</p>
                      ) : (
                        areas.map(area => (
                          <Form.Group key={area.id} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              id={`batch-area-${area.id}`}
                              label={area.nombre}
                              checked={selectedAreas.includes(area.id)}
                              onChange={e => handleAreaCheckboxChange(area.id, e.target.checked)}
                            />
                          </Form.Group>
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Marcar nuevas asignaciones como Activas"
                  id="batch-activo"
                  checked={batchActivo}
                  onChange={e => setBatchActivo(e.target.checked)}
                />
              </Form.Group>
              
              <div className="text-muted small">
                * Se creará la asignación del docente vinculando las áreas seleccionadas a cada aula seleccionada.
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" type="submit" disabled={loading}>
            {editingItem ? 'Actualizar' : 'Guardar Lote'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

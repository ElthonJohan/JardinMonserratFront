import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { getConceptosPago, createDeuda } from '../../api/pagosAPI';

export default function ModalNuevoCargo({ show, handleClose, alumnoId, onSuccess }) {
  const [conceptos, setConceptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    concepto: '',
    monto_total: '',
    detalle_adicional: '',
    fecha_vencimiento: new Date().toISOString().split('T')[0],
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  const [conceptoSeleccionado, setConceptoSeleccionado] = useState(null);

  useEffect(() => {
    if (show) {
      cargarConceptos();
    } else {
      // Reset form on close
      setFormData({
        concepto: '',
        monto_total: '',
        detalle_adicional: '',
        fecha_vencimiento: new Date().toISOString().split('T')[0],
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear(),
      });
      setConceptoSeleccionado(null);
    }
  }, [show]);

  const cargarConceptos = async () => {
    setLoading(true);
    try {
      const res = await getConceptosPago();
      const conceptosArray = Array.isArray(res) ? res : res?.results || [];
      // Filtrar activos
      setConceptos(conceptosArray.filter(c => c.activo));
    } catch (error) {
      toast.error('Error al cargar conceptos');
    } finally {
      setLoading(false);
    }
  };

  const handleConceptoChange = (e) => {
    const conceptId = e.target.value;
    const concept = conceptos.find(c => String(c.id) === String(conceptId));
    setConceptoSeleccionado(concept);
    
    setFormData(prev => ({
      ...prev,
      concepto: conceptId,
      monto_total: concept ? concept.monto_base : '',
      detalle_adicional: '' // Reset detail on concept change
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.concepto) {
      toast.error('Seleccione un concepto');
      return;
    }
    
    if (conceptoSeleccionado?.tipo === 'OTROS' && !formData.detalle_adicional.trim()) {
      toast.error('El detalle adicional es obligatorio para cargos de tipo OTROS');
      return;
    }

    setSaving(true);
    try {
      await createDeuda({
        alumno: alumnoId,
        concepto: formData.concepto,
        monto_total: formData.monto_total || null,
        detalle_adicional: formData.detalle_adicional,
        fecha_vencimiento: formData.fecha_vencimiento,
        mes: formData.mes,
        anio: formData.anio
      });
      
      toast.success('Cargo extra registrado correctamente');
      onSuccess();
      handleClose();
    } catch (error) {
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 
                       error.response?.data?.detalle_adicional?.[0] || 
                       'Error al registrar el cargo';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nuevo Cargo</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Concepto</Form.Label>
                <Form.Select
                  name="concepto"
                  value={formData.concepto}
                  onChange={handleConceptoChange}
                  required
                >
                  <option value="">-- Seleccione un concepto --</option>
                  {conceptos.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} (Base: S/ {c.monto_base})</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Monto Total (S/)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="monto_total"
                  value={formData.monto_total}
                  onChange={handleChange}
                  placeholder="Ej: 50.00"
                />
                <Form.Text className="text-muted">
                  Puede modificar el monto base si es necesario.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Detalle Adicional
                  {conceptoSeleccionado?.tipo === 'OTROS' && <span className="text-danger"> *</span>}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="detalle_adicional"
                  value={formData.detalle_adicional}
                  onChange={handleChange}
                  placeholder="Ej: Uniforme Talla 8, Excursión..."
                  required={conceptoSeleccionado?.tipo === 'OTROS'}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha de Vencimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving || loading}>
            {saving ? <Spinner size="sm" animation="border" /> : 'Guardar Cargo'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

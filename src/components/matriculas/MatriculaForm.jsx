import React, { useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import '../../styles/MatriculaForm.css';

const getAlumnoLabel = (a) => {
  if (!a) return '';
  const full = `${a.nombres || ''} ${a.apellidos || ''}`.trim();
  return `#${a.id} - ${full}`;
};

export default function MatriculaForm({
  formData,
  onChange,
  alumnos = [],
  aulas = []
}) {
  return (
    <Form>
      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>Alumno *</Form.Label>
            <Form.Select name="alumno" value={formData.alumno} onChange={onChange}>
              <option value="">-- Seleccionar alumno --</option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {getAlumnoLabel(a)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Año lectivo *</Form.Label>
            <Form.Control
              type="number"
              name="anio"
              value={formData.anio}
              onChange={onChange}
              min={2000}
              max={2100}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Aula *</Form.Label>
            <Form.Select name="aula" value={formData.aula} onChange={onChange}>
              <option value="">-- Seleccionar aula --</option>
              {aulas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </Form.Select>
            {/* <Form.Control
              type="text"
              value={aulas.find(a => String(a.id) === String(formData.aula))?.nombre || ''}
              readOnly
              placeholder="Seleccione un alumno para ver su aula"
            /> */}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select name="estado" value={formData.estado} onChange={onChange}>
              <option value="Activa">Activo</option>
              <option value="Trasladado">Trasladado</option>
              <option value="Retirado">Retirado</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              type="text"
              name="observaciones"
              value={formData.observaciones}
              onChange={onChange}
              placeholder="Opcional"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

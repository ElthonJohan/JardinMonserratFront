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
            <Form.Control
              type="text"
              name="aula"
              value={formData.aula}
              onChange={onChange}
              placeholder={(() => {
                // Mostrar el aula asociada al alumno seleccionado como placeholder
                // Buscar el aula asociada al alumno seleccionado
                const alumnoId = formData.alumno;
                if (!alumnoId) return '';
                // Buscar el alumno
                const alumno = alumnos.find(a => String(a.id) === String(alumnoId));
                if (!alumno || !alumno.aula) return '';
                // Si el alumno tiene un campo aula (objeto o string)
                if (typeof alumno.aula === 'object' && alumno.aula !== null) {
                  console.warn('El campo aula del alumno es un objeto, se intentará mostrar su nombre o id');
                  console.warn('Alumno:', alumno);
                  console.warn('Aula:', alumno.aula);
                  console.warn('Recomendación: revisar el backend para que el campo aula del alumno sea una referencia (id) o un string, no un objeto completo');
                  return alumno.aula.nombre || alumno.aula.id || '';
                }else{
                    
                  const aulaId = alumno.aula;
                  const aula = aulas.find(a => String(a.id) === String(aulaId));
                  return aula ? aula.nombre : '';
                
                }
                
              })()}
              readOnly
            />
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

import React, { useMemo, useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import axiosInstance from '../../api/axiosConfig';
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
  aulas = [],
  periodos = [],
}) {
  // Guardamos el objeto completo seleccionado para mantener el label
  const [selectedAlumnoOption, setSelectedAlumnoOption] = useState(null);

  // Opciones iniciales
  const alumnoOptions = useMemo(() =>
    alumnos.map(a => ({
      value: String(a.id),
      label: getAlumnoLabel(a)
    })), [alumnos]
  );

  // Cargar opciones desde el servidor
  const loadOptions = async (search) => {
    try {
      const res = await axiosInstance.get(`/estudiantes/?search=${search}`);
      const data = res.data.results || res.data;
      return data.map(a => ({
        value: String(a.id),
        label: getAlumnoLabel(a)
      }));
    } catch {
      return [];
    }
  };

  // Sincronizar cuando cambia formData.alumno (por ejemplo, al editar)
  useEffect(() => {
    if (formData.alumno) {
      const currentValue = String(formData.alumno);
      
      // Buscar en opciones iniciales
      let option = alumnoOptions.find(opt => opt.value === currentValue);
      
      // Si no está, usar el que ya tenemos guardado
      if (!option && selectedAlumnoOption?.value === currentValue) {
        option = selectedAlumnoOption;
      }
      
      // Fallback mínimo
      if (!option) {
        option = { value: currentValue, label: `#${currentValue}` };
      }
      
      setSelectedAlumnoOption(option);
    } else {
      setSelectedAlumnoOption(null);
    }
  }, [formData.alumno, alumnoOptions, selectedAlumnoOption]);

  const handleAlumnoChange = (selected) => {
    setSelectedAlumnoOption(selected);
    
    // Guardamos solo el ID en formData (como antes)
    onChange({ 
      target: { 
        name: 'alumno', 
        value: selected ? selected.value : '' 
      } 
    });
  };

  return (
    <Form>
      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>Alumno *</Form.Label>
            <AsyncSelect
              cacheOptions
              defaultOptions={alumnoOptions}
              loadOptions={loadOptions}
              placeholder="Escribe para buscar un alumno..."
              value={selectedAlumnoOption}
              onChange={handleAlumnoChange}
              isClearable
              noOptionsMessage={() => "No se encontraron alumnos"}
              loadingMessage={() => "Buscando..."}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Período académico *</Form.Label>
            <Form.Select 
              name="periodo_academico" 
              value={formData.periodo_academico} 
              onChange={onChange}
            >
              <option value="">-- Seleccionar período --</option>
              {periodos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.anio})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Aula *</Form.Label>
            <Form.Select 
              name="aula" 
              value={formData.aula} 
              onChange={onChange}
            >
              <option value="">-- Seleccionar aula --</option>
              {aulas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select 
              name="estado" 
              value={formData.estado} 
              onChange={onChange}
            >
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
              value={formData.observaciones || ''}
              onChange={onChange}
              placeholder="Opcional"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}
import React, { useMemo, useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
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

  const periodoOptions = useMemo(() => 
    periodos.map(p => ({
      value: String(p.id),
      label: `${p.nombre} (${p.anio})`
    })), [periodos]
  );

  const aulaOptions = useMemo(() => 
    aulas.map(a => ({
      value: String(a.id),
      label: a.nombre
    })), [aulas]
  );

  const estadoOptions = [
    { value: 'Activa', label: 'Activo' },
    { value: 'Trasladado', label: 'Trasladado' },
    { value: 'Retirado', label: 'Retirado' }
  ];

  const handleGenericSelectChange = (name, selected) => {
    onChange({ 
      target: { 
        name, 
        value: selected ? selected.value : '' 
      } 
    });
  };

  useEffect(() => {
    if (!formData.periodo_academico && periodos.length > 0) {
      const currentYear = new Date().getFullYear();
      let defaultPeriodo = periodos.find(p => p.anio === currentYear);
      if (!defaultPeriodo) {
        defaultPeriodo = [...periodos].sort((a, b) => b.anio - a.anio)[0];
      }
      if (defaultPeriodo) {
        onChange({
          target: {
            name: 'periodo_academico',
            value: defaultPeriodo.id
          }
        });
      }
    }
  }, [periodos, formData.periodo_academico, onChange]);

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
            <Select
              options={periodoOptions}
              value={periodoOptions.find(o => o.value === String(formData.periodo_academico)) || null}
              onChange={(selected) => handleGenericSelectChange('periodo_academico', selected)}
              placeholder="Buscar período..."
              isClearable
              noOptionsMessage={() => "No se encontraron períodos"}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Aula *</Form.Label>
            <Select
              options={aulaOptions}
              value={aulaOptions.find(o => o.value === String(formData.aula)) || null}
              onChange={(selected) => handleGenericSelectChange('aula', selected)}
              placeholder="Buscar aula..."
              isClearable
              noOptionsMessage={() => "No se encontraron aulas"}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Select
              options={estadoOptions}
              value={estadoOptions.find(o => o.value === String(formData.estado)) || estadoOptions[0]}
              onChange={(selected) => handleGenericSelectChange('estado', selected)}
              placeholder="Buscar estado..."
              isSearchable={false}
            />
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
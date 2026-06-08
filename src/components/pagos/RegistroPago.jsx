import React, { useEffect, useState, useMemo } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import AsyncSelect from 'react-select/async';
import axiosInstance from '../../api/axiosConfig';
import { DataTable } from '../shared';
import { createPago, getDeudasByAlumno, getPagosByAlumno, getBancos } from '../../api/pagosAPI';
import { useNumeroOperacionDuplicado } from '../../hooks/useNumeroOperacionDuplicado';

const getAlumnoLabel = (a) => {
  if (!a) return '';
  const full = `${a.nombres || ''} ${a.apellidos || ''}`.trim();
  return `#${a.id} - ${full}`;
};

export default function RegistroPago({
  alumnos = [],
  cajaAbierta = null,
  onPagoRegistrado = null
}) {
  const [formData, setFormData] = useState({
    alumno: '',
    banco: '',
    metodo_pago: 'Efectivo',
    numero_operacion: ''
  });

  const [bancos, setBancos] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [selectedDeudas, setSelectedDeudas] = useState([]);
  const [loadingDeudas, setLoadingDeudas] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [pagosHistorico, setPagosHistorico] = useState([]);
  const { validarDuplicado } = useNumeroOperacionDuplicado(pagosHistorico);
  const [selectedAlumnoOption, setSelectedAlumnoOption] = useState(null);

  // Opciones iniciales para el buscador de alumnos basadas en la prop 'alumnos'
  const alumnoOptions = useMemo(() =>
    alumnos.map(a => ({
      value: String(a.id),
      label: getAlumnoLabel(a),
      studentData: a
    })), [alumnos]
  );

  // Función para buscar alumnos en el servidor dinámicamente
  const loadOptions = async (search) => {
    try {
      const res = await axiosInstance.get(`/estudiantes/?search=${search}`);
      const data = res.data.results || res.data;
      return data.map(a => ({
        value: String(a.id),
        label: getAlumnoLabel(a),
        studentData: a
      }));
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        const res = await getBancos();
        const bancosArray = Array.isArray(res) ? res : res?.results || [];
        setBancos(bancosArray);
      } catch (error) {
        console.error("Error fetching bancos", error);
      }
    };
    fetchBancos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      if (name === 'metodo_pago' && ['Efectivo', 'Yape', 'Plin'].includes(value)) {
        nextData.banco = '';
      }
      if (name === 'metodo_pago' && value === 'Efectivo') {
        nextData.numero_operacion = '';
      }
      return nextData;
    });
  };

  const handleCheckboxChange = (deudaId) => {
    setSelectedDeudas(prev =>
      prev.includes(deudaId)
        ? prev.filter(id => id !== deudaId)
        : [...prev, deudaId]
    );
  };

  const handleAlumnoChange = async (selectedOption) => {
    const alumnoId = selectedOption ? selectedOption.value : '';
    setSelectedAlumnoOption(selectedOption);
    setFormData((prev) => ({ ...prev, alumno: alumnoId }));
    setSelectedDeudas([]);

    if (!alumnoId) {
      setDeudas([]);
      setAlumnoSeleccionado(null);
      setPagosHistorico([]);
      return;
    }

    setLoadingDeudas(true);
    try {
      setAlumnoSeleccionado(selectedOption.studentData);

      const [deudasRes, pagosRes] = await Promise.all([
        getDeudasByAlumno(alumnoId, false),
        getPagosByAlumno(alumnoId)
      ]);

      const deudasArray = Array.isArray(deudasRes) ? deudasRes : deudasRes?.results || [];
      const pagosArray = Array.isArray(pagosRes) ? pagosRes : pagosRes?.results || [];

      setDeudas(deudasArray);
      setPagosHistorico(pagosArray);

      if (deudasArray.length === 0) {
        toast.info('El alumno no tiene deudas pendientes', {
          icon: 'ℹ️',
          duration: 3000
        });
      }
    } catch (error) {
      toast.error('Error al cargar los datos. Intenta nuevamente.');
      console.error('Error fetching data:', error);
      setDeudas([]);
      setPagosHistorico([]);
    } finally {
      setLoadingDeudas(false);
    }
  };

  const montoTotalSeleccionado = selectedDeudas.reduce((acc, deudaId) => {
    const deuda = deudas.find(d => d.id === deudaId);
    return acc + (deuda ? parseFloat(deuda.saldo_pendiente) : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.alumno) {
      toast.error('Selecciona un alumno');
      return;
    }

    if (selectedDeudas.length === 0) {
      toast.error('Selecciona al menos una deuda para pagar');
      return;
    }

    const requiereBanco = ['Transferencia', 'Depósito'].includes(formData.metodo_pago);
    if (requiereBanco && !formData.banco) {
      toast.error('El banco es obligatorio para transferencias o depósitos');
      return;
    }

    if (formData.metodo_pago !== 'Efectivo' && !formData.numero_operacion.trim()) {
      toast.error('El número de operación es obligatorio para pagos no en efectivo');
      return;
    }

    if (formData.numero_operacion && validarDuplicado(formData.numero_operacion)) {
      toast.error('❌ Este número de operación ya fue registrado para este alumno');
      return;
    }

    setLoadingPago(true);
    try {
      const detalles_pago = selectedDeudas.map(id => {
        const deuda = deudas.find(d => d.id === id);
        return {
          deuda_id: id,
          monto_asignado: parseFloat(deuda.saldo_pendiente)
        };
      });

      const payloadData = {
        alumno: parseInt(formData.alumno),
        monto_total_entregado: montoTotalSeleccionado,
        metodo_pago: formData.metodo_pago,
        detalles_pago: detalles_pago
      };

      if (cajaAbierta && cajaAbierta.id) {
        payloadData.caja = cajaAbierta.id;
      }

      if (formData.metodo_pago !== 'Efectivo' && formData.banco) {
        payloadData.banco = parseInt(formData.banco);
      }

      if (formData.numero_operacion.trim()) {
        payloadData.numero_operacion = formData.numero_operacion.trim();
      }

      const result = await createPago(payloadData);

      toast.success(
        `Pago registrado correctamente. Estado: ${result.estado || 'REGISTRADO'}`
      );

      setFormData({
        alumno: '',
        banco: '',
        metodo_pago: 'Efectivo',
        numero_operacion: ''
      });
      setDeudas([]);
      setSelectedDeudas([]);
      setAlumnoSeleccionado(null);
      setSelectedAlumnoOption(null);
      setPagosHistorico([]);

      if (onPagoRegistrado) {
        onPagoRegistrado();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.numero_operacion?.[0] ||
        error.response?.data?.detail ||
        'Error al registrar el pago';
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoadingPago(false);
    }
  };

  const deudasColumns = [
    {
      key: 'select',
      label: 'Acción',
      render: (_, row) => {
        const isSelected = selectedDeudas.includes(row.id);
        return (
          <div className="text-center">
            <Button
              variant={isSelected ? "success" : "outline-primary"}
              size="sm"
              onClick={() => handleCheckboxChange(row.id)}
              className="fw-bold"
              style={{ minWidth: '110px' }}
            >
              {isSelected ? "✓ Seleccionado" : "Seleccionar"}
            </Button>
          </div>
        );
      }
    },
    {
      key: 'concepto_detail',
      label: 'Concepto',
      render: (val, row) => {
        const index = deudas.findIndex(d => d.id === row.id);
        const numero = index !== -1 ? `${index + 1}` : '';
        const nombre = val?.nombre || 'N/A';
        const displayNombre = row.detalle_adicional ? `${nombre} - ${row.detalle_adicional}` : nombre;
        return `${numero}. ${displayNombre}`;
      }
    },
    {
      key: 'mes',
      label: 'Mes',
      render: (val) => {
        if (!val) return 'Anual';
        const meses = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[val - 1] || val;
      }
    },
    {
      key: 'monto_total',
      label: 'Monto',
      render: (val) => `S/ ${parseFloat(val).toFixed(2)}`
    },
    {
      key: 'saldo_pendiente',
      label: 'Saldo Pendiente',
      render: (val) => `S/ ${parseFloat(val).toFixed(2)}`
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => (
        <span className={`badge bg-${val === 'Pendiente' ? 'danger' : val === 'Parcial' ? 'warning' : 'success'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="registro-pago-container">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Alumno <span style={{ color: 'red' }}>*</span></Form.Label>
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
              <Form.Label>Monto a Pagar</Form.Label>
              <div className="p-2 bg-light border border-success rounded d-flex align-items-center justify-content-center">
                <span className="fw-bold text-success" style={{ fontSize: '1.25rem' }}>
                  S/ {montoTotalSeleccionado.toFixed(2)}
                </span>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Método de Pago <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Select
                name="metodo_pago"
                value={formData.metodo_pago}
                onChange={handleInputChange}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Depósito">Depósito</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Banco Destino <span style={{ color: 'red' }}>{['Transferencia', 'Depósito'].includes(formData.metodo_pago) && '*'}</span></Form.Label>
              <Form.Select
                name="banco"
                value={formData.banco}
                onChange={handleInputChange}
                disabled={['Efectivo', 'Yape', 'Plin'].includes(formData.metodo_pago)}
              >
                <option value="">-- Seleccionar banco --</option>
                {bancos.map(b => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                Número de Operación <span style={{ color: 'red' }}>{formData.metodo_pago !== 'Efectivo' && '*'}</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="numero_operacion"
                value={formData.numero_operacion}
                onChange={handleInputChange}
                placeholder={formData.metodo_pago === 'Efectivo' ? 'No requerido' : 'Ingresa el número'}
                disabled={formData.metodo_pago === 'Efectivo'}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mb-3 d-flex gap-2">
          <Button
            variant="primary"
            type="submit"
            disabled={loadingPago || selectedDeudas.length === 0}
          >
            {loadingPago ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Registrando...
              </>
            ) : (
              'Registrar Pago'
            )}
          </Button>
          <Button
            variant="secondary"
            type="reset"
            onClick={() => {
              setFormData({
                alumno: '',
                banco: '',
                metodo_pago: 'Efectivo',
                numero_operacion: ''
              });
              setDeudas([]);
              setSelectedDeudas([]);
              setAlumnoSeleccionado(null);
              setSelectedAlumnoOption(null);
            }}
          >
            Limpiar
          </Button>
        </div>
      </Form>

      {alumnoSeleccionado && (
        <div className="mt-4">
          <h5>Deudas Pendientes de {getAlumnoLabel(alumnoSeleccionado)}</h5>
          <DataTable
            columns={deudasColumns}
            data={deudas}
            loading={loadingDeudas}
            striped
            bordered
            hover
          />
          {!loadingDeudas && deudas.length > 0 && (
            <div className="alert alert-info mt-3">
              💡 <strong>Instrucciones:</strong> Marca las deudas que deseas pagar. El monto total se calculará automáticamente y el pago entrará en revisión.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

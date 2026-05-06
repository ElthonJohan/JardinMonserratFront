import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { DataTable } from '../shared';
import { createPago, getDeudasByAlumno, getPagosByAlumno } from '../../api/pagosAPI';
import { useNumeroOperacionDuplicado } from '../../hooks/useNumeroOperacionDuplicado';

const getAlumnoLabel = (a) => {
  if (!a) return '';
  const full = `${a.nombres || ''} ${a.apellidos || ''}`.trim();
  return `#${a.id} - ${full}`;
};

export default function RegistroPago({
  alumnos = [],
  cajaAbierta = false,
  onPagoRegistrado = null
}) {
  const [formData, setFormData] = useState({
    alumno: '',
    monto_total_entregado: '',
    metodo_pago: 'Efectivo',
    numero_operacion: ''
  });

  const [deudas, setDeudas] = useState([]);
  const [loadingDeudas, setLoadingDeudas] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [pagosHistorico, setPagosHistorico] = useState([]);
  const { validarDuplicado } = useNumeroOperacionDuplicado(pagosHistorico);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAlumnoChange = async (e) => {
    const alumnoId = e.target.value;
    setFormData((prev) => ({ ...prev, alumno: alumnoId }));

    if (!alumnoId) {
      setDeudas([]);
      setAlumnoSeleccionado(null);
      setPagosHistorico([]);
      return;
    }

    setLoadingDeudas(true);
    try {
      const alumno = alumnos.find((a) => String(a.id) === String(alumnoId));
      setAlumnoSeleccionado(alumno);

      const [deudasRes, pagosRes] = await Promise.all([
        getDeudasByAlumno(alumnoId, false),
        getPagosByAlumno(alumnoId)
      ]);

      const deudasArray = Array.isArray(deudasRes) ? deudasRes : deudasRes?.results || [];
      const pagosArray = Array.isArray(pagosRes) ? pagosRes : pagosRes?.results || [];

      setDeudas(deudasArray);
      setPagosHistorico(pagosArray);

      if (deudasArray.length === 0) {
        toast.info('El alumno no tiene deudas pendientes');
      }
    } catch (error) {
      toast.error('Error al cargar datos del alumno');
      console.error(error);
      setDeudas([]);
      setPagosHistorico([]);
    } finally {
      setLoadingDeudas(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.alumno) {
      toast.error('Selecciona un alumno');
      return;
    }

    if (!formData.monto_total_entregado || parseFloat(formData.monto_total_entregado) <= 0) {
      toast.error('Ingresa un monto válido mayor a cero');
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
      const payloadData = {
        alumno: parseInt(formData.alumno),
        monto_total_entregado: parseFloat(formData.monto_total_entregado),
        metodo_pago: formData.metodo_pago
      };

      if (formData.numero_operacion.trim()) {
        payloadData.numero_operacion = formData.numero_operacion.trim();
      }

      const result = await createPago(payloadData);

      toast.success(
        `Pago registrado correctamente. Monto aplicado: S/ ${result.monto_aplicado || result.monto_total_entregado}`
      );

      setFormData({
        alumno: '',
        monto_total_entregado: '',
        metodo_pago: 'Efectivo',
        numero_operacion: ''
      });
      setDeudas([]);
      setAlumnoSeleccionado(null);
      setPagosHistorico([]);

      if (onPagoRegistrado) {
        onPagoRegistrado();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.numero_operacion?.[0] ||
        error.response?.data?.caja?.[0] ||
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
      key: 'concepto_detail',
      label: 'Concepto',
      render: (val) => val?.nombre || 'N/A'
    },
    {
      key: 'mes',
      label: 'Mes',
      render: (val) => {
        if (!val) return 'Anual';
        const meses = [
          'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
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
      {!cajaAbierta && (
        <Alert variant="warning" className="mb-4">
          ⚠️ La caja no está abierta. Abre una caja para registrar pagos.
        </Alert>
      )}

      <Form onSubmit={handleSubmit} disabled={!cajaAbierta}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Alumno *</Form.Label>
              <Form.Select
                name="alumno"
                value={formData.alumno}
                onChange={handleAlumnoChange}
                disabled={!cajaAbierta}
              >
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
              <Form.Label>Monto Entregado *</Form.Label>
              <Form.Control
                type="number"
                name="monto_total_entregado"
                value={formData.monto_total_entregado}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={!cajaAbierta}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Método de Pago *</Form.Label>
              <Form.Select
                name="metodo_pago"
                value={formData.metodo_pago}
                onChange={handleInputChange}
                disabled={!cajaAbierta}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Depósito">Depósito</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Número de Operación
                {formData.metodo_pago !== 'Efectivo' && ' *'}
              </Form.Label>
              <Form.Control
                type="text"
                name="numero_operacion"
                value={formData.numero_operacion}
                onChange={handleInputChange}
                placeholder={formData.metodo_pago === 'Efectivo' ? 'No requerido' : 'Ingresa el número'}
                disabled={!cajaAbierta}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mb-3 d-flex gap-2">
          <Button
            variant="primary"
            type="submit"
            disabled={!cajaAbierta || loadingPago}
          >
            {loadingPago ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Registrando...
              </>
            ) : (
              '✅ Registrar Pago'
            )}
          </Button>
          <Button
            variant="secondary"
            type="reset"
            onClick={() => {
              setFormData({
                alumno: '',
                monto_total_entregado: '',
                metodo_pago: 'Efectivo',
                numero_operacion: ''
              });
              setDeudas([]);
              setAlumnoSeleccionado(null);
            }}
            disabled={!cajaAbierta}
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
              💡 <strong>Nota:</strong> El sistema distribuirá el pago automáticamente (FIFO)
              a las deudas más antiguas primero.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

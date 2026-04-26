import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import '../styles/MatriculasPage.css';
import MatriculaForm from '../components/matriculas/MatriculaForm';
import MatriculaTable from '../components/matriculas/MatriculaTable';
import { AppNavbar, Loading, Modal } from '../components/shared';
import { buildComprobanteMatriculaHtml } from '../utils/matriculaComprobante';
import {
  createMatricula,
  deleteMatricula,
  
  getMatriculas,
  updateMatricula
} from '../api/matriculasAPI';

import { getEstudiantes } from '../api/estudiantesAPI';
import { getAulas } from '../api/estudiantesAPI';


export default function MatriculasPage() {
  const [loading, setLoading] = useState(false);

  const [matriculas, setMatriculas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [aulas, setAulas] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [showMatriculaModal, setShowMatriculaModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);

  const [selectedMatricula, setSelectedMatricula] = useState(null);
  const [editingMatriculaId, setEditingMatriculaId] = useState(null);

  const currentYear = new Date().getFullYear();

  const [matriculaForm, setMatriculaForm] = useState({
    alumno: '',
    aula: '',
    anio: currentYear,
    estado: 'Activa',
    observaciones: ''
  });

  const handleMatriculaInputChange = (e) => {
    const { name, value } = e.target;
    setMatriculaForm((p) => ({ ...p, [name]: value }));
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mRes, aRes, aulasRes] = await Promise.all([
        getMatriculas(),
        getEstudiantes(),
        getAulas()
      ]);

      const toArray = (res) => (Array.isArray(res) ? res : res?.results || []);

      setMatriculas(toArray(mRes));
      setAlumnos(toArray(aRes));
      setAulas(toArray(aulasRes));
    } catch (e) {
      toast.error('Error al cargar datos de matrículas');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMatriculas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matriculas;

    return matriculas.filter((m) => {
      const alumno = m.alumno_detail;
      const full = alumno ? `${alumno.nombres} ${alumno.apellidos}`.toLowerCase() : '';
      const aula = m.aula_detail?.nombre?.toLowerCase?.() || '';
      const anio = String(m.anio || '');
      return full.includes(term) || aula.includes(term) || anio.includes(term);
    });
  }, [matriculas, searchTerm]);

  const handleOpenNewMatricula = () => {
    setEditingMatriculaId(null);
    setMatriculaForm({
      alumno: '',
      aula: '',
      anio: currentYear,
      estado: 'Activa',
      observaciones: ''
    });
    setShowMatriculaModal(true);
  };

  const handleEditMatricula = (m) => {
    setEditingMatriculaId(m?.id || null);
    setMatriculaForm({
      alumno: m?.alumno ?? '',
      aula: m?.aula ?? '',
      anio: m?.anio ?? currentYear,
      estado: m?.estado ?? 'Activa',
      observaciones: m?.observaciones ?? ''
    });
    setShowMatriculaModal(true);
  };

  const handleDeleteMatricula = async (m) => {
    const id = m?.id;
    if (!id) return;

    const alumnoNombre = m?.alumno_detail ? `${m.alumno_detail.nombres || ''} ${m.alumno_detail.apellidos || ''}`.trim() : '';
    const aulaNombre = m?.aula_detail?.nombre || '';
    const msg = `¿Eliminar la matrícula${alumnoNombre ? ` de ${alumnoNombre}` : ''}${aulaNombre ? ` (${aulaNombre})` : ''}?`;

    // Confirmación simple (sin UI extra)
    if (!window.confirm(msg)) return;

    setLoading(true);
    try {
      await deleteMatricula(id);
      toast.success('Matrícula eliminada');

      if (selectedMatricula?.id === id) {
        setShowDetalleModal(false);
        setSelectedMatricula(null);
      }

      fetchAll();
    } catch (e) {
      const data = e?.response?.data;
      const err = data?.detail || 'Error al eliminar matrícula';
      toast.error(err);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMatricula = async () => {
    if (!matriculaForm.alumno || !matriculaForm.aula || !matriculaForm.anio) {
      toast.error('Completa alumno, aula y año');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...matriculaForm,
        anio: Number(matriculaForm.anio)
      };

      if (editingMatriculaId) {
        await updateMatricula(editingMatriculaId, payload);
        toast.success('Matrícula actualizada');
      } else {
        await createMatricula(payload);
        toast.success('Matrícula registrada');
      }

      setShowMatriculaModal(false);
      setEditingMatriculaId(null);
      fetchAll();
    } catch (e) {
      const data = e?.response?.data;
      const msg = data?.non_field_errors?.[0] || data?.detail || 'Error al registrar matrícula';
      toast.error(msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatricula = (m) => {
    setSelectedMatricula(m);
    setShowDetalleModal(true);
  };

  const handleComprobante = (m) => {
    try {
      const html = buildComprobanteMatriculaHtml(m);
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('El navegador bloqueó la ventana emergente');
        return;
      }
      win.document.open();
      win.document.write(html);
      win.document.close();
    } catch (e) {
      toast.error('No se pudo generar el comprobante');
      console.error(e);
    }
  };

  if (loading && matriculas.length === 0) {
    return <Loading message="Cargando matrículas..." />;
  }

  return (
    <>
      <AppNavbar />
      <Container fluid className="py-4">
        <Row className="mb-3 align-items-center">
          <Col>
            <h1>📝 Gestión de Matrículas</h1>
            <p className="text-muted mb-0">Registrar matrícula y comprobante</p>
          </Col>
          <Col className="text-end">
            <Button variant="success" onClick={handleOpenNewMatricula}>
              ➕ Nueva Matrícula
            </Button>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Buscar</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Alumno, aula o año..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="text-end">
                <Form.Label className="invisible">.</Form.Label>
                <div className="text-muted">
                  Total: <strong>{filteredMatriculas.length}</strong>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <MatriculaTable
          data={filteredMatriculas}
          loading={loading}
          onView={handleViewMatricula}
          onEdit={handleEditMatricula}
          onDelete={handleDeleteMatricula}
          aulas={aulas}
        />

        <Modal
          show={showMatriculaModal}
          title={editingMatriculaId ? 'Editar Matrícula' : 'Nueva Matrícula'}
          onClose={() => setShowMatriculaModal(false)}
          onSave={handleSaveMatricula}
          loading={loading}
          size="lg"
          saveText={editingMatriculaId ? 'Actualizar' : 'Guardar'}
          saveVariant={editingMatriculaId ? 'warning' : 'primary'}
        >
          <MatriculaForm
            formData={matriculaForm}
            onChange={handleMatriculaInputChange}
            alumnos={alumnos}
            aulas={aulas}
          />
        </Modal>

        <Modal
          show={showDetalleModal}
          title="Detalle de matrícula"
          onClose={() => setShowDetalleModal(false)}
          onSave={null}
          loading={loading}
          size="lg"
        >
          {selectedMatricula ? (
            <div>
              <p className="mb-1">
                <strong>Alumno:</strong>{' '}
                {selectedMatricula.alumno_detail
                  ? `${selectedMatricula.alumno_detail.nombres} ${selectedMatricula.alumno_detail.apellidos}`
                  : selectedMatricula.alumno}
              </p>
              <p className="mb-1">
                <strong>ID Estudiante:</strong> {selectedMatricula.alumno_detail?.id || selectedMatricula.alumno || '-'}
              </p>
              <p className="mb-1">
                <strong>Aula:</strong> {selectedMatricula.aula_detail?.nombre || '-'}
              </p>
              <p className="mb-3">
                <strong>Año:</strong> {selectedMatricula.anio} &nbsp; <strong>Estado:</strong> {selectedMatricula.estado}
              </p>

              <div className="d-flex gap-2 flex-wrap">
                <Button variant="primary" onClick={() => handleComprobante(selectedMatricula)}>
                  🧾 Comprobante
                </Button>
              </div>
            </div>
          ) : null}
        </Modal>
      </Container>
    </>
  );
}

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { deleteAsignacion } from '../../../api/academicoAPI';
import ModalAsignacionDocente from './ModalAsignacionDocente';
import { exportAsignacionesToExcel, exportAsignacionesToPdf } from './asignacionExportTemplates';
import { DataTable } from '../../../components/shared';

export default function AsignacionesTab({
  asignaciones,
  docentes,
  aulas,
  areas,
  periodosAcademicos,
  onRefresh
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta asignación?')) {
      try {
        await deleteAsignacion(row.id);
        toast.success('Asignación docente eliminada');
        onRefresh();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar la asignación docente');
      }
    }
  };

  const columns = useMemo(() => [
    {
      key: 'docente',
      label: 'Docente',
      render: (_, row) => row.docente_nombre || 'Docente no asignado'
    },
    {
      key: 'aula',
      label: 'Aula',
      render: (_, row) => row.aula_nombre || 'Aula no definida'
    },
    {
      key: 'area',
      label: 'Área',
      render: (_, row) => (row.areas_detalle && row.areas_detalle.map(a => a.nombre).join(', ')) || 'Sin áreas'
    },
    {
      key: 'periodo',
      label: 'Periodo Académico',
      render: (_, row) => row.periodo_nombre || 'Periodo no definido'
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => (
        <Badge bg={row.activo ? 'success' : 'secondary'} className="px-3 py-2 rounded-pill">
          {row.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    }
  ], []);

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4 mt-3">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 className="fw-bold m-0 text-dark">Lista de Asignaciones</h4>
              <p className="text-muted small m-0">Asignar docentes a aulas y áreas específicas por periodo</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button className="btn-nueva-matricula" onClick={() => handleOpenModal(null)}>
                ➕ Nueva Asignación
              </Button>
              <Button variant="success" className="d-flex align-items-center gap-2" style={{ borderRadius: '8px', fontWeight: 500 }} onClick={() => exportAsignacionesToExcel(asignaciones)}>
                📊 Exportar Excel
              </Button>
              <Button variant="danger" className="d-flex align-items-center gap-2" style={{ borderRadius: '8px', fontWeight: 500 }} onClick={() => exportAsignacionesToPdf(asignaciones)}>
                📄 Exportar PDF
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={asignaciones}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            paginated={true}
          />
        </Card.Body>
      </Card>

      <ModalAsignacionDocente
        show={showModal}
        onHide={() => setShowModal(false)}
        editingItem={editingItem}
        docentes={docentes}
        aulas={aulas}
        areas={areas}
        periodosAcademicos={periodosAcademicos}
        onSuccess={onRefresh}
      />
    </>
  );
}

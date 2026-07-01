import React, { useState } from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { deleteAsignacion } from '../../../api/academicoAPI';
import ModalAsignacionDocente from './ModalAsignacionDocente';

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

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta asignación?')) {
      try {
        await deleteAsignacion(id);
        toast.success('Asignación docente eliminada');
        onRefresh();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar la asignación docente');
      }
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4 mt-3">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold m-0 text-dark">Lista de Asignaciones</h4>
              <p className="text-muted small m-0">Asignar docentes a aulas y áreas específicas por periodo</p>
            </div>
            <Button variant="success" className="rounded-3 px-4 py-2" onClick={() => handleOpenModal(null)}>
              + Nueva Asignación
            </Button>
          </div>
          <Table responsive hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0">Docente</th>
                <th className="border-0">Aula</th>
                <th className="border-0">Área</th>
                <th className="border-0">Periodo Académico</th>
                <th className="border-0 text-center">Estado</th>
                <th className="border-0 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((item) => (
                <tr key={item.id}>
                  <td>{item.docente_nombre || 'Docente no asignado'}</td>
                  <td>{item.aula_nombre || 'Aula no definida'}</td>
                  <td>{item.areas_detalle && item.areas_detalle.map(a => a.nombre).join(', ') || 'Sin áreas'}</td>
                  <td>{item.periodo_nombre || 'Periodo no definido'}</td>
                  <td className="text-center">
                    <Badge bg={item.activo ? 'success' : 'secondary'} className="px-3 py-2 rounded-pill">
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button variant="outline-primary" size="sm" className="rounded-3 me-2" onClick={() => handleOpenModal(item)}>
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" className="rounded-3" onClick={() => handleDelete(item.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {asignaciones.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    No hay asignaciones docentes registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
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

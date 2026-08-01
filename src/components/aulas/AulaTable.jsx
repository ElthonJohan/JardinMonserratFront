import React, { useMemo } from 'react';
import { DataTable } from '../shared';

export default function AulaTable({ data, onEdit, onDelete }) {
  const columns = useMemo(
    () => [
      {
        key: 'nombre',
        label: 'Nombre'
      },
      {
        key: 'capacidad',
        label: 'Capacidad'
      }
    ],
    []
  );

  return (
    <div className="card-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Lista de Aulas 🎈</h5>
      </div>
      <DataTable
        columns={columns}
        data={data}
        onEdit={onEdit}
        onDelete={(row) => onDelete(row.id)}
        paginated={true}
      />
    </div>
  );
}

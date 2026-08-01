import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { DataTable } from '../shared';

export default function ApoderadoTable({ data, onEdit, onDelete, onResetPassword }) {
  const columns = useMemo(
    () => [
      { key: 'nombres', label: 'Nombre' },
      { key: 'apellidos', label: 'Apellidos' },
      { key: 'dni', label: 'DNI' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'email', label: 'Email' },
      { key: 'direccion', label: 'Dirección' },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_v, row) => (
          <div className="d-flex gap-2 justify-content-center">
            {onEdit && (
              <Button
                variant="warning"
                size="sm"
                onClick={() => onEdit(row)}
                title="Editar"
              >
                ✏️
              </Button>
            )}
            {onResetPassword && (
              <Button
                variant="info"
                size="sm"
                onClick={() => onResetPassword(row)}
                title="Restablecer contraseña"
              >
                🔑
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(row.id)}
                title="Eliminar"
              >
                🗑️
              </Button>
            )}
          </div>
        )
      }
    ],
    [onEdit, onDelete, onResetPassword]
  );

  return (
    <div className="card p-3">
      <h5>Lista de Apoderados</h5>
      <DataTable
        columns={columns}
        data={data}
        paginated={true}
      />
    </div>
  );
}
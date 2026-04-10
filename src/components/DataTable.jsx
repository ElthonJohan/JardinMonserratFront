import React from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import './Table.css';

const DataTable = ({
  columns = [], // Array de { key, label, render? }
  data = [],
  loading = false,
  onEdit = null,
  onDelete = null,
  onView = null,
  className = '',
  striped = true,
  bordered = true,
  hover = true
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className={`table-responsive ${className}`}>
      <Table striped={striped} bordered={bordered} hover={hover} className="mb-0">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete || onView) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={`${row.id || idx}-${col.key}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete || onView) && (
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    {onView && (
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => onView(row)}
                        title="Ver detalles"
                      >
                        👁️
                      </Button>
                    )}
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
                    {onDelete && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(row)}
                        title="Eliminar"
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;

import React, { useState } from 'react';
import { Table, Button, Spinner, Form } from 'react-bootstrap';
import './DataTable.css';

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
  hover = true,
  paginated = false,
  defaultPageSize = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

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

  // Paginación del lado del cliente
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const displayedData = paginated ? data.slice(startIndex, endIndex) : data;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={`table-container ${className}`}>
      {paginated && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span>Mostrar</span>
            <Form.Select
              size="sm"
              style={{ width: '80px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
            <span>registros</span>
          </div>
        </div>
      )}

      <div className="table-responsive">
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
            {displayedData.map((row, idx) => (
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

      {paginated && (
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <div className="text-muted small">
            Mostrando {startIndex + 1} a {endIndex} de {totalItems} registros
          </div>
          <div className="d-flex gap-1">
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            >
              « Primero
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ‹ Ant.
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
              .map((p, idx, arr) => {
                const isGap = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <React.Fragment key={p}>
                    {isGap && <span className="px-2 align-self-end">...</span>}
                    <Button
                      variant={currentPage === p ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  </React.Fragment>
                );
              })}
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Sig. ›
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              Último »
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

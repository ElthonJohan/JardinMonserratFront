import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { DataTable } from '../shared';

export default function EstudianteTable({
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onMatricula,
  onApoderados,
}) {
  const getApoderadoDisplay = (estudiante) => {
    const lista = estudiante.apoderados || estudiante.apoderados_detail || [];
    if (lista.length === 0) return null;
    const principal = lista.find((rel) => rel.es_principal) || lista[0];
    const info = principal.apoderado;
    if (!info) return null;
    return { nombre: `${info.nombres} ${info.apellidos}`, tipo: principal.tipo_relacion || "Relación" };
  };

  const columns = useMemo(
    () => [
      {
        key: 'codigo',
        label: 'Código',
        render: (_v, row) => row.codigo_estudiante || "—"
      },
      {
        key: 'nombres',
        label: 'Nombres',
        render: (_v, row) => row.nombres
      },
      {
        key: 'apellidos',
        label: 'Apellidos',
        render: (_v, row) => row.apellidos
      },
      {
        key: 'dni',
        label: 'DNI',
        render: (_v, row) => row.dni || "—"
      },
      {
        key: 'fecha_nacimiento',
        label: 'Fecha Nacimiento',
        render: (_v, row) => row.fecha_nacimiento || "—"
      },
      {
        key: 'apoderado',
        label: 'Apoderado Principal',
        render: (_v, row) => {
          const apo = getApoderadoDisplay(row);
          return (
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div>
                {apo ? (
                  <>
                    <span>{apo.nombre}</span>{' '}
                    <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>{apo.tipo}</span>
                  </>
                ) : (
                  <span className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.9em' }}>Sin apoderado</span>
                )}
              </div>
              {onApoderados && (
                <Button 
                  size="sm" 
                  variant="outline-primary" 
                  style={{ padding: '0.1rem 0.4rem', fontSize: '0.8rem' }}
                  onClick={() => onApoderados(row)} 
                  title="Gestionar Apoderados"
                >
                  👥 Apo
                </Button>
              )}
            </div>
          );
        }
      }
    ],
    [onApoderados]
  );

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      loading={loading} 
      onView={onMatricula} 
      onEdit={onEdit} 
      onDelete={(row) => onDelete(row.id)} 
      paginated={true}
    />
  );
}
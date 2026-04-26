import React, { useMemo } from 'react';
import { DataTable } from '../shared';
import '../../styles/MatriculaTable.css';

export default function MatriculaTable({
  data = [],
  loading = false,
  onView = null,
  onEdit = null,
  onDelete = null,
  aulas = []
}) {
  const aulaById = useMemo(() => {
    const map = new Map();
    (aulas || []).forEach((a) => map.set(String(a.id), a.nombre));
    return map;
  }, [aulas]);

  const columns = useMemo(
    () => [
      {
        key: 'alumno',
        label: 'Alumno',
        render: (_v, row) => {
          const a = row.alumno_detail;
          return a ? `${a.nombres} ${a.apellidos}` : row.alumno;
        }
      },
      {
        key: 'alumno_id',
        label: 'ID',
        render: (_v, row) => row.alumno_detail?.id || row.alumno || '-'
      },
      {
        key: 'aula',
        label: 'Aula',
        render: (_v, row) => row.aula_detail?.nombre || aulaById.get(String(row.aula)) || '-'
      },
      { key: 'anio', label: 'Año' },
      {
        key: 'fecha_matricula',
        label: 'Fecha',
        render: (value) => (value ? String(value).slice(0, 10) : '-')
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => (
          <span className={`badge bg-${value === 'Activa' ? 'success' : value === 'Retirado' ? 'danger' : 'secondary'}`}>
            {value}
          </span>
        )
      }
    ],
    [aulaById]
  );

  return <DataTable columns={columns} data={data} loading={loading} onView={onView} onEdit={onEdit} onDelete={onDelete} />;
}

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
          const initials = a 
            ? (a.nombres?.[0] + a.apellidos?.[0]).toUpperCase() 
            : 'AL';
          const avatarClasses = ['primary', 'secondary', 'tertiary'];
          const avatarClass = avatarClasses[row.id % 3];
          return (
            <div className="student-cell">
              <div className={`student-avatar ${avatarClass}`}>
                {initials}
              </div>
              <span className="student-name">
                {a ? `${a.nombres} ${a.apellidos}` : row.alumno}
              </span>
            </div>
          );
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
        render: (_v, row) => (
          <span className="classroom-badge">
            {row.aula_detail?.nombre || aulaById.get(String(row.aula)) || '-'}
          </span>
        )
      },
      {
        key:'periodo_academico',
        label: 'Año lectivo',
        render: (_v, row) => `${row.periodo_academico_detail?.nombre} - ${row.periodo_academico_detail?.anio}` || row.periodo_academico || '-'
      },
      {
        key: 'fecha_matricula',
        label: 'Fecha',
        render: (value) => (value ? String(value).slice(0, 10) : '-')
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => {
          const statusClass = value === 'Activa' 
            ? 'activo' 
            : value === 'Retirado' 
            ? 'retirado' 
            : 'pendiente';
          return (
            <span className={`status-badge ${statusClass}`}>
              {value}
            </span>
          );
        }
      }
    ],
    [aulaById]
  );

  return <DataTable columns={columns} data={data} loading={loading} onView={onView} onEdit={onEdit} onDelete={onDelete} />;
}

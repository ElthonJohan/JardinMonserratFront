import React, { forwardRef } from 'react';
import LibretaTemplate from './LibretaTemplate';
import './LibretasReportes.css';

const LibretaPrintWrapper = forwardRef(({ datosReporte }, ref) => {
  if (!datosReporte || !datosReporte.alumnos || datosReporte.alumnos.length === 0) {
    return <div ref={ref}>No hay datos para imprimir.</div>;
  }

  const { institucion, periodo_academico, alumnos } = datosReporte;

  return (
    <div ref={ref}>
      {alumnos.map((alumno, index) => (
        <LibretaTemplate 
          key={alumno.id || index}
          alumno={alumno}
          institucion={institucion}
          periodoAcademico={periodo_academico}
        />
      ))}
    </div>
  );
});

export default LibretaPrintWrapper;

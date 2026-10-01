import React from 'react';
import './LibretasReportes.css';

const LibretaTemplate = React.forwardRef(({ alumno, institucion, periodoAcademico }, ref) => {
  // Asumiendo que el backend nos envía periodos B1, B2, B3, B4 o similares en las evaluaciones
  // Extraemos las claves de periodo de la primera evaluación disponible para los headers
  let periodosHeaders = [];
  if (alumno?.areas?.length > 0 && alumno.areas[0].competencias?.length > 0) {
    periodosHeaders = Object.keys(alumno.areas[0].competencias[0].evaluaciones);
  }

  return (
    <div className="libreta-pagina" ref={ref}>
      {/* Cabecera SIAGIE */}
      <div className="libreta-header">
        <h1>Ministerio de Educación</h1>
        <h2>INFORME DE PROGRESO DEL APRENDIZAJE DEL ESTUDIANTE - {periodoAcademico}</h2>
      </div>

      {/* Datos Institucionales y Alumno */}
      <div className="libreta-info-section">
        <div className="info-box">
          <div className="info-row">
            <span className="info-label">DRE:</span>
            <span>{institucion?.dre || 'DRE Cajamarca'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">UGEL:</span>
            <span>{institucion?.ugel || 'UGEL Cajamarca'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Institución:</span>
            <span>{institucion?.nombre || 'I.E. Nuestra Señora de Montserrat'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Código Modular:</span>
            <span>{institucion?.codigo_modular || '1517119-0'}</span>
          </div>
        </div>

        <div className="info-box">
          <div className="info-row">
            <span className="info-label">Estudiante:</span>
            <span>{alumno?.apellidos_nombres}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Código (DNI):</span>
            <span>{alumno?.dni || alumno?.codigo_estudiante}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Edad / Aula:</span>
            <span>{alumno?.edad} - {alumno?.seccion}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Docente:</span>
            <span>{alumno?.docente}</span>
          </div>
        </div>
      </div>

      {/* Tabla de Calificaciones y Conclusiones */}
      <table className="libreta-table">
        <thead>
          <tr>
            <th rowSpan="2" style={{ width: '15%' }}>ÁREA CURRICULAR</th>
            <th rowSpan="2" style={{ width: '35%' }}>COMPETENCIAS</th>
            <th colSpan={periodosHeaders.length}>CALIFICATIVO POR PERIODO</th>
          </tr>
          <tr>
            {periodosHeaders.map((per) => (
              <th key={per}>{per}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alumno?.areas?.map((area, idx) => (
            <React.Fragment key={idx}>
              <tr className="area-row">
                <td className="text-left" rowSpan={area.competencias.length + 1}>
                  {area.area_nombre}
                </td>
              </tr>
              {area.competencias.map((comp, cIdx) => (
                <tr key={cIdx} className="competencia-row">
                  <td className="text-left">{comp.descripcion}</td>
                  {periodosHeaders.map((per) => (
                    <td key={per}>
                      {comp.evaluaciones[per] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Cuadro de Asistencias */}
      {alumno?.asistencias && periodosHeaders.length > 0 && (
        <table className="libreta-table" style={{ width: '60%' }}>
           <thead>
             <tr>
               <th rowSpan="2">ASISTENCIAS</th>
               <th colSpan={periodosHeaders.length}>PERIODOS</th>
             </tr>
             <tr>
               {periodosHeaders.map((per) => (
                 <th key={per}>{per}</th>
               ))}
             </tr>
           </thead>
           <tbody>
             <tr>
               <td className="text-left">Faltas Injustificadas</td>
               {periodosHeaders.map((per) => (
                 <td key={per}>{alumno.asistencias[per]?.faltas_injustificadas || 0}</td>
               ))}
             </tr>
             <tr>
               <td className="text-left">Tardanzas Injustificadas</td>
               {periodosHeaders.map((per) => (
                 <td key={per}>{alumno.asistencias[per]?.tardanzas_injustificadas || 0}</td>
               ))}
             </tr>
           </tbody>
        </table>
      )}

      {/* Apreciación General */}
      <div className="apreciacion-box">
        <div className="apreciacion-title">CONCLUSIÓN DESCRIPTIVA GLOBAL / APRECIACIÓN DEL TUTOR(A):</div>
        <p>{alumno?.comentario_general || 'No se registraron comentarios adicionales.'}</p>
      </div>

      {/* Firmas */}
      <div className="firmas-container">
        <div className="firma-box">
          <div className="firma-linea"></div>
          <div className="firma-texto">DIRECTOR(A)</div>
        </div>
        <div className="firma-box">
          <div className="firma-linea"></div>
          <div className="firma-texto">DOCENTE TUTOR(A)</div>
        </div>
      </div>
    </div>
  );
});

export default LibretaTemplate;

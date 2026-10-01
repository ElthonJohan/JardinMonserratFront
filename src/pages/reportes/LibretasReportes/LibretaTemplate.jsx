import React from 'react';
import './LibretasReportes.css';
import logoJardin from '../../../images/logoJardin.png';

const LibretaTemplate = React.forwardRef(({ alumno, institucion, periodoAcademico }, ref) => {
  // Asumiendo que el backend nos envía periodos B1, B2, B3, B4 o similares en las evaluaciones
  // Extraemos las claves de periodo de la primera evaluación disponible para los headers
  let periodosHeaders = [];
  if (alumno?.areas?.length > 0 && alumno.areas[0].competencias?.length > 0) {
    periodosHeaders = Object.keys(alumno.areas[0].competencias[0].evaluaciones);
  }

  const edadStr = String(alumno?.edad || '').toUpperCase();
  const isSoloConclusiones = edadStr.includes('0') || edadStr.includes('1') || edadStr.includes('2') || edadStr.includes('CUNA');

  const evaluatedPeriods = periodosHeaders.filter(per => {
    let hasGrade = false;
    alumno?.areas?.forEach(area => {
      area.competencias.forEach(comp => {
        if (comp.evaluaciones[per] && comp.evaluaciones[per] !== '-') hasGrade = true;
        if (comp.conclusiones?.[per] && comp.conclusiones[per].trim() !== '') hasGrade = true;
      });
    });
    return hasGrade;
  });

  return (
    <div className="libreta-pagina" ref={ref}>
      {/* Cabecera SIAGIE y Datos del Alumno */}
      <div className="libreta-header-container">
        <div className="libreta-header-left">
          <img src="/logoPeruLibreta2.png" alt="Logo Peru" className="libreta-header-logo" />
        </div>
        <div className="libreta-header-center">
          <h3 className="libreta-year">{new Date().getFullYear()}</h3>
          <table className="libreta-info-table">
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '35%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td className="info-label-cell">DRE</td>
                <td className="info-value-cell">{institucion?.dre || 'DRE CAJAMARCA'}</td>
                <td className="info-label-cell">UGEL</td>
                <td className="info-value-cell">{institucion?.ugel || 'UGEL CAJAMARCA'}</td>
              </tr>
              <tr>
                <td className="info-label-cell">Nivel</td>
                <td className="info-value-cell">INICIAL - CUNA - JARDÍN</td>
                <td className="info-label-cell">Código Modular</td>
                <td className="info-value-cell">{institucion?.codigo_modular || '1517119-0'}</td>
              </tr>
              <tr>
                <td className="info-label-cell">Institución o programa educativo</td>
                <td className="info-value-cell" colSpan="3">{institucion?.nombre || 'NUESTRA SEÑORA DE MONSERRAT'}</td>
              </tr>
              <tr>
                <td className="info-label-cell">Edad</td>
                <td className="info-value-cell">{alumno?.edad || '0 A 2 AÑOS'}</td>
                <td className="info-label-cell">Sección</td>
                <td className="info-value-cell">{alumno?.seccion || 'ÚNICA'}</td>
              </tr>
              <tr>
                <td className="info-label-cell">Apellidos y nombres del estudiante</td>
                <td className="info-value-cell" colSpan="3">{alumno?.apellidos_nombres}</td>
              </tr>
              <tr>
                <td className="info-label-cell">Código del estudiante</td>
                <td className="info-value-cell">{alumno?.codigo_estudiante || String(alumno?.id || 0).padStart(14, '0')}</td>
                <td className="info-label-cell">DNI</td>
                <td className="info-value-cell">{alumno?.dni || 'NO REGISTRADO'}</td>
              </tr>
              <tr>
                <td className="info-label-cell">Apellidos y nombres del docente</td>
                <td className="info-value-cell" colSpan="3">{alumno?.docente}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="libreta-header-right">
          <img src={logoJardin} alt="Logo Jardin" className="libreta-header-logo" />
        </div>
      </div>

      {/* Tabla de Calificaciones y Conclusiones */}
      <table className="libreta-table">
        <thead>
          <tr>
            <th rowSpan="2" style={{ width: '10%' }}>ÁREA CURRICULAR</th>
            <th rowSpan="2" style={{ width: '15%' }}>COMPETENCIAS</th>
            {isSoloConclusiones ? (
              <th colSpan={periodosHeaders.length}>CALIFICATIVO POR PERIODO</th>
            ) : (
              periodosHeaders.map((per) => (
                <th key={per} colSpan="2">{per}</th>
              ))
            )}
          </tr>
          <tr>
            {isSoloConclusiones ? (
              periodosHeaders.map((per) => (
                <th key={per} style={{ width: `${60 / periodosHeaders.length}%` }}>{per}</th>
              ))
            ) : (
              periodosHeaders.map((per) => (
                <React.Fragment key={per}>
                  <th style={{ width: `${(60 / periodosHeaders.length) * 0.2}%` }}>NL</th>
                  <th style={{ width: `${(60 / periodosHeaders.length) * 0.8}%` }}>Conclusión Descriptiva</th>
                </React.Fragment>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {alumno?.areas?.map((area, idx) => (
            <React.Fragment key={idx}>
              <tr className="area-row">
                <td className="text-left" rowSpan={area.competencias.length + 1} style={{ verticalAlign: 'middle', fontWeight: 'bold' }}>
                  {area.area_nombre}
                </td>
              </tr>
              {area.competencias.map((comp, cIdx) => (
                <tr key={cIdx} className="competencia-row">
                  <td className="text-left">{comp.descripcion}</td>
                  {periodosHeaders.map((per) => {
                    const nota = comp.evaluaciones[per] || '-';
                    const conclusion = comp.conclusiones?.[per] || '';

                    if (isSoloConclusiones) {
                      return (
                        <td key={per} style={{ verticalAlign: 'middle', padding: '5px' }}>
                          {nota !== '-' && <div style={{ fontWeight: 'bold' }}>{nota}</div>}
                          {conclusion && <div style={{ fontSize: '0.7em', marginTop: '3px', textAlign: 'left', lineHeight: '1.1' }}>{conclusion}</div>}
                          {nota === '-' && !conclusion && '-'}
                        </td>
                      );
                    } else {
                      return (
                        <React.Fragment key={per}>
                          <td style={{ verticalAlign: 'middle', padding: '5px', fontWeight: 'bold' }}>
                            {nota}
                          </td>
                          <td style={{ verticalAlign: 'middle', padding: '5px', fontSize: '0.7em', textAlign: 'left', lineHeight: '1.1' }}>
                            {conclusion}
                          </td>
                        </React.Fragment>
                      );
                    }
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* Apreciación General */}
      <div style={{ display: 'flex', justifyItems: 'center', marginBottom: '20px' }}>
        <table className="libreta-table" style={{ width: '70%', margin: '0 auto' }}>
          <thead>
            <tr>
              <th>COMENTARIO GENERAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ height: '25px', verticalAlign: 'top', textAlign: 'left', padding: '8px' }}>
                {alumno?.comentario_general || ' '}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Cuadro de Asistencias */}
      {evaluatedPeriods.length > 0 && (
        <table className="libreta-table" style={{ width: '100%', marginBottom: '15px' }}>
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '20%' }}>PERIODOS</th>
              <th colSpan="2" style={{ width: '40%' }}>INASISTENCIAS</th>
              <th colSpan="2" style={{ width: '40%' }}>TARDANZAS</th>
            </tr>
            <tr>
              <th>Justificadas</th>
              <th>Injustificadas</th>
              <th>Justificadas</th>
              <th>Injustificadas</th>
            </tr>
          </thead>
          <tbody>
            {evaluatedPeriods.map((per) => (
              <tr key={per}>
                <td className="text-left fw-bold" style={{ paddingLeft: '10px', fontSize: '8px' }}>{per}</td>
                <td>{alumno?.asistencias?.[per]?.faltas_justificadas || '-'}</td>
                <td>{alumno?.asistencias?.[per]?.faltas_injustificadas || '-'}</td>
                <td>{alumno?.asistencias?.[per]?.tardanzas_justificadas || '-'}</td>
                <td>{alumno?.asistencias?.[per]?.tardanzas_injustificadas || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Situación Final */}
      <div style={{ display: 'flex', justifyItems: 'center', marginBottom: '20px' }}>
        <table className="libreta-table" style={{ width: '80%', margin: '0 auto' }}>
          <tbody>
            <tr>
              <th style={{ width: '50%', verticalAlign: 'middle', textAlign: 'center' }}>SITUACIÓN AL FINALIZAR EL PERIODO LECTIVO</th>
              <td style={{ width: '50%', height: '25px', verticalAlign: 'top', textAlign: 'left', padding: '8px' }}>
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Firmas */}
      <div className="firmas-container">
        <div className="firma-box">
          <div className="firma-linea"></div>
          <div className="firma-texto">Firma del Docente o Tutor(a)</div>
        </div>
        <div className="firma-box">
          <div className="firma-linea"></div>
          <div className="firma-texto">Firma y sello del Director(a)</div>
        </div>
      </div>
    </div>
  );
});

export default LibretaTemplate;

import { exportToExcel, exportToPdf } from '../../utils/exportHelpers';

/**
 * Exporta la lista de matrículas a Excel
 * @param {Array} matriculas - Array de objetos de matrículas
 */
export const exportMatriculasToExcel = (matriculas) => {
  if (!matriculas || matriculas.length === 0) {
    console.warn('No hay datos de matrículas para exportar.');
    return;
  }

  const excelData = matriculas.map((m, index) => {
    const alumnoNombre = m.alumno_detail ? `${m.alumno_detail.nombres} ${m.alumno_detail.apellidos}` : m.alumno || '-';
    const aula = m.aula_detail?.nombre || m.aula || '-';
    const periodo = m.periodo_academico_detail ? `${m.periodo_academico_detail.nombre} - ${m.periodo_academico_detail.anio}` : m.periodo_academico || '-';

    return {
      'N°': index + 1,
      'ID Estudiante': m.alumno_detail?.id || m.alumno || '-',
      'Alumno': alumnoNombre,
      'Aula': aula,
      'Año Lectivo': periodo,
      'Estado': m.estado || '-',
    };
  });

  exportToExcel(excelData, 'Lista_Matriculas', 'Matriculas');
};

/**
 * Exporta la lista de matrículas a PDF
 * @param {Array} matriculas - Array de objetos de matrículas
 */
export const exportMatriculasToPdf = (matriculas) => {
  if (!matriculas || matriculas.length === 0) {
    console.warn('No hay datos de matrículas para exportar.');
    return;
  }

  const headers = ['N°', 'ID Estudiante', 'Alumno', 'Aula', 'Año Lectivo', 'Estado'];
  
  const pdfData = matriculas.map((m, index) => {
    const alumnoNombre = m.alumno_detail ? `${m.alumno_detail.nombres} ${m.alumno_detail.apellidos}` : m.alumno || '-';
    const aula = m.aula_detail?.nombre || m.aula || '-';
    const periodo = m.periodo_academico_detail ? `${m.periodo_academico_detail.nombre} - ${m.periodo_academico_detail.anio}` : m.periodo_academico || '-';

    return [
      index + 1,
      m.alumno_detail?.id || m.alumno || '-',
      alumnoNombre,
      aula,
      periodo,
      m.estado || '-',
    ];
  });

  exportToPdf(headers, pdfData, 'Reporte de Matrículas', 'Lista_Matriculas', 'p');
};

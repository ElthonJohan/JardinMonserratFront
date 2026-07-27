import toast from 'react-hot-toast';
import { exportToExcel, exportToPdf } from '../../../utils/exportHelpers';

/**
 * Exporta la lista de asignaciones a Excel
 * @param {Array} asignaciones - Array de asignaciones docentes
 */
export const exportAsignacionesToExcel = (asignaciones) => {
  if (!asignaciones || asignaciones.length === 0) {
    toast.error('No hay datos de asignaciones para exportar.');
    return;
  }

  const excelData = asignaciones.map((item, index) => {
    const areas = item.areas_detalle ? item.areas_detalle.map(a => a.nombre).join(', ') : 'Sin áreas';

    return {
      'N°': index + 1,
      'Docente': item.docente_nombre || 'No asignado',
      'Aula': item.aula_nombre || 'No definida',
      'Áreas': areas,
      'Periodo': item.periodo_nombre || 'No definido',
      'Estado': item.activo ? 'Activo' : 'Inactivo',
    };
  });

  exportToExcel(excelData, 'Lista_Asignaciones', 'Asignaciones');
};

/**
 * Exporta la lista de asignaciones a PDF
 * @param {Array} asignaciones - Array de asignaciones docentes
 */
export const exportAsignacionesToPdf = (asignaciones) => {
  if (!asignaciones || asignaciones.length === 0) {
    toast.error('No hay datos de asignaciones para exportar.');
    return;
  }

  const headers = ['N°', 'Docente', 'Aula', 'Áreas', 'Periodo', 'Estado'];

  const pdfData = asignaciones.map((item, index) => {
    const areas = item.areas_detalle ? item.areas_detalle.map(a => a.nombre).join(', ') : 'Sin áreas';

    return [
      index + 1,
      item.docente_nombre || 'No asignado',
      item.aula_nombre || 'No definida',
      areas,
      item.periodo_nombre || 'No definido',
      item.activo ? 'Activo' : 'Inactivo',
    ];
  });

  exportToPdf(headers, pdfData, 'Reporte de Asignaciones Docentes', 'Lista_Asignaciones', 'l'); // 'l' para landscape porque 'Áreas' puede ser largo
};

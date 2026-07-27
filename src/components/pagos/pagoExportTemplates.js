import toast from 'react-hot-toast';
import { exportToExcel, exportToPdf } from '../../utils/exportHelpers';

/**
 * Exporta el resumen de ingresos a Excel
 * @param {Object} resumen - Objeto con el resumen de la caja
 */
export const exportResumenToExcel = (resumen) => {
  if (!resumen || !resumen.resumen_por_metodo || resumen.resumen_por_metodo.length === 0) {
    toast.error('No hay datos en el resumen para exportar.');
    return;
  }

  const excelData = resumen.resumen_por_metodo.map((metodo, index) => ({
    'N°': index + 1,
    'Método de Pago': metodo.metodo_pago,
    'Cantidad de Transacciones': metodo.cantidad,
    'Total (S/)': parseFloat(metodo.total).toFixed(2),
  }));

  // Agregamos los totales al final
  excelData.push({
    'N°': '',
    'Método de Pago': 'TOTAL RECAUDADO',
    'Cantidad de Transacciones': resumen.cantidad_pagos || 0,
    'Total (S/)': parseFloat(resumen.total_recaudado || 0).toFixed(2),
  });

  exportToExcel(excelData, 'Resumen_Caja', 'Resumen');
};

/**
 * Exporta el resumen de ingresos a PDF
 * @param {Object} resumen - Objeto con el resumen de la caja
 */
export const exportResumenToPdf = (resumen) => {
  if (!resumen || !resumen.resumen_por_metodo || resumen.resumen_por_metodo.length === 0) {
    toast.error('No hay datos en el resumen para exportar.');
    return;
  }

  const headers = ['N°', 'Método de Pago', 'Cantidad', 'Total (S/)'];
  
  const pdfData = resumen.resumen_por_metodo.map((metodo, index) => [
    index + 1,
    metodo.metodo_pago,
    metodo.cantidad,
    parseFloat(metodo.total).toFixed(2),
  ]);

  // Fila de totales
  pdfData.push([
    '',
    'TOTAL RECAUDADO',
    resumen.cantidad_pagos || 0,
    parseFloat(resumen.total_recaudado || 0).toFixed(2),
  ]);

  exportToPdf(headers, pdfData, 'Resumen de Ingresos de Caja', 'Resumen_Caja', 'p');
};

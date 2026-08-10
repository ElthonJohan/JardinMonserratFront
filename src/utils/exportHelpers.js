import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Helper genérico para exportar a Excel usando xlsx
 * @param {Array} data - Array de objetos con los datos a exportar.
 * @param {String} fileName - Nombre del archivo de salida.
 * @param {String} sheetName - Nombre de la hoja de cálculo.
 */
export const exportToExcel = (data, fileName = 'reporte', sheetName = 'Hoja 1') => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar.');
    return;
  }

  // Crear una nueva hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Auto-ajustar el ancho de las columnas
  const objectKeys = Object.keys(data[0] || {});
  const wscols = objectKeys.map(key => {
    // La longitud inicial es el tamaño del nombre de la columna (header)
    let maxLength = key.toString().length;
    
    // Recorrer los datos buscando el valor más largo en esta columna
    data.forEach(row => {
      const cellValue = row[key];
      if (cellValue !== null && cellValue !== undefined) {
        const cellLength = cellValue.toString().length;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      }
    });
    // Agregar un padding de 2 caracteres para que no quede muy apretado
    return { wch: maxLength + 2 };
  });

  worksheet['!cols'] = wscols;
  
  // Crear un nuevo libro de trabajo y añadir la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Formatear la fecha para el nombre del archivo
  const dateStr = format(new Date(), 'yyyyMMdd_HHmmss');
  const finalFileName = `${fileName}_${dateStr}.xlsx`;

  // Descargar el archivo
  XLSX.writeFile(workbook, finalFileName);
};

/**
 * Helper genérico para exportar a PDF usando jspdf y jspdf-autotable
 * @param {Array} headers - Array de strings con los nombres de las columnas.
 * @param {Array} data - Array de arrays con los valores correspondientes a cada columna.
 * @param {String} title - Título que aparecerá en el PDF.
 * @param {String} fileName - Nombre del archivo de salida.
 * @param {String} orientation - Orientación de la página: 'p' para vertical, 'l' para horizontal.
 */
export const exportToPdf = (headers, data, title = 'Reporte', fileName = 'reporte', orientation = 'p') => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar.');
    return;
  }

  const doc = new jsPDF(orientation, 'pt', 'a4');
  
  // Título del reporte
  doc.setFontSize(18);
  doc.text(title, 40, 40);
  
  // Fecha de generación
  doc.setFontSize(10);
  const dateStr = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
  doc.text(`Fecha de generación: ${dateStr}`, 40, 60);

  // Agregar la tabla
  autoTable(doc, {
    startY: 70,
    head: [headers],
    body: data,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [41, 128, 185], // Un color azul elegante
      textColor: 255,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Generar nombre de archivo con fecha
  const fileDateStr = format(new Date(), 'yyyyMMdd_HHmmss');
  const finalFileName = `${fileName}_${fileDateStr}.pdf`;

  // Descargar el archivo
  doc.save(finalFileName);
};

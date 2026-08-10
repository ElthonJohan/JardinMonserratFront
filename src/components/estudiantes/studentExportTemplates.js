import { exportToExcel, exportToPdf } from '../../utils/exportHelpers';

/**
 * Exporta la lista de estudiantes a Excel
 * @param {Array} students - Array de objetos de estudiantes
 */
export const exportStudentsToExcel = (students) => {
  if (!students || students.length === 0) {
    console.warn('No hay datos de estudiantes para exportar.');
    return;
  }

  // Mapear los datos al formato requerido por exceljs / xlsx
  // Cada llave del objeto se convierte en una columna en Excel
  const excelData = students.map((student, index) => {
    // Obtener apoderado principal
    const listaApoderados = student.apoderados || student.apoderados_detail || [];
    const relPrincipal = listaApoderados.find((r) => r.es_principal) || listaApoderados[0];
    const apoderado = relPrincipal ? relPrincipal.apoderado : null;
    const apoderadoNombre = apoderado ? `${apoderado.nombres} ${apoderado.apellidos}` : '-';
    const apoderadoTel = apoderado ? (apoderado.telefono || '-') : '-';

    return {
      'N°': index + 1,
      'DNI': student.dni || student.documento || '-',
      'Nombres': student.nombre || student.nombres || '-',
      'Apellidos': student.apellido || student.apellidos || '-',
      'Fecha Nacimiento': student.fecha_nacimiento || student.fechaNacimiento || '-',
      'Apoderado': apoderadoNombre,
      'Tel. Apoderado': apoderadoTel,
      'Estado': student.estado === false ? 'Inactivo' : 'Activo',
    };
  });

  exportToExcel(excelData, 'Lista_Estudiantes', 'Estudiantes');
};

/**
 * Exporta la lista de estudiantes a PDF
 * @param {Array} students - Array de objetos de estudiantes
 */
export const exportStudentsToPdf = (students) => {
  if (!students || students.length === 0) {
    console.warn('No hay datos de estudiantes para exportar.');
    return;
  }

  // Definir las cabeceras de la tabla
  const headers = ['N°', 'DNI', 'Nombres', 'Apellidos', 'Fecha Nac.', 'Apoderado', 'Teléfono', 'Estado'];
  
  // Mapear los datos al formato de array de arrays requerido por jspdf-autotable
  const pdfData = students.map((student, index) => {
    const listaApoderados = student.apoderados || student.apoderados_detail || [];
    const relPrincipal = listaApoderados.find((r) => r.es_principal) || listaApoderados[0];
    const apoderado = relPrincipal ? relPrincipal.apoderado : null;
    const apoderadoNombre = apoderado ? `${apoderado.nombres} ${apoderado.apellidos}` : '-';
    const apoderadoTel = apoderado ? (apoderado.telefono || '-') : '-';

    return [
      index + 1,
      student.dni || student.documento || '-',
      student.nombre || student.nombres || '-',
      student.apellido || student.apellidos || '-',
      student.fecha_nacimiento || student.fechaNacimiento || '-',
      apoderadoNombre,
      apoderadoTel,
      student.estado === false ? 'Inactivo' : 'Activo',
    ];
  });

  // Usamos orientación landscape ('l') si hay muchas columnas para que encajen mejor
  exportToPdf(headers, pdfData, 'Reporte de Estudiantes', 'Lista_Estudiantes', 'p');
};

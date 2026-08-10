import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { importarAlumnosMasivo } from '../../api/estudiantesAPI';
import toast from 'react-hot-toast';
import { Button, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ImportarEstudiantesModal({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultados, setResultados] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResultados(null);
  };

  const handleDownloadTemplate = () => {
    const ws_data = [
      [
        'DNI Alumno',
        'Nombres Alumno',
        'Apellidos Alumno',
        'Fecha Nacimiento (YYYY-MM-DD)',
        'DNI Apoderado',
        'Nombres Apoderado',
        'Apellidos Apoderado',
        'Telefono Apoderado',
        'Email Apoderado',
        'Direccion Apoderado',
        'Relacion (PADRE, MADRE, TUTOR, OTRO)'
      ],
      [
        '77665544',
        'Juanito',
        'Perez',
        '2018-05-20',
        '10203040',
        'Carlos',
        'Perez',
        '987654321',
        'carlos@gmail.com',
        'Av. Siempreviva 123',
        'PADRE'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Auto-size columns slightly
    ws['!cols'] = Array(11).fill({ wch: 20 });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla Importacion");

    XLSX.writeFile(wb, "Plantilla_Estudiantes.xlsx");
  };

  const procesarExcel = () => {
    if (!file) {
      toast.error('Por favor, selecciona un archivo Excel.');
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON array (header row is used for keys if we pass header:1 it gives arrays)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Remove header row
        const rows = jsonData.slice(1);

        if (rows.length === 0) {
          toast.error("El archivo está vacío o no tiene datos válidos.");
          setIsLoading(false);
          return;
        }

        const payload = rows.map((row) => {
          let fecha = row[3];
          if (typeof fecha === 'number') {
            // Convertir número de serie de Excel a fecha YYYY-MM-DD
            const excelEpoch = new Date(1899, 11, 30);
            const date = new Date(excelEpoch.getTime() + fecha * 86400000);
            fecha = date.toISOString().split('T')[0];
          } else {
            fecha = String(fecha || '').trim();
          }

          return {
            estudiante: {
              dni: String(row[0] || '').trim(),
              nombres: String(row[1] || '').trim(),
              apellidos: String(row[2] || '').trim(),
              fecha_nacimiento: fecha // Formato YYYY-MM-DD asegurado
            },
            apoderado: {
              dni: String(row[4] || '').trim(),
              nombres: String(row[5] || '').trim(),
              apellidos: String(row[6] || '').trim(),
              telefono: String(row[7] || '').trim(),
              email: String(row[8] || '').trim(),
              direccion: String(row[9] || '').trim(),
            },
            tipo_relacion: String(row[10] || 'OTRO').toUpperCase().trim()
          };
        }).filter(item => item.estudiante.dni && item.apoderado.dni); // Filter empty rows

        if (payload.length === 0) {
          toast.error("No se encontraron filas con DNI de estudiante y apoderado válidos.");
          setIsLoading(false);
          return;
        }

        const response = await importarAlumnosMasivo(payload);
        toast.success(response.mensaje || 'Importación exitosa');
        setResultados(response);
        onSuccess(); // Refresh table

      } catch (error) {
        console.error("Error al importar:", error);
        if (error.response && error.response.data) {
          setResultados(error.response.data);
          toast.error("Hubo errores durante la importación. Revisa el reporte.");
        } else {
          toast.error('Error al procesar el archivo Excel. Asegúrate que el formato sea correcto.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const descargarCredencialesPDF = () => {
    if (!resultados || !resultados.credenciales || resultados.credenciales.length === 0) {
      toast.error("No hay credenciales para descargar.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Credenciales de Acceso - Intranet", 14, 22);

    doc.setFontSize(10);
    doc.text(`Generadas el: ${new Date().toLocaleDateString('es-PE')}`, 14, 30);

    const tableColumn = ["Apoderado", "Estudiante", "Usuario", "Contraseña"];
    const tableRows = [];

    resultados.credenciales.forEach(cred => {
      const rowData = [
        cred.apoderado,
        cred.estudiante,
        cred.username,
        cred.password
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [20, 108, 46] } // School green color
    });

    doc.save("Credenciales_Apoderados.pdf");
  };

  const closeAndReset = () => {
    setFile(null);
    setResultados(null);
    document.getElementById('fileInputExcel').value = "";
    // close modal happens via bootstrap data-bs-dismiss
  };

  return (
    <div className="modal fade" id="importarEstudiantesModal" tabIndex="-1" data-bs-backdrop="static">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">📥 Importación Masiva de Estudiantes</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={closeAndReset}></button>
          </div>
          <div className="modal-body">

            <div className="alert alert-info" role="alert">
              <strong>1.</strong> Descarga la plantilla en Excel.<br />
              <strong>2.</strong> Llena los datos de los estudiantes y apoderados.<br />
              <strong>3.</strong> Sube el archivo completado. Las cuentas de acceso para nuevos apoderados se generarán automáticamente.
            </div>

            <div className="mb-4 d-flex justify-content-center">
              <Button variant="success" onClick={handleDownloadTemplate} className="d-flex align-items-center gap-2">
                Descargar Plantilla Excel
              </Button>
            </div>

            <div className="mb-3">
              <label htmlFor="fileInputExcel" className="form-label">Subir archivo de importación (.xlsx)</label>
              <input
                className="form-control"
                type="file"
                id="fileInputExcel"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </div>

            {resultados && (
              <div className="mt-4">
                <hr />
                <h6 className="fw-bold">Resultados de la Importación</h6>
                {resultados.mensaje && (
                  <p className="text-success fw-bold">{resultados.mensaje}</p>
                )}

                {resultados.errores && resultados.errores.length > 0 && (
                  <div className="alert alert-danger" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    <strong>Errores encontrados:</strong>
                    <ul className="mb-0 mt-2 text-start" style={{ fontSize: '13px' }}>
                      {resultados.errores.map((err, idx) => <li key={idx}>{err}</li>)}
                    </ul>
                  </div>
                )}

                {resultados.credenciales && resultados.credenciales.length > 0 && (
                  <div className="alert alert-success d-flex justify-content-between align-items-center">
                    <div>
                      <strong>¡Credenciales Generadas!</strong>
                      <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>Se generaron {resultados.credenciales.length} cuentas nuevas.</p>
                    </div>
                    <Button variant="success" size="sm" onClick={descargarCredencialesPDF}>
                      📄 Descargar PDF
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>
          <div className="modal-footer">
            <Button variant="danger" data-bs-dismiss="modal" onClick={closeAndReset}>
              Cerrar
            </Button>
            <Button
              variant="success"
              onClick={procesarExcel}
              disabled={!file || isLoading}
            >
              {isLoading ? (
                <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Procesando...</>
              ) : 'Subir e Importar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

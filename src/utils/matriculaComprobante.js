export const escapeHtml = (value) => {
  const s = String(value ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const buildComprobanteMatriculaHtml = (matricula) => {
  const alumno = matricula?.alumno_detail;
  const aula = matricula?.aula_detail;
  const periodo_academico=matricula?.periodo_academico_detail;

  const alumnoNombre = alumno ? `${alumno.nombres || ''} ${alumno.apellidos || ''}`.trim() : '';
  const periodoNombre = periodo_academico ? `${periodo_academico.nombre || ''} - ${periodo_academico.anio || ''}`.trim() : '';

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Comprobante de Matrícula</title>
    <style>
      * { box-sizing: border-box; }
      body { 
        font-family: 'Helvetica Neue', Arial, sans-serif; 
        margin: 0; 
        padding: 40px; 
        color: #333;
        background-color: #fff;
      }
      
      .container {
        max-width: 700px;
        margin: 0 auto;
        position: relative;
      }

      /* Encabezado Principal */
      .header { 
        text-align: center; 
        margin-bottom: 24px; 
      }
      .logo-placeholder {
        font-size: 24px;
        margin-bottom: 8px;
      }
      .institution-name { 
        font-size: 24px; 
        font-weight: 700; 
        color: #0056b3; 
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 4px 0;
      }
      .subtitle { 
        color: #555; 
        font-size: 13px; 
        font-style: italic;
        margin-bottom: 16px;
      }

      /* Recuadro Destacado del ID (Estilo Recibo de Caja) */
      .document-badge {
        border: 1px solid #f8d7da;
        background-color: #fff5f5;
        border-radius: 6px;
        padding: 12px;
        max-width: 280px;
        margin: 0 auto 24px auto;
        text-align: center;
      }
      .badge-title {
        font-size: 11px;
        font-weight: bold;
        color: #b02a37;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      .badge-id {
        font-size: 16px;
        font-weight: bold;
        color: #b02a37;
        margin: 0;
      }

      /* Línea divisoria azul */
      .divider {
        height: 3px;
        background-color: #0056b3;
        margin-bottom: 20px;
      }

      /* Bloque de Información del Alumno (Gris claro) */
      .info-box { 
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px; 
        padding: 16px; 
        margin-bottom: 24px;
      }
      .grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 16px 24px; 
      }
      .item {
        display: flex;
        flex-direction: column;
      }
      .item label { 
        font-size: 12px; 
        color: #6c757d; 
        font-weight: 500;
        margin-bottom: 4px; 
      }
      .item div { 
        font-size: 14px; 
        color: #212529;
        font-weight: 500;
      }

      /* Tabla de Detalles Estilo "Aprobado" de la Imagen */
      .details-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
      .details-table th {
        background-color: #212529;
        color: #ffffff;
        text-align: left;
        padding: 10px 14px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .details-table td {
        padding: 14px;
        font-size: 13px;
        border-bottom: 1px solid #dee2e6;
        color: #333;
      }
      
      /* Marca de agua sutil de fondo */
      .watermark {
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-15deg);
        font-size: 70px;
        font-weight: bold;
        color: rgba(40, 167, 69, 0.04);
        user-select: none;
        z-index: -1;
        letter-spacing: 5px;
      }

      /* Pie de página e Impresión */
      .footer-text {
        text-align: center;
        font-size: 11px;
        color: #6c757d;
        margin-top: 40px;
        border-top: 1px dashed #dee2e6;
        padding-top: 15px;
      }
      .actions { 
        margin-top: 20px; 
        text-align: center;
      }
      .btn-print {
        background-color: #0056b3;
        color: white;
        border: none;
        padding: 8px 16px;
        font-size: 13px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }
      .btn-print:hover {
        background-color: #004085;
      }

      @media print {
        .no-print { display: none; }
        body { padding: 0; }
        .container { max-width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="watermark">MATRICULADO</div>

      <div class="header">
        <div class="logo-placeholder">🔔</div>
        <h1 class="institution-name">Jardín Monserrat</h1>
        <div class="subtitle">Educación inicial de calidad</div>
      </div>

      <div class="document-badge">
        <div class="badge-title">Comprobante de Matrícula</div>
        <p class="badge-id">N° MAT-${escapeHtml(matricula?.id || '000000')}</p>
      </div>

      <div class="divider"></div>

      <div class="info-box">
        <div class="grid">
          <div class="item">
            <label>Alumno:</label>
            <div>${escapeHtml(alumnoNombre || '-')}</div>
          </div>
          <div class="item">
            <label>Fecha de Matrícula:</label>
            <div>${escapeHtml(matricula?.fecha_matricula || '-')}</div>
          </div>
          <div class="item">
            <label>Código Alumno:</label>
            <div>${escapeHtml(alumno?.id || matricula?.alumno || '-')}</div>
          </div>
          <div class="item">
            <label>Año Lectivo:</label>
            <div>${escapeHtml(periodoNombre || '-')}</div>
          </div>
        </div>
      </div>

      <table class="details-table">
        <thead>
          <tr>
            <th>Concepto / Detalle de Matrícula</th>
            <th style="text-align: right;">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Matrícula regular en <strong>${escapeHtml(aula?.nombre || '-')}</strong>
              ${matricula?.observaciones ? `<br><small style="color:#6c757d;">Obs: ${escapeHtml(matricula.observaciones)}</small>` : ''}
            </td>
            <td style="text-align: right; font-weight: bold; color: #28a745;">
              ${escapeHtml(matricula?.estado || 'PROCESADO')}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="footer-text">
        Este documento es un comprobante de sistema que acredita la reserva y registro de la matrícula.<br>
        <strong>¡Gracias por confiar en el Jardín Monserrat!</strong>
      </div>

      <div class="actions no-print">
        <button class="btn-print" onclick="window.print()">Imprimir Comprobante</button>
      </div>
    </div>
  </body>
</html>`;
};
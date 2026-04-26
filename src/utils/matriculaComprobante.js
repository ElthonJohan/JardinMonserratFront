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

  const alumnoNombre = alumno ? `${alumno.nombres || ''} ${alumno.apellidos || ''}`.trim() : '';

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Comprobante de Matrícula</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
      .title { font-size: 18px; font-weight: 700; }
      .sub { color: #444; font-size: 12px; }
      .box { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .item label { display: block; font-size: 11px; color: #666; margin-bottom: 4px; }
      .item div { font-size: 13px; }
      .footer { margin-top: 18px; font-size: 11px; color: #555; }
      @media print {
        .no-print { display: none; }
        body { margin: 0; }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="title">Comprobante de Matrícula</div>
        <div class="sub">Documento generado por el sistema</div>
      </div>
      <div class="sub">ID Matrícula: ${escapeHtml(matricula?.id)}</div>
    </div>

    <div class="box">
      <div class="grid">
        <div class="item">
          <label>Alumno</label>
          <div>${escapeHtml(alumnoNombre || '-')}</div>
        </div>
        <div class="item">
          <label>ID Estudiante</label>
          <div>${escapeHtml(alumno?.id || matricula?.alumno || '-')}</div>
        </div>
        <div class="item">
          <label>Aula</label>
          <div>${escapeHtml(aula?.nombre || '-') }</div>
        </div>
        <div class="item">
          <label>Año lectivo</label>
          <div>${escapeHtml(matricula?.anio || '-') }</div>
        </div>
        <div class="item">
          <label>Fecha de matrícula</label>
          <div>${escapeHtml(matricula?.fecha_matricula || '-') }</div>
        </div>
        <div class="item">
          <label>Estado</label>
          <div>${escapeHtml(matricula?.estado || '-') }</div>
        </div>
        <div class="item">
          <label>Observaciones</label>
          <div>${escapeHtml(matricula?.observaciones || '-') }</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="no-print">
        <button onclick="window.print()">Imprimir</button>
      </div>
    </div>
  </body>
</html>`;
};

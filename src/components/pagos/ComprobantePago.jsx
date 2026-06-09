import React from 'react';
import logoJardin from '../../images/logoJardin.png';

export const ComprobantePago = React.forwardRef(({ pago }, ref) => {
  if (!pago) return null;

  const {
    id,
    fecha_pago,
    metodo_pago,
    numero_operacion,
    monto_total_entregado,
    alumno_detail,
    asignaciones = [],
    banco_detail
  } = pago;

  const getMesNombre = (mesNum) => {
    if (!mesNum) return '';
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mesNum - 1] || '';
  };

  const fechaFormateada = new Date(fecha_pago).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div ref={ref} className="a5-receipt-page">
      <style>{`
        @page {
          size: A5 portrait;
          margin: 0;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
            background-color: #fff;
          }
          .a5-receipt-page {
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
          }
        }
        .a5-receipt-page {
          width: 148mm;
          height: 210mm;
          padding: 12mm 10mm;
          box-sizing: border-box;
          background-color: #ffffff;
          position: relative;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #2b2b2b;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #ddd;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          margin: 10px auto;
          overflow: hidden;
        }
        .watermark {
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          font-size: 75px;
          font-weight: 900;
          color: rgba(40, 167, 69, 0.08);
          text-transform: uppercase;
          border: 8px solid rgba(40, 167, 69, 0.08);
          padding: 10px 30px;
          border-radius: 12px;
          pointer-events: none;
          z-index: 0;
          user-select: none;
          white-space: nowrap;
          letter-spacing: 5px;
        }
        .receipt-header {
          text-align: center;
          z-index: 10;
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .school-info {
          text-align: center;
          width: 100%;
        }
        .school-title {
          font-size: 22px;
          font-weight: bold;
          color: #0b5ed7;
          margin: 0 0 2px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .school-subtitle {
          font-size: 11px;
          color: #666;
          margin: 0 0 6px 0;
          font-style: italic;
        }
        .school-details {
          font-size: 10px;
          line-height: 1.4;
          color: #444;
          margin-bottom: 8px;
        }
        .receipt-number-box {
          background-color: #fdf2f2;
          border: 1px solid #f8b4b4;
          color: #9b1c1c;
          padding: 6px 30px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          display: inline-block;
          box-sizing: border-box;
        }
        .receipt-number-title {
          font-size: 10px;
          color: #c05621;
          margin-bottom: 3px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .receipt-number-val {
          font-size: 15px;
          letter-spacing: 0.5px;
        }
        .receipt-divider {
          border-bottom: 2px solid #0b5ed7;
          margin: 10px 0;
          z-index: 10;
        }
        .receipt-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }
        .receipt-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          font-size: 11px;
          margin-bottom: 15px;
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }
        .grid-item strong {
          color: #495057;
        }
        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin-top: 5px;
        }
        .receipt-table th {
          background-color: #212529;
          color: #ffffff;
          padding: 8px 10px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
        }
        .receipt-table td {
          padding: 8px 10px;
          border-bottom: 1px solid #dee2e6;
          color: #333;
        }
        .receipt-table tr:nth-of-type(even) {
          background-color: #fdfdfd;
        }
        .total-container {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: 15px;
          padding-top: 10px;
        }
        .total-box {
          display: flex;
          align-items: baseline;
          gap: 10px;
          background-color: #f8f9fa;
          padding: 6px 15px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
        }
        .total-label {
          font-size: 12px;
          font-weight: bold;
          color: #495057;
        }
        .total-amount {
          font-size: 20px;
          font-weight: bold;
          color: #212529;
        }
        .receipt-footer {
          text-align: center;
          font-size: 9px;
          color: #6c757d;
          border-top: 1px dashed #dee2e6;
          padding-top: 10px;
          margin-top: 15px;
          z-index: 10;
        }
      `}</style>

      {/* Marca de Agua */}
      <div className="watermark">APROBADO</div>

      {/* Encabezado */}
      <div className="receipt-header">
        <div className="logo-container" style={{ marginBottom: '6px' }}>
          <img src={logoJardin} alt="Logo Jardín Monserrat" style={{ height: '45px', objectFit: 'contain' }} />
        </div>
        <div className="school-info">
          <h1 className="school-title">Jardín Monserrat</h1>
          <p className="school-subtitle">Educación inicial de calidad</p>
          <div className="school-details">
            <div>R.U.C. N° 20608945123</div>
            <div>Jr. Comercio 540 - Cajamarca</div>
            <div>Teléfono: 948 372 192 | Correo: informes@jardinmonserrat.edu.pe</div>
          </div>
        </div>
        
        <div className="receipt-number-box">
          <div className="receipt-number-title">Recibo de Caja</div>
          <div className="receipt-number-val">N° REC-{String(id).padStart(6, '0')}</div>
        </div>
      </div>

      <div className="receipt-divider" />

      {/* Cuerpo */}
      <div className="receipt-body">
        {/* Grilla de Datos */}
        <div className="receipt-grid">
          <div className="grid-item">
            <strong>Alumno:</strong> {alumno_detail?.apellidos?.toUpperCase()}, {alumno_detail?.nombres?.toUpperCase()}
          </div>
          <div className="grid-item">
            <strong>Fecha Pago:</strong> {fechaFormateada}
          </div>
          <div className="grid-item">
            <strong>Código Alumno:</strong> {alumno_detail?.id || '—'}
          </div>
          <div className="grid-item">
            <strong>Método de Pago:</strong> {metodo_pago}
          </div>
          {banco_detail && (
            <div className="grid-item">
              <strong>Banco Destino:</strong> {banco_detail.nombre}
            </div>
          )}
          {numero_operacion && (
            <div className="grid-item">
              <strong>N° Operación:</strong> {numero_operacion}
            </div>
          )}
        </div>

        {/* Tabla de Detalle */}
        <table className="receipt-table">
          <thead>
            <tr>
              <th style={{ width: '70%' }}>Concepto / Deuda Cancelada</th>
              <th style={{ width: '30%', textAlign: 'right' }}>Monto Pagado</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones && asignaciones.length > 0 ? (
              asignaciones.map((asig, idx) => (
                <tr key={idx}>
                  <td>
                    {asig.deuda_detail?.concepto || 'Cargo'} 
                    {asig.deuda_detail?.mes ? ` - Mes: ${getMesNombre(asig.deuda_detail.mes)} ${asig.deuda_detail.anio}` : ''}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    S/ {parseFloat(asig.monto_aplicado).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>Pago a cuenta / General</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  S/ {parseFloat(monto_total_entregado).toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total */}
        <div className="total-container">
          <div className="total-box">
            <span className="total-label">TOTAL RECIBIDO:</span>
            <span className="total-amount">S/ {parseFloat(monto_total_entregado).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Pie de Página */}
      <div className="receipt-footer">
        <div>Este documento es un comprobante de caja que acredita la recepción del pago.</div>
        <div style={{ marginTop: '2px', fontWeight: 'bold' }}>¡Gracias por confiar en el Jardín Monserrat!</div>
      </div>
    </div>
  );
});

ComprobantePago.displayName = 'ComprobantePago';
export default ComprobantePago;

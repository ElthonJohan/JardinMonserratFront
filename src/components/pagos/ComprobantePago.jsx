import React from 'react';
import logoJardin from '../../images/logoJardin.png';
import "../../styles/ComprobantePago.css";

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

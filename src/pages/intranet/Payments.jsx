import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';

const Payments = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
            const response = await axiosInstance.get('/pagos/parent/pagos/'); // URL correcta según backend
        setDashboard(response.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información de pagos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de pagos...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return <div className="text-red-500 text-center p-8">{error || "Error al cargar datos"}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Seguimiento de Pagos</h1>
        <p className="text-gray-600">Apoderado: <span className="font-medium">{dashboard.apoderado_nombre}</span></p>
      </div>

      {/* Tarjeta Principal - Saldo Pendiente */}
      <div className="bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 text-white rounded-3xl p-8 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-lg opacity-90">Saldo Pendiente Total</p>
            <p className="text-6xl font-bold mt-2 tracking-tight">
              S/ {Number(dashboard.total_pendiente).toFixed(2)}
            </p>
          </div>
          
          <button 
            className="bg-white text-red-600 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
            onClick={() => alert("Próximamente: Integración de pago en línea")}
          >
            Pagar Ahora
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Deudas Pendientes */}
        <div className="bg-white rounded-3xl shadow-lg p-7">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            📅 Deudas Pendientes
          </h3>

          {dashboard.deudas_pendientes.length === 0 ? (
            <div className="text-center py-16 text-green-600">
              <p className="text-6xl mb-4">🎉</p>
              <p className="text-xl">¡Felicidades! No tienes deudas pendientes.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {dashboard.deudas_pendientes.map((deuda) => (
                <div
                  key={deuda.id}
                  className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">
                        {deuda.concepto_nombre}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {deuda.alumno_nombre} • {deuda.mes && `${deuda.mes}/${deuda.anio}`}
                      </p>
                      {deuda.detalle_adicional && (
                        <p className="text-xs text-gray-500 mt-1">{deuda.detalle_adicional}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">
                        S/ {Number(deuda.saldo_pendiente).toFixed(2)}
                      </p>
                      <span className="inline-block mt-2 px-4 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        {deuda.estado}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Vence: {new Date(deuda.fecha_vencimiento).toLocaleDateString('es-PE')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de Pagos Recientes */}
        <div className="bg-white rounded-3xl shadow-lg p-7">
          <h3 className="text-2xl font-semibold mb-6">💰 Últimos Pagos</h3>

          {dashboard.pagos_recientes.length === 0 ? (
            <p className="text-gray-500 py-12 text-center">Aún no hay pagos registrados.</p>
          ) : (
            <div className="space-y-5">
              {dashboard.pagos_recientes.map((pago) => (
                <div
                  key={pago.id}
                  className="flex justify-between items-center border-b border-gray-100 pb-5 last:border-none last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">Pago registrado</p>
                    <p className="text-sm text-gray-500">
                      {new Date(pago.fecha_pago).toLocaleDateString('es-PE', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })} • {pago.metodo_pago}
                    </p>
                    {pago.numero_operacion && (
                      <p className="text-xs text-gray-400">Op. {pago.numero_operacion}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      + S/ {Number(pago.monto_total_entregado).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
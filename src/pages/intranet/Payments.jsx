import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import "../../styles/intranetPagos.css"; // Asegúrate de crear este archivo CSS para estilos específicos
import PagoModal from "./PagoModal";
import toast from "react-hot-toast";

const Payments = () => {
  const [dashboard, setDashboard] = useState(null);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    deuda_id: "",
    metodo_pago: "Yape",
    numero_operacion: "",
    comprobante: null,
  });
  const [showPagoModal, setShowPagoModal] = useState(false);

  const loadDashboard = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await axiosInstance.get("/pagos/parent/pagos/");
      setDashboard(response.data);

      if (response.data.alumnos && response.data.alumnos.length > 0) {
        if (selectedAlumno) {
          const updated = response.data.alumnos.find((a) => a.id === selectedAlumno.id);
          setSelectedAlumno(updated || response.data.alumnos[0]);
        } else {
          setSelectedAlumno(response.data.alumnos[0]);
        }
      }

      if (isRefresh) {
        toast.success("Información actualizada");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la información de pagos.");
      if (isRefresh) {
        toast.error("Error al actualizar la información de pagos.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Cargando información de pagos...</p>
        </div>
      </div>
    );
  }

  console.log("DASHBOARD DATA:", dashboard.deudas_pendientes);

  if (error || !dashboard) {
    return <div className="error-box">{error || "Error al cargar datos"}</div>;
  }
  return (
    <div className="payments-page">
      {/* HEADER */}
      <div className="payments-header">
        <div>
          <h1>Seguimiento de Pagos</h1>
          <p>
            Apoderado:
            <span> {dashboard.apoderado_nombre}</span>
          </p>
          <div className="family-summary">
            <div className="summary-card">
              <h4>👨‍👩‍👧‍👦 Hijos</h4>

              <span>{dashboard.cantidad_hijos}</span>
            </div>

            <div className="summary-card">
              <h4>💰 Deuda Familiar</h4>

              <span>
                S/
                {Number(dashboard.total_pendiente).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button 
          className="refresh-btn" 
          onClick={() => loadDashboard(true)} 
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <div className="btn-spinner"></div>
              <span>Actualizando...</span>
            </>
          ) : (
            <span>🔄 Actualizar Datos</span>
          )}
        </button>
      </div>

      <div className="student-selector">
        {dashboard.alumnos?.map((alumno) => (
          <button
            key={alumno.id}
            className={
              selectedAlumno?.id === alumno.id
                ? "student-btn active"
                : "student-btn"
            }
            onClick={() => setSelectedAlumno(alumno)}
          >
            👦 {alumno.nombre}
          </button>
        ))}
      </div>

      {/* BALANCE */}
      <div className="balance-card">
        <div className="balance-content">
          <div>
            <p className="balance-label">
              Saldo Pendiente de {selectedAlumno?.nombre}
            </p>

            <h2 className="balance-amount">
              S/ {Number(selectedAlumno?.total_pendiente || 0).toFixed(2)}
            </h2>
          </div>

          <button
            className="pay-btn"
            onClick={() =>
              setShowPagoModal(true)
            }
          >
            Pagar Ahora
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="payments-grid">
        {/* DEUDAS */}
        <div className="section-card">
          <h3 className="section-title">📅 Deudas Pendientes</h3>

          {selectedAlumno?.deudas?.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">🎉</div>
              <p>No tienes deudas pendientes</p>
            </div>
          ) : (
            selectedAlumno?.deudas?.map((deuda) => {
              const getNombreMes = (num) => {
                const meses = [
                  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ];
                return meses[num - 1] || "";
              };

              const conceptoNombre = deuda.concepto_detail?.nombre || deuda.concepto_nombre || "Concepto";
              const mesNombre = deuda.mes ? ` - ${getNombreMes(deuda.mes)} ${deuda.anio}` : "";
              const alumnoNombre = deuda.alumno_detail
                ? `${deuda.alumno_detail.nombres} ${deuda.alumno_detail.apellidos}`.trim()
                : (deuda.alumno_nombre || selectedAlumno?.nombre);

              return (
                <div key={deuda.id} className="debt-item">
                  <div className="debt-top">
                    <div>
                      <h4 className="debt-title">{conceptoNombre}{mesNombre}</h4>

                      <p className="debt-subtitle">{alumnoNombre}</p>

                      {deuda.detalle_adicional && (
                        <p className="debt-detail">{deuda.detalle_adicional}</p>
                      )}
                    </div>

                    <div>
                      <div className="debt-price">
                        S/ {Number(deuda.saldo_pendiente).toFixed(2)}
                      </div>

                      <span className="status-badge">{deuda.estado}</span>
                    </div>
                  </div>

                  <p className="debt-date">
                    Vence:{" "}
                    {new Date(deuda.fecha_vencimiento).toLocaleDateString(
                      "es-PE",
                    )}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* PAGOS */}
        <div className="section-card">
          <h3 className="section-title">💰 Últimos Pagos</h3>

          {selectedAlumno?.pagos_recientes.length === 0 ? (
            <div className="empty-state">
              <p>No hay pagos registrados</p>
            </div>
          ) : (
            selectedAlumno?.pagos_recientes?.map((pago) => {
              const getBadgeProps = (estado) => {
                switch (estado) {
                  case 'APROBADO':
                    return { bg: 'success text-white', label: 'Válido' };
                  case 'RECHAZADO':
                    return { bg: 'danger text-white', label: 'Rechazado' };
                  default:
                    return { bg: 'warning text-dark', label: 'Pendiente' };
                }
              };

              const getPriceColor = (estado) => {
                switch (estado) {
                  case 'APROBADO':
                    return '#16a34a'; // Green
                  case 'RECHAZADO':
                    return '#dc2626'; // Red
                  default:
                    return '#d97706'; // Dark yellow/orange
                }
              };

              const badge = getBadgeProps(pago.estado);

              return (
                <div key={pago.id} className="payment-item">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h4 className="payment-title" style={{ margin: 0 }}>
                        Pago reportado
                      </h4>
                      <span className={`badge bg-${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="payment-date" style={{ margin: 0 }}>
                      {new Date(pago.fecha_pago).toLocaleDateString("es-PE")}
                      {" • "}
                      {pago.metodo_pago}
                    </p>

                    {pago.numero_operacion && (
                      <p className="payment-op" style={{ margin: '2px 0 0 0' }}>Op. {pago.numero_operacion}</p>
                    )}

                    {pago.estado === 'RECHAZADO' && pago.motivo_rechazo && (
                      <p className="payment-op text-danger fw-semibold" style={{ margin: '4px 0 0 0' }}>
                        Motivo: {pago.motivo_rechazo}
                      </p>
                    )}
                  </div>

                  <div className="payment-price" style={{ color: getPriceColor(pago.estado) }}>
                    + S/ {Number(pago.monto_total_entregado).toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <PagoModal
        show={showPagoModal}
        onHide={() => setShowPagoModal(false)}
        deudas={selectedAlumno?.deudas || []}
        onSuccess={loadDashboard}
      />
    </div>
  );
};

export default Payments;

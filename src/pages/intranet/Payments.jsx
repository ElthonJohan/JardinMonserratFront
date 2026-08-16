import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import PagoModal from "./PagoModal";
import toast from "react-hot-toast";
import HistorialPagosModal from "./HistorialPagosModal";
import DetallePagoModal from "./DetallePagoModal";
import GuiaPagosModal from "./GuiaPagosModal";
import { Spinner } from "react-bootstrap";

import "../../styles/intranetPagos.css";

// Iconos vectoriales
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);
const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const getNombreMes = (num) => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return meses[num - 1] || "";
};

const Payments = () => {
  const [dashboard, setDashboard] = useState(null);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [showPagoModal, setShowPagoModal] = useState(false);
  const [showDetallePago, setShowDetallePago] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [showHistorialPagos, setShowHistorialPagos] = useState(false);
  const [showGuia, setShowGuia] = useState(false);

  const loadDashboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

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

      if (isRefresh) toast.success("Información actualizada");
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la información de pagos.");
      if (isRefresh) toast.error("Error al actualizar la información de pagos.");
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
      <div className="payments-loading">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Cargando módulos de pago...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return <div className="payments-error-card">{error || "Error al cargar datos"}</div>;
  }

  // Deuda principal destacada (la más próxima a vencer)
  const proximaDeuda = selectedAlumno?.deudas?.[0];
  const totalPagado = selectedAlumno?.total_pagado || 0;
  const porcentajeProgreso = selectedAlumno?.porcentaje_progreso || 0;

  return (
    <div className="payments-container">
      {/* HEADER PRINCIPAL */}
      <div className="payments-page-header">
        <div>
          <h1>Seguimiento de Pagos</h1>
          <p>Gestiona las colegiaturas y revisa el historial de transacciones.</p>
        </div>

        <div className="header-buttons">
          <button className="btn-action-light" onClick={() => setShowGuia(true)}>
            <HelpIcon /> Guía de Pagos
          </button>
          <button className="btn-action-primary" onClick={() => loadDashboard(true)} disabled={refreshing}>
            <RefreshIcon /> {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {/* SELECTOR DE ESTUDIANTE */}
      <div className="student-selector-bar">
        {dashboard.alumnos?.map((alumno) => (
          <button
            key={alumno.id}
            className={`student-tab ${selectedAlumno?.id === alumno.id ? "active" : ""}`}
            onClick={() => setSelectedAlumno(alumno)}
          >
            👦 {alumno.nombre}
          </button>
        ))}
      </div>

      {/* TOP SUMMARY CARDS GRID */}
      <div className="payments-top-grid">
        {/* TARJETA PRÓXIMO VENCIMIENTO / PAGAR AHORA */}
        <div className={`featured-pay-card ${proximaDeuda ? "has-debt" : "no-debt"}`}>
          <div className="featured-card-top">
            <span className={`status-pill ${proximaDeuda ? "overdue" : "success"}`}>
              {proximaDeuda ? "Acción Requerida" : "Al Día"}
            </span>
            <div className="amount-group">
              <span className="amount-label">Monto a Pagar</span>
              <h2 className="amount-value">
                S/ {Number(selectedAlumno?.total_pendiente || 0).toFixed(2)}
              </h2>
            </div>
          </div>

          <div className="featured-card-body">
            <h3>
              {proximaDeuda
                ? `${proximaDeuda.concepto_detail?.nombre || "Colegiatura"} ${
                    proximaDeuda.mes ? `- ${getNombreMes(proximaDeuda.mes)}` : ""
                  }`
                : "Sin pensiones pendientes"}
            </h3>
            <p className="student-sub">Estudiante: {selectedAlumno?.nombre}</p>

            {proximaDeuda && (
              <div className="debt-details-box">
                <span>Fecha Vencimiento: <strong>{new Date(proximaDeuda.fecha_vencimiento).toLocaleDateString("es-PE")}</strong></span>
              </div>
            )}
          </div>

          <div className="featured-card-actions">
            <button
              className="btn-pay-now"
              onClick={() => setShowPagoModal(true)}
              disabled={selectedAlumno?.deudas?.length === 0}
            >
              Pagar Ahora
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: PROGRESO Y MÉTODOS */}
        <div className="side-summary-stack">
          {/* TARJETA TOTAL PAGADO */}
          <div className="summary-card-mini">
            <div className="mini-card-header">
              <span>Total Pagado (Ciclo)</span>
              <span className="check-icon">✓</span>
            </div>
            <h3 className="mini-card-amount">S/ {Number(totalPagado).toFixed(2)}</h3>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(porcentajeProgreso, 100)}%` }}
              ></div>
            </div>
            <span className="progress-text">{porcentajeProgreso.toFixed(0)}% Completado</span>
          </div>

          {/* TARJETA MÉTODOS DISPONIBLES */}
          <div className="summary-card-mini">
            <span className="mini-card-title">Métodos de Pago Aceptados</span>
            <div className="payment-methods-list">
              <div className="method-item">
                <CreditCardIcon />
                <div>
                  <p className="method-name">Yape / Plin / BCP</p>
                  <span className="method-sub">Transferencia directa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DETALLE: CUOTAS Y PAGOS */}
      <div className="payments-tables-section">
        <div className="table-card">
          <div className="table-card-header">
            <h3>Cuotas del Ciclo Escolar</h3>
          </div>

          {selectedAlumno?.deudas?.length === 0 ? (
            <div className="empty-table-state">
              <p>🎉 ¡Excelente! No hay cuotas pendientes para este estudiante.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-payments-table">
                <thead>
                  <tr>
                    <th>CONCEPTO</th>
                    <th>VENCIMIENTO</th>
                    <th>MONTO</th>
                    <th>ESTADO</th>
                    <th className="text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAlumno?.deudas?.map((deuda) => (
                    <tr key={deuda.id}>
                      <td>
                        <div className="concept-cell">
                          <span className="concept-title">
                            {deuda.concepto_detail?.nombre || "Cuota"} {deuda.mes ? `- ${getNombreMes(deuda.mes)}` : ""}
                          </span>
                          <span className="concept-sub">{deuda.anio ? `Año: ${deuda.anio}` : ""}</span>
                        </div>
                      </td>
                      <td className="text-muted">
                        {new Date(deuda.fecha_vencimiento).toLocaleDateString("es-PE")}
                      </td>
                      <td className="font-semibold">
                        S/ {Number(deuda.saldo_pendiente).toFixed(2)}
                      </td>
                      <td>
                        <span className={`status-pill ${deuda.estado === "VENCIDO" ? "overdue" : "pending"}`}>
                          {deuda.estado}
                        </span>
                      </td>
                      <td className="text-right">
                        <button className="btn-table-pay" onClick={() => setShowPagoModal(true)}>
                          Pagar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ÚLTIMAS TRANSACTIONS / HISTORIAL */}
        <div className="table-card mt-4">
          <div className="table-card-header">
            <h3>Historial Reciente de Pagos</h3>
            <button className="btn-link-action" onClick={() => setShowHistorialPagos(true)}>
              Ver Historial Completo →
            </button>
          </div>

          {selectedAlumno?.pagos_recientes?.length === 0 ? (
            <div className="empty-table-state">
              <p>No se han registrado reportes de pago recientemente.</p>
            </div>
          ) : (
            <div className="recent-payments-list">
              {selectedAlumno?.pagos_recientes?.map((pago) => (
                <div
                  key={pago.id}
                  className="recent-payment-row"
                  onClick={() => {
                    setPagoSeleccionado(pago);
                    setShowDetallePago(true);
                  }}
                >
                  <div className="row-main-info">
                    <span className="payment-origin-badge">
                      {pago.origen === "ADMINISTRACION" ? "🏫 Caja Presencial" : "📱 App Apoderado"}
                    </span>
                    <div>
                      <h4 className="payment-monto">S/ {Number(pago.monto_total_entregado).toFixed(2)}</h4>
                      <p className="payment-meta">
                        {new Date(pago.fecha_pago).toLocaleDateString("es-PE")} • {pago.metodo_pago}
                      </p>
                    </div>
                  </div>

                  <div className="row-status-col">
                    <span className={`status-pill ${
                      pago.estado === "APROBADO" ? "approved" : pago.estado === "RECHAZADO" ? "rejected" : "pending"
                    }`}>
                      {pago.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALES */}
      <PagoModal
        show={showPagoModal}
        onHide={() => setShowPagoModal(false)}
        deudas={selectedAlumno?.deudas || []}
        onSuccess={loadDashboard}
      />

      <DetallePagoModal
        show={showDetallePago}
        onHide={() => setShowDetallePago(false)}
        pagoSeleccionado={pagoSeleccionado}
      />

      <HistorialPagosModal
        show={showHistorialPagos}
        onHide={() => setShowHistorialPagos(false)}
        pagos={selectedAlumno?.historial_pagos || []}
        onVerDetalle={(pago) => {
          setPagoSeleccionado(pago);
          setShowHistorialPagos(false);
          setShowDetallePago(true);
        }}
      />

      <GuiaPagosModal
        show={showGuia}
        onHide={() => setShowGuia(false)}
      />
    </div>
  );
};

export default Payments;
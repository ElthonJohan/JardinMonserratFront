import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import '../styles/PagosPage.css';
import RegistroPago from '../components/pagos/RegistroPago';
import GestionCaja from '../components/pagos/GestionCaja';
import AuditoriaAlumno from '../components/pagos/AuditoriaAlumno';
import ValidacionPagos from '../components/pagos/ValidacionPagos';
import { AppNavbar, ErrorBoundary } from '../components/shared';
import { getEstudiantes } from '../api/estudiantesAPI';

const TABS = [
  { key: 'registro',   label: 'Registro de Pago',   icon: '📝' },
  { key: 'caja',       label: 'Gestión de Caja',    icon: '💼' },
  { key: 'auditoria',  label: 'Auditoría de Pagos', icon: '📊' },
  { key: 'validacion', label: 'Validación de Pagos', icon: '✅' },
];

export default function PagosPage() {
  const [alumnos, setAlumnos] = useState([]);
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('registro');

  const cargarAlumnos = async () => {
    setLoading(true);
    try {
      const response = await getEstudiantes();
      const estudiantesArray = Array.isArray(response) ? response : response?.results || [];
      setAlumnos(estudiantesArray);
    } catch (error) {
      toast.error('Error al cargar alumnos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const handlePagoRegistrado = () => {
    // Aquí puedes agregar lógica para refrescar datos si es necesario
  };

  const handleCajaChange = (abierta) => {
    setCajaAbierta(abierta);
  };

  /* ── Render tab content ── */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'registro':
        return loading ? (
          <div className="pagos-loading">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <ErrorBoundary>
            <RegistroPago
              alumnos={alumnos}
              cajaAbierta={cajaAbierta}
              onPagoRegistrado={handlePagoRegistrado}
            />
          </ErrorBoundary>
        );

      case 'caja':
        return (
          <ErrorBoundary>
            <GestionCaja onCajaChange={handleCajaChange} />
          </ErrorBoundary>
        );

      case 'auditoria':
        return loading ? (
          <div className="pagos-loading">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <ErrorBoundary>
            <AuditoriaAlumno alumnos={alumnos} />
          </ErrorBoundary>
        );

      case 'validacion':
        return (
          <ErrorBoundary>
            <ValidacionPagos />
          </ErrorBoundary>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pagos-container">
      <AppNavbar />

      <div className="container-pagos">

        {/* ── Page Header ── */}
        <div className="pagos-header">
          <h1>Tesorería - Gestión de Pagos</h1>
          <p>Registro de pagos y control de caja diaria</p>
        </div>

        {/* ── Custom Tabs ── */}
        <div className="pagos-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`pagos-tab-btn${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="pagos-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content Card ── */}
        <div className="pagos-tab-content">
          <div className="pagos-tab-panel">
            {renderTabContent()}
          </div>
        </div>

      </div>
    </div>
  );
}

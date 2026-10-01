import React, { useState, useEffect, useRef } from 'react';
import { getAulas } from '../../../api/aulasAPI';
import { getPeriodosAcademicos } from '../../../api/matriculasAPI';
import { getReporteLibretasAula } from '../../../api/reportesAPI';
import { useReactToPrint } from 'react-to-print';
import LibretaPrintWrapper from './LibretaPrintWrapper';
import { AppNavbar } from '../../../components/shared';
import '../../../styles/aulas.css';
import './LibretasReportes.css';

const LibretasPage = () => {
  const [aulas, setAulas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  
  const [aulaSeleccionada, setAulaSeleccionada] = useState('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');
  
  const [datosReporte, setDatosReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const componentRef = useRef(null);

  // Cargar Aulas y Periodos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aulasRes, periodosRes] = await Promise.all([
          getAulas(),
          getPeriodosAcademicos()
        ]);
        setAulas(aulasRes.results || aulasRes || []);
        setPeriodos(periodosRes.results || periodosRes || []);
      } catch (err) {
        console.error("Error cargando filtros:", err);
      }
    };
    fetchData();
  }, []);

  const handleGenerarReporte = async () => {
    if (!aulaSeleccionada || !periodoSeleccionado) {
      setError('Por favor, selecciona un aula y un periodo.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await getReporteLibretasAula({
        aula_id: aulaSeleccionada,
        periodo_academico_id: periodoSeleccionado
      });
      setDatosReporte(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Ocurrió un error al generar las libretas.');
      setDatosReporte(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Libretas_Aula_${aulaSeleccionada}_Periodo_${periodoSeleccionado}`,
  });

  return (
    <>
      <AppNavbar />
      <div className="matriculas-container">
        <div className="container-matriculas">
          {/* HEADER */}
          <div className="matriculas-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h1>📄 Generación de Libretas</h1>
                <p className="text-muted mb-0">Genera y descarga en PDF las libretas de notas de las aulas seleccionadas.</p>
              </div>
            </div>
          </div>

          <div className="search-card mb-4" style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label fw-bold">Periodo Académico (Año):</label>
              <select 
                className="form-select"
                value={periodoSeleccionado} 
                onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              >
                <option value="">-- Seleccionar Periodo --</option>
                {periodos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label fw-bold">Aula / Sección:</label>
              <select 
                className="form-select"
                value={aulaSeleccionada} 
                onChange={(e) => setAulaSeleccionada(e.target.value)}
              >
                <option value="">-- Seleccionar Aula --</option>
                {aulas.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-primary fw-bold" 
                onClick={handleGenerarReporte}
                disabled={loading || !aulaSeleccionada || !periodoSeleccionado}
              >
                {loading ? 'Cargando...' : 'Obtener Datos'}
              </button>

              {datosReporte && (
                <button 
                  className="btn btn-success fw-bold" 
                  onClick={handlePrint}
                >
                  🖨️ Imprimir / PDF
                </button>
              )}
            </div>
          </div>

          {error && <div className="alert alert-danger mb-4">{error}</div>}

          {/* Previsualización */}
          {datosReporte && (
            <div className="libretas-preview-container" style={{ borderRadius: '8px' }}>
              <LibretaPrintWrapper 
                ref={componentRef} 
                datosReporte={datosReporte} 
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LibretasPage;

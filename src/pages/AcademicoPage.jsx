import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppNavbar, ErrorBoundary, Loading } from '../components/shared';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosConfig';
import { getAulas } from '../api/aulasAPI';
import { getPeriodosAcademicos } from '../api/matriculasAPI';
import {
  getPeriodos,
  getAreas,
  getCompetencias,
  getAsignaciones
} from '../api/academicoAPI';

// Import subcomponents
import AsignacionesTab from './academico/components/AsignacionesTab';
import AreasTab from './academico/components/AreasTab';
import CompetenciasTab from './academico/components/CompetenciasTab';
import PeriodosTab from './academico/components/PeriodosTab';

export default function AcademicoPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lists state
  const [asignaciones, setAsignaciones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  // Dropdowns/Master data state
  const [aulas, setAulas] = useState([]);
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
  const [docentes, setDocentes] = useState([]);

  // Loaders
  const [loadingList, setLoadingList] = useState(true);

  // Sync tab with search params
  const activeTab = searchParams.get("tab") || "asignacion";

  // Load all lists concurrently
  const loadAllData = async () => {
    setLoadingList(true);
    try {
      const [resAsignaciones, resAreas, resCompetencias, resPeriodos, resAulas, resPeriodosAcademico, resDocentes] = await Promise.all([
        getAsignaciones(),
        getAreas(),
        getCompetencias(),
        getPeriodos(),
        getAulas(),
        getPeriodosAcademicos(),
        axiosInstance.get('/auth/usuarios/docentes/')
      ]);

      const normalizeList = (response) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.results) return response.results;
        if (response?.data?.results) return response.data.results;
        return [];
      };

      setAsignaciones(normalizeList(resAsignaciones));
      setAreas(normalizeList(resAreas));
      setCompetencias(normalizeList(resCompetencias));
      setPeriodos(normalizeList(resPeriodos));
      setAulas(normalizeList(resAulas));
      setPeriodosAcademicos(normalizeList(resPeriodosAcademico));
      setDocentes(normalizeList(resDocentes));
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar datos académicos');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Individual refreshes for mutations
  const fetchAsignaciones = async () => {
    try {
      const res = await getAsignaciones();
      setAsignaciones(Array.isArray(res) ? res : res.results || []);
    } catch (e) {
      toast.error('Error al refrescar asignaciones');
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await getAreas();
      setAreas(Array.isArray(res) ? res : res.results || []);
    } catch (e) {
      toast.error('Error al refrescar áreas');
    }
  };

  const fetchCompetencias = async () => {
    try {
      const res = await getCompetencias();
      setCompetencias(Array.isArray(res) ? res : res.results || []);
    } catch (e) {
      toast.error('Error al refrescar competencias');
    }
  };

  const fetchPeriodos = async () => {
    try {
      const res = await getPeriodos();
      setPeriodos(Array.isArray(res) ? res : res.results || []);
    } catch (e) {
      toast.error('Error al refrescar periodos');
    }
  };

  if (loadingList) {
    return <Loading message="Cargando panel académico administrativo..." />;
  }

  return (
    <ErrorBoundary>
      <AppNavbar />
      <Container className="mt-4 mb-5" style={{ maxWidth: '1200px' }}>
        <Row className="mb-4">
          <Col>
            <h1 className="display-5 fw-bold text-dark">Panel Administrativo Académico</h1>
            <p className="text-muted">
              Gestión de periodos, áreas, competencias y asignación docente
            </p>
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onSelect={(tab) => {
            navigate(`/academico?tab=${tab}`);
          }}
          className="mb-4"
          id="academico-tabs"
        >
          <Tab eventKey="asignacion" title="📑 Asignación Docente">
            <AsignacionesTab
              asignaciones={asignaciones}
              docentes={docentes}
              aulas={aulas}
              areas={areas}
              periodosAcademicos={periodosAcademicos}
              onRefresh={fetchAsignaciones}
            />
          </Tab>

          <Tab eventKey="areas" title="🗂️ Áreas Académicas">
            <AreasTab
              areas={areas}
              onRefresh={fetchAreas}
            />
          </Tab>

          <Tab eventKey="competencias" title="🎯 Competencias">
            <CompetenciasTab
              competencias={competencias}
              areas={areas}
              onRefresh={fetchCompetencias}
            />
          </Tab>

          <Tab eventKey="periodos" title="📅 Periodos de Evaluación">
            <PeriodosTab
              periodos={periodos}
              periodosAcademicos={periodosAcademicos}
              onRefresh={fetchPeriodos}
            />
          </Tab>
        </Tabs>
      </Container>
    </ErrorBoundary>
  );
}

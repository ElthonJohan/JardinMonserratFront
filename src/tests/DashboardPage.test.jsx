import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../pages/DashboardPage';
import { getDashboardStats } from '../api/dashboardAPI';
import { useNavigate } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock API module
vi.mock('../api/dashboardAPI', () => ({
  getDashboardStats: vi.fn(),
}));

// Mock AppNavbar component
vi.mock('../components/shared', () => ({
  AppNavbar: () => <div data-testid="app-navbar" />,
}));

const mockStats = {
  kpis: {
    total_alumnos_activos: 150,
    matriculas_anio: 45,
    pagos_pendientes_cantidad: 12,
    pagos_pendientes_monto: 3450.50,
    recaudacion_actual: 5000.00,
    recaudacion_anterior: 4200.00,
  },
  distribucion_aulas: [
    { nombre_aula: '3 Años', total: 15, capacidad: 20 },
    { nombre_aula: '4 Años', total: 18, capacidad: 20 },
  ],
  top_deudores: [
    { alumno__id: 1, nombre_completo: 'Juan Perez', deuda_total: '350.00' },
    { alumno__id: 2, nombre_completo: 'Maria Gomez', deuda_total: '120.50' },
  ],
};

describe('DashboardPage Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    getDashboardStats.mockResolvedValue(mockStats);
  });

  it('debe renderizar cargando inicialmente', async () => {
    getDashboardStats.mockReturnValue(new Promise(() => { }));
    render(<DashboardPage />);

    expect(screen.getByTestId('app-navbar')).toBeInTheDocument();
    expect(screen.getByText('Centro de Operaciones')).toBeInTheDocument();
  });

  it('debe renderizar las KPIs y los datos de la API correctamente', async () => {
    render(<DashboardPage />);

    // Esperar a que el loading termine
    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument(); // Alumnos activos
    });

    // Validar KPIs
    expect(screen.getByText('45')).toBeInTheDocument(); // Matrículas año
    expect(screen.getByText('12 rcbs')).toBeInTheDocument(); // Recibos pendientes
    expect(screen.getByText('S/ 3450.50')).toBeInTheDocument(); // Monto pendiente
    expect(screen.getByText('S/ 5000.00')).toBeInTheDocument(); // Recaudado mes

    // Validar diferencias y comparación vs mes anterior
    expect(screen.getByText(/▲ \+ S\/ 800.00 vs mes ant./i)).toBeInTheDocument();

    // Validar tabla de deudores
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('S/ 350.00')).toBeInTheDocument();
    expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
    expect(screen.getByText('S/ 120.50')).toBeInTheDocument();
  });

  it('debe permitir cambiar el año lectivo y realizar una nueva llamada a la API', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    const yearSelect = screen.getByRole('combobox');
    expect(yearSelect.value).toBe('2026');

    // Cambiar a 2025
    await userEvent.selectOptions(yearSelect, '2025');

    expect(getDashboardStats).toHaveBeenCalledWith(2025);
  });

  it('debe mostrar el desglose de distribución por aulas en el modal', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    // Abrir modal haciendo clic en "Alumnos" o "Ver desglose por aula"
    const kpiAlumnosCard = screen.getByText('Ver desglose por aula →');
    await userEvent.click(kpiAlumnosCard);

    // Validar título y elementos del modal
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Distribución Académica — Año 2026/i)).toBeInTheDocument();
    expect(screen.getByText('Aula 3 Años')).toBeInTheDocument();
    expect(screen.getByText('15 / 20 alumnos')).toBeInTheDocument();
    expect(screen.getByText('Aula 4 Años')).toBeInTheDocument();
    expect(screen.getByText('18 / 20 alumnos')).toBeInTheDocument();

    // Cerrar modal
    const closeBtn = screen.getByRole('button', { name: /Cerrar/i });
    await userEvent.click(closeBtn);

    // Esperar que desaparezca el modal
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('debe navegar a las secciones correctas al hacer clic en las KPIs y botones', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    // Click en la KPI de Matriculas
    const matriculasKpi = screen.getByRole('heading', { name: /Matrículas/i }).closest('.kpi-card');
    await userEvent.click(matriculasKpi);
    expect(mockNavigate).toHaveBeenCalledWith('/matriculas');

    // Click en la KPI de Deudas Pendientes
    const deudasKpi = screen.getByRole('heading', { name: /Deudas Pendientes/i }).closest('.kpi-card');
    await userEvent.click(deudasKpi);
    expect(mockNavigate).toHaveBeenCalledWith('/pagos');

    // Click en el botón "Cobrar" de un deudor de la lista
    const cobrarBtn = screen.getAllByRole('button', { name: /Cobrar/i })[0];
    await userEvent.click(cobrarBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/pagos');

    // Acceso Rápido: Gestión de Alumnos
    const quickAlumnos = screen.getByRole('button', { name: /Gestión de Alumnos/i });
    await userEvent.click(quickAlumnos);
    expect(mockNavigate).toHaveBeenCalledWith('/estudiantes');
  });
});

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PagosPage from '../pages/PagosPage';
import { getEstudiantes } from '../api/estudiantesAPI';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Mock react-router-dom
const mockNavigate = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams, vi.fn()],
}));

// Mock API
vi.mock('../api/estudiantesAPI', () => ({
  getEstudiantes: vi.fn(),
}));

// Mock AppNavbar
vi.mock('../components/shared', () => ({
  AppNavbar: () => <div data-testid="app-navbar" />,
  ErrorBoundary: ({ children }) => <>{children}</>,
}));

// Mock Child Components to test state and props propagation
vi.mock('../components/pagos/RegistroPago', () => ({
  default: ({ alumnos, cajaAbierta }) => (
    <div data-testid="mock-registro-pago">
      <span>RegistroPago Component</span>
      <span data-testid="num-alumnos">{alumnos.length}</span>
      <span data-testid="caja-estado">{cajaAbierta ? 'abierta' : 'cerrada'}</span>
    </div>
  ),
}));

vi.mock('../components/pagos/GestionCaja', () => ({
  default: ({ onCajaChange }) => (
    <div data-testid="mock-gestion-caja">
      <span>GestionCaja Component</span>
      <button onClick={() => onCajaChange(true)} data-testid="btn-abrir-caja">
        Abrir Caja
      </button>
      <button onClick={() => onCajaChange(false)} data-testid="btn-cerrar-caja">
        Cerrar Caja
      </button>
    </div>
  ),
}));

vi.mock('../components/pagos/AuditoriaAlumno', () => ({
  default: ({ alumnos }) => (
    <div data-testid="mock-auditoria-alumno">
      <span>AuditoriaAlumno Component</span>
      <span data-testid="auditoria-num-alumnos">{alumnos.length}</span>
    </div>
  ),
}));

vi.mock('../components/pagos/ValidacionPagos', () => ({
  default: () => <div data-testid="mock-validacion-pagos">ValidacionPagos Component</div>,
}));

const mockAlumnos = [
  { id: 1, nombre_completo: 'Juan Perez' },
  { id: 2, nombre_completo: 'Maria Gomez' },
];

describe('PagosPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams('tab=registro');
    getEstudiantes.mockResolvedValue(mockAlumnos);
  });

  it('debe renderizar el título de la página y las pestañas', async () => {
    render(<PagosPage />);

    expect(screen.getByTestId('app-navbar')).toBeInTheDocument();
    expect(screen.getByText('Tesorería - Gestión de Pagos')).toBeInTheDocument();
    expect(screen.getByText('📝 Registro de Pago')).toBeInTheDocument();
    expect(screen.getByText('💼 Gestión de Caja')).toBeInTheDocument();
    expect(screen.getByText('📊 Auditoría de Pagos')).toBeInTheDocument();
    expect(screen.getByText('✅ Validación de Pagos')).toBeInTheDocument();

    await waitFor(() => {
      expect(getEstudiantes).toHaveBeenCalledTimes(1);
    });
  });

  it('debe cargar la lista de alumnos e iniciar en la pestaña de Registro de Pago', async () => {
    render(<PagosPage />);

    // Esperar a que se resuelva la carga de alumnos
    await waitFor(() => {
      expect(screen.getByTestId('mock-registro-pago')).toBeInTheDocument();
    });

    expect(screen.getByTestId('num-alumnos')).toHaveTextContent('2');
    expect(screen.getByTestId('caja-estado')).toHaveTextContent('cerrada');
  });

  it('debe navegar a la pestaña seleccionada', async () => {
    render(<PagosPage />);

    const tabGestionCaja = screen.getByText('💼 Gestión de Caja');
    await userEvent.click(tabGestionCaja);

    expect(mockNavigate).toHaveBeenCalledWith('/pagos?tab=caja');
  });

  it('debe propagar el estado de la caja desde GestionCaja a RegistroPago', async () => {
    // Inicializar en pestaña de caja para interactuar con ella
    mockSearchParams = new URLSearchParams('tab=caja');
    const { rerender } = render(<PagosPage />);

    expect(screen.getByTestId('mock-gestion-caja')).toBeInTheDocument();

    // Abrir caja
    const btnAbrir = screen.getByTestId('btn-abrir-caja');
    await userEvent.click(btnAbrir);

    // Cambiar la pestaña a registro de pago mediante búsqueda de URL
    mockSearchParams = new URLSearchParams('tab=registro');
    rerender(<PagosPage />);

    // Verificar que RegistroPago reciba cajaAbierta = true
    await waitFor(() => {
      expect(screen.getByTestId('mock-registro-pago')).toBeInTheDocument();
    });
    expect(screen.getByTestId('caja-estado')).toHaveTextContent('abierta');
  });

  it('debe renderizar el componente de Auditoría de Pagos al estar en su pestaña', async () => {
    mockSearchParams = new URLSearchParams('tab=auditoria');
    render(<PagosPage />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-auditoria-alumno')).toBeInTheDocument();
    });
    expect(screen.getByTestId('auditoria-num-alumnos')).toHaveTextContent('2');
  });

  it('debe renderizar el componente de Validación de Pagos al estar en su pestaña', async () => {
    mockSearchParams = new URLSearchParams('tab=validacion');
    render(<PagosPage />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-validacion-pagos')).toBeInTheDocument();
    });
  });
});

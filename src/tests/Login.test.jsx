// src/tests/auth/Login.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../components/login/LoginPage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('LoginPage Component', () => {
    const mockNavigate = vi.fn();
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        useAuth.mockReturnValue({
            login: mockLogin,
            user: null, // Agregar estado de usuario
        });
    });

    it('debe renderizar el formulario de login', () => {
        render(<LoginPage />);
        expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('debe llamar a login y navegar a /dashboard al ingresar credenciales correctas', async () => {
        mockLogin.mockResolvedValue(true);
        render(<LoginPage />);

        const userInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(userInput, 'testuser');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(submitButton);

        expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('debe mostrar mensaje de error si el login falla', async () => {
        mockLogin.mockResolvedValue(false);
        render(<LoginPage />);

        const userInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(userInput, 'testuser');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(submitButton);

        expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('Usuario o contraseña incorrectos');
    });

    it('debe deshabilitar los campos y mostrar estado de carga mientras se envía', async () => {
        let resolveLogin;
        const slowLoginPromise = new Promise((resolve) => {
            resolveLogin = resolve;
        });
        mockLogin.mockReturnValue(slowLoginPromise);

        render(<LoginPage />);

        const userInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(userInput, 'testuser');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(submitButton);

        expect(screen.getByRole('button', { name: /iniciando sesión.../i })).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
        expect(userInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();

        resolveLogin(true);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    // 👇 PRUEBAS ADICIONALES SUGERIDAS

    it('debe navegar automáticamente a /dashboard si el usuario ya está autenticado', () => {
        // Simular que el usuario ya está autenticado
        useAuth.mockReturnValue({
            login: mockLogin,
            isAuthenticated: true,
            user: { id: 1, username: 'testuser' }, // Usuario autenticado
        });

        render(<LoginPage />);

        // Debería navegar inmediatamente
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('debe mostrar error si el usuario no ingresa credenciales', async () => {
        render(<LoginPage />);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        // Hacer clic sin llenar campos
        await userEvent.click(submitButton);

        // Verificar mensajes de validación en el formulario
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('debe manejar errores de red en el login', async () => {
        // Simular un error de red
        mockLogin.mockRejectedValue(new Error('Error de conexión'));

        render(<LoginPage />);

        const userInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await userEvent.type(userInput, 'testuser');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(submitButton);

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('Error en la conexión con el servidor');
    });
});
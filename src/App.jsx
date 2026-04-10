import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary, ProtectedRoute } from './components/shared';
import { LoginPage } from './components/login';
import { AlumnosPage } from './components/core';
import { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Login - Ruta pública */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Dashboard - Ruta protegida */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Alumnos - Ruta protegida */}
            <Route
              path="/alumnos"
              element={
                <ProtectedRoute>
                  <AlumnosPage />
                </ProtectedRoute>
              }
            />

            {/* Ruta raíz - Redirige a login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Página 404 - Redirige a login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;

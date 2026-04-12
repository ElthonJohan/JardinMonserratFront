import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary, ProtectedRoute } from './components/shared';
import { LoginPage } from './components/login';
import { AlumnosPage } from './components/core';
import { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage';
import LandinPage from './pages/LandinPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandinPage />} />
            <Route path="/landing" element={<LandinPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute> }/> 
            <Route path="/alumnos" element={<ProtectedRoute> <AlumnosPage /> </ProtectedRoute> }/>
            <Route path="*" element={<Navigate to="/" replace />} /> </Routes>
          
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
            }}/>

        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;

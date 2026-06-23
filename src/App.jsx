import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PanelDocentePage from "./pages/docente/PanelDocentePage";
import MatrizNotasPage from "./pages/docente/MatrizNotasPage";
import { ErrorBoundary, ProtectedRoute } from "./components/shared";
import { LoginPage } from "./components/login";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import Dashboard from "./pages/intranet/Dashboard";
import LandinPage from "./pages/LandinPage";
import EstudiantesPage from "./pages/EstudiantesPage";
import MatriculasPage from "./pages/MatriculasPage";
import PagosPage from "./pages/PagosPage";
import Register from "./pages/Register";
import ApoderadosPage from "./pages/ApoderadosPage";
import AulasPage from "./pages/AulasPage";
import ConceptosPage from "./pages/ConceptosPage";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import UsuariosPage from "./pages/UsuariosPage";
import RolesPage from "./pages/RolesPage";
import PeriodosPage from "./pages/PeriodosPage";
import BancosPage from "./pages/BancosPage";
import AcademicoPage from "./pages/AcademicoPage";
import ValidacionPagos from "./components/pagos/ValidacionPagos";
import Payments from "./pages/intranet/Payments";
import LoginParent from "./pages/intranet/LoginParent";
import IntranetLayout from "./pages/intranet/IntranetLayout";
import ChangePassword from "./pages/intranet/ChangePassword";
import Profile from "./pages/intranet/Profile"; 
import "./App.css";
import ConfiguracionPagosPage from "./pages/ConfiguracionPagosPage";

const TeacherRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#f8f9fa' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isTeacher) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandinPage />} />
            <Route path="/landing" element={<LandinPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-parent" element={<LoginParent />} />
            <Route path="/change-password" element={<ChangePassword />} />
            {/* ==================== INTRANET PARA APODERADOS ==================== */}
            <Route
              path="/intranet"
              element={
                <ProtectedRoute allowedPermissions={["parent"]}>
                  <IntranetLayout />
                </ProtectedRoute>
              }
            >

              <Route index element={<Dashboard />} />
              <Route path="pagos" element={<Payments />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* ==================== INTRANET PARA DOCENTES ==================== */}
            <Route
              path="/docente/mis-cursos"
              element={
                <TeacherRoute>
                  <PanelDocentePage />
                </TeacherRoute>
              }
            />
            <Route
              path="/docente/evaluar/:asignacionId"
              element={
                <TeacherRoute>
                  <MatrizNotasPage />
                </TeacherRoute>
              }
            />


            
      
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {" "}
                  <DashboardPage />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/estudiantes"
              element={
                <ProtectedRoute allowedPermissions={["view_estudiante"]}>
                  {" "}
                  <EstudiantesPage />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/apoderados"
              element={
                <ProtectedRoute allowedPermissions={["view_apoderado"]}>
                  <ApoderadosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aulas"
              element={
                <ProtectedRoute allowedPermissions={["view_aula"]}>
                  <AulasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matriculas"
              element={
                <ProtectedRoute allowedPermissions={["view_matricula"]}>
                  <MatriculasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pagos"
              element={
                <ProtectedRoute allowedPermissions={["view_pago"]}>
                  <PagosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/validacion-pagos"
              element={
                <ProtectedRoute allowedPermissions={["view_pago"]}>
                  <ValidacionPagos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conceptos"
              element={
                <ProtectedRoute allowedPermissions={["view_conceptopago"]}>
                  <ConceptosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute
                  allowedPermissions={[
                    "view_periodoacademico",
                    "view_aula",
                    "view_conceptopago",
                    "view_apoderado",
                    "view_usuario",
                    "view_group",
                  ]}
                >
                  <ConfiguracionPage />
                </ProtectedRoute>
              }
            />
            <Route
    path="/configuracion-pagos"
    element={<ConfiguracionPagosPage />}
/>
            <Route
              path="/periodos"
              element={
                <ProtectedRoute allowedPermissions={["view_periodoacademico"]}>
                  <PeriodosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute allowedPermissions={["view_usuario"]}>
                  <UsuariosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute allowedPermissions={["view_group"]}>
                  <RolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bancos"
              element={
                <ProtectedRoute allowedPermissions={["view_banco"]}>
                  <BancosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/academico"
              element={
                <ProtectedRoute allowedPermissions={["view_asignaciondocente", "view_periodoacademico"]}>
                  <AcademicoPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />{" "}
          </Routes>
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import Payments from "./pages/intranet/Payments";
import LoginParent from "./pages/intranet/LoginParent";
import IntranetLayout from "./pages/intranet/IntranetLayout";
import ChangePassword from "./pages/intranet/ChangePassword";
import Profile from "./pages/intranet/Profile";
import "./App.css";

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

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { Spinner } from "react-bootstrap";

import "../../styles/Profile.css";

// Iconos vectoriales
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const IdIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="11" y2="12"></line></svg>
);
const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const getRelacionLabel = (tipo) => {
  switch (tipo) {
    case "PADRE": return "Padre";
    case "MADRE": return "Madre";
    case "TUTOR": return "Tutor Legal";
    case "ABUELO": return "Abuelo/a";
    default: return tipo;
  }
};

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/parent/profile/");
      setUserData(response.data);
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (!userData) {
    return (
      <div className="profile-loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Cargando perfil del apoderado...</p>
      </div>
    );
  }

  const getInitials = () => {
    const n = userData.nombres?.charAt(0) || "";
    const a = userData.apellidos?.charAt(0) || "";
    return `${n}${a}`.toUpperCase() || "AP";
  };

  return (
    <div className="profile-container">
      {/* HEADER PAGE */}
      <div className="profile-page-header">
        <h1>Mi Perfil</h1>
        <p>Administra tu información personal y revisa los datos de tus representados.</p>
      </div>

      {/* HERO CARD DE USUARIO */}
      <div className="profile-hero-card">
        <div className="hero-avatar">
          {getInitials()}
        </div>
        <div className="hero-info">
          <div className="hero-title-row">
            <h2>{userData.nombres} {userData.apellidos}</h2>
            <span className="role-pill">{userData.role || "Apoderado"}</span>
          </div>
          <p className="hero-desc">
            Portal Institucional Jardín Montserrat • {userData.hijos?.length || 0} alumno(s) bajo tutela
          </p>
        </div>
      </div>

      {/* GRID DE INFORMACIÓN */}
      <div className="profile-grid">
        {/* TARJETA: INFORMACIÓN PERSONAL */}
        <div className="profile-card">
          <div className="card-header-flex">
            <h3>Información Personal</h3>
            <div className="card-actions-inline">
              <button className="btn-secondary-action" onClick={() => setShowEditModal(true)}>
                <EditIcon /> Editar
              </button>
              <button className="btn-primary-action" onClick={() => setShowPasswordModal(true)}>
                <LockIcon /> Contraseña
              </button>
            </div>
          </div>

          <div className="info-list">
            <div className="info-row">
              <div className="info-icon"><MailIcon /></div>
              <div className="info-content">
                <span className="info-label">Correo electrónico</span>
                <span className="info-value">{userData.email}</span>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon"><PhoneIcon /></div>
              <div className="info-content">
                <span className="info-label">Teléfono de contacto</span>
                <span className="info-value">{userData.telefono || "Sin registrar"}</span>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon"><IdIcon /></div>
              <div className="info-content">
                <span className="info-label">Documento de Identidad (DNI)</span>
                <span className="info-value font-mono">{userData.dni || "—"}</span>
                <span className="info-subtext">El DNI no puede editarse manualmente.</span>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon"><MapIcon /></div>
              <div className="info-content">
                <span className="info-label">Dirección domiciliaria</span>
                <span className="info-value">{userData.direccion || "Sin registrar"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA: HIJOS / REPRESENTADOS */}
        <div className="profile-card">
          <div className="card-header-flex">
            <h3>Estudiantes Asignados</h3>
            <span className="count-badge">{userData.hijos?.length || 0} Registrados</span>
          </div>

          {userData.hijos?.length > 0 ? (
            <div className="students-stack">
              {userData.hijos.map((hijo) => (
                <div key={hijo.id} className="student-profile-item">
                  <div className="student-avatar-circle">
                    {hijo.nombre?.charAt(0)}
                  </div>
                  <div className="student-details-col">
                    <div className="student-header-line">
                      <h4 className="student-name">{hijo.nombre}</h4>
                      {hijo.es_principal && (
                        <span className="badge-principal">Contacto Principal</span>
                      )}
                    </div>
                    <p className="student-code">Código Estudiantil: <strong>{hijo.codigo_estudiante}</strong></p>
                    <div className="student-relation-tag">
                      Relación: {getRelacionLabel(hijo.tipo_relacion)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No tienes estudiantes vinculados a tu cuenta de apoderado.</p>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        userData={userData}
        onSuccess={fetchProfile}
      />

      <ChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Profile;
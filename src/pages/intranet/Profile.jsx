import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

import "../../styles/Profile.css";

const getRelacionLabel = (tipo) => {
  switch (tipo) {
    case "PADRE": return "👨 Padre";
    case "MADRE": return "👩 Madre";
    case "TUTOR": return "🧑 Tutor";
    case "ABUELO": return "👴 Abuelo";
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
      <>
                <div className="profile-loading">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
          <span>Cargando perfil...</span>
        </div>
      </>
    );
  }

  return (
    <>
            <div className="profile-page">

        {/* Header */}
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <p>Información personal y académica del apoderado.</p>
        </div>

        {/* Hero */}
        <div className="profile-hero">
          <div className="profile-avatar">
            {userData.nombres?.charAt(0)}
            {userData.apellidos?.charAt(0)}
          </div>
          <div className="profile-hero-info">
            <h2>{userData.nombres} {userData.apellidos}</h2>
            <p>{userData.hijos?.length || 0} hijo{userData.hijos?.length !== 1 ? "s" : ""} registrado{userData.hijos?.length !== 1 ? "s" : ""}</p>
            <span className="profile-role-badge">🎓 {userData.role}</span>
            <p className="profile-hero-desc">
              Bienvenido al portal institucional. Desde aquí puede consultar información académica, pagos y datos relacionados a sus hijos.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">👨‍👧‍👦</div>
            <div className="stat-content">
              <h4>{userData.hijos?.length || 0}</h4>
              <span>Hijos registrados</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <h4>{userData.role}</h4>
              <span>Rol en el sistema</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="profile-grid">

          {/* Información personal */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Información Personal</h3>
            </div>
            <div className="profile-card-body">
              <div className="info-item">
                <span className="info-label">Correo electrónico</span>
                <span className="info-value">{userData.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Teléfono</span>
                <span className="info-value">{userData.telefono || "—"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Documento DNI</span>
                <span className="info-value">
                  <span className="info-dni">🔒 {userData.dni}</span>
                </span>
                <span className="info-note">El DNI no puede modificarse.</span>
              </div>
              <div className="info-item">
                <span className="info-label">Dirección</span>
                <span className="info-value">{userData.direccion || "—"}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="btn-edit-profile" onClick={() => setShowEditModal(true)}>
                ✏️ Editar Perfil
              </button>
              <button className="btn-change-password" onClick={() => setShowPasswordModal(true)}>
                🔑 Cambiar Contraseña
              </button>
            </div>
          </div>

          {/* Hijos */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Hijos Registrados</h3>
            </div>
            {userData.hijos?.length > 0 ? (
              <div className="student-list">
                {userData.hijos.map((hijo) => (
                  <div key={hijo.id} className="student-card">
                    <div className="student-avatar">👦</div>
                    <div className="student-info">
                      <div className="student-code">{hijo.codigo_estudiante}</div>
                      <div className="student-name">{hijo.nombre}</div>
                      <div className="student-meta">
                        <span className="student-relacion">
                          {getRelacionLabel(hijo.tipo_relacion)}
                        </span>
                        {hijo.es_principal && (
                          <span className="student-principal-badge">Principal</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="student-empty">
                📭 No tiene hijos registrados aún.
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
    </>
  );
};

export default Profile;
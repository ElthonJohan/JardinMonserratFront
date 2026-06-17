import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .profile-page {
    font-family: 'Inter', sans-serif;
    background: #f1f5f9;
    min-height: 100vh;
    padding: 32px 28px 48px;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .profile-header {
    margin-bottom: 28px;
  }

  .profile-header h1 {
    font-size: 1.6rem;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.5px;
    margin: 0 0 4px;
  }

  .profile-header p {
    font-size: 0.88rem;
    color: #64748b;
    margin: 0;
    font-weight: 500;
  }

  /* ── Hero card ── */
  .profile-hero {
    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
    border-radius: 20px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .profile-hero::before {
    content: '';
    position: absolute;
    right: -40px;
    top: -40px;
    width: 200px;
    height: 200px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .profile-hero::after {
    content: '';
    position: absolute;
    right: 40px;
    bottom: -60px;
    width: 150px;
    height: 150px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(255,255,255,0.18);
    border: 2.5px solid rgba(255,255,255,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 800;
    color: #ffffff;
    flex-shrink: 0;
    letter-spacing: -1px;
    backdrop-filter: blur(4px);
  }

  .profile-hero-info {
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
  }

  .profile-hero-info h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 4px;
    letter-spacing: -0.4px;
  }

  .profile-hero-info p {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.7);
    margin: 0 0 10px;
    font-weight: 500;
  }

  .profile-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .profile-hero-desc {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.65);
    margin: 10px 0 0;
    line-height: 1.5;
    max-width: 480px;
  }

  /* ── Stats ── */
  .profile-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 18px 22px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .stat-content h4 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 2px;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .stat-content span {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #94a3b8;
  }

  /* ── Grid ── */
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  @media (max-width: 768px) {
    .profile-grid { grid-template-columns: 1fr; }
    .profile-stats { grid-template-columns: 1fr 1fr; }
    .profile-hero { flex-direction: column; text-align: center; }
    .profile-hero-desc { text-align: left; }
  }

  /* ── Cards ── */
  .profile-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
  }

  .profile-card-header {
    padding: 16px 22px;
    border-bottom: 1px solid #f1f5f9;
    background: #f8fafc;
  }

  .profile-card-header h3 {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #64748b;
    margin: 0;
  }

  .profile-card-body {
    padding: 8px 0;
  }

  /* ── Info items ── */
  .info-item {
    padding: 13px 22px;
    border-bottom: 1px solid #f8fafc;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #94a3b8;
  }

  .info-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
  }

  .info-note {
    font-size: 0.72rem;
    color: #94a3b8;
    font-weight: 400;
    margin-top: 2px;
  }

  .info-dni {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 3px 10px;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    color: #475569;
    letter-spacing: 0.5px;
  }

  /* ── Actions ── */
  .profile-actions {
    padding: 16px 22px;
    display: flex;
    gap: 10px;
    border-top: 1px solid #f1f5f9;
    flex-wrap: wrap;
  }

  .btn-edit-profile {
    flex: 1;
    padding: 9px 16px;
    background: linear-gradient(135deg, #1e3a5f, #2563eb);
    color: #ffffff;
    border: none;
    border-radius: 9px;
    font-size: 0.83rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: opacity 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .btn-edit-profile:hover {
    opacity: 0.9;
  }

  .btn-change-password {
    flex: 1;
    padding: 9px 16px;
    background: #f1f5f9;
    color: #475569;
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    font-size: 0.83rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .btn-change-password:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  /* ── Student cards ── */
  .student-list {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .student-card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: border-color 0.15s;
  }

  .student-card:hover {
    border-color: #bfdbfe;
  }

  .student-avatar {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    border: 1.5px solid #bfdbfe;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .student-info {
    flex: 1;
    min-width: 0;
  }

  .student-code {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #94a3b8;
    margin-bottom: 2px;
    font-family: 'Courier New', monospace;
  }

  .student-name {
    font-size: 0.92rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .student-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .student-relacion {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .student-principal-badge {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 2px 8px;
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
    border-radius: 20px;
  }

  .student-empty {
    margin: 12px 16px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 10px;
    padding: 16px;
    text-align: center;
    font-size: 0.85rem;
    color: #0369a1;
    font-weight: 500;
  }

  /* ── Loading ── */
  .profile-loading {
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    gap: 10px;
  }

  .loading-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2563eb;
    animation: pulse-dot 1.2s infinite;
  }

  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse-dot {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }
`;

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
        <style>{styles}</style>
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
      <style>{styles}</style>
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
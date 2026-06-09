import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/intranetProfile.css';
import  axiosInstance  from '../../api/axiosConfig';
import { useEffect, useState } from 'react';

const Profile = () => {

    const {user} = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/parent/profile/');
                setUserData(response.data);
                
console.log(response.data);


    console.log('Usuario en Profile:', response.data);
            } catch (error) {
                console.error('Error al obtener el perfil:', error);
            }
        };

        fetchProfile();
    }, [user]);

if (!userData) {
    return <p>Cargando perfil...</p>;
  }
  return (

    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">

        <h1>
          Perfil del Usuario
        </h1>

        <p>
          Información personal y académica
          del apoderado.
        </p>

      </div>

      {/* TOP CARD */}
      <div className="profile-top-card">

        {/* AVATAR */}
        <div className="profile-avatar">
          {userData.nombres.charAt(0)}
        </div>

        {/* INFO */}
        <div className="profile-user-info">

          <h2>
            {userData.nombres} {userData.apellidos}
          </h2>

          <h2>
  {userData.nombres} {userData.apellidos}
</h2>

<p className="text-muted">
  Hijos registrados: {userData.hijos?.length || 0}
</p>

          <span className="profile-role">
            {userData.role}
          </span>

          <p className="profile-description">
            Bienvenido al portal institucional
            de la intranet. Desde aquí puede
            consultar información académica,
            pagos y datos relacionados a sus hijos.
          </p>

        </div>

      </div>

      {/* GRID */}
      <div className="profile-grid">

        {/* PERSONAL INFO */}
        <div className="profile-card">

          <h3 className="profile-card-title">
            Información Personal
          </h3>

          <div className="info-item">
            <span className="info-label">
              Correo Electrónico
            </span>

            <span className="info-value">
              {userData.email}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">
              Número de Teléfono
            </span>

            <span className="info-value">
              {userData.telefono}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">
              Documento DNI
            </span>

            <span className="info-value">
              {userData.dni}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">
              Dirección
            </span>

            <span className="info-value">
              {userData.direccion}
            </span>
          </div>

          <button className="edit-profile-btn">
            Editar Perfil
          </button>

        </div>

        {/* STUDENTS */}
        <div className="profile-card">

  <h3 className="profile-card-title">
    Hijos Registrados
  </h3>

  {
    userData.hijos?.length > 0 ? (

      userData.hijos.map((hijo) => (

        <div
          key={hijo.id}
          className="student-card"
        >

          <div className="student-avatar">
            👦
          </div>

          <div className="student-info">

            <h3>
              {hijo.codigo_estudiante}
            </h3>

            <h4>
              {hijo.nombre}
            </h4>

            <p>
              Relación: {hijo.tipo_relacion}
            </p>
            <p>
  {hijo.tipo_relacion === "PADRE" && "👨 Padre"}
  {hijo.tipo_relacion === "MADRE" && "👩 Madre"}
  {hijo.tipo_relacion === "TUTOR" && "🧑 Tutor"}
  {hijo.tipo_relacion === "ABUELO" && "👴 Abuelo"}
</p>

            {
              hijo.es_principal && (
                <span
                  className="badge bg-success"
                >
                  Principal
                </span>
              )
            }

          </div>

        </div>

      ))

    ) : (

      <div className="alert alert-info">
        No tiene hijos registrados.
      </div>

    )
  }

</div>

      </div>

    </div>

  );

};

export default Profile;
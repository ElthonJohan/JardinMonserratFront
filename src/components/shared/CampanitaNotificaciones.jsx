import React, { useEffect, useState } from 'react';
import { Dropdown, Badge, Spinner } from 'react-bootstrap';
import { getNotificaciones, marcarNotificacionLeida } from '../../api/notificacionesAPI';

export default function CampanitaNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const res = await getNotificaciones();
      const notifs = Array.isArray(res) ? res : res?.results || [];
      setNotificaciones(notifs);
    } catch (error) {
      console.error('Error fetching notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    // Podría establecerse un intervalo aquí si se desean actualizaciones en tiempo real
    // const interval = setInterval(fetchNotificaciones, 60000); // 1 minuto
    // return () => clearInterval(interval);
  }, []);

  const handleNotificacionClick = async (notificacion) => {
    if (!notificacion.leido) {
      try {
        await marcarNotificacionLeida(notificacion.id);
        // Actualizar el estado local para no volver a consultar la API inmediatamente
        setNotificaciones((prev) =>
          prev.map((n) => (n.id === notificacion.id ? { ...n, leido: true } : n))
        );
      } catch (error) {
        console.error('Error marcando notificación como leída', error);
      }
    }
  };

  const noLeidasCount = notificaciones.filter((n) => !n.leido).length;

  return (
    <Dropdown align="end" className="ms-2">
      <Dropdown.Toggle variant="link" className="text-light text-decoration-none position-relative p-2" id="dropdown-notificaciones">
        🔔
        {noLeidasCount > 0 && (
          <Badge 
            bg="danger" 
            pill 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.6rem' }}
          >
            {noLeidasCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}>
        <Dropdown.Header>Notificaciones</Dropdown.Header>
        {loading && notificaciones.length === 0 ? (
          <div className="text-center p-3"><Spinner animation="border" size="sm" /></div>
        ) : notificaciones.length === 0 ? (
          <Dropdown.Item disabled>No tienes notificaciones</Dropdown.Item>
        ) : (
          notificaciones.map((n) => (
            <Dropdown.Item 
              key={n.id} 
              onClick={() => handleNotificacionClick(n)}
              style={{ 
                whiteSpace: 'normal', 
                backgroundColor: n.leido ? 'transparent' : '#f8f9fa',
                borderLeft: n.leido ? 'none' : '3px solid #0d6efd',
                marginBottom: '5px'
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <strong style={{ fontSize: '0.9rem' }}>{n.titulo}</strong>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {new Date(n.fecha_creacion).toLocaleDateString()}
                </small>
              </div>
              <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                {n.mensaje}
              </p>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

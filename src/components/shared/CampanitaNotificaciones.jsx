import React, { useEffect, useState, useCallback } from "react";
import { Dropdown, Badge, Spinner } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

import {
  getNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLeidas,
} from "../../api/notificacionesAPI";

export default function CampanitaNotificaciones() {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const getIcon = (tipo) => {
    switch (tipo) {
      case "PAGO_APROBADO": return "✅";
      case "PAGO_RECHAZADO": return "❌";
      case "PAGO_REGISTRADO": return "💰";
      case "SISTEMA": return "⚙️";
      default: return "🔔";
    }
  };

  const getBorderColor = (tipo) => {
    switch (tipo) {
      case "PAGO_APROBADO": return "#198754";
      case "PAGO_RECHAZADO": return "#dc3545";
      case "PAGO_REGISTRADO": return "#0d6efd";
      case "SISTEMA": return "#6c757d";
      default: return "#0d6efd";
    }
  };

  const fetchNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotificaciones();
      const data = Array.isArray(res) ? res : res?.results || [];
      setNotificaciones(data);
    } catch (error) {
      console.error("Error cargando notificaciones", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 5000);
    return () => clearInterval(interval);
  }, [fetchNotificaciones]);

  const handleNotificacionClick = async (notificacion) => {
    try {
      if (!notificacion.leido) {
        await marcarNotificacionLeida(notificacion.id);
        setNotificaciones((prev) =>
          prev.map((n) =>
            n.id === notificacion.id ? { ...n, leido: true } : n
          )
        );
      }

      if (notificacion.ruta) {
        navigate(notificacion.ruta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasLeidas();
      setNotificaciones((prev) =>
        prev.map((n) => ({ ...n, leido: true }))
      );
    } catch (error) {
      console.error("Error marcando todas", error);
    }
  };

  const noLeidasCount = notificaciones.filter((n) => !n.leido).length;

  return (
    <Dropdown align="end" className="ms-2">
      <Dropdown.Toggle
        variant="link"
        className="text-light text-decoration-none position-relative p-2"
        id="dropdown-notificaciones"
      >
        🔔
        {noLeidasCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: "0.65rem", padding: "0.25em 0.45em" }}
          >
            {noLeidasCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          minWidth: "420px",
          maxWidth: "460px",
          maxHeight: "520px",
          overflowY: "auto",
          zIndex: 1070,           // ← Muy importante
          border: "1px solid #dee2e6",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
        className="py-2"
      >
        <Dropdown.Header className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
          <strong>Notificaciones</strong>
          {noLeidasCount > 0 && (
            <button
              className="btn btn-link btn-sm p-0 text-decoration-none text-primary"
              onClick={handleMarcarTodas}
            >
              Marcar todas leídas
            </button>
          )}
        </Dropdown.Header>

        {loading && notificaciones.length === 0 ? (
          <div className="text-center p-4">
            <Spinner animation="border" size="sm" />
          </div>
        ) : notificaciones.length === 0 ? (
          <Dropdown.Item disabled className="text-center py-4">
            No tienes notificaciones
          </Dropdown.Item>
        ) : (
          notificaciones.map((n) => (
            <Dropdown.Item
              key={n.id}
              onClick={() => handleNotificacionClick(n)}
              className="border-0 px-3 py-3 mb-1 mx-2 rounded-3"
              style={{
                backgroundColor: n.leido ? "#fff" : "#f8f9fa",
                borderLeft: `4px solid ${getBorderColor(n.tipo)}`,
                whiteSpace: "normal",
                transition: "all 0.2s ease",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-center gap-2 flex-grow-1">
                  <span style={{ fontSize: "1.1rem" }}>{getIcon(n.tipo)}</span>
                  <strong style={{ fontSize: "0.95rem", lineHeight: 1.3 }}>
                    {n.titulo}
                  </strong>
                </div>

                {!n.leido && (
                  <Badge bg="primary" pill className="ms-2 flex-shrink-0">
                    Nuevo
                  </Badge>
                )}
              </div>

              <div
                className="text-muted mt-2"
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                {n.mensaje}
              </div>

              <small className="text-secondary d-block mt-2">
                {formatDistanceToNow(new Date(n.fecha_creacion), {
                  addSuffix: true,
                  locale: es,
                })}
              </small>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
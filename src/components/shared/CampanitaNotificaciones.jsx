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
      case "PAGO_APROBADO":
        return "✅";

      case "PAGO_RECHAZADO":
        return "❌";

      case "PAGO_REGISTRADO":
        return "💰";

      case "SISTEMA":
        return "⚙️";

      default:
        return "🔔";
    }
  };

  const getBorderColor = (tipo) => {
    switch (tipo) {
      case "PAGO_APROBADO":
        return "#198754";

      case "PAGO_RECHAZADO":
        return "#dc3545";

      case "PAGO_REGISTRADO":
        return "#0d6efd";

      case "SISTEMA":
        return "#6c757d";

      default:
        return "#0d6efd";
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

        await marcarNotificacionLeida(
          notificacion.id
        );

        setNotificaciones((prev) =>
          prev.map((n) =>
            n.id === notificacion.id
              ? { ...n, leido: true }
              : n
          ),
        );


      }

      if (notificacion.ruta) {

        navigate(
          notificacion.ruta
        );

      }

    } catch (error) {

      console.error(error);

    }

  };

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasLeidas();

      setNotificaciones((prev) =>
        prev.map((n) => ({
          ...n,
          leido: true,
        })),
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
        className="
          text-light
          text-decoration-none
          position-relative
          p-2
        "
        id="dropdown-notificaciones"
      >
        🔔
        {noLeidasCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="
                position-absolute
                top-0
                start-100
                translate-middle
              "
            style={{
              fontSize: "0.65rem",
            }}
          >
            {noLeidasCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          minWidth: "380px",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <Dropdown.Header
          className="
            d-flex
            justify-content-between
            align-items-center
          "
        >
          <span>Notificaciones</span>

          {noLeidasCount > 0 && (
            <button
              className="
                  btn
                  btn-link
                  btn-sm
                  p-0
                  text-decoration-none
                "
              onClick={handleMarcarTodas}
            >
              Marcar todas
            </button>
          )}
        </Dropdown.Header>

        {loading && notificaciones.length === 0 ? (
          <div className="text-center p-4">
            <Spinner animation="border" size="sm" />
          </div>
        ) : notificaciones.length === 0 ? (
          <Dropdown.Item disabled>No tienes notificaciones</Dropdown.Item>
        ) : (
          notificaciones.map((n) => (
            <Dropdown.Item
              key={n.id}
              onClick={() => handleNotificacionClick(n)}
              style={{
                whiteSpace: "normal",
                backgroundColor: n.leido ? "transparent" : "#f8f9fa",

                borderLeft: `4px solid ${getBorderColor(n.tipo)}`,

                marginBottom: "6px",

                padding: "12px",
              }}
            >
              <div
                className="
                      d-flex
                      justify-content-between
                      align-items-start
                    "
              >
                <strong
                  style={{
                    fontSize: "0.9rem",
                  }}
                >
                  {getIcon(n.tipo)} {n.titulo}
                </strong>

                {!n.leido && (
                  <Badge bg="primary text-white" pill>
                    Nuevo
                  </Badge>
                )}
              </div>

              <div
                className="
                      text-muted
                      mt-1
                    "
                style={{
                  fontSize: "0.82rem",
                }}
              >
                {n.mensaje}
              </div>

              <small
                className="
                      text-secondary
                      d-block
                      mt-2
                    "
              >
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

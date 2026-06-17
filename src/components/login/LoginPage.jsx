

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";
import logoJardin from "../../images/logoJardin.png";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error en la conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0 login-card">
              <Card.Body className="p-3">
                <div className="text-center mb-4">
                  {/* <h1 className="fw-bold text-primary">Jardín Monserrat</h1>
                  <p className="text-muted">Sistema de Gestión Escolar</p> */}

                  <img
                    src={logoJardin}
                    alt="Logo Jardín"
                    style={{ height: "80px" }}
                  />
                  <h1 className="fw-bold text-primary">
                    Jardín Nuestra Señora de Monserrat
                  </h1>
                  {/* <p className="text-muted small">Sistema de Gestión Escolar</p> */}
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="fw-bold">Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingresa tu usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                      className="form-control-sm"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="fw-bold">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="form-control-sm"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 fw-bold"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    className="w-100 fw-bold mt-2"
                    onClick={() => navigate("/")}
                  >
                    Inicio
                  </Button>
                  {/* <p className="text-center mt-3">
                    ¿No tienes una cuenta?{" "}
                    <span
                      className="link-register"
                      onClick={() => navigate("/register")}
                    >
                      Regístrate
                    </span>
                  </p> */}
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted small">
                    © 2026 Jardín Monserrat. Todos los derechos reservados.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

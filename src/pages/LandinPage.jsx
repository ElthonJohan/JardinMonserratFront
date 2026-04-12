import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './LandinPage.css';

export default function LandinPage() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setNavOpen(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      {/* ==================== NAVBAR ==================== */}
      <Navbar expand="lg" className="landing-navbar sticky-top">
        <Container fluid>
          <Navbar.Brand>🌸 Jardín Monserrat</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setNavOpen(!navOpen)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => scrollToSection('servicios')} className="nav-link">
                Servicios
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('acerca')} className="nav-link">
                Acerca de
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('galeria')} className="nav-link">
                Galería
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('testimonios')} className="nav-link">
                Testimonios
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('contacto')} className="nav-link">
                Contacto
              </Nav.Link>
              <Nav.Link>
                <button className="btn btn-login" onClick={handleLogin}>
                  Ingreso
                </button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ==================== HERO SECTION ==================== */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col lg={8} className="hero-content">
              <h1>Jardín Nuestra Señora de Monserrat</h1>
              <p className="tagline">Educamos a sus hijos para que sean felices</p>
              <p className="lead">
                Somos una institución educativa comprometida con el desarrollo integral de nuestros alumnos,
                ofreciendo un ambiente seguro, afectuoso y estimulante para el aprendizaje y el crecimiento
                personal.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary-purple" onClick={() => scrollToSection('contacto')}>
                  📬 Contáctenos
                </button>
                <button className="btn btn-secondary-purple" onClick={() => scrollToSection('servicios')}>
                  📚 Conocer más
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================== SERVICIOS SECTION ==================== */}
      <section className="servicios-section" id="servicios">
        <Container>
          <h2 className="section-title">Nuestros Servicios</h2>
          <Row className="g-4">
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">🎨</div>
                <h5>Educación Artística</h5>
                <p>
                  Desarrollamos la creatividad y expresión de los niños a través de actividades
                  lúdicas y educativas en artes plásticas.
                </p>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">⚽</div>
                <h5>Educación Física</h5>
                <p>
                  Promovemos hábitos saludables y el desarrollo motriz con actividades deportivas
                  seguras y divertidas.
                </p>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">🎵</div>
                <h5>Educación Musical</h5>
                <p>
                  Estimulamos el oído musical y la sensibilidad artística mediante experiencias
                  enriquecedoras con la música.
                </p>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">📖</div>
                <h5>Programa Académico</h5>
                <p>
                  Ofrecemos un currículum sólido que integra lectoescritura, matemáticas y ciencias
                  de forma lúdica.
                </p>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">🍎</div>
                <h5>Nutrición y Salud</h5>
                <p>
                  Cuidamos la salud integral con snacks nutritivos y seguimiento del bienestar de
                  cada niño.
                </p>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">👨‍👩‍👧</div>
                <h5>Integración Familiar</h5>
                <p>
                  Fomentamos la participación activa de las familias en el proceso educativo de sus
                  hijos.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================== ACERCA DE SECTION ==================== */}
      <section className="acerca-section" id="acerca">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="acerca-image">
                <img
                  src="https://images.unsplash.com/photo-1564620035527-ffee3be80122?w=600&h=400&fit=crop"
                  alt="Niños aprendiendo"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="acerca-text">
                <h2>Acerca de Nosotros</h2>
                <p>
                  Somos una institución educativa con más de una década de experiencia en educación
                  inicial. Nuestro objetivo es crear un ambiente acogedor donde cada niño pueda
                  desarrollar sus habilidades sociales, emocionales y cognitivas.
                </p>
                <p>
                  Contamos con un equipo de docentes capacitados y comprometidos con la excelencia
                  educativa. Utilizamos metodologías innovadoras que respetan el ritmo de desarrollo de
                  cada estudiante y promueven el aprendizaje significativo.
                </p>
                <p>
                  Nuestras instalaciones están diseñadas para garantizar la seguridad y comodidad de
                  nuestros alumnos, con espacios adecuados para el juego, el descanso y el aprendizaje.
                </p>
                <button className="btn btn-primary-purple mt-3" onClick={handleLogin}>
                  Inscriptores 📝
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================== GALERÍA SECTION ==================== */}
      <section className="galeria-section" id="galeria">
        <Container>
          <h2 className="section-title">Galería</h2>
          <div className="gallery-container">
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1503454537688-e47a9f00c535?w=400&h=300&fit=crop"
                alt="Niños jugando"
              />
              <div className="gallery-overlay">
                <span>Diversión y Aprendizaje</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop"
                alt="Clases educativas"
              />
              <div className="gallery-overlay">
                <span>Educación de Calidad</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1588088129545-9fc10c13c62c?w=400&h=300&fit=crop"
                alt="Actividades recreativas"
              />
              <div className="gallery-overlay">
                <span>Actividades Recreativas</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b2f?w=400&h=300&fit=crop"
                alt="Desarrollo infantil"
              />
              <div className="gallery-overlay">
                <span>Desarrollo Integral</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================== TESTIMONIOS SECTION ==================== */}
      <section className="testimonios-section" id="testimonios">
        <Container>
          <h2 className="section-title">Testimonios</h2>
          <div className="testimonios-container">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Excelente jardín. Mi hijo ha mejorado su autonomía y seguridad. Las maestras son muy
                cálidas y profesionales."
              </p>
              <p className="testimonial-author">- María González</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Mi hija ama ir al jardín cada día. La educación integrada y el ambiente familiar nos
                encanta."
              </p>
              <p className="testimonial-author">- Carlos Rodríguez</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Recomendamos altamente este jardín. Ha superado nuestras expectativas en cada
                aspecto."
              </p>
              <p className="testimonial-author">- Ana Martinez</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================== FOOTER / CONTACTO ==================== */}
      <footer className="landing-footer" id="contacto">
        <Container>
          <Row className="mb-4">
            <Col md={6} lg={3} className="footer-section">
              <h5>Información</h5>
              <p className="fw-bold">Jardín Nuestra Señora de Monserrat</p>
              <p>📍 Dirección: Av. Principal 123, Ciudad</p>
              <p>📞 Teléfono: +56 2 XXXX XXXX</p>
              <p>📧 Email: info@jardinmonserrat.cl</p>
            </Col>

            <Col md={6} lg={3} className="footer-section">
              <h5>Horarios</h5>
              <ul>
                <li>
                  <strong>Lunes - Viernes:</strong>
                  <p>08:00 - 17:00</p>
                </li>
                <li>
                  <strong>Fin de semana:</strong>
                  <p>Cerrado</p>
                </li>
              </ul>
            </Col>

            <Col md={6} lg={3} className="footer-section">
              <h5>Navegación</h5>
              <ul>
                <li>
                  <a href="#servicios" onClick={(e) => { e.preventDefault(); scrollToSection('servicios'); }}>
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#acerca" onClick={(e) => { e.preventDefault(); scrollToSection('acerca'); }}>
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#galeria" onClick={(e) => { e.preventDefault(); scrollToSection('galeria'); }}>
                    Galería
                  </a>
                </li>
                <li>
                  <a href="#testimonios" onClick={(e) => { e.preventDefault(); scrollToSection('testimonios'); }}>
                    Testimonios
                  </a>
                </li>
              </ul>
            </Col>

            <Col md={6} lg={3} className="footer-section">
              <h5>Síguenos</h5>
              <p>Estamos en redes sociales</p>
              <div className="footer-social">
                <div className="social-icon" onClick={() => window.open('https://facebook.com')}>
                  f
                </div>
                <div className="social-icon" onClick={() => window.open('https://instagram.com')}>
                  📷
                </div>
                <div className="social-icon" onClick={() => window.open('https://whatsapp.com')}>
                  💬
                </div>
              </div>
            </Col>
          </Row>

          <div className="footer-divider">
            <p>&copy; 2024 Jardín Nuestra Señora de Monserrat. Todos los derechos reservados.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

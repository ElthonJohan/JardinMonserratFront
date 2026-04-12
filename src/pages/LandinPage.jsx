import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import niñosAprendiendo from '../images/niñosAprendiendo.jpg';
import educacionCalidad from '../images/educacionCalidad.png';
import actividadesRecreativas from '../images/actividadesRecreativas.jpg';
import desarrolloInfantil from '../images/desarrolloInfantil.jpg';
import logoJardin from '../images/logoJardin.png';
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
          <Navbar.Brand>
            <img src={logoJardin} alt="Logo Jardín" style={{height: '45px', marginRight: '10px'}} />
            Jardín Nuestra Señora de Monserrat
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setNavOpen(!navOpen)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => scrollToSection('servicios')} className="nav-link">
                Talleres
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
                  🎓 Ver Talleres
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================== TALLERES SECTION ==================== */}
      <section className="servicios-section" id="servicios">
        <Container>
          <h2 className="section-title">Nuestros Talleres</h2>
          <Row className="g-4">
            {/* <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">🎨</div>
                <h5>Dibujo y Pintura</h5>
                <p>
                  Los niños exploran la creatividad a través del arte, desarrollando su imaginación
                  y expresión artística con técnicas variadas y materiales seguros.
                </p>
              </Card>
            </Col> */}
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">✋</div>
                <h5>Manitos Creativas</h5>
                <p>
                  Estimulamos la motricidad fina y coordinación mediante actividades manuales,
                  construcciones y trabajos en equipo.
                </p>
              </Card>
            </Col>
            {/* <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">🌐</div>
                <h5>Inglés</h5>
                <p>
                  Iniciamos a los niños en el aprendizaje del idioma inglés de forma lúdica y
                  divertida, creando una base sólida para su futuro.
                </p>
              </Card>
            </Col> */}
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">💃</div>
                <h5>Danza</h5>
                <p>
                  Fomentamos la expresión corporal y el ritmo a través de actividades de danza
                  adaptadas a cada edad.
                </p>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="service-card">
                <div className="service-icon">👨‍🍳</div>
                <h5>Minichef</h5>
                <p>
                  Los niños aprenden nociones básicas de cocina de forma segura y divertida,
                  descubriendo nuevos sabores y valores nutricionales.
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
                  src={niñosAprendiendo}
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
                src={actividadesRecreativas}
                alt="Actividades recreativas"
              />
              <div className="gallery-overlay">
                <span>Actividades Recreativas</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src={educacionCalidad}
                alt="Clases educativas"
              />
              <div className="gallery-overlay">
                <span>Educación de Calidad</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src={actividadesRecreativas}
                alt="Actividades recreativas"
              />
              <div className="gallery-overlay">
                <span>Diversión y Juego</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src={desarrolloInfantil}
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
              <p>📍 Dirección: Av. Miguel Grau número 768, Cajamarca, Peru, 06001</p>
              <p>📞 Teléfono: +51 987244935</p>
              <p>📧 Email: iepnsmonserrat@gmail.com</p>
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
                <div className="social-icon" onClick={() => window.open('https://www.facebook.com/profile.php?id=100064244611306&locale=es_LA')}>
                  f
                </div>
                {/* <div className="social-icon" onClick={() => window.open('https://instagram.com')}>
                  📷
                </div> */}
                <div className="social-icon" onClick={() => window.open('https://wa.me/51987244935')}>
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

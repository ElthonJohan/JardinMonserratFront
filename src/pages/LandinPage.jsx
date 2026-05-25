import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  const talleres = [
    {
      icon: '✋',
      iconBg: 'rgba(170,125,254,0.14)',
      title: 'Manitos Creativas',
      desc: 'Estimulamos la motricidad fina mediante actividades manuales, construcciones y trabajos en equipo que despiertan la imaginación.',
    },
    {
      icon: '💃',
      iconBg: 'rgba(94,43,172,0.1)',
      title: 'Danza',
      desc: 'Ritmo, movimiento y coordinación. Los niños aprenden a expresarse corporalmente mientras desarrollan confianza y equilibrio.',
    },
    {
      icon: '👨‍🍳',
      iconBg: 'rgba(236,220,255,0.5)',
      title: 'Minichef',
      desc: 'Pequeños descubrimientos culinarios que enseñan nutrición, medidas y trabajo en equipo de forma deliciosa y segura.',
    },
  ];

  const testimonials = [
    {
      initials: 'MC',
      name: 'María Castro',
      role: 'Madre de Mateo (3 años)',
      text: '"La mejor decisión que tomamos para nuestro hijo. El nivel de atención y el cariño que reciben es excepcional. Realmente se nota el profesionalismo."',
    },
    {
      initials: 'RR',
      name: 'Ricardo Rojas',
      role: 'Padre de Lucía (Pre-K)',
      text: '"El taller de Minichef es el favorito de Lucía. Ha desarrollado muchísima confianza y habilidades sociales. El equipo es increíble."',
    },
    {
      initials: 'AS',
      name: 'Ana Solís',
      role: 'Madre de Valentina (Nido)',
      text: '"Un espacio impecable y muy acogedor. Me da total tranquilidad dejar a mi pequeña sabiendo que está en las mejores manos."',
    },
  ];

  return (
    <div className="landing-page">

      {/* ==================== NAVBAR ==================== */}
      <Navbar
        expand="lg"
        className={`landing-navbar sticky-top ${scrolled ? 'scrolled' : ''}`}
      >
        <Container>
          <Navbar.Brand>
            <img src={logoJardin} alt="Logo" style={{ height: '40px' }} />
            Jardín Monserrat
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="nav-main"
            onClick={() => setNavOpen(!navOpen)}
          />
          <Navbar.Collapse id="nav-main" in={navOpen}>
            <Nav className="ms-auto align-items-center gap-1">
              {[
                ['Talleres', 'servicios'],
                ['Acerca de', 'acerca'],
                ['Galería', 'galeria'],
                ['Testimonios', 'testimonios'],
                ['Contacto', 'contacto'],
                ['Intranet', 'intranet'],
              ].map(([label, id]) => (
                <Nav.Link key={id} onClick={() => scrollToSection(id)} className="nav-link">
                  {label}
                </Nav.Link>
              ))}
              <Nav.Link>
                <button className="btn-login" onClick={() => navigate('/login')}>
                  Ingreso
                </button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ==================== HERO ==================== */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="hero-content">
              <div className="hero-badge">
                <span>⭐</span> Inscripciones Abiertas 2026
              </div>
              <h1>Jardín Nuestra Señora de Monserrat</h1>
              <p className="lead">
                Educamos a sus hijos para que sean felices. Un espacio de amor, aprendizaje
                y crecimiento donde cada niño es protagonista de su propia aventura.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary-purple" onClick={() => scrollToSection('contacto')}>
                  📬 Solicitar Información
                </button>
                <button className="btn-secondary-purple" onClick={() => scrollToSection('servicios')}>
                  🎓 Ver Talleres
                </button>
              </div>
            </Col>

            <Col lg={6}>
              <div style={{ position: 'relative' }}>
                <div className="hero-blob-1" />
                <div className="hero-blob-2" />
                <div className="hero-image-card" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={niñosAprendiendo}
                    alt="Niños aprendiendo"
                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================== TALLERES ==================== */}
      <section className="servicios-section" id="servicios">
        <Container>
          <div className="text-center mb-5 reveal">
            <h2 className="section-title">Nuestros Talleres Creativos</h2>
            <p className="section-subtitle">
              Fomentamos el desarrollo integral de los pequeños a través de actividades
              que despiertan su curiosidad y talento.
            </p>
          </div>
          <Row className="g-4">
            {talleres.map((t, i) => (
              <Col md={4} key={i}>
                <div className="soft-card reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="service-icon" style={{ background: t.iconBg }}>
                    {t.icon}
                  </div>
                  <h5>{t.title}</h5>
                  <p>{t.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ==================== ACERCA DE ==================== */}
      <section className="acerca-section" id="acerca">
        <Container>
          <Row className="align-items-center g-5">
            {/* Image grid — hidden on mobile via CSS */}
            <Col lg={6} className="reveal">
              <div className="acerca-image-grid">
                <div className="col-a">
                  <img src={niñosAprendiendo} alt="Niños aprendiendo" className="acerca-img-tall" />
                  <img src={actividadesRecreativas} alt="Actividades" className="acerca-img-short" />
                </div>
                <div className="col-b">
                  <img src={educacionCalidad} alt="Educación" className="acerca-img-short" />
                  <img src={desarrolloInfantil} alt="Desarrollo" className="acerca-img-tall" />
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="reveal">
                <h2 className="section-title">Nuestra Filosofía</h2>
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.75, marginBottom: 14 }}>
                  En Jardín Monserrat, entendemos que los primeros años son fundamentales.
                  Nuestra metodología combina el rigor académico con el juego libre y la
                  educación emocional.
                </p>
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.75, marginBottom: 14 }}>
                  Contamos con un equipo de docentes capacitados y comprometidos con la
                  excelencia educativa, utilizando metodologías innovadoras que respetan el
                  ritmo de desarrollo de cada estudiante.
                </p>

                <ul className="acerca-checklist">
                  {[
                    'Atención personalizada con grupos reducidos por aula.',
                    'Ambiente seguro y moderno diseñado para el aprendizaje.',
                    'Comunicación constante y transparente con los padres.',
                  ].map((item, i) => (
                    <li key={i}>
                      <span className="material-symbols-outlined check-icon"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="btn-primary-purple" onClick={() => navigate('/login')}>
                  Inscripciones 📝
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================== GALERÍA ==================== */}
      <section className="galeria-section" id="galeria">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5 reveal">
            <div>
              <h2 className="section-title mb-1">Galería de Aventuras</h2>
              <p style={{ color: 'var(--on-surface-variant)', margin: 0, fontSize: 15 }}>
                Momentos inolvidables capturados en nuestro día a día.
              </p>
            </div>
          </div>
          <div className="gallery-grid reveal">
            {[
              [actividadesRecreativas, 'Actividades Recreativas'],
              [educacionCalidad, 'Educación de Calidad'],
              [niñosAprendiendo, 'Diversión y Juego'],
              [desarrolloInfantil, 'Desarrollo Integral'],
            ].map(([src, label], i) => (
              <div className="gallery-item" key={i}>
                <img src={src} alt={label} />
                <div className="gallery-overlay"><span>{label}</span></div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================== TESTIMONIOS ==================== */}
      <section className="testimonios-section" id="testimonios">
        <Container>
          <div className="text-center mb-5 reveal">
            <h2 className="section-title">Lo que dicen los papás</h2>
          </div>
          <Row className="g-4">
            {testimonials.map((t, i) => (
              <Col md={4} key={i}>
                <div className="testimonial-card reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div>
                    <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                    <p className="testimonial-text">{t.text}</p>
                  </div>
                  <div className="testimonial-author-wrap">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div>
                      <p className="testimonial-author">{t.name}</p>
                      <p className="testimonial-role">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="cta-section">
        <Container>
          <h2>¡Únete a nuestra familia!</h2>
          <p>
            Agenda una visita personalizada y conoce por qué somos la mejor opción
            para el primer paso educativo de tus hijos.
          </p>
          <button className="btn-cta" onClick={() => scrollToSection('contacto')}>
            Solicitar una Visita Guiada
          </button>
        </Container>
      </section>

      {/* ==================== FOOTER / CONTACTO ==================== */}
      <footer className="landing-footer" id="contacto">
        <Container>
          <Row className="g-4 mb-4">
            {/* Brand */}
            <Col md={6} lg={4} className="footer-section">
              <div style={{
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--primary)',
                marginBottom: 10,
              }}>
                Jardín Monserrat
              </div>
              <p style={{ marginBottom: 16 }}>
                © 2025 Jardín Nuestra Señora de Monserrat.<br />
                Educamos con amor y profesionalismo.
              </p>
              <div className="footer-social">
                <a className="social-btn"
                  onClick={() => window.open('https://www.facebook.com/profile.php?id=100064244611306')}
                  title="Facebook">
                  f
                </a>
                <a className="social-btn"
                  onClick={() => window.open('https://wa.me/51987244935')}
                  title="WhatsApp">
                  💬
                </a>
              </div>
            </Col>

            {/* Navigation */}
            <Col md={6} lg={4} className="footer-section">
              <h5>Enlaces Rápidos</h5>
              <ul>
                {[
                  ['Talleres', 'servicios'],
                  ['Acerca de Nosotros', 'acerca'],
                  ['Galería', 'galeria'],
                  ['Testimonios', 'testimonios'],
                ].map(([label, id]) => (
                  <li key={id}>
                    <a href={`#${id}`} onClick={e => { e.preventDefault(); scrollToSection(id); }}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Contact */}
            <Col md={6} lg={4} className="footer-section">
              <h5>Contacto</h5>
              {[
                ['location_on', 'Av. Miguel Grau 768, Cajamarca, Peru'],
                ['call', '+51 987 244 935'],
                ['mail', 'iepnsmonserrat@gmail.com'],
                ['schedule', 'Lun – Vie: 08:00 – 17:00'],
              ].map(([icon, text]) => (
                <div className="footer-contact-item" key={icon + text}>
                  <span className="material-symbols-outlined">{icon}</span>
                  {text}
                </div>
              ))}
            </Col>
          </Row>

          <div className="footer-divider">
            <p>© 2025 Jardín Nuestra Señora de Monserrat. Todos los derechos reservados.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
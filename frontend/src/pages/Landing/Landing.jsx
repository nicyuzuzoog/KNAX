import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaCertificate, 
  FaWifi, 
  FaBriefcase, 
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaArrowRight,
  FaClock,
  FaUsers,
  FaLaptop,
  FaProjectDiagram,
  FaCheckCircle,
  FaQuoteLeft,
  FaStar,
  FaSignInAlt,
  FaUserPlus,
  FaCode,
  FaNetworkWired,
  FaCalculator,
  FaMicrochip,
  FaWhatsapp,
  FaLinkedin,
  FaChevronDown
} from 'react-icons/fa';
import './Landing.css';

const departments = [
  { 
    id: 'SOD', 
    name: 'Software Development',
    fullName: 'SOFTWARE DEVELOPMENT',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=500&fit=crop',
    description: 'Master programming, web & mobile development',
    color: '#2196F3',
    icon: <FaCode />
  },
  { 
    id: 'CSA', 
    name: 'Computer Systems',
    fullName: 'COMPUTER SYSTEM AND ARCHITECTURE',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&h=500&fit=crop',
    description: 'Learn system architecture and administration',
    color: '#7C3AED',
    icon: <FaMicrochip />
  },
  { 
    id: 'ACCOUNTING', 
    name: 'Accounting',
    fullName: 'ACCOUNTING',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&h=500&fit=crop',
    description: 'Financial management and bookkeeping',
    color: '#F59E0B',
    icon: <FaCalculator />
  },
  { 
    id: 'NIT', 
    name: 'Networking & IT',
    fullName: 'NETWORKING AND INTERNET TECHNOLOGY',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=500&fit=crop',
    description: 'Network infrastructure and IT support',
    color: '#10B981',
    icon: <FaNetworkWired />
  },
  { 
    id: 'ETE', 
    name: 'Electronics & Telecom',
    fullName: 'ELECTRONICS AND TELECOMMUNICATION',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&h=500&fit=crop',
    description: 'Electronics and communication systems',
    color: '#EF4444',
    icon: <FaMicrochip />
  }
];

// Typewriter hook
function useTypewriter(text, speed = 120, startDelay = 500) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout;
    let i = 0;
    setDisplayed('');
    setDone(false);
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

const Landing = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef(null);

  const line1 = useTypewriter('KNAX_250', 130, 400);
  const line2 = useTypewriter('TECHNOLOGY Ltd', 100, line1.done ? 200 : 9999);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % departments.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setCountersStarted(true);
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">

      {/* ===== HEADER ===== */}
      <header className={`lnd-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="lnd-header-inner">
          <Link to="/" className="lnd-logo">
            <div className="lnd-logo-icon-wrap">
              <FaGraduationCap />
            </div>
            <div className="lnd-logo-text">
              <span className="lnd-logo-main">KNAX_250</span>
              <span className="lnd-logo-sub">TECHNOLOGY LTD</span>
            </div>
          </Link>

          <nav className={`lnd-nav ${mobileOpen ? 'open' : ''}`}>
            <Link to="/departments" className="lnd-nav-link" onClick={() => setMobileOpen(false)}>Departments</Link>
            <Link to="/equipment" className="lnd-nav-link" onClick={() => setMobileOpen(false)}>Equipment</Link>
            <Link to="/about" className="lnd-nav-link" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/find-us" className="lnd-nav-link" onClick={() => setMobileOpen(false)}>Find Us</Link>
          </nav>

          <div className="lnd-auth">
            {user ? (
              <Link to="/student/dashboard" className="lnd-btn-dash">
                <FaUsers /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="lnd-btn-login">
                  <FaSignInAlt /> Login
                </Link>
                <Link to="/register" className="lnd-btn-register">
                  <FaUserPlus /> Register
                  <span className="register-shine"></span>
                </Link>
              </>
            )}
          </div>

          <button 
            className={`lnd-burger ${mobileOpen ? 'active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ===== HERO — HORIZONTAL SPLIT ===== */}
      <section className="lnd-hero">
        <div className="hero-left">
          <div className="hero-badge-pill">
            <span className="hero-live-dot" />
            RTB Certified Training Center · Kigali
          </div>

          <h1 className="hero-brand">
            <span className="hero-brand-line1">
              {line1.displayed}
              {!line1.done && <span className="cursor-blink">|</span>}
            </span>
            <span className="hero-brand-line2">
              {line2.displayed}
              {line1.done && !line2.done && <span className="cursor-blink">|</span>}
            </span>
          </h1>

          <p className="hero-sub">
            Transform your future with professional technical training in Kigali.
            Get RTB-certified, enjoy free WiFi, and launch your career with our 
            job placement assistance.
          </p>

          <div className="hero-stats-band" ref={statsRef}>
            <div className="hero-stat-item">
              <span className="hstat-num">500+</span>
              <span className="hstat-label">Students Trained</span>
            </div>
            <div className="hstat-divider" />
            <div className="hero-stat-item">
              <span className="hstat-num">5</span>
              <span className="hstat-label">Departments</span>
            </div>
            <div className="hstat-divider" />
            <div className="hero-stat-item">
              <span className="hstat-num">100%</span>
              <span className="hstat-label">Job Support</span>
            </div>
          </div>

          <div className="hero-cta-row">
            {user ? (
              <Link to="/student/dashboard" className="hero-cta-primary">
                Go to Dashboard <FaArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/register" className="hero-cta-primary">
                  <span>Start Your Journey</span>
                  <FaArrowRight />
                  <span className="cta-shine" />
                </Link>
                <Link to="/departments" className="hero-cta-secondary">
                  Explore Programs
                </Link>
              </>
            )}
          </div>

          <a 
            href="https://wa.me/250782562906?text=Hello, I want to join KNAX250"
            target="_blank" rel="noopener noreferrer"
            className="hero-whatsapp"
          >
            <FaWhatsapp /> Chat with Us on WhatsApp
          </a>
        </div>

        <div className="hero-right">
          <div className="hero-carousel-frame">
            {departments.map((dept, i) => (
              <div 
                key={dept.id}
                className={`hcarousel-slide ${i === currentSlide ? 'active' : ''}`}
              >
                <img src={dept.image} alt={dept.name} />
                <div className="hcarousel-overlay">
                  <span className="hcarousel-id" style={{ background: dept.color }}>{dept.id}</span>
                  <h3>{dept.name}</h3>
                  <p>{dept.description}</p>
                </div>
              </div>
            ))}

            {/* Floating badge */}
            <div className="hero-float-badge">
              <FaCertificate />
              <div>
                <strong>RTB Certified</strong>
                <span>Internationally Recognized</span>
              </div>
            </div>
          </div>

          <div className="hcarousel-dots">
            {departments.map((_, i) => (
              <button
                key={i}
                className={`hc-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>

        <div className="hero-scroll-hint">
          <FaChevronDown />
        </div>
      </section>

      {/* ===== LOGO / COMPANY PLACEHOLDER ===== */}
      <section className="lnd-logo-section">
        <div className="lnd-container">
          <div className="logo-placeholder-row">
            <div className="logo-placeholder-box">
              <div className="logo-placeholder-inner">
                <FaGraduationCap className="logo-ph-icon" />
                <span className="logo-ph-text">YOUR COMPANY LOGO HERE</span>
                <span className="logo-ph-sub">Replace this with your official logo image</span>
              </div>
            </div>
            <div className="logo-tagline">
              <h2>We Have <span className="accent-blue">Solutions</span> You Need</h2>
              <p>KNAX_250 TECHNOLOGY LTD is Kigali's premier technical training and internship center, empowering the next generation of tech professionals with world-class, RTB-certified education.</p>
              <div className="logo-certs">
                <span className="cert-badge"><FaCertificate /> RTB Certified</span>
                <span className="cert-badge green"><FaCheckCircle /> Job Placement</span>
                <span className="cert-badge gold"><FaWifi /> Free WiFi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DEPARTMENTS ===== */}
      <section className="lnd-depts">
        <div className="lnd-container">
          <div className="lnd-section-head">
            <span className="lnd-badge">Our Programs</span>
            <h2>Choose Your Career Path</h2>
            <p>5 professional training programs designed to launch your tech career</p>
          </div>

          <div className="depts-grid">
            {departments.map((dept, i) => (
              <div 
                key={dept.id} 
                className={`dept-card-v2 ${activeCard === i ? 'flipped' : ''}`}
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="dept-card-inner">
                  <div className="dept-card-front">
                    <div className="dept-img-wrap">
                      <img src={dept.image} alt={dept.name} />
                      <div className="dept-img-overlay" style={{ background: `${dept.color}cc` }}>
                        <span className="dept-icon-big">{dept.icon}</span>
                      </div>
                    </div>
                    <div className="dept-card-body">
                      <span className="dept-code-pill" style={{ background: dept.color }}>{dept.id}</span>
                      <h3>{dept.fullName}</h3>
                      <p>{dept.description}</p>
                    </div>
                  </div>
                  <div className="dept-card-back" style={{ background: dept.color }}>
                    <span className="dept-back-icon">{dept.icon}</span>
                    <h3>{dept.name}</h3>
                    <p>{dept.description}</p>
                    <Link to="/register" className="dept-apply-btn">
                      Apply Now <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="lnd-features">
        <div className="lnd-container">
          <div className="lnd-section-head light">
            <span className="lnd-badge light">Why KNAX_250</span>
            <h2>What Makes Us Different</h2>
            <p>Discover the benefits of training with us</p>
          </div>

          <div className="features-grid-v2">
            {[
              { icon: <FaCertificate />, title: 'RTB Certified', text: 'Internationally recognized certificates signed by Rwanda Technical Board', color: '#7C3AED' },
              { icon: <FaWifi />, title: 'Free WiFi', text: 'Unlimited high-speed internet throughout your entire training period', color: '#2196F3' },
              { icon: <FaBriefcase />, title: 'Job Placement', text: 'We help you find employment opportunities after completing your training', color: '#10B981' },
              { icon: <FaClock />, title: 'Flexible Shifts', text: 'Choose between morning and afternoon shifts that suit your schedule', color: '#F59E0B' },
              { icon: <FaGraduationCap />, title: 'Expert Instructors', text: 'Learn from experienced professionals with real-world industry knowledge', color: '#EF4444' },
              { icon: <FaMapMarkerAlt />, title: 'Prime Location', text: 'Conveniently located in Kigali city center, easy to access from anywhere', color: '#06B6D4' },
            ].map((f, i) => (
              <div className="feature-card-v2" key={i} style={{ '--fc-color': f.color }}>
                <div className="fc-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PEOPLE USING COMPUTERS / GALLERY STRIP ===== */}
      <section className="lnd-gallery-strip">
        <div className="gallery-strip-inner">
          {[
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=350&fit=crop',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=350&fit=crop',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=350&fit=crop',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=350&fit=crop',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=350&fit=crop',
            'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=350&fit=crop',
          ].map((src, i) => (
            <div className="gallery-strip-item" key={i}>
              <img src={src} alt={`Training ${i + 1}`} />
              <div className="gallery-strip-overlay">
                <span>KNAX_250 Training</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CEO SECTION ===== */}
      <section className="lnd-ceo">
        <div className="lnd-container">
          <div className="ceo-wrapper">
            <div className="ceo-photo-side">
              <div className="ceo-photo-frame">
                <div className="ceo-photo-placeholder">
                  <FaUsers className="ceo-ph-icon" />
                  <span>CEO / Manager Photo</span>
                  <span className="ceo-ph-hint">Replace with actual photo</span>
                </div>
                <div className="ceo-photo-deco-1" />
                <div className="ceo-photo-deco-2" />
              </div>
              <div className="ceo-title-badge">
                <FaGraduationCap />
                <div>
                  <strong>CEO & Founder</strong>
                  <span>KNAX_250 TECHNOLOGY LTD</span>
                </div>
              </div>
            </div>

            <div className="ceo-text-side">
              <span className="lnd-badge">Leadership</span>
              <h2>Meet Our <span className="accent-blue">Leader</span></h2>
              <div className="ceo-name-block">
                <h3>[ CEO / Manager Name ]</h3>
                <p className="ceo-position">Chief Executive Officer</p>
              </div>
              <p className="ceo-bio">
                A visionary leader dedicated to empowering Rwandan youth with world-class 
                technical education. With years of experience in technology and education, 
                our CEO founded KNAX_250 TECHNOLOGY LTD with a mission: to make quality 
                tech training accessible and to create job-ready graduates who can compete 
                on the global stage.
              </p>
              <blockquote className="ceo-quote">
                <FaQuoteLeft className="ceo-quote-icon" />
                "We don't just train students — we build the future of Rwanda's 
                technology sector, one graduate at a time."
              </blockquote>
              <div className="ceo-contact">
                <a href="tel:0782562906" className="ceo-contact-btn">
                  <FaPhone /> 0782562906
                </a>
                <a href="mailto:niyikorajeanbaptiste@gmail.com" className="ceo-contact-btn email">
                  <FaEnvelope /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EQUIPMENT ===== */}
      <section className="lnd-equipment">
        <div className="lnd-container">
          <div className="equip-layout">
            <div className="equip-text">
              <span className="lnd-badge">Shop With Us</span>
              <h2>Technical <span className="accent-blue">Equipment</span></h2>
              <p>
                We sell quality computers and projectors for education and business.
                Get student discounts and professional after-sales support from our expert team.
              </p>
              <div className="equip-perks">
                {['Genuine Products', 'Student Discounts', 'Free Installation', 'Warranty Included'].map(p => (
                  <div className="equip-perk" key={p}>
                    <FaCheckCircle /> <span>{p}</span>
                  </div>
                ))}
              </div>
              <Link to="/equipment" className="hero-cta-primary small">
                View All Products <FaArrowRight />
              </Link>
            </div>
            <div className="equip-cards-grid">
              <div className="equip-card-v2">
                <div className="equip-card-icon blue"><FaLaptop /></div>
                <h4>Computers & Laptops</h4>
                <p className="equip-price">From <strong>350,000 RWF</strong></p>
                <ul>
                  <li>✓ Desktop Computers</li>
                  <li>✓ Laptops</li>
                  <li>✓ Accessories</li>
                </ul>
                <a href="https://wa.me/250782562906?text=I'm interested in computers" target="_blank" rel="noopener noreferrer" className="equip-inquire">Inquire <FaArrowRight /></a>
              </div>
              <div className="equip-card-v2">
                <div className="equip-card-icon purple"><FaProjectDiagram /></div>
                <h4>Projectors</h4>
                <p className="equip-price">From <strong>280,000 RWF</strong></p>
                <ul>
                  <li>✓ HD Projectors</li>
                  <li>✓ Smart Projectors</li>
                  <li>✓ Screens & Mounts</li>
                </ul>
                <a href="https://wa.me/250782562906?text=I'm interested in projectors" target="_blank" rel="noopener noreferrer" className="equip-inquire">Inquire <FaArrowRight /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="lnd-testimonials">
        <div className="lnd-container">
          <div className="lnd-section-head">
            <span className="lnd-badge">Testimonials</span>
            <h2>What People Say</h2>
            <p>Hear from those who know us best</p>
          </div>
          <div className="testi-grid">
            {[
              {
                initials: 'IM', name: 'Ismael Mwanafunzi', role: 'Journalist',
                text: 'KNAX_250 is the best technical training center in Kigali! The instructors are amazing and the facilities are top-notch. Highly recommended for anyone who wants a tech career.'
              },
              {
                initials: 'GC', name: 'GenZ Comedy & Mr. Pilate', role: 'Content Creators',
                text: 'The place where technology meets creativity! Highly recommended for anyone wanting to learn tech skills and build a real career in Rwanda.'
              },
            ].map((t, i) => (
              <div className={`testi-card ${i === 1 ? 'featured' : ''}`} key={i}>
                <FaQuoteLeft className="testi-quote-icon" />
                <p>{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.initials}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
                <div className="testi-stars">
                  {[...Array(5)].map((_, j) => <FaStar key={j} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section className="lnd-location">
        <div className="lnd-container">
          <div className="location-layout">
            <div className="location-info-side">
              <span className="lnd-badge">Find Us</span>
              <h2>Visit Our Training Center</h2>
              {[
                { icon: <FaMapMarkerAlt />, label: 'Address', val: 'Near Makuza Peace Plaza\nIn front of BK In Carefree Zone\nATHENE Building, Kigali' },
                { icon: <FaPhone />, label: 'Phone', val: '0782562906' },
                { icon: <FaEnvelope />, label: 'Email', val: 'niyikorajeanbaptiste@gmail.com' },
                { icon: <FaClock />, label: 'Hours', val: 'Mon–Fri: 8:00AM – 6:00PM\nSaturday: 9:00AM – 4:00PM' },
              ].map((item, i) => (
                <div className="loc-detail" key={i}>
                  <div className="loc-icon">{item.icon}</div>
                  <div>
                    <strong>{item.label}</strong>
                    <p style={{ whiteSpace: 'pre-line' }}>{item.val}</p>
                  </div>
                </div>
              ))}
              <a href="https://www.instagram.com/knax_250" target="_blank" rel="noopener noreferrer" className="instagram-link">
                <FaInstagram /> Follow @knax_250
              </a>
            </div>
            <div className="location-map-side">
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2srw!4v1770365038991!5m2!1sen!2srw!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2V2T2pVcUFF!2m2!1d-1.949145814143238!2d30.05998743631952!3f235.35127!4f0!5f0.7820865974627469"
                width="100%" height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KNAX_250 Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="lnd-cta-strip">
        <div className="lnd-container">
          <div className="cta-strip-inner">
            <div className="cta-strip-text">
              <h2>Ready to Start Your Tech Journey?</h2>
              <p>Join hundreds of successful graduates. Get RTB certified and start your career today!</p>
            </div>
            <div className="cta-strip-btns">
              <Link to="/register" className="hero-cta-primary large">
                Register Now — 30,000 RWF
                <span className="cta-shine" />
              </Link>
              <Link to="/find-us" className="hero-cta-secondary large">
                Find Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lnd-footer">
        <div className="lnd-footer-main">
          <div className="lnd-container">
            <div className="lnd-footer-grid">
              <div className="lnd-footer-brand">
                <div className="lnd-footer-logo">
                  <FaGraduationCap />
                  <div>
                    <span className="accent-blue">KNAX_250</span><br />
                    <span className="accent-gold">TECHNOLOGY LTD</span>
                  </div>
                </div>
                <p>We Have Solutions You Need.</p>
                <div className="footer-socials">
                  <a href="https://www.instagram.com/knax_250" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                  <a href="https://wa.me/250782562906" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                </div>
              </div>

              <div className="lnd-footer-col">
                <h4>Quick Links</h4>
                <ul>
                  <li><Link to="/departments">Departments</Link></li>
                  <li><Link to="/equipment">Equipment</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/find-us">Find Us</Link></li>
                </ul>
              </div>

              <div className="lnd-footer-col">
                <h4>Programs</h4>
                <ul>
                  {departments.map(d => <li key={d.id}>{d.name}</li>)}
                </ul>
              </div>

              <div className="lnd-footer-col">
                <h4>Contact</h4>
                <ul className="footer-contact-list">
                  <li><FaMapMarkerAlt /> ATHENE Building, Kigali</li>
                  <li><FaPhone /> 0782562906</li>
                  <li><FaEnvelope /> niyikorajeanbaptiste@gmail.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="lnd-footer-bottom">
          <div className="lnd-container">
            <p>© 2026 KNAX_250 TECHNOLOGY LTD. All rights reserved. | RTB Certified | Free WiFi | Job Placement</p>
            <p className="footer-dev-credit">
              Designed & Developed by{' '}
              <span className="dev-name">Jean Bosco CYUZUZO</span>
              {' '}&amp;{' '}
              <span className="dev-name">Jean Paul NIYOKWIZERWA</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;

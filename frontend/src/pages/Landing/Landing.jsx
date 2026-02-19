import React, { useState, useEffect } from 'react';
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
  FaUserPlus
} from 'react-icons/fa';
import './Landing.css';

// Department data with working image URLs
const departments = [
  { 
    id: 'SOD', 
    name: 'Software Development',
    fullName: 'SOFTWARE DEVELOPMENT',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    description: 'Master programming, web & mobile development',
    color: '#2196F3'
  },
  { 
    id: 'CSA', 
    name: 'Computer Systems',
    fullName: 'COMPUTER SYSTEM AND ARCHITECTURE',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    description: 'Learn system architecture and administration',
    color: '#9C27B0'
  },
  { 
    id: 'ACCOUNTING', 
    name: 'Accounting',
    fullName: 'ACCOUNTING',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
    description: 'Financial management and bookkeeping',
    color: '#FF9800'
  },
  { 
    id: 'NIT', 
    name: 'Networking & IT',
    fullName: 'NETWORKING AND INTERNET TECHNOLOGY',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
    description: 'Network infrastructure and IT support',
    color: '#4CAF50'
  },
  { 
    id: 'ETE', 
    name: 'Electronics & Telecom',
    fullName: 'ELECTRONICS AND TELECOMMUNICATION',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop',
    description: 'Electronics and communication systems',
    color: '#F44336'
  }
];

const Landing = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % departments.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ========== FLOATING AUTH HEADER ========== */}
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="header-logo">
            <FaGraduationCap className="logo-icon" />
            <div className="logo-text">
              <span className="logo-main">KNAX_250</span>
              <span className="logo-sub">TECHNOLOGY</span>
            </div>
          </Link>

          <nav className="header-nav">
            <Link to="/departments" className="nav-link">Departments</Link>
            <Link to="/equipment" className="nav-link">Equipment</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/find-us" className="nav-link">Find Us</Link>
          </nav>

          <div className="header-auth">
            {user ? (
              <Link to="/student/dashboard" className="auth-btn dashboard-btn">
                <FaUsers /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="auth-btn login-btn">
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="auth-btn register-btn">
                  <FaUserPlus />
                  <span>Register</span>
                  <div className="btn-glow"></div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-toggle" id="mobileMenuToggle">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              RTB Certified Training Center
            </div>
            
            <h1 className="hero-title">
              <span className="text-blue">KNAX_250</span>
              <span className="text-gold">TECHNOLOGY Ltd</span>
            </h1>
            
            <p className="hero-description">
              Transform your future with professional technical training. 
              Get RTB certified certificates, free WiFi, and guaranteed job placement assistance.
            </p>
            
            <div className="hero-stats-row">
              <div className="hero-stat">
                <span className="stat-num">500+</span>
                <span className="stat-text">Students</span>
              </div>
              <div className="hero-stat">
                <span className="stat-num">5</span>
                <span className="stat-text">Departments</span>
              </div>
              <div className="hero-stat">
                <span className="stat-num">100%</span>
                <span className="stat-text">Job Support</span>
              </div>
            </div>
            
            <div className="hero-btns">
              {user ? (
                <Link to="/student/dashboard" className="btn-primary-hero">
                  Go to Dashboard <FaArrowRight />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary-hero animated-btn">
                    <span className="btn-text">Start Your Journey</span>
                    <span className="btn-icon"><FaArrowRight /></span>
                    <div className="btn-shine"></div>
                  </Link>
                  <Link to="/departments" className="btn-secondary-hero">
                    Explore Programs
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hero-carousel-wrapper">
            <div className="hero-carousel">
              {departments.map((dept, index) => (
                <div 
                  key={dept.id}
                  className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
                >
                  <img src={dept.image} alt={dept.name} />
                  <div className="carousel-caption">
                    <span className="dept-badge" style={{ background: dept.color }}>
                      {dept.id}
                    </span>
                    <h3>{dept.name}</h3>
                    <p>{dept.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-indicators">
              {departments.map((_, index) => (
                <button 
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== DEPARTMENTS SECTION ========== */}
      <section className="departments-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Programs</span>
            <h2>Choose Your Career Path</h2>
            <p>5 Professional training programs designed to launch your tech career</p>
          </div>
          
          <div className="dept-grid">
            {departments.map((dept) => (
              <div key={dept.id} className="dept-card">
                <div className="dept-img">
                  <img src={dept.image} alt={dept.name} />
                  <div className="dept-overlay" style={{ background: `${dept.color}e6` }}>
                    <Link to="/register" className="overlay-btn">
                      Apply Now <FaArrowRight />
                    </Link>
                  </div>
                </div>
                <div className="dept-info">
                  <span className="dept-id" style={{ background: dept.color }}>{dept.id}</span>
                  <h3>{dept.fullName}</h3>
                  <p>{dept.description}</p>
                  <Link to="/register" className="dept-link">
                    Learn More <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header light">
            <span className="section-badge">Why KNAX_250</span>
            <h2>What Makes Us Different</h2>
            <p>Discover the benefits of learning with us</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">
                <FaCertificate />
              </div>
              <h3>RTB Certified</h3>
              <p>Receive internationally recognized certificates signed by Rwanda Technical Board</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <FaWifi />
              </div>
              <h3>Free WiFi</h3>
              <p>Enjoy unlimited high-speed internet throughout your entire training period</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <FaBriefcase />
              </div>
              <h3>Job Placement</h3>
              <p>We help you find employment opportunities after completing your training</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3>Flexible Shifts</h3>
              <p>Choose between morning and afternoon shifts that suit your schedule</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <FaGraduationCap />
              </div>
              <h3>Expert Instructors</h3>
              <p>Learn from experienced professionals with real-world industry experience</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Prime Location</h3>
              <p>Conveniently located in Kigali city center, easy to access from anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== EQUIPMENT SECTION ========== */}
      <section className="equipment-section">
        <div className="container">
          <div className="equipment-wrapper">
            <div className="equipment-text">
              <span className="section-badge">Shop With Us</span>
              <h2>Technical Equipment</h2>
              <p>
                We also sell quality computers and projectors for education and business.
                Get student discounts and professional after-sales support.
              </p>
              
              <div className="equipment-perks">
                <div className="perk">
                  <FaCheckCircle />
                  <span>Genuine Products</span>
                </div>
                <div className="perk">
                  <FaCheckCircle />
                  <span>Student Discounts</span>
                </div>
                <div className="perk">
                  <FaCheckCircle />
                  <span>Free Installation</span>
                </div>
                <div className="perk">
                  <FaCheckCircle />
                  <span>Warranty Included</span>
                </div>
              </div>
              
              <Link to="/equipment" className="btn-dark">
                View All Products <FaArrowRight />
              </Link>
            </div>
            
            <div className="equipment-cards">
              <div className="equip-card">
                <div className="equip-icon">
                  <FaLaptop />
                </div>
                <h4>Computers & Laptops</h4>
                <p className="price">From 350,000 RWF</p>
                <ul>
                  <li>Desktop Computers</li>
                  <li>Laptops</li>
                  <li>Accessories</li>
                </ul>
              </div>
              
              <div className="equip-card">
                <div className="equip-icon">
                  <FaProjectDiagram />
                </div>
                <h4>Projectors</h4>
                <p className="price">From 280,000 RWF</p>
                <ul>
                  <li>HD Projectors</li>
                  <li>Smart Projectors</li>
                  <li>Screens & Mounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2>What People Say About Us</h2>
            <p>Hear from those who know us best</p>
          </div>
          
          <div className="testimonials-row">
            <div className="testimonial-card">
              <div className="quote-icon">
                <FaQuoteLeft />
              </div>
              <p className="testimonial-text">
                "KNAX_250 is the best technical training center in Kigali! 
                The instructors are amazing and the facilities are top-notch."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">IM</div>
                <div className="author-info">
                  <strong>Ismael Mwanafunzi</strong>
                  <span>Journalist</span>
                </div>
              </div>
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
            
            <div className="testimonial-card featured">
              <div className="quote-icon">
                <FaQuoteLeft />
              </div>
              <p className="testimonial-text">
                "The place where technology meets creativity! Highly recommended 
                for anyone wanting to learn tech skills and build a career."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">GC</div>
                <div className="author-info">
                  <strong>GenZ Comedy & Mr. Pilate</strong>
                  <span>Content Creators</span>
                </div>
              </div>
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LOCATION SECTION ========== */}
      <section className="location-section">
        <div className="container">
          <div className="location-wrapper">
            <div className="location-info">
              <span className="section-badge">Find Us</span>
              <h2>Visit Our Training Center</h2>
              
              <div className="location-details">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="detail-text">
                    <strong>Address</strong>
                    <p>Near Makuza Peace Plaza<br />
                    In front of BK In Carefree Zone<br />
                    ATHENE Building, Kigali</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaPhone />
                  </div>
                  <div className="detail-text">
                    <strong>Phone</strong>
                    <p>0782562906</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaEnvelope />
                  </div>
                  <div className="detail-text">
                    <strong>Email</strong>
                    <p>niyikorajeanbaptiste@gmail.com</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaClock />
                  </div>
                  <div className="detail-text">
                    <strong>Working Hours</strong>
                    <p>Mon - Fri: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
              
              <a 
                href="https://www.instagram.com/knax_250" 
                target="_blank" 
                rel="noopener noreferrer"
                className="instagram-btn"
              >
                <FaInstagram /> Follow @knax_250
              </a>
            </div>

              {/* In the Location Section */}
<div className="location-map">
  <iframe
    src="https://www.google.com/maps/embed?pb=!3m2!1sen!2srw!4v1770365038991!5m2!1sen!2srw!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2V2T2pVcUFF!2m2!1d-1.949145814143238!2d30.05998743631952!3f235.35127!4f0!5f0.7820865974627469"
    width="100%"
    height="100%"
    style={{ border: 0, borderRadius: '16px' }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="KNAX_250 Location"
  ></iframe>

            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-shape cta-shape-1"></div>
          <div className="cta-shape cta-shape-2"></div>
        </div>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Tech Journey?</h2>
            <p>
              Join hundreds of successful graduates. Get RTB certified and start your career today!
            </p>
            <div className="cta-btns">
              <Link to="/register" className="btn-gold animated-cta-btn">
                <span>Register Now - Only 30,000 RWF</span>
                <div className="cta-btn-shine"></div>
              </Link>
              <Link to="/find-us" className="btn-white-outline">
                Find Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <h3>
                  <span className="text-blue">KNAX_250</span><br />
                  <span className="text-gold">TECHNOLOGY Ltd</span>
                </h3>
                <p>We Have Solutions You Need.</p>
                <div className="social-links">
                  <a 
                    href="https://www.instagram.com/knax_250" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
              
              <div className="footer-links">
                <h4>Quick Links</h4>
                <ul>
                  <li><Link to="/departments">Departments</Link></li>
                  <li><Link to="/equipment">Equipment</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/find-us">Find Us</Link></li>
                </ul>
              </div>
              
              <div className="footer-links">
                <h4>Programs</h4>
                <ul>
                  <li>Software Development</li>
                  <li>Computer Systems</li>
                  <li>Accounting</li>
                  <li>Networking & IT</li>
                  <li>Electronics & Telecom</li>
                </ul>
              </div>
              
              <div className="footer-contact">
                <h4>Contact Info</h4>
                <ul>
                  <li><FaMapMarkerAlt /> ATHENE Building, Kigali</li>
                  <li><FaPhone /> 0782562906</li>
                  <li><FaEnvelope /> niyikorajeanbaptiste@gmail.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="container">
            <p>© 2024 KNAX_250 TECHNOLOGY Ltd. All rights reserved.</p>
            <p>RTB Certified | Free WiFi | Job Placement Assistance</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
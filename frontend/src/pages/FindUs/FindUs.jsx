// pages/FindUs/FindUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import { 
  FaMapMarkerAlt, FaPhone, FaWhatsapp, FaCheckCircle, FaWifi,
  FaCertificate, FaBriefcase, FaToilet, FaClock, FaGlassCheers,
  FaBus, FaStar, FaEnvelope, FaGraduationCap
} from 'react-icons/fa';
import './FindUs.css';

const FindUs = () => {
  return (
    <div className="findus-page">
      <BackButton to="/" text="Back to Home" />

      {/* HERO */}
      <section className="findus-hero">
        <div className="container">
          <span className="findus-hero-badge">Kigali, Rwanda</span>
          <h1>Find <span className="highlight">KNAX_250</span></h1>
          <p>Everything you need to know about visiting us — we're easy to find!</p>
        </div>
      </section>

      {/* LOCATION */}
      <section className="location-section">
        <div className="container">
          <div className="location-grid">
            <div className="location-details">
              <h2><FaMapMarkerAlt /> Our Location</h2>

              <div className="address-card">
                <h3>Physical Address</h3>
                <p className="main-address">Near <strong>Makuza Peace Plaza</strong></p>
                <p className="sub-address">In front of <strong>BK IN Carefree Zone</strong></p>
                <p className="sub-address"><strong>ATHENE Building</strong>, Kigali City Center</p>
              </div>

              <div className="contact-cards">
                <a href="tel:0782562906" className="quick-contact phone">
                  <FaPhone />
                  <div><span>Call Us</span><strong>0782562906</strong></div>
                </a>
                <a href="https://wa.me/250782562906" target="_blank" rel="noopener noreferrer" className="quick-contact whatsapp">
                  <FaWhatsapp />
                  <div><span>WhatsApp</span><strong>0782562906</strong></div>
                </a>
                <a href="mailto:niyikorajeanbaptiste@gmail.com" className="quick-contact email">
                  <FaEnvelope />
                  <div><span>Email</span><strong>niyikorajeanbaptiste@gmail.com</strong></div>
                </a>
              </div>

              <div className="directions-info">
                <h3><FaBus /> How to Get There</h3>
                <ul>
                  <li>Easy access from Kigali City Center</li>
                  <li>Near major bus routes and public transport</li>
                  <li>Walking distance from Makuza Peace Plaza</li>
                  <li>Look for the ATHENE Building signage</li>
                </ul>
              </div>
            </div>

            <div className="map-box">
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2srw!4v1770365038991!5m2!1sen!2srw!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2V2T2pVcUFF!2m2!1d-1.949145814143238!2d30.05998743631952!3f235.35127!4f0!5f0.7820865974627469"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KNAX250 Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle">Discover why KNAX_250 is Kigali's premier training center</p>
          <div className="features-grid">
            {[
              { cls:'cert',     icon:<FaCertificate />, title:'RTB Certified', text:'Certificates signed by RTB (Rwanda TVET Board) recognized internationally' },
              { cls:'wifi',     icon:<FaWifi />,        title:'Free WiFi Always', text:'High-speed internet connection available at all times, completely free' },
              { cls:'learn',    icon:<FaCheckCircle />, title:'Hands-on Learning', text:'Practical, industry-relevant training with real tools and real projects' },
              { cls:'shifts',   icon:<FaClock />,       title:'2 Shifts Daily', text:'Morning and afternoon shifts available to fit your busy schedule' },
              { cls:'toilet',   icon:<FaToilet />,      title:'Free Facilities', text:'Clean toilet facilities available free of charge every single day' },
              { cls:'location', icon:<FaMapMarkerAlt />,title:'City Center Location', text:'Located in Kigali city center — easy to reach from anywhere' },
              { cls:'job',      icon:<FaBriefcase />,   title:'Job Placement', text:'We actively help you find employment when you finish your training' },
              { cls:'celebrate',icon:<FaGlassCheers />, title:'Graduation Celebration', text:'When you finish, we celebrate your achievement together as a family' },
            ].map((f,i) => (
              <div className="feature-item" key={i}>
                <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
                <div className="feature-content">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENDORSEMENTS */}
      <section className="endorsements-section">
        <div className="container">
          <h2 className="section-title">Endorsed By Famous Personalities</h2>
          <p className="section-subtitle">Trusted and recommended by well-known figures in Rwanda</p>
          <div className="endorsements-grid">
            {[
              { emoji:'📺', name:'Ismael Mwanafunzi', role:'Famous Journalist' },
              { emoji:'😂', name:'GenZ Comedy',        role:'Popular Comedy Group' },
              { emoji:'🎭', name:'Mr. Pilate',         role:'Entertainment Star' },
            ].map((e,i) => (
              <div className="endorsement-card" key={i}>
                <div className="endorsement-image">
                  <div className="image-placeholder">
                    <span>{e.emoji}</span>
                    <p>Add Photo</p>
                  </div>
                </div>
                <div className="endorsement-info">
                  <FaStar className="star" />
                  <h3>{e.name}</h3>
                  <p>{e.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">Our Facility</h2>
          <p className="section-subtitle">Take a look at our professional learning environment</p>
          <div className="gallery-grid">
            {[1,2,3,4,5,6].map(n => (
              <div key={n} className="gallery-item">
                <div className="gallery-placeholder">
                  <span>📷</span>
                  <p>Add Photo {n}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="findus-cta">
        <div className="container">
          <h2>Ready to Visit Us?</h2>
          <p>Come see our facilities, meet our team, and start your journey today!</p>
          <div className="cta-buttons">
            <a 
              href="https://wa.me/250782562906?text=Hello, I want to visit KNAX_250"
              target="_blank" rel="noopener noreferrer"
              className="btn btn-primary-cta btn-large"
            >
              <FaWhatsapp /> Contact on WhatsApp
            </a>
            <Link to="/register" className="btn btn-outline-cta btn-large">
              <FaGraduationCap /> Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindUs;

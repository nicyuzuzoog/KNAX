// pages/FindUs/FindUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaWhatsapp,
  FaCheckCircle,
  FaWifi,
  FaCertificate,
  FaBriefcase,
  FaToilet,
  FaClock,
  FaGlassCheers,
  FaBus,
  FaStar,
  FaEnvelope
} from 'react-icons/fa';
import './FindUs.css';

const FindUs = () => {
  return (
    <div className="findus-page">
      {/* Back Button */}
      <BackButton to="/" text="Back to Home" />

      {/* Hero */}
      <section className="findus-hero">
        <div className="container">
          <h1>Find <span className="highlight">KNAX250</span></h1>
          <p>Everything you need to know about visiting us</p>
        </div>
      </section>

      {/* Location Section */}
      <section className="location-section">
        <div className="container">
          <div className="location-grid">
            <div className="location-details">
              <h2><FaMapMarkerAlt /> Our Location</h2>
              
              <div className="address-card">
                <h3>Physical Address</h3>
                <p className="main-address">
                  Near <strong>Makuza Peace Plaza</strong>
                </p>
                <p className="sub-address">
                  In front of <strong>BK MURI Carefree Zone</strong>
                </p>
                <p className="sub-address">
                  <strong>ATENE Building</strong>, Kigali City Center
                </p>
              </div>

              <div className="contact-cards">
                <a href="tel:0782562906" className="quick-contact phone">
                  <FaPhone />
                  <div>
                    <span>Call Us</span>
                    <strong>0782562906</strong>
                  </div>
                </a>
                <a 
                  href="https://wa.me/250782562906" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="quick-contact whatsapp"
                >
                  <FaWhatsapp />
                  <div>
                    <span>WhatsApp</span>
                    <strong>0782562906</strong>
                  </div>
                </a>
                <a href="mailto:niyikorajeanbatist@gmail.com" className="quick-contact email">
                  <FaEnvelope />
                  <div>
                    <span>Email</span>
                    <strong>niyikorajeanbatist@gmail.com</strong>
                  </div>
                </a>
              </div>

              <div className="directions-info">
                <h3><FaBus /> How to Get There</h3>
                <ul>
                  <li>Easy access from Kigali City Center</li>
                  <li>Near major bus routes and public transport</li>
                  <li>Walking distance from Makuza Peace Plaza</li>
                  <li>Look for the ATENE Building</li>
                </ul>
              </div>
            </div>

            <div className="map-box">
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2srw!4v1770365038991!5m2!1sen!2srw!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2V2T2pVcUFF!2m2!1d-1.949145814143238!2d30.05998743631952!3f235.35127!4f0!5f0.7820865974627469"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KNAX250 Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon cert">
                <FaCertificate />
              </div>
              <div className="feature-content">
                <h3>RTB Certified</h3>
                <p>Certificates signed by RTB (Rwanda TVET Board) and recognized worldwide</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon wifi">
                <FaWifi />
              </div>
              <div className="feature-content">
                <h3>Free WiFi Always</h3>
                <p>High-speed internet connection available at all times, completely free</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon learn">
                <FaCheckCircle />
              </div>
              <div className="feature-content">
                <h3>Learn Without Registration</h3>
                <p>Learn to do technology - no registration fee required to start</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon shifts">
                <FaClock />
              </div>
              <div className="feature-content">
                <h3>2 Shifts Daily</h3>
                <p>Morning and afternoon shifts available to fit your schedule</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon toilet">
                <FaToilet />
              </div>
              <div className="feature-content">
                <h3>Free Facilities</h3>
                <p>Clean toilet facilities available free of charge every day</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon location">
                <FaMapMarkerAlt />
              </div>
              <div className="feature-content">
                <h3>City Center Location</h3>
                <p>Located in Kigali city - easy to reach from anywhere</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon job">
                <FaBriefcase />
              </div>
              <div className="feature-content">
                <h3>Job Placement</h3>
                <p>We help you find a job when you finish your internship</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon celebrate">
                <FaGlassCheers />
              </div>
              <div className="feature-content">
                <h3>Graduation Celebration</h3>
                <p>When you finish, we celebrate your achievement together</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Endorsements Section */}
      <section className="endorsements-section">
        <div className="container">
          <h2 className="section-title">Endorsed By Famous Personalities</h2>
          <p className="section-subtitle">Trusted and recommended by well-known figures</p>
          
          <div className="endorsements-grid">
            <div className="endorsement-card">
              <div className="endorsement-image">
                <div className="image-placeholder">
                  <span>📺</span>
                  <p>Add Photo</p>
                </div>
              </div>
              <div className="endorsement-info">
                <FaStar className="star" />
                <h3>Ismael Mwanafunzi</h3>
                <p>Famous Journalist we all agree</p>
              </div>
            </div>

            <div className="endorsement-card">
              <div className="endorsement-image">
                <div className="image-placeholder">
                  <span>😂</span>
                  <p>Add Photo</p>
                </div>
              </div>
              <div className="endorsement-info">
                <FaStar className="star" />
                <h3>GenZ Comedy</h3>
                <p>Popular Comedy Group</p>
              </div>
            </div>

            <div className="endorsement-card">
              <div className="endorsement-image">
                <div className="image-placeholder">
                  <span>🎭</span>
                  <p>Add Photo</p>
                </div>
              </div>
              <div className="endorsement-info">
                <FaStar className="star" />
                <h3>Mr. Pilate</h3>
                <p>Entertainment Star</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">Our Facility</h2>
          <p className="section-subtitle">Take a look at our learning environment</p>
          
          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="gallery-item">
                <div className="gallery-placeholder">
                  <span>📷</span>
                  <p>Add Photo {num}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="findus-cta">
        <div className="container">
          <h2>Ready to Visit Us?</h2>
          <p>Come see our facilities and meet our team</p>
          <div className="cta-buttons">
            <a 
              href="https://wa.me/250782562906?text=Hello, I want to visit KNAX250" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary btn-large"
            >
              <FaWhatsapp /> Contact on WhatsApp
            </a>
            <Link to="/register" className="btn btn-outline btn-large">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindUs;
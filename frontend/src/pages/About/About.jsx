// pages/About/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import { 
  FaCertificate, 
  FaWifi, 
  FaBriefcase, 
  FaGraduationCap,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUsers,
  FaAward
} from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Back Button */}
      <BackButton to="/" text="Back to Home" />

      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>About KNAX250</h1>
          <p className="hero-subtitle">
            Your Gateway to Professional Technical Training in Kigali
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Graduates</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Departments</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Job Placement</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="location-section">
        <div className="container">
          <div className="location-content">
            <div className="location-info">
              <h2><FaMapMarkerAlt /> Find Us</h2>
              <p className="address">
                Near Makuza Peace Plaza<br />
                In front of BK MURI Carefree Zone<br />
                ATENE Building, Kigali City Center
              </p>
              <p className="phone">📞 0782562906</p>
              <p className="email">✉️ niyikorajeanbatist@gmail.com</p>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2srw!4v1770365038991!5m2!1sen!2srw!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2V2T2pVcUFF!2m2!1d-1.949145814143238!2d30.05998743631952!3f235.35127!4f0!5f0.7820865974627469"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KNAX250 Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section">
        <div className="container">
          <h2>Why Choose KNAX250?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaCertificate className="feature-icon" />
              <h3>RTB Certified</h3>
              <p>Receive certificates signed by RTB that are recognized worldwide</p>
            </div>
            <div className="feature-card">
              <FaWifi className="feature-icon" />
              <h3>Free WiFi</h3>
              <p>Enjoy free high-speed WiFi throughout your training period</p>
            </div>
            <div className="feature-card">
              <FaGraduationCap className="feature-icon" />
              <h3>No Registration Fee</h3>
              <p>Learn technology without any registration requirements</p>
            </div>
            <div className="feature-card">
              <FaClock className="feature-icon" />
              <h3>2 Shifts Daily</h3>
              <p>Flexible learning with morning and afternoon shifts</p>
            </div>
            <div className="feature-card">
              <FaMapMarkerAlt className="feature-icon" />
              <h3>City Center Location</h3>
              <p>Easily accessible location in the heart of Kigali</p>
            </div>
            <div className="feature-card">
              <FaBriefcase className="feature-icon" />
              <h3>Job Placement</h3>
              <p>We help you find employment after completing your training</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="container">
          <h2>What People Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <FaAward className="testimonial-icon" />
              <p className="testimonial-text">
                "Yamamazwa by ISMAEL MWANAFUNZI, a journalist we all agree - 
                KNAX250 is the best technical training center in Kigali!"
              </p>
              <div className="testimonial-author">
                <strong>Ismael Mwanafunzi</strong>
                <span>Journalist</span>
              </div>
            </div>
            <div className="testimonial-card">
              <FaUsers className="testimonial-icon" />
              <p className="testimonial-text">
                "Yamamazwa by GENZ COMEDY AND MR. PILATE - 
                The place where technology meets creativity!"
              </p>
              <div className="testimonial-author">
                <strong>GenZ Comedy & Mr. Pilate</strong>
                <span>Content Creators</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Benefits */}
      <div className="benefits-section">
        <div className="container">
          <h2>Additional Benefits</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <FaCheckCircle />
              <span>Free toilet facilities with daily maintenance</span>
            </div>
            <div className="benefit-item">
              <FaCheckCircle />
              <span>Celebration venue for graduation ceremonies</span>
            </div>
            <div className="benefit-item">
              <FaCheckCircle />
              <span>Professional equipment sales (Computers & Projectors)</span>
            </div>
            <div className="benefit-item">
              <FaCheckCircle />
              <span>Hands-on practical training</span>
            </div>
            <div className="benefit-item">
              <FaCheckCircle />
              <span>Industry-recognized certifications</span>
            </div>
            <div className="benefit-item">
              <FaCheckCircle />
              <span>Expert instructors with real-world experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join KNAX250 today and transform your future with technology!</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Register Now - It's Free!
            </Link>
            <Link to="/contact" className="btn btn-outline btn-large">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
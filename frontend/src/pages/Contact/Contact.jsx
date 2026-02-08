// pages/Contact/Contact.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import BackButton from '../../components/BackButton/BackButton';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp,
  FaClock,
  FaPaperPlane
} from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Back Button */}
      <BackButton to="/" text="Back to Home" />

      {/* Header */}
      <div className="contact-header">
        <h1>Contact KNAX250</h1>
        <p>Get in touch with us for any inquiries or support</p>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>We're here to help you start your journey in technology!</p>

            <div className="info-items">
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <h4>Location</h4>
                  <p>Near Makuza Peace Plaza<br />
                  In front of BK MURI Carefree Zone<br />
                  ATENE Building, Kigali</p>
                </div>
              </div>

              <div className="info-item">
                <FaPhone className="info-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>0782562906</p>
                </div>
              </div>

              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div>
                  <h4>Email</h4>
                  <p>niyikorajeanbatist@gmail.com</p>
                </div>
              </div>

              <div className="info-item">
                <FaWhatsapp className="info-icon" />
                <div>
                  <h4>WhatsApp</h4>
                  <p>0782562906</p>
                </div>
              </div>

              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <h4>Working Hours</h4>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 4:00 PM<br />
                  2 Shifts Available Daily</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mini-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2srw!4v1770365038991!5m2!1sen!2srw!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2V2T2pVcUFF!2m2!1d-1.949145814143238!2d30.05998743631952!3f235.35127!4f0!5f0.7820865974627469"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KNAX250 Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone Number"
                  required
                />
              </div>

              <div className="form-group">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="internship">Internship Inquiry</option>
                  <option value="equipment">Equipment Purchase</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                </select>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                <FaPaperPlane /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
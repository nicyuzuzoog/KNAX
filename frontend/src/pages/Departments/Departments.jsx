// pages/Departments/Departments.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import { 
  FaNetworkWired, 
  FaLaptopCode, 
  FaCalculator, 
  FaServer, 
  FaBroadcastTower,
  FaArrowRight,
  FaClock,
  FaCertificate,
  FaUsers
} from 'react-icons/fa';
import './Departments.css';

const departments = [
  {
    id: 'NIT',
    name: 'Network & IT',
    icon: <FaNetworkWired />,
    color: '#2196F3',
    description: 'Master network infrastructure, system administration, and IT support. Learn to design, implement, and manage computer networks.',
    skills: ['Network Configuration', 'System Administration', 'IT Support', 'Network Security', 'Troubleshooting'],
    duration: '3 months',
    projects: ['Network Setup', 'Server Configuration', 'Help Desk Support']
  },
  {
    id: 'SOD',
    name: 'Software Development',
    icon: <FaLaptopCode />,
    color: '#4CAF50',
    description: 'Learn modern programming languages and frameworks. Build real-world applications and gain hands-on coding experience.',
    skills: ['Web Development', 'Mobile Apps', 'Database Design', 'API Development', 'Version Control'],
    duration: '3 months',
    projects: ['Web Applications', 'Mobile Apps', 'API Integration']
  },
  {
    id: 'ACCOUNTING',
    name: 'Accounting',
    icon: <FaCalculator />,
    color: '#FF9800',
    description: 'Develop essential accounting and financial management skills. Work with real financial data and accounting software.',
    skills: ['Financial Reporting', 'Bookkeeping', 'Tax Preparation', 'Budgeting', 'Payroll Management'],
    duration: '3 months',
    projects: ['Financial Statements', 'Budget Planning', 'Audit Assistance']
  },
  {
    id: 'CSA',
    name: 'Computer Systems Administration',
    icon: <FaServer />,
    color: '#9C27B0',
    description: 'Specialize in managing and maintaining computer systems. Learn server administration and cloud technologies.',
    skills: ['Server Management', 'Cloud Computing', 'Virtualization', 'Backup Solutions', 'System Security'],
    duration: '3 months',
    projects: ['Cloud Deployment', 'System Migration', 'Backup Implementation']
  },
  {
    id: 'ETE',
    name: 'Electronics & Telecommunications',
    icon: <FaBroadcastTower />,
    color: '#F44336',
    description: 'Explore electronics, telecommunications, and embedded systems. Work with hardware and communication technologies.',
    skills: ['Circuit Design', 'Telecommunications', 'Embedded Systems', 'Signal Processing', 'IoT'],
    duration: '3 months',
    projects: ['IoT Devices', 'Communication Systems', 'Electronic Circuits']
  }
];

const Departments = () => {
  return (
    <div className="departments-page">
      {/* Back Button */}
      <BackButton to="/" text="Back to Home" />

      {/* Header */}
      <div className="departments-header">
        <div className="header-content">
          <h1>Our Internship Programs</h1>
          <p>Choose from our diverse range of professional internship programs designed to launch your career</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <FaClock />
          <div>
            <span className="stat-value">3 Months</span>
            <span className="stat-label">Duration</span>
          </div>
        </div>
        <div className="stat-item">
          <FaCertificate />
          <div>
            <span className="stat-value">Certificate</span>
            <span className="stat-label">Upon Completion</span>
          </div>
        </div>
        <div className="stat-item">
          <FaUsers />
          <div>
            <span className="stat-value">500+</span>
            <span className="stat-label">Students Trained</span>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="departments-container">
        <div className="departments-grid">
          {departments.map((dept) => (
            <div key={dept.id} className="department-card" style={{ '--dept-color': dept.color }}>
              <div className="dept-header">
                <div className="dept-icon" style={{ background: dept.color }}>
                  {dept.icon}
                </div>
                <div className="dept-badge">{dept.id}</div>
              </div>
              
              <h2>{dept.name}</h2>
              <p className="dept-description">{dept.description}</p>

              <div className="dept-section">
                <h4>Skills You'll Learn</h4>
                <div className="skills-list">
                  {dept.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="dept-section">
                <h4>Projects</h4>
                <ul className="projects-list">
                  {dept.projects.map((project, index) => (
                    <li key={index}>{project}</li>
                  ))}
                </ul>
              </div>

              <div className="dept-footer">
                <div className="dept-info">
                  <FaClock />
                  <span>{dept.duration}</span>
                </div>
                <Link to="/register" className="btn btn-primary">
                  Apply Now <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="departments-cta">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join our internship program and gain the skills employers are looking for</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Apply Now - 30,000 RWF
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

export default Departments;
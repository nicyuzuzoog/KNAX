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
  FaUsers,
  FaCheckCircle,
  FaGraduationCap
} from 'react-icons/fa';
import './Departments.css';

const departments = [
  {
    id: 'NIT',
    name: 'Network & IT',
    icon: <FaNetworkWired />,
    color: '#1976D2',
    description: 'Master network infrastructure, system administration, and IT support. Learn to design, implement, and manage computer networks used by businesses across Rwanda.',
    skills: ['Network Configuration', 'System Administration', 'IT Support', 'Network Security', 'Troubleshooting'],
    duration: '3 months',
    projects: ['Network Setup', 'Server Configuration', 'Help Desk Support']
  },
  {
    id: 'SOD',
    name: 'Software Development',
    icon: <FaLaptopCode />,
    color: '#10B981',
    description: 'Learn modern programming languages and frameworks. Build real-world applications and gain hands-on coding experience with our expert instructors.',
    skills: ['Web Development', 'Mobile Apps', 'Database Design', 'API Development', 'Version Control'],
    duration: '3 months',
    projects: ['Web Applications', 'Mobile Apps', 'API Integration']
  },
  {
    id: 'ACCOUNTING',
    name: 'Accounting',
    icon: <FaCalculator />,
    color: '#F59E0B',
    description: 'Develop essential accounting and financial management skills. Work with real financial data and industry-standard accounting software used by Rwandan companies.',
    skills: ['Financial Reporting', 'Bookkeeping', 'Tax Preparation', 'Budgeting', 'Payroll Management'],
    duration: '3 months',
    projects: ['Financial Statements', 'Budget Planning', 'Audit Assistance']
  },
  {
    id: 'CSA',
    name: 'Computer Systems & Architecture',
    icon: <FaServer />,
    color: '#7C3AED',
    description: 'Specialize in managing and maintaining computer systems. Learn server administration, cloud technologies, and system security best practices.',
    skills: ['Server Management', 'Cloud Computing', 'Virtualization', 'Backup Solutions', 'System Security'],
    duration: '3 months',
    projects: ['Cloud Deployment', 'System Migration', 'Backup Implementation']
  },
  {
    id: 'ETE',
    name: 'Electronics & Telecommunications',
    icon: <FaBroadcastTower />,
    color: '#EF4444',
    description: 'Explore electronics, telecommunications, and embedded systems. Work with hardware and cutting-edge communication technologies in real environments.',
    skills: ['Circuit Design', 'Telecommunications', 'Embedded Systems', 'Signal Processing', 'IoT'],
    duration: '3 months',
    projects: ['IoT Devices', 'Communication Systems', 'Electronic Circuits']
  }
];

const Departments = () => {
  return (
    <div className="departments-page">
      <BackButton to="/" text="Back to Home" />

      {/* HEADER */}
      <div className="departments-header">
        <div className="header-content">
          <span className="header-badge">RTB Certified Programs</span>
          <h1>Our <span>Training</span> Programs</h1>
          <p>5 professional internship programs designed to launch your tech career in Rwanda and beyond</p>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stat-item">
          <FaClock />
          <div>
            <span className="stat-value">3 Months</span>
            <span className="stat-label">Duration Each</span>
          </div>
        </div>
        <div className="stat-item">
          <FaCertificate />
          <div>
            <span className="stat-value">RTB Certified</span>
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
        <div className="stat-item">
          <FaCheckCircle />
          <div>
            <span className="stat-value">100%</span>
            <span className="stat-label">Job Support</span>
          </div>
        </div>
      </div>

      {/* DEPARTMENTS GRID */}
      <div className="departments-container">
        <div className="departments-grid">
          {departments.map((dept) => (
            <div key={dept.id} className="department-card" style={{ '--dept-color': dept.color }}>
              <div className="dept-header">
                <div className="dept-icon" style={{ background: dept.color }}>
                  {dept.icon}
                </div>
                <span className="dept-badge">{dept.id}</span>
              </div>

              <h2>{dept.name}</h2>
              <p className="dept-description">{dept.description}</p>

              <div className="dept-section">
                <h4>Skills You'll Learn</h4>
                <div className="skills-list">
                  {dept.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="dept-section">
                <h4>Sample Projects</h4>
                <ul className="projects-list">
                  {dept.projects.map((p, i) => <li key={i}>{p}</li>)}
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

      {/* CTA */}
      <div className="departments-cta">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join our internship program and gain the skills employers are looking for. Registration fee: only 30,000 RWF.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-gold btn-large">
              <FaGraduationCap /> Apply Now — 30,000 RWF
            </Link>
            <Link to="/find-us" className="btn btn-outline btn-large">
              Find Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;

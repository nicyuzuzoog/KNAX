// pages/Equipment/Equipment.jsx
import React from 'react';
import BackButton from '../../components/BackButton/BackButton';
import { 
  FaLaptop, FaDesktop, FaProjectDiagram, FaKeyboard,
  FaMouse, FaHeadphones, FaUsb, FaPhone, FaWhatsapp, FaGraduationCap
} from 'react-icons/fa';
import './Equipment.css';

const equipmentList = [
  {
    category: 'Computers',
    items: [
      {
        name: 'Laptops',
        icon: <FaLaptop />,
        description: 'High-quality laptops for students, professionals, and businesses — new and refurbished options available.',
        features: ['Various brands available', 'New and refurbished options', 'Warranty included', 'Student discounts']
      },
      {
        name: 'Desktop Computers',
        icon: <FaDesktop />,
        description: 'Powerful desktop computers for office and personal use, with full technical support and setup.',
        features: ['Complete setups available', 'Custom configurations', 'Technical support', 'Free installation']
      }
    ]
  },
  {
    category: 'Presentation Equipment',
    items: [
      {
        name: 'HD Projectors',
        icon: <FaProjectDiagram />,
        description: 'Professional projectors for presentations, classrooms, training centers, and business meetings.',
        features: ['HD & 4K quality options', 'Various sizes & brands', 'Rental options available', 'Screens & mounts included']
      }
    ]
  },
  {
    category: 'Accessories & Peripherals',
    items: [
      {
        name: 'Keyboards',
        icon: <FaKeyboard />,
        description: 'Wired and wireless keyboards for all needs, from standard office use to gaming setups.',
        features: ['USB and Bluetooth', 'Ergonomic designs', 'Gaming options', 'All brands']
      },
      {
        name: 'Computer Mice',
        icon: <FaMouse />,
        description: 'Computer mice in various styles — optical, laser, wired, wireless, and gaming variants.',
        features: ['Wired and wireless', 'Optical and laser', 'Gaming mice', 'Ergonomic options']
      },
      {
        name: 'Headphones & Headsets',
        icon: <FaHeadphones />,
        description: 'Quality headphones and headsets for communication, entertainment, and professional use.',
        features: ['With microphone', 'Noise cancellation', 'Bluetooth options', 'Professional grade']
      },
      {
        name: 'Cables & USB Drives',
        icon: <FaUsb />,
        description: 'All types of cables, USB drives, flash storage, connectors, and computing accessories.',
        features: ['HDMI, VGA, USB-C', 'Flash drives', 'Extension cables', 'All adapters']
      }
    ]
  }
];

const Equipment = () => {
  return (
    <div className="equipment-page">
      <BackButton to="/" text="Back to Home" />

      {/* HERO */}
      <section className="equipment-hero">
        <div className="container">
          <span className="equip-hero-badge">Shop & Buy</span>
          <h1>Technical <span>Equipment</span> Store</h1>
          <p>Quality computers, projectors, and accessories at competitive prices with student discounts</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="equipment-section">
        <div className="container">
          {equipmentList.map((category, index) => (
            <div key={index} className="equipment-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="equipment-grid">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="equipment-card">
                    <div className="equipment-icon">{item.icon}</div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <ul className="equipment-features">
                      {item.features.map((f, fi) => <li key={fi}>{f}</li>)}
                    </ul>
                    <a
                      href={`https://wa.me/250782562906?text=Hello, I'm interested in purchasing ${item.name}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      Inquire Price
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="equipment-cta">
        <div className="container">
          <h2>Need Equipment?</h2>
          <p>Contact us for current prices, availability, and student discounts</p>
          <div className="cta-contacts">
            <a href="tel:0782562906" className="cta-contact phone">
              <FaPhone /> <span>0782562906</span>
            </a>
            <a href="https://wa.me/250782562906" target="_blank" rel="noopener noreferrer" className="cta-contact whatsapp">
              <FaWhatsapp /> <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Equipment;

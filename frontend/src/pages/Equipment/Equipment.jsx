// pages/Equipment/Equipment.jsx
import React from 'react';
import BackButton from '../../components/BackButton/BackButton';
import { 
  FaLaptop, 
  FaDesktop, 
  FaProjectDiagram, 
  FaKeyboard,
  FaMouse,
  FaHeadphones,
  FaUsb,
  FaPhone,
  FaWhatsapp
} from 'react-icons/fa';
import './Equipment.css';

const equipmentList = [
  {
    category: 'Computers',
    items: [
      {
        name: 'Laptops',
        icon: <FaLaptop />,
        description: 'High-quality laptops for students, professionals, and businesses',
        features: ['Various brands available', 'New and refurbished options', 'Warranty included']
      },
      {
        name: 'Desktop Computers',
        icon: <FaDesktop />,
        description: 'Powerful desktop computers for office and personal use',
        features: ['Complete setups available', 'Custom configurations', 'Technical support']
      }
    ]
  },
  {
    category: 'Presentation Equipment',
    items: [
      {
        name: 'Projectors',
        icon: <FaProjectDiagram />,
        description: 'Professional projectors for presentations and training',
        features: ['HD quality', 'Various sizes', 'Rental options available']
      }
    ]
  },
  {
    category: 'Accessories',
    items: [
      {
        name: 'Keyboards',
        icon: <FaKeyboard />,
        description: 'Wired and wireless keyboards for all needs',
        features: ['USB and Bluetooth', 'Ergonomic designs', 'Gaming options']
      },
      {
        name: 'Mouse',
        icon: <FaMouse />,
        description: 'Computer mice in various styles and features',
        features: ['Wired and wireless', 'Optical and laser', 'Gaming mice']
      },
      {
        name: 'Headphones',
        icon: <FaHeadphones />,
        description: 'Headphones and headsets for work and entertainment',
        features: ['With microphone', 'Noise cancellation', 'Bluetooth options']
      },
      {
        name: 'Cables & USB',
        icon: <FaUsb />,
        description: 'All types of cables, USB drives, and connectors',
        features: ['HDMI, VGA, USB', 'Flash drives', 'Extension cables']
      }
    ]
  }
];

const Equipment = () => {
  return (
    <div className="equipment-page">
      {/* Back Button */}
      <BackButton to="/" text="Back to Home" />

      {/* Hero */}
      <section className="equipment-hero">
        <div className="container">
          <h1>Technical Equipment Store</h1>
          <p>Quality computers, projectors, and accessories at competitive prices</p>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="equipment-section">
        <div className="container">
          {equipmentList.map((category, index) => (
            <div key={index} className="equipment-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="equipment-grid">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="equipment-card">
                    <div className="equipment-icon">
                      {item.icon}
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <ul className="equipment-features">
                      {item.features.map((feature, fIndex) => (
                        <li key={fIndex}>✓ {feature}</li>
                      ))}
                    </ul>
                    <a 
                      href={`https://wa.me/250782562906?text=Hello, I'm interested in purchasing ${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
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

      {/* Contact CTA */}
      <section className="equipment-cta">
        <div className="container">
          <h2>Need Equipment?</h2>
          <p>Contact us for prices and availability</p>
          <div className="cta-contacts">
            <a href="tel:0782562906" className="cta-contact phone">
              <FaPhone />
              <span>0782562906</span>
            </a>
            <a 
              href="https://wa.me/250782562906" 
              target="_blank"
              rel="noopener noreferrer"
              className="cta-contact whatsapp"
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Equipment;
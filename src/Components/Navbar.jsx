import React, { useState } from 'react';
import logo from '../assests/imgs/Logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const navbarStyle = {
    position: 'absolute', // Overlays the homepage
    top: 0,
    left: 0,
    width: '90%',
    backgroundColor: 'transparent', // Transparent background
    padding: '15px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10, // Keeps navbar on top
    direction: 'rtl',
  };

  const logoStyle = {
    width: '65px', // Reduced size
    height: 'auto',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '30px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const linkStyle = (isHovered) => ({
    textDecoration: 'none',
    color: isHovered ? '#00ffcb' : '#ffffff', // Change color on hover
    fontSize: '18px',
    transition: 'color 0.3s',
  });

  const actionContainerStyle = {
    display: 'flex',
    gap: '10px',
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    fontSize: '10px'
  };

  const langButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: '14px'
  };

  const loginButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#1EC8A0',
    border: '2px solid  #1EC8A0',
    fontFamily: "'Tajawal', sans-serif"

  };

  const signupButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
    fontFamily: "'Tajawal', sans-serif"
  };

  return (
    <nav style={navbarStyle}>
      <img src={logo} alt="Logo" style={logoStyle} />

      <ul style={navLinksStyle}>
        {['الرئيسية', 'معلومات عنا', 'مميزاتنا', 'المعلمون', 'أراء الطلاب', 'الأسئلة الشائعة'].map((text, index) => (
          <li key={index}>
            <a
              href="www.facebook.com"
              style={linkStyle(hoveredLink === index)}
              onMouseEnter={() => setHoveredLink(index)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>

      <div style={actionContainerStyle}>
        <button style={langButtonStyle}>EN</button>
        <Link to="/login" style={{ ...loginButtonStyle, textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
          تسجيل الدخول
        </Link>

        <Link to="/register" style={{ ...signupButtonStyle, textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
          إنشاء حساب جديد
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

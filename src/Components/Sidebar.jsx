import React, { useState } from 'react';

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState('الرئيسية');
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarStyle = {
    width: isOpen ? '220px' : '0',
    height: '100vh',
    backgroundColor: '#F2F8F6',
    padding: isOpen ? '20px' : '0',
    boxSizing: 'border-box',
    direction: 'rtl',
    position: 'fixed',
    top: 0,
    right: 0,
    overflowX: 'hidden',
    transition: 'width 0.3s ease',
    zIndex: 1000,
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    marginTop: '50px',
    display: isOpen ? 'block' : 'none',
  };

  const linkStyle = (link) => ({
    padding: '15px 10px',
    marginBottom: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: activeLink === link ? '#1EC8A0' : '#000000',
    fontWeight: activeLink === link ? 'bold' : 'normal',
    backgroundColor: activeLink === link ? '#E6F7F3' : 'transparent',
    transition: 'all 0.3s ease',
    textAlign: 'right',
  });

  const hamburgerStyle = {
    position: 'absolute',
    top: '20px',
    right: isOpen ? '180px' : '20px',
    fontSize: '30px',
    cursor: 'pointer',
    zIndex: 1100,
    transition: 'left 0.3s ease',
  };

  return (
    <>
      <div style={hamburgerStyle} onClick={toggleSidebar}>
        ☰
      </div>
      <div style={sidebarStyle}>
        <ul style={listStyle}>
          {['الرئيسية', 'الدورات', 'طلبات الجدولة', 'المحادثات'].map((link) => (
            <li
              key={link}
              style={linkStyle(link)}
              onClick={() => setActiveLink(link)}
            >
              {link}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

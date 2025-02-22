import React, { useState } from 'react';
// import logo from '../assests/imgs/BellLogo.svg.png'; // ✅ تأكد من أن المسار صحيح

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const navbarStyle = {
    height: '70px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 40px',
    borderBottom: '1px solid #E6E6E6',
    position: 'absolute',
    top: 20,
    zIndex: 100,
    direction: 'rtl', // ⭐ لدعم اللغة العربية
  };

  const logoStyle = {
    width: '50px',
    // height: 'auto',
    margin:'auto'
  };

  const profileStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#1EC8A0',
    cursor: 'pointer',
    position: 'relative',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '55px',
    left: 0, // ⭐ تم التعديل ليتناسب مع الاتجاه من اليمين لليسار
    backgroundColor: '#FFFFFF',
    border: '1px solid #E6E6E6',
    borderRadius: '5px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    zIndex: 10,
    textAlign: 'right', // ⭐ النص محاذي لليمين
  };

  return (
    <nav style={navbarStyle}>
      {/* <img src={logo} alt="الشعار" style={logoStyle} /> */}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <i className="fa fa-bell" style={{ fontSize: '20px', cursor: 'pointer' }}></i>
        <div
          style={profileStyle}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {showDropdown && (
            <div style={dropdownStyle}>
              <p style={{ margin: '0 0 10px', cursor: 'pointer' }}>الملف الشخصي</p>
              <p style={{ margin: 0, cursor: 'pointer' }}>تسجيل الخروج</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


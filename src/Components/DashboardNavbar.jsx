// @ts-ignore
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService'; 

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true); 
    logout();
    setShowDropdown(false);
    setTimeout(() => {
      setLoading(false);
      navigate('/login', { state: { message: 'تم تسجيل الخروج بنجاح!' } });
    }, 500); 
  };

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
    direction: 'rtl',
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
    left: 0,
    backgroundColor: '#FFFFFF',
    border: '1px solid #E6E6E6',
    borderRadius: '5px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    zIndex: 10,
    textAlign: 'right',
  };

  return (
    <nav 
// @ts-ignore
    style={navbarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <i className="fa fa-bell" style={{ fontSize: '20px', cursor: 'pointer' }}></i>
        <div
          // @ts-ignore
          style={profileStyle}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {showDropdown && (
            <div 
// @ts-ignore
            style={dropdownStyle}>
              <p style={{ margin: '0 0 10px', cursor: 'pointer' }}>الملف الشخصي</p>
              <p
                style={{ margin: 0, cursor: 'pointer' }}
                onClick={handleLogout}
              >
                {loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
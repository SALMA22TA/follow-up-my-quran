import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { User, Bell, CircleAlert } from 'lucide-react';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  

  useEffect(() => {
    // Log all localStorage items to find the correct key
    console.log('All localStorage items:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`${key}:`, localStorage.getItem(key));
    }

    // Try different possible keys for role
    const role = localStorage.getItem('role') || 
                 localStorage.getItem('user_role') || 
                 localStorage.getItem('userType') ||
                 localStorage.getItem('user_type');
    
    console.log('Found role:', role);
    
    // Parse the role if it's stored as a number
    const roleNum = parseInt(role);
    console.log('Parsed role number:', roleNum);
    
    if (roleNum === 2) {
      setUserType('teacher');
    } else if (roleNum === 0) {
      setUserType('student');
    }
    console.log('Detected user type:', roleNum === 2 ? 'teacher' : 'student');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('Current user type:', userType);
        console.log('Access token:', token ? 'Present' : 'Missing');

        const endpoint = userType === 'teacher' 
          ? 'http://localhost:8000/api/v1/teacher/get_notifications'
          : 'http://localhost:8000/api/v1/student/get_notifications';
        
        console.log('Using endpoint:', endpoint);

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (data.data) {
          setNotifications(data.data);
        } else {
          console.warn('No notifications data in response:', data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        if (error.response) {
          console.error('Error response:', error.response);
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        }
      }
    };

    if (userType) {
      console.log('Fetching notifications for user type:', userType);
      fetchNotifications();
    } else {
      console.warn('No user type set, skipping notification fetch');
    }
  }, [userType]);

  const markAllAsRead = async () => {
    try {
      console.log('Marking all notifications as read...');
      const token = localStorage.getItem('access_token');
      console.log('Access token for mark as read:', token ? 'Present' : 'Missing');

      const endpoint = userType === 'teacher'
        ? 'http://localhost:8000/api/v1/teacher/mark_all_as_read'
        : 'http://localhost:8000/api/v1/student/mark_all_as_read';
      
      console.log('Using mark as read endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Mark as read response status:', response.status);
      const data = await response.json();
      console.log('Mark as read response data:', data);
      
      if (response.ok) {
        console.log('Successfully marked all notifications as read');
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({
            ...notification,
            read_at: notification.read_at || new Date().toISOString()
          }))
        );
      } else {
        console.error('Failed to mark notifications as read:', data);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'الآن';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `منذ ${diffInDays} يوم`;
    }

    return date.toLocaleDateString('ar-SA');
  };

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '50px',
    left: 0,
    backgroundColor: '#FFFFFF',
    border: '1px solid #E6E6E6',
    borderRadius: '5px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '8px',
    zIndex: 1000,
    textAlign: 'right',
    minWidth: '120px'
  };

  const notificationDropdownStyle = {
    position: 'absolute',
    top: '50px',
    left: 0,
    backgroundColor: '#FFFFFF',
    border: '1px solid #E6E6E6',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '12px',
    zIndex: 1000,
    textAlign: 'right',
    width: '320px',
    maxHeight: '400px',
    overflowY: 'auto'
  };

  const notificationItemStyle = {
    padding: '12px',
    borderBottom: '1px solid #E6E6E6',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  };

  const dropdownItemStyle = {
    padding: '6px 10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '4px',
    fontSize: '14px',
    margin: '0 0 4px',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  };

  const dropdownItemHoverStyle = {
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <nav style={navbarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }} ref={notificationRef}>
          <div
            style={{
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onClick={() => setShowNotifications(!showNotifications)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} color="#666" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#F44336',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          {showNotifications && (
            <div style={notificationDropdownStyle}>
              <div style={{ 
                padding: '0 0 12px 0', 
                borderBottom: '1px solid #E6E6E6',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>الإشعارات</h3>
                {unreadCount > 0 && (
                  <span 
                    style={{ 
                      color: '#1EC8A0', 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      transition: 'color 0.2s ease'
                    }}
                    onClick={markAllAsRead}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#17997A'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#1EC8A0'}
                  >
                    تعيين الكل كمقروء
                  </span>
                )}
              </div>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      ...notificationItemStyle,
                      backgroundColor: notification.read_at ? 'transparent' : '#F8FCFB'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FCFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.read_at ? 'transparent' : '#F8FCFB'}
                  >
                    <div style={{ 
                      color: '#E74C3C',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <CircleAlert size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        color: '#333',
                        fontSize: '14px',
                        marginBottom: '4px',
                        whiteSpace: 'pre-line'
                      }}>
                        {notification.data.message}
                      </div>
                      <div style={{ 
                        color: '#666',
                        fontSize: '12px'
                      }}>
                        {formatTimeAgo(notification.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  textAlign: 'center',
                  padding: '24px',
                  color: '#666'
                }}>
                  لا توجد إشعارات جديدة
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            style={profileStyle}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <User size={24} />
          </div>
          {showDropdown && (
            <div style={dropdownStyle}>
              <p 
                style={{ 
                  ...dropdownItemStyle,
                  ':hover': { backgroundColor: '#f5f5f5' }
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                الملف الشخصي
              </p>
              <p
                style={{ 
                  ...dropdownItemStyle,
                  margin: 0,
                  ':hover': { backgroundColor: '#f5f5f5' }
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
/*************************************************************************** */
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { logout } from '../services/authService';

// const Navbar = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setLoading(true);
//     logout();
//     setShowDropdown(false);
//     setTimeout(() => {
//       setLoading(false);
//       navigate('/login', { state: { message: 'تم تسجيل الخروج بنجاح!' } });
//     }, 500);
//   };

//   const navbarStyle = {
//     height: '70px',
//     backgroundColor: '#FFFFFF',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '0 40px',
//     borderBottom: '1px solid #E6E6E6',
//     position: 'absolute',
//     top: 20,
//     zIndex: 100,
//     direction: 'rtl',
//   };

//   const profileStyle = {
//     width: '45px',
//     height: '45px',
//     borderRadius: '50%',
//     backgroundColor: '#1EC8A0',
//     cursor: 'pointer',
//     position: 'relative',
//   };

//   const dropdownStyle = {
//     position: 'absolute',
//     top: '55px',
//     left: 0,
//     backgroundColor: '#FFFFFF',
//     border: '1px solid #E6E6E6',
//     borderRadius: '5px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//     padding: '10px',
//     zIndex: 10,
//     textAlign: 'right',
//   };

//   return (
//     <nav
//       style={navbarStyle}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//         <i className="fa fa-bell" style={{ fontSize: '20px', cursor: 'pointer' }}></i>
//         <div

//           style={profileStyle}
//           onClick={() => setShowDropdown(!showDropdown)}
//         >
//           {showDropdown && (
//             <div
//               style={dropdownStyle}>
//               <p style={{ margin: '0 0 10px', cursor: 'pointer' }}>الملف الشخصي</p>
//               <p
//                 style={{ margin: 0, cursor: 'pointer' }}
//                 onClick={handleLogout}
//               >
//                 {loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBookOpen, faCommentDots, faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { faFileLines, faClipboard } from '@fortawesome/free-regular-svg-icons';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
          <button
        className="toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', top: '15px', right: 0, zIndex: 1100, marginRight: '16px', transition: 'background 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#EAF8F4'; e.currentTarget.style.cursor = 'pointer'; }}
        onMouseLeave={e => { e.currentTarget.style.background = ''; }}
      >
        ☰
      </button> 
      {/* <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button> */}
      {isOpen && (
        <div className="sidebar" style={{ right: 0, left: 'auto', position: 'fixed' }}>
          <ul>
            <li>
              <NavLink to="/sheikh-dashboard" end className={({ isActive }) => isActive ? "active" : ""}> <FontAwesomeIcon icon={faHouse} /> الرئيسية</NavLink>
            </li>
            <li>
              <NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}> <FontAwesomeIcon icon={faBookOpen} /> الدورات</NavLink>
            </li>
            <li>
              <NavLink to="/schedule-requests" className={({ isActive }) => isActive ? "active" : ""}> <FontAwesomeIcon icon={faClipboard} /> طلبات الجدولة</NavLink>
            </li>
            <li>
              <NavLink to="/coming-soon-teacher" className={({ isActive }) => isActive ? "active" : ""}> <FontAwesomeIcon icon={faCommentDots} /> المحادثات</NavLink>
            </li>
            <li>
              <NavLink to="/exams" className={({ isActive }) => isActive ? "active" : ""}> <FontAwesomeIcon icon={faFileLines} /> الاختبارات</NavLink>
            </li>
            <li>
              <NavLink to="/generate-sessions" className={({ isActive }) => isActive ? "active" : ""}> <FontAwesomeIcon icon={faUsersLine} /> الجلسات</NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';



// const Sidebar = () => {
//   const [activeLink, setActiveLink] = useState('الرئيسية');
//   const [isOpen, setIsOpen] = useState(true);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const sidebarStyle = {
//     width: isOpen ? '220px' : '60px',
//     height: '100vh',
//     backgroundColor: '#F2F8F6',
//     padding: '20px 10px',
//     boxSizing: 'border-box',
//     direction: 'rtl',
//     position: 'fixed',
//     top: 0,
//     right: 0,
//     overflowX: 'hidden',
//     transition: 'width 0.3s ease',
//     zIndex: 1000,
//   };

//   const listStyle = {
//     listStyle: 'none',
//     padding: 0,
//     marginTop: '60px',
//     display: isOpen ? 'block' : 'none',
//   };

//   const linkStyle = (link) => ({
//     padding: '15px 10px',
//     marginBottom: '10px',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     color: activeLink === link ? '#1EC8A0' : '#000000',
//     fontWeight: activeLink === link ? 'bold' : 'normal',
//     backgroundColor: activeLink === link ? '#E6F7F3' : 'transparent',
//     transition: 'all 0.3s ease',
//     textAlign: 'right',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//   });


//    const hamburgerStyle = {
//     position: 'absolute',
//     top: '20px',
//     right: isOpen ? '180px' : '20px',
//     fontSize: '30px',
//     cursor: 'pointer',
//     zIndex: 1100,
//     transition: 'right 0.3s ease',
//   };

//   return (
//     <>
//       <div style={hamburgerStyle} onClick={toggleSidebar}>
//         ☰
//       </div>
//       <div style={sidebarStyle}>
//         <ul style={listStyle}>
//           <li onClick={() => setActiveLink('الرئيسية')}>
//             <Link to="/" style={linkStyle('الرئيسية')}>الرئيسية</Link>
//           </li>
//           <li onClick={() => setActiveLink('الدورات')}>
//             <Link to="/courses" style={linkStyle('الدورات')}>الدورات</Link>
//           </li>
//           <li onClick={() => setActiveLink('طلبات الجدولة')}>
//             <Link to="/schedule-requests" style={linkStyle('طلبات الجدولة')}>طلبات الجدولة</Link>
//           </li>
//           <li onClick={() => setActiveLink('المحادثات')}>
//             <Link to="/chat" style={linkStyle('المحادثات')}>المحادثات</Link>
//           </li>
//         </ul>
//       </div>
//       {/* <div style={sidebarStyle}>
//         <ul style={listStyle}>
//           {['الرئيسية', 'الدورات', 'طلبات الجدولة', 'المحادثات'].map((link) => (
//             <li
//               key={link}
//               style={linkStyle(link)}
//               onClick={() => setActiveLink(link)}
//             >
//               {link}
//             </li>
            
//           ))}
//         </ul>
//       </div> */}
//     </>
//   );
// };

// export default Sidebar;

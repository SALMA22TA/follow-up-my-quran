import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faEye, faUsers, faBookOpen, faClipboardCheck, faFileLines, faGear, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Auto-close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    // Check on mount
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      {isOpen && (
        <div className="sidebar" style={{ right: 0, left: "auto", position: "fixed" }}>
          <ul>
            <li>
              <NavLink to="/admin-dashboard" exact activeClassName="active"><FontAwesomeIcon icon={faHouse} /> الرئيسية</NavLink>
            </li>
            <li>
              <NavLink to="/admin/teachers" activeClassName="active"><FontAwesomeIcon icon={faGraduationCap} /> المعلمون</NavLink>
            </li>
            <li>
              <NavLink to="/admin/students" activeClassName="active"><FontAwesomeIcon icon={faUsers} /> الطلاب</NavLink>
            </li>
            <li>
              <NavLink to="/admin/courses" activeClassName="active"><FontAwesomeIcon icon={faBookOpen} /> الإشراف على الدورات</NavLink>
            </li>
            <li>
              <NavLink to="/admin/exams-supervision" activeClassName="active"><FontAwesomeIcon icon={faClipboardCheck} /> الإشراف على الاختبارات</NavLink>
            </li>
            <li>
              <NavLink to="/reports-feedback" activeClassName="active"><FontAwesomeIcon icon={faFileLines} /> التقارير والآراء</NavLink>
            </li>
            {/* <li>
              <NavLink to="/admin/settings" activeClassName="active"><FontAwesomeIcon icon={faGear} /> الإعدادات</NavLink>
            </li> */}
          </ul>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;

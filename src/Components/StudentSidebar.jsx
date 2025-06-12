import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBookOpen, faCommentDots, faUsersLine, faChalkboardUser, faCalendarDay, faCircleCheck, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { faFileLines, faClipboard } from '@fortawesome/free-regular-svg-icons';

const StudentSidebar = () => {
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
        <div className="sidebar" style={{ right: 0, left: "auto", position: "fixed" }}>
          <ul>
            <li>
              <NavLink to="/student-dashboard" exact activeClassName="active"><FontAwesomeIcon icon={faHouse} /> الرئيسية</NavLink>
            </li>
            <li>
              <NavLink to="/teachers" activeClassName="active"> <FontAwesomeIcon icon={faChalkboardUser} /> المعلمون</NavLink>
            </li>
            <li>
              <NavLink to="/student-requests" activeClassName="active">  <FontAwesomeIcon icon={faClipboard} /> طلباتي</NavLink>
            </li>
            <li>
              <NavLink to="/student-courses" activeClassName="active"> <FontAwesomeIcon icon={faBookOpen} /> الدورات</NavLink>
            </li>
            <li>
              <NavLink to="/student-exams" activeClassName="active" >  <FontAwesomeIcon icon={faFileLines} /> الاختبارات</NavLink>
            </li>
            <li>
              <NavLink to="/progress" activeClassName="active" > <FontAwesomeIcon icon={faCircleCheck} />  الخطط</NavLink>
            </li>
            <li>
              <NavLink to="/select-verse" activeClassName="active">  <FontAwesomeIcon icon={faMicrophone} /> تلاوة آية قرآنية</NavLink>
            </li>
            <li>
              <NavLink to="/discussions" activeClassName="active">  <FontAwesomeIcon icon={faCommentDots} /> المحادثات</NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default StudentSidebar;

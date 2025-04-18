import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css"; // Uses the same CSS as the Sheikh's sidebar

const StudentSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      {isOpen && (
        <div className="sidebar" style={{ right: 0, left: "auto", position: "fixed" }}>
          <ul>
            <li>
              <NavLink to="/student-dashboard" exact activeClassName="active">الرئيسية</NavLink>
            </li>
            <li>
              <NavLink to="/teachers" activeClassName="active">المعلمون</NavLink>
            </li>
            <li>
              <NavLink to="/student-requests" activeClassName="active">طلباتي</NavLink>
            </li>
            <li>
              <NavLink to="/student-courses" activeClassName="active">الدورات</NavLink>
            </li><li>
              <NavLink to="/progress" activeClassName="active">الاختبارات</NavLink>
            </li><li>
              <NavLink to="/progress" activeClassName="active" > الخطط</NavLink>
            </li>
            <li>
              <NavLink to="/discussions" activeClassName="active">المحادثات</NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default StudentSidebar;

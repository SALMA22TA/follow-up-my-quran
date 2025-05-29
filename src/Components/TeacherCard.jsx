import React from "react";
import { Link } from "react-router-dom";
import '../styles/TeacherStyles.css';

// @ts-ignore
const TeacherCard = ({ teacher }) => {
  return (
    <div className="teacher-card">
      <img src={teacher.photo} alt={teacher.name} />
      <h3>{teacher.name}</h3>
      <p>{teacher.expertise}</p>
      <Link to={`/teachers/${teacher.id}`}>View Details</Link>
    </div>
  );
};

export default TeacherCard;

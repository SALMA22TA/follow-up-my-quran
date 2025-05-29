import React from "react";
import { useParams } from "react-router-dom";
import teachers from "../data/teachers";
import '../styles/TeacherStyles.css';


const TeacherDetail = () => {
  const { id } = useParams();
  // @ts-ignore
  const teacher = teachers.find((teacher) => teacher.id === parseInt(id));

  if (!teacher) {
    return <h2>Teacher not found</h2>;
  }

  return (
    <div className="teacher-detail">
      <img src={teacher.photo} alt={teacher.name} />
      <h1>{teacher.name}</h1>
      <h3>Expertise: {teacher.expertise}</h3>
      <p>{teacher.bio}</p>
      <p>Contact: {teacher.contact}</p>
    </div>
  );
};

export default TeacherDetail;

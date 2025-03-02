import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: "رياضيات", description: "بعض مسائل الرياضيات", status: "مسودة", published: false },
    { id: 2, title: "اللغة الإنجليزية", description: "الماضي البسيط", status: "مسودة", published: false },
  ]);

  const handlePublish = (id) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id
          ? { ...course, published: true, status: "منشور" }
          : course
      )
    );
  };

  return (
    <>
      <Navbar />
      <div style={dashboardContainer}>
        <Sidebar />
        <div style={mainContent}>
          <h1>قائمة الدورات</h1>

          {/* Add Course Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
            <Link to="/add-course" style={addButtonStyle}>
              + إضافة دورة جديدة
            </Link>
          </div>

          {/* Courses Table */}
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={tableHeaderCellStyle}>العنوان</th>
                  <th style={tableHeaderCellStyle}>الوصف</th>
                  <th style={tableHeaderCellStyle}>الحالة</th>
                  <th style={tableHeaderCellStyle}>نشر؟</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{course.title}</td>
                    <td style={tableCellStyle}>{course.description}</td>
                    <td style={tableCellStyle}>{course.status}</td>
                    <td style={tableCellStyle}>
                      <button
                        onClick={() => handlePublish(course.id)}
                        disabled={course.published}
                        style={{
                          ...publishButtonStyle,
                          backgroundColor: course.published ? "#ccc" : "#1EC8A0",
                          cursor: course.published ? "not-allowed" : "pointer",
                        }}
                      >
                        {course.published ? "نُشر" : "نشر"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

// 📌 **Matching Dashboard Layout**
const dashboardContainer = {
  display: "flex",
  flexDirection: "row-reverse", // Sidebar on the right
  direction: "rtl",
};

const mainContent = {
  marginRight: "220px", // Same as sidebar width
  padding: "20px",
  width: "100%",
  boxSizing: "border-box",
};

const addButtonStyle = {
  backgroundColor: "#1EC8A0",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  fontSize: "18px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
};

const tableContainerStyle = {
  width: "100%",
  overflowX: "auto",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  padding: "15px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "right",
};

const tableHeaderRowStyle = {
  backgroundColor: "#f8f9fa",
};

const tableHeaderCellStyle = {
  padding: "12px",
  textAlign: "right",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "12px",
};

const publishButtonStyle = {
  color: "#fff",
  border: "none",
  padding: "7px 15px",
  borderRadius: "5px",
  fontWeight: "bold",
};

export default Courses;

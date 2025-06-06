import React, { useState, useEffect } from "react";
import { Search, Star, User } from "lucide-react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter] = useState("جميع التخصصات");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Token from localStorage:", token);
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    axios
      .get("http://localhost:8000/api/v1/student/teachers_list", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((response) => {
        const teacherList = response.data.data.data.map((item) => {
          // Calculate average rating from feedbacks
          const averageRating = item.feedbacks && item.feedbacks.length > 0
            ? (item.feedbacks.reduce((sum, feedback) => sum + feedback.rate, 0) / item.feedbacks.length).toFixed(1)
            : "0.0";

          // Get unique students (based on user_id in feedbacks)
          const uniqueStudents = new Set(item.feedbacks?.map(feedback => feedback.user_id) || []).size;

          return {
            id: item.id,
            name: `${item.teacherinfo.fname} ${item.teacherinfo.lname}`,
            specialty: item.teacherinfo.specialty || "غير محدد",
            image: item.teacherinfo.profile_pic,
            students: uniqueStudents, // Number of unique students who gave feedback
            rating: averageRating,
            raw: item,
          };
        });
        setTeachers(teacherList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching teachers:", error);
        setError("فشل في جلب قائمة المعلمين");
        setLoading(false);
      });
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      (filter === "جميع التخصصات" || teacher.specialty.includes(filter)) &&
      (search === "" || teacher.name.includes(search))
  );

  const handleRequestSchedule = (teacher) => {
    const updatedTeacher = {
      ...teacher,
      specialty: `متخصص في ${teacher.specialty}`,
    };
    navigate("/request-schedule", { state: { teacher: updatedTeacher } });
  };

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl" }}>
        <Sidebar />

        <div style={{ marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" }}>
          <h1>قائمة المعلمين</h1>

          {/* Filter and Search Bar */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="ابحث عن معلم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 35px 8px 10px",
                  borderRadius: "6px",
                  border: "1px solid #1EC8A0",
                }}
              />
              <Search size={18} style={{ position: "absolute", right: "10px", color: "#888" }} />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #1EC8A0",
                background: "#fff",
                width: "180px",
              }}
            >
              <option>جميع التخصصات</option>
              <option>التجويد</option>
              <option>القرآن الكريم</option>
              <option>التفسير</option>
            </select>
          </div>

          {/* Loading Message */}
          {loading ? (
            <div style={{ fontSize: "18px", color: "#888", textAlign: "center", padding: "20px" }}>
              جارٍ تحميل المعلمين...
            </div>
          ) : error ? (
            <div style={{ fontSize: "18px", color: "red", textAlign: "center", padding: "20px" }}>
              {error}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              backgroundColor: "#EAF8F4",
              borderRadius: "12px",
              marginTop: "20px"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Star size={48} color="#1EC8A0" />
              </div>
              <h3 style={{ margin: "0 0 10px 0", color: "#666" }}>لا يوجد معلمين</h3>
              <p style={{ margin: 0, color: "#888", textAlign: "center" }}>
                لا يوجد معلمين يوافقون معايير البحث
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              {filteredTeachers.map((teacher, index) => (
                <div
                  key={index}
                  style={{
                    background: "#EAF8F4",
                    padding: "15px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    direction: "rtl",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/teacher/${teacher.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Profile Image (Right Side) */}
                  {teacher.image ? (
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "15px",
                        border: "2px solid #1EC8A0"
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "15px",
                        border: "2px solid #1EC8A0"
                      }}
                    >
                      <User size={40} color="#1EC8A0" />
                    </div>
                  )}

                  {/* Teacher Info (Center) */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>الشيخ {teacher.name}</p>
                    <p style={{ color: "#1EC8A0", fontWeight: "bold" }}> متخصص في {teacher.specialty}</p>
                    <p>طلاب نشطين: {teacher.students}</p>
                  </div>

                  {/* Rating and Button (Left Side) */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    {/* Rating & Star - Shifted to the Left */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        position: "absolute",
                        top: "10px",
                        left: "0px",
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "bold" }}>{teacher.rating}</p>
                      <Star size={18} color="#FFD700" fill="#FFD700" />
                    </div>

                    {/* Schedule Button - Positioned Lower */}
                    <button
                      style={{
                        backgroundColor: "#1EC8A0",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginTop: "auto",
                        alignSelf: "flex-end",
                        transition: "0.3s ease-in-out",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                      onClick={(e) => { e.stopPropagation(); handleRequestSchedule(teacher); }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                       اشترك الان
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeachersList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { CircleAlert, Bell, Book, Calendar, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const dashboardContainer = {
    display: "flex",
    flexDirection: "row-reverse",
    direction: "rtl",
  };

  const mainContent = {
    marginRight: "220px",
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
  };

  const [latestCourses, setLatestCourses] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const [sessions, setSessions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios.get("http://localhost:8000/api/v1/student/today_sessions", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(response => {
        const sessionsArray = response.data?.data?.data;
        if (Array.isArray(sessionsArray)) {
          console.log("✅ Sessions fetched:", sessionsArray);
          setSessions(sessionsArray);
        } else {
          console.warn("❗ sessions data is not an array:", response.data);
          setSessions([]);
        }
      })
      .catch(error => {
        console.error("❌ Error fetching sessions:", error);
        if (error.response) {
          console.log("🔎 Status:", error.response.status);
          console.log("🔎 Response:", error.response.data);
        }
      });

    // Fetch latest courses
    axios.get("http://localhost:8000/api/v1/student/latest_courses", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log("✅ Latest courses fetched:", response.data);
        setLatestCourses(response.data?.data || []);
      })
      .catch((error) => {
        console.error("❌ Error fetching latest courses:", error);
        if (error.response) {
          console.log("🔎 Status:", error.response.status);
          console.log("🔎 Response:", error.response.data);
        }
      });

    // Fetch latest notifications
    axios.get("http://localhost:8000/api/v1/student/latest_notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log("✅ Notifications fetched:", response.data);
        setNotifications(response.data?.data || []);
      })
      .catch((error) => {
        console.error("❌ Error fetching notifications:", error);
        if (error.response) {
          console.log("🔎 Status:", error.response.status);
          console.log("🔎 Response:", error.response.data);
        }
      });

  }, []);

  return (
    <>
      <Navbar />
      <div style={dashboardContainer}>
        <Sidebar />

        <div style={mainContent}>
          <h1>لوحة التحكم</h1>

          {/* جلسات اليوم */}
          <div style={{ marginTop: "20px" }}>
            <div style={{ backgroundColor: "#1EC8A0", padding: "15px", borderRadius: "12px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <Calendar size={20} />
              <h2 style={{ margin: 0 }}>جلسات اليوم</h2>
            </div>
            <div style={{ backgroundColor: "#EAF8F4", padding: "15px", borderRadius: "12px", marginTop: "10px" }}>
              <table style={{ width: "100%", textAlign: "center", direction: "rtl" }}>
                <thead>
                  <tr style={{ backgroundColor: "#1EC8A0", color: "white" }}>
                    <th style={{ padding: "10px" }}>الوقت</th>
                    <th style={{ padding: "10px" }}>اسم المعلم</th>
                    <th style={{ padding: "10px" }}>الانضمام؟</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(sessions) && sessions.length > 0 ? (
                    sessions.map((session, index) => (
                      <tr
                        key={index}
                        style={{ backgroundColor: "white", transition: "background-color 0.1s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ECECEC")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                      >
                        <td style={{ padding: "10px", color: "black" }}>{session.time}</td>
                        <td style={{ padding: "10px", fontWeight: "bold" }}>
                          {session.teacher?.teacherinfo?.fname} {session.teacher?.teacherinfo?.lname}
                        </td>
                        <td style={{ padding: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
                          {session.teacher?.teacherinfo?.link ? (
                            <a
                              href={session.teacher.teacherinfo.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                backgroundColor: "#1EC8A0",
                                color: "white",
                                border: "none",
                                padding: "8px 15px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "7px",
                                textDecoration: "none",
                                fontWeight: 500,
                                transition: "background 0.2s, transform 0.2s",
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#17997A';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#1EC8A0';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <Video size={18} />
                              انضم
                            </a>
                          ) : (
                            <button
                              style={{
                                backgroundColor: '#ccc',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '7px',
                                fontWeight: 500,
                                cursor: 'not-allowed',
                              }}
                              disabled
                            >
                              <Video size={18} />
                              انضم
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ padding: "15px" }}>
                        <div style={{ 
                          textAlign: "center", 
                          padding: "30px 20px",
                          color: "#666",
                          fontSize: "16px",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          margin: "10px 0",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "10px"
                        }}>
                          <Calendar size={24} color="#888" />
                          <div>لا توجد جلسات اليوم</div>
                          <div style={{ fontSize: "14px", color: "#888" }}>سيظهر هنا جدول جلساتك اليومية</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* الدورات القادمة */}
          <div style={{ marginTop: "20px" }}>
            <div style={{ backgroundColor: "#1EC8A0", padding: "15px", borderRadius: "12px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Book size={20} />
                <h2 style={{ margin: 0 }}> آخر الدورات</h2>
              </div>
            </div>
            <div style={{ backgroundColor: "#EAF8F4", padding: "15px", borderRadius: "12px", marginTop: "10px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {Array.isArray(latestCourses) && latestCourses.length > 0 ? (
                latestCourses.map((course, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "white",
                      padding: "15px",
                      borderRadius: "8px",
                      flex: "1",
                      minWidth: "250px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      position: "relative",
                      textAlign: "right",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    <h3 style={{ color: "black", marginTop: "25px" }}>دورة {course.title}</h3>
                    <p style={{ margin: "5px 0" }}>مع  الشيخ {course.teacher?.teacherinfo?.fname} {course.teacher?.teacherinfo?.lname}</p>


                  </div>
                ))
              ) : (
                <div style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "30px 20px",
                  color: "#666",
                  fontSize: "16px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  margin: "10px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <Book size={24} color="#888" />
                  <div>لا توجد دورات متاحة حالياً</div>
                  <div style={{ fontSize: "14px", color: "#888" }}>سيظهر هنا الدورات التي تم تسجيلك فيها</div>
                </div>
              )}

            </div>
          </div>

          {/* آخر النشاطات */}
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                backgroundColor: "#1EC8A0",
                padding: "15px",
                borderRadius: "12px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Bell size={20} />
                <h2 style={{ margin: 0 }}>آخر الإشعارات</h2>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#EAF8F4",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "10px",
              }}
            >
              {Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "start",
                      padding: "10px 0",
                      borderBottom: "1px solid #D4ECE5",
                      color: "#333",
                      flexDirection: "column",
                      textAlign: "right",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "5px",
                        top: "13px",
                        color: "#E74C3C",
                        fontSize: "20px",
                      }}
                    >
                      <CircleAlert size={20} />
                    </div>
                    <div style={{ flex: 1, paddingRight: "30px" }}>{notif.data.message}</div>
                    <div style={{ color: "#666", fontSize: "14px", paddingRight: "30px", marginTop: "5px" }}>
                      {new Date(notif.created_at).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  textAlign: "center", 
                  padding: "30px 20px",
                  color: "#666",
                  fontSize: "16px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  margin: "10px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <Bell size={24} color="#888" />
                  <div>لا توجد إشعارات جديدة</div>
                  <div style={{ fontSize: "14px", color: "#888" }}>سيظهر هنا أي إشعارات جديدة تتلقاها</div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </>

  );
};

export default StudentDashboard;
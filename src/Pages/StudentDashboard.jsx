// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../Components/DashboardNavbar";
// import Sidebar from "../Components/StudentSidebar";
// import { CircleAlert } from "lucide-react";

// const StudentDashboard = () => {
//   const dashboardContainer = {
//     display: "flex",
//     flexDirection: "row-reverse",
//     direction: "rtl",
//   };

//   const mainContent = {
//     marginRight: "220px",
//     padding: "20px",
//     width: "100%",
//     boxSizing: "border-box",
//   };

//   // Sessions & Courses Data
//   // const sessions = [
//   //   { time: "PM 7:30", teacher: "الشيخ أحمد بن علي" },
//   //   { time: "PM 9:00", teacher: "الشيخ إسماعيل بكر" },
//   //   { time: "PM 9:00", teacher: "الشيخ إسماعيل بكر" },
//   // ];

//   const courses = [
//     { title: "دورة تجويد القرآن الكريم", teacher: "الشيخ عبد الرحمن السديس", time: "PM 8:00", days: "الأحد - الثلاثاء", startsIn: "يبدأ في 3 أيام" },
//     { title: "دورة التفسير", teacher: "الشيخ عبد الرحمن السديس", time: "PM 8:30", days: "الأحد - الثلاثاء", startsIn: "يبدأ في 3 أيام" },
//   ];

//   const activities = [
//     { id: 1, text: "تم تسجيلك في دورة أحكام التجويد", time: "منذ ساعتين" },
//     { id: 2, text: "تم إضافة اختبار جديد في دورة حفظ سورة البقرة", time: "منذ 5 ساعات" },
//     { id: 3, text: "فرز على استفسارك في المحادثات", time: "منذ يوم واحد" },
//   ];

//   const [sessions, setSessions] = useState([]);
//   // const [courses, setCourses] = useState([]);
//   // const [activities, setActivities] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("access_token"); // or use your method of storing the token
  
//     axios.get("http://localhost:8000/api/v1/student/today_sessions", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       }
//     })
//       .then(response => setSessions(response.data))
//       .catch(error => console.error("Error fetching sessions:", error));
//   }, []);
  

//     // // Fetch courses
//     // axios.get("http://localhost/api/courses/upcoming")
//     //   .then(response => setCourses(response.data))
//     //   .catch(error => console.error("Error fetching courses:", error));

//     // // Fetch activities
//     // axios.get("http://localhost/api/student/activities")
//     //   .then(response => setActivities(response.data))
//     //   .catch(error => console.error("Error fetching activities:", error));



//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />

//         <div style={mainContent}>
//           <h1>لوحة التحكم</h1>

//           {/* جلسات اليوم */}
//           <div style={{ marginTop: "20px" }}>
//             <div style={{ backgroundColor: "#1EC8A0", padding: "15px", borderRadius: "12px", color: "white" }}>
//               <h2 style={{ margin: 0, textAlign: "center" }}>جلسات اليوم</h2>
//             </div>
//             <div style={{ backgroundColor: "#EAF8F4", padding: "15px", borderRadius: "12px", marginTop: "10px" }}>
//               <table style={{ width: "100%", textAlign: "center", direction: "rtl" }}>
//                 <thead>
//                   <tr style={{ backgroundColor: "#1EC8A0", color: "white" }}>
//                     <th style={{ padding: "10px" }}>الوقت</th>
//                     <th style={{ padding: "10px" }}>اسم المعلم</th>
//                     <th style={{ padding: "10px" }}>الانضمام؟</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sessions.map((session, index) => (
//                     <tr key={index}
//                       style={{
//                         backgroundColor: "white",
//                         transition: "background-color 0.1s",
//                       }}
//                       onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EAF8F4")}
//                       onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
//                     >
//                       <td style={{ padding: "10px", color: "black" }}>{session.time}</td>
//                       <td style={{ padding: "10px", fontWeight: "bold" }}>{session.teacher}</td>
//                       <td style={{ padding: "10px" }}>
//                         <button
//                           style={{
//                             backgroundColor: "#1EC8A0",
//                             color: "white",
//                             border: "none",
//                             padding: "8px 15px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           إنضم
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* الدورات القادمة */}
//           <div style={{ marginTop: "20px" }}>
//             <div style={{ backgroundColor: "#1EC8A0", padding: "15px", borderRadius: "12px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <h2 style={{ margin: 0 }}>الدورات القادمة</h2>
//               <span style={{ cursor: "pointer" }}>عرض الكل</span>
//             </div>
//             <div style={{ backgroundColor: "#EAF8F4", padding: "15px", borderRadius: "12px", marginTop: "10px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
//               {courses.map((course, index) => (
//                 <div key={index} style={{
//                   backgroundColor: "white",
//                   padding: "15px",
//                   borderRadius: "8px",
//                   flex: "1",
//                   minWidth: "250px",
//                   boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                   position: "relative",
//                   textAlign: "right"
//                 }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.backgroundColor = "#f5f5f5")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.backgroundColor = "white")
//                   }>
//                   <span style={{
//                     backgroundColor: "#C3E6CD",
//                     color: "#218838",
//                     padding: "5px 10px",
//                     borderRadius: "15px",
//                     fontSize: "14px",
//                     position: "absolute",
//                     top: "10px",
//                     left: "10px"
//                   }}>
//                     {course.startsIn}
//                   </span>
//                   <h3 style={{ color: "black", marginTop: "25px" }}>{course.title}</h3>
//                   <p style={{ margin: "5px 0" }}>مع {course.teacher}</p>
//                   <p style={{ margin: "5px 0", fontWeight: "bold" }}>{course.days} - {course.time}</p>
//                   <span style={{
//                     color: "#1EC8A0",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                     position: "absolute",
//                     bottom: "10px",
//                     left: "10px"
//                   }}>
//                     التفاصيل
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* آخر النشاطات */}
//           <div style={{ marginTop: "20px" }}>
//             <div
//               style={{
//                 backgroundColor: "#1EC8A0",
//                 padding: "15px",
//                 borderRadius: "12px",
//                 color: "white",
//                 textAlign: "right",
//                 fontSize: "16px",
//               }}
//             >
//               <h2 style={{ margin: 0 }}>آخر النشاطات</h2>
//             </div>

//             <div
//               style={{
//                 backgroundColor: "#EAF8F4",
//                 padding: "15px",
//                 borderRadius: "12px",
//                 marginTop: "10px",
//               }}
//             >
//               {activities.map((activity) => (
//                 <div
//                   key={activity.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "start",
//                     padding: "10px 0",
//                     borderBottom: "1px solid #D4ECE5",
//                     color: "#333",
//                     flexDirection: "column",
//                     textAlign: "right",
//                     position: "relative",
//                   }}
//                 >
//                   {/* Warning Icon on the Right */}
//                   <div
//                     style={{
//                       position: "absolute",
//                       right: "5px",
//                       top: "13px",
//                       color: "#E74C3C",
//                       fontSize: "20px",
//                     }}
//                   >
//                     <CircleAlert size={20} />
//                   </div>

//                   {/* Activity text */}
//                   <div style={{ flex: 1, paddingRight: "30px" }}>{activity.text}</div>

//                   {/* Time under the sentence */}
//                   <div style={{ color: "#666", fontSize: "14px", paddingRight: "30px", marginTop: "5px" }}>
//                     {activity.time}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { CircleAlert } from "lucide-react";

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

  const courses = [
    { title: "دورة تجويد القرآن الكريم", teacher: "الشيخ عبد الرحمن السديس", time: "PM 8:00", days: "الأحد - الثلاثاء", startsIn: "يبدأ في 3 أيام" },
    { title: "دورة التفسير", teacher: "الشيخ عبد الرحمن السديس", time: "PM 8:30", days: "الأحد - الثلاثاء", startsIn: "يبدأ في 3 أيام" },
  ];

  const activities = [
    { id: 1, text: "تم تسجيلك في دورة أحكام التجويد", time: "منذ ساعتين" },
    { id: 2, text: "تم إضافة اختبار جديد في دورة حفظ سورة البقرة", time: "منذ 5 ساعات" },
    { id: 3, text: "فرز على استفسارك في المحادثات", time: "منذ يوم واحد" },
  ];

  const [sessions, setSessions] = useState([]);

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
            <div style={{ backgroundColor: "#1EC8A0", padding: "15px", borderRadius: "12px", color: "white" }}>
              <h2 style={{ margin: 0, textAlign: "center" }}>جلسات اليوم</h2>
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
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EAF8F4")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                      >
                        <td style={{ padding: "10px", color: "black" }}>{session.time}</td>
                        <td style={{ padding: "10px", fontWeight: "bold" }}>{session.teacher}</td>
                        <td style={{ padding: "10px" }}>
                          <button
                            style={{
                              backgroundColor: "#1EC8A0",
                              color: "white",
                              border: "none",
                              padding: "8px 15px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            إنضم
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ padding: "15px", color: "gray" }}>
                        لا توجد جلسات اليوم
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
              <h2 style={{ margin: 0 }}>الدورات القادمة</h2>
              <span style={{ cursor: "pointer" }}>عرض الكل</span>
            </div>
            <div style={{ backgroundColor: "#EAF8F4", padding: "15px", borderRadius: "12px", marginTop: "10px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {courses.map((course, index) => (
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
                  <span
                    style={{
                      backgroundColor: "#C3E6CD",
                      color: "#218838",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "14px",
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                    }}
                  >
                    {course.startsIn}
                  </span>
                  <h3 style={{ color: "black", marginTop: "25px" }}>{course.title}</h3>
                  <p style={{ margin: "5px 0" }}>مع {course.teacher}</p>
                  <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                    {course.days} - {course.time}
                  </p>
                  <span
                    style={{
                      color: "#1EC8A0",
                      cursor: "pointer",
                      fontSize: "14px",
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                    }}
                  >
                    التفاصيل
                  </span>
                </div>
              ))}
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
                textAlign: "right",
                fontSize: "16px",
              }}
            >
              <h2 style={{ margin: 0 }}>آخر النشاطات</h2>
            </div>

            <div
              style={{
                backgroundColor: "#EAF8F4",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "10px",
              }}
            >
              {activities.map((activity) => (
                <div
                  key={activity.id}
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
                  <div style={{ flex: 1, paddingRight: "30px" }}>{activity.text}</div>
                  <div style={{ color: "#666", fontSize: "14px", paddingRight: "30px", marginTop: "5px" }}>
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default StudentDashboard;

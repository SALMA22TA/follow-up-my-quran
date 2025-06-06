import React, { useState, useEffect } from "react";
import { Filter, Search, CalendarDays, User } from "lucide-react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from "axios";

library.add(faLayerGroup);

const StdCoursesPage = () => {
  const [filter, setFilter] = useState("جميع الدورات");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("جارية");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);


 useEffect(() => {
  fetchCourses();
}, []);


const fetchCourses = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await axios.get('http://localhost:8000/api/v1/student/get_courses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Full API Response:', response.data);
    const fetchedCourses = response.data.data.data;
    console.log('Fetched Courses:', fetchedCourses);

    const formattedCourses = fetchedCourses.map(course => {
      console.log('Processing course:', course);
      return {
        id: course.id,
        title: course.title,
        teacher: course.teacher?.teacherinfo ? 
          `الشيخ ${course.teacher.teacherinfo.fname} ${course.teacher.teacherinfo.lname}` : 
          'المدرس',
        progress: 0,
        days: course.days || "", 
        time: course.time || "", 
        status: mapStatus(course.status), 
        image: course.cover_image || null, 
        teacherImage: course.teacher?.teacherinfo?.profile_pic || null,
      };
    });

    console.log('Formatted Courses:', formattedCourses);
    setAllCourses(formattedCourses);
  } catch (error) {
    console.error("حدث خطأ أثناء جلب الدورات:", error);
    setLoading(false);
  } finally {
    setLoading(false);
  }
};


const mapStatus = (status) => {
  if (status === "published") return "جارية";
  if (status === "upcoming") return "قادمة";
  if (status === "completed") return "مكتملة";
  return "غير معروف";
};


const filteredCourses = allCourses.filter((course) => {
  const matchesSearch = search === "" ? true : course.teacher.toLowerCase().includes(search.toLowerCase());
  const matchesFilter = filter === "جميع الدورات" ? true : course.title === filter;
  return matchesSearch && matchesFilter;
});
  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl" }}>
        <Sidebar />

        <div style={{ marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" }}>
          <h1>الدورات</h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            استعرض جميع الدورات المتاحة لك من المعلمين المشترك معهم
          </p>

          {/* Filter and Search */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="ابحث عن معلم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "95%",
                  padding: "12px 35px 10px 10px",
                  borderRadius: "6px",
                  border: "1px solid #1EC8A0",
                }}
              />
              <Search size={18} style={{ position: "absolute", right: "10px", top: "12px", color: "#888" }} />
            </div>

            <div style={{ position: "relative", width: "180px" }}>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 30px",
                  paddingRight: "35px",
                  borderRadius: "6px",
                  border: "1px solid #1EC8A0",
                  appearance: "auto",
                  backgroundColor: "#fff",
                }}
              >
                <option>جميع الدورات</option>
                {Array.from(new Set(allCourses.map(course => course.title))).map((title, idx) => (
                  <option key={idx}>{title}</option>
                ))}
              </select>
              <Filter size={16} style={{ position: "absolute", right: "10px", top: "12px", color: "#888" }} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "25px",
            width: "100%"
          }}>
            {["جارية", "قادمة", "مكتملة"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  backgroundColor: activeTab === tab ? "#1EC8A0" : "#EAF8F4",
                  color: activeTab === tab ? "#fff" : "#000",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  flex: 1
                }}
              >
                <CalendarDays size={16} />
                الدورات {tab}
              </button>
            ))}
          </div>

          {/* Course Cards */}
          {loading ? (
            <p>جاري التحميل...</p>
          ) : filteredCourses.length === 0 ? (
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
                <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: "48px", color: "#1EC8A0" }} />
              </div>
              <h3 style={{ margin: "0 0 10px 0", color: "#666" }}>لا توجد دورات حالياً</h3>
              <p style={{ margin: 0, color: "#888", textAlign: "center" }}>
                لم يتم العثور على دورات {activeTab} تطابق معايير البحث
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              {filteredCourses.map((course, index) => (
                <div
                  key={index}
                  style={{
                    background: "#EAF8F4",
                    padding: "0",
                    borderRadius: "10px",
                    direction: "rtl",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  {/* Image Section with Title and Badge */}
                  <div style={{
                    position: "relative",
                    width: "100%",
                    height: "160px",
                    marginBottom: "15px",
                  }}>
                    <img
                      src={course.cover_image || "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop"}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {/* Overlay */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
                    }} />

                    {/* Title */}
                    <div style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "15px",
                      color: "#fff",
                      fontSize: "18px",
                      fontWeight: "bold",
                      textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                    }}>
                     دورة {course.title} 
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "0 15px 15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden"
                      }}>
                        {course.teacherImage ? (
                          <img
                            src={course.teacherImage}
                            alt={course.teacher}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        ) : (
                          <User size={20} color="#1EC8A0" />
                        )}
                      </div>
                      <span> الشيخ {course.teacher}</span>
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                      <Link 
                        to={`/course/${course.id}`}
                        style={{ 
                          color: "#1EC8A0", 
                          fontWeight: "bold", 
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#0d9e7c";
                          e.currentTarget.style.transform = "translateX(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#1EC8A0";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        عرض التفاصيل
                      </Link>
                      <Link 
                        to={`/course/${course.id}/session`}
                        style={{ 
                          color: "#1EC8A0", 
                          fontWeight: "bold", 
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#0d9e7c";
                          e.currentTarget.style.transform = "translateX(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#1EC8A0";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        دخول
                      </Link>
                    </div>
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

export default StdCoursesPage;


// import React, { useState } from "react";
// import { Filter, Search, CalendarDays, User, Clock } from "lucide-react";
// import Navbar from "../Components/DashboardNavbar";
// import Sidebar from "../Components/StudentSidebar";
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Link } from 'react-router-dom';

// library.add(faLayerGroup);

// const StdCoursesPage = () => {
//   const [filter, setFilter] = useState("جميع المعلمين");
//   const [search, setSearch] = useState("");
//   const [activeTab, setActiveTab] = useState("جارية");

//   const allCourses = [
//     {
//       id: 1,
//       title: "دورة تجويد القرآن الكريم",
//       teacher: "الشيخ  سالم بن محمود",
//       progress: 45,
//       days: "الأحد - الثلاثاء",
//       time: "7:30 PM",
//       status: "جارية",
//     },
//     {
//       id: 2,
//       title: "دورة تجويد القرآن الكريم",
//       teacher: "الشيخ أحمد بن علي",
//       progress: 45,
//       days: "الأحد - الثلاثاء",
//       time: "7:30 PM",
//       status: "جارية",
//     },
//     {
//       id: 3,
//       title: "دورة حفظ سورة البقرة",
//       teacher: "الشيخ أحمد بن علي",
//       progress: 30,
//       days: "السبت - الأربعاء",
//       time: "9:00 PM",
//       status: "قادمة",
//     },
//     {
//       id: 4,
//       title: "دورة أحكام التلاوة",
//       teacher: "الشيخ كبير بن بكر",
//       progress: 75,
//       days: "الإثنين - الخميس",
//       time: "8:00 PM",
//       status: "مكتملة",
//     },
//   ];

//   const filteredCourses = allCourses.filter((course) => {
//     const matchesSearch = course.title.includes(search);
//     const matchesFilter = filter === "جميع المعلمين" || course.teacher.includes(filter);
//     const matchesTab = course.status === activeTab;
//     return matchesSearch && matchesFilter && matchesTab;
//   });

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl" }}>
//         <Sidebar />

//         <div style={{ marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" }}>
//           <h1>الدورات</h1>
//           <p style={{ color: "#666", marginBottom: "20px" }}>
//             استعرض جميع الدورات المتاحة لك من المعلمين المشترك معهم
//           </p>

//           {/* Filter and Search */}
//           <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//             <div style={{ position: "relative", flex: 1 }}>
//               <input
//                 type="text"
//                 placeholder="ابحث عن دورة..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 style={{
//                   width: "95%",
//                   padding: "12px 35px 10px 10px",
//                   borderRadius: "6px",
//                   border: "1px solid #1EC8A0",
//                 }}
//               />
//               <Search size={18} style={{ position: "absolute", right: "10px", top: "12px", color: "#888" }} />
//             </div>

//             <div style={{ position: "relative", width: "180px" }}>
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "10px 10px 10px 30px",
//                   paddingRight: "35px",
//                   borderRadius: "6px",
//                   border: "1px solid #1EC8A0",
//                   appearance: "auto",
//                   backgroundColor: "#fff",
//                 }}
//               >
//                 <option>جميع المعلمين</option>
//                 <option>الشيخ أحمد بن علي</option>
//                 <option>الشيخ كبير بن بكر</option>
//               </select>
//               <Filter size={16} style={{ position: "absolute", right: "10px", top: "12px", color: "#888" }} />
//             </div>
//           </div>

//           {/* Tabs */}
//           <div style={{ 
//             display: "flex", 
//             justifyContent: "space-between", 
//             gap: "20px", 
//             marginBottom: "25px",
//             width: "100%" 
//           }}>
//             {["جارية", "قادمة", "مكتملة"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 style={{
//                   padding: "8px 20px",
//                   borderRadius: "8px",
//                   backgroundColor: activeTab === tab ? "#1EC8A0" : "#EAF8F4",
//                   color: activeTab === tab ? "#fff" : "#000",
//                   border: "none",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: "6px",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                   flex: 1
//                 }}
//               >
//                 <CalendarDays size={16} />
//                 الدورات {tab}
//               </button>
//             ))}
//           </div>

//           {/* Course Cards or No Courses Message */}
//           {filteredCourses.length === 0 ? (
//             <div style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "40px",
//               backgroundColor: "#EAF8F4",
//               borderRadius: "12px",
//               marginTop: "20px"
//             }}>
//               <div style={{
//                 width: "60px",
//                 height: "60px",
//                 marginBottom: "20px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center"
//               }}>
//                 <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: "48px", color: "#1EC8A0" }} />
//               </div>
//               <h3 style={{ margin: "0 0 10px 0", color: "#666" }}>لا توجد دورات حالياً</h3>
//               <p style={{ margin: 0, color: "#888", textAlign: "center" }}>
//                 لم يتم العثور على دورات {activeTab} تطابق معايير البحث
//               </p>
//             </div>
//           ) : (
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
//               {filteredCourses.map((course, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     background: "#EAF8F4",
//                     padding: "0",
//                     borderRadius: "10px",
//                     direction: "rtl",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                     height: "100%",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Image Section with Title and Badge */}
//                   <div style={{
//                     position: "relative",
//                     width: "100%",
//                     height: "160px",
//                     marginBottom: "15px",
//                   }}>
//                     <img
//                       src={course.image || "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop"}
//                       alt={course.title}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                     {/* Overlay for better text readability */}
//                     <div style={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                       background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
//                     }} />
                    
//                     {/* Title on image */}
//                     <div style={{
//                       position: "absolute",
//                       bottom: "10px",
//                       right: "15px",
//                       color: "#fff",
//                       fontSize: "18px",
//                       fontWeight: "bold",
//                       textShadow: "0 1px 2px rgba(0,0,0,0.6)",
//                     }}>
//                       {course.title}
//                     </div>

//                     {/* Status Badge */}
//                     <div style={{
//                       position: "absolute",
//                       top: "10px",
//                       left: "10px",
//                       padding: "4px 12px",
//                       borderRadius: "12px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       backgroundColor: course.status === "جارية" ? "#1EC8A0" : 
//                                     course.status === "قادمة" ? "#FFA500" : "#888",
//                       color: "#fff",
//                     }}>
//                       {course.status}
//                     </div>
//                   </div>

//                   {/* Rest of card content with padding */}
//                   <div style={{ padding: "0 15px 15px" }}>
//                     {/* Teacher */}
//                     <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
//                       <div style={{
//                         width: "36px",
//                         height: "36px",
//                         borderRadius: "50%",
//                         backgroundColor: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         overflow: "hidden"
//                       }}>
//                         {course.teacherImage ? (
//                           <img 
//                             src={course.teacherImage} 
//                             alt={course.teacher}
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover"
//                             }}
//                           />
//                         ) : (
//                           <User size={20} color="#1EC8A0" />
//                         )}
//                       </div>
//                       <span>{course.teacher}</span>
//                     </div>

//                     {/* Progress */}
//                     <div style={{ height: "6px", background: "#ccc", borderRadius: "4px", margin: "5px 0" }}>
//                       <div style={{
//                         width: `${course.progress}%`,
//                         background: "#1EC8A0",
//                         height: "100%",
//                         borderRadius: "4px"
//                       }}></div>
//                     </div>
//                     <span style={{ fontSize: "12px", color: "#666", textAlign: "left" }}>{course.progress}%</span>

//                     {/* Schedule */}
//                     <div style={{ marginTop: "10px", fontSize: "14px", color: "#444" }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                         <CalendarDays size={14} color="#1EC8A0" />
//                         <span>{course.days} - {course.time}</span>
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
//                         <Clock size={14} color="#1EC8A0" />
//                         <span>الجلسة القادمة: {course.time}</span>
//                       </div>
//                     </div>

//                     {/* Footer */}
//                     <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
//                       <Link 
//                         to={`/course/${course.id}`}
//                         style={{ color: "#1EC8A0", fontWeight: "bold", textDecoration: "none" }}
//                       >
//                         عرض التفاصيل
//                       </Link>
//                       <Link 
//                         to={`/course/${course.id}/session`}
//                         style={{ color: "#1EC8A0", fontWeight: "bold", textDecoration: "none" }}
//                       >
//                         دخول
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default StdCoursesPage;



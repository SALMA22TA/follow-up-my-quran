import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { Link, useNavigate } from "react-router-dom"; 
import { Trash2 } from "lucide-react";

const Courses = () => {
  const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "delete" or "publish"
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  
  const openModal = (type, id) => {
    setModalType(type);
    setSelectedCourseId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourseId(null);
    setModalType("");
  };

  const confirmAction = () => {
    if (modalType === "delete") {
      handleDeleteCourse(selectedCourseId);
    } else if (modalType === "publish") {
      handlePublishCourse(selectedCourseId);
    }
    closeModal();
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("access_token"); 
      if (!token) {
        
        setError("الرجاء تسجيل الدخول أولاً");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/v1/teacher/get_courses", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            
            setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
            return;
          }
          throw new Error("فشل في جلب البيانات");
        }

        const data = await response.json();
        console.log("Courses data:", data); // Debug
        setCourses(data.data.data); 
      } catch (err) {
        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  
  const handleDeleteCourse = async (id) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      
      setError("الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/delete_course/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Delete response:", data);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          
          setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
        throw new Error("فشل في حذف الدورة");
      }
      
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
      
      const courseTitle = courses.find(course => course.id === id)?.title;
      console.log(`تم حذف الدورة: ${courseTitle}`);
      setError(null); 
    } catch (err) {
      
      setError(err.message);
    }
  };

  
  const handlePublishCourse = async (id) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      
      setError("الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/publish_course/${id}`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Publish response:", data);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          
          setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
        throw new Error(data.message || "فشل في نشر الدورة");
      }

      
      setCourses(prevCourses =>
        prevCourses.map(course =>
          
          course.id === id ? { ...course, status: "published" } : course
        )
      );
      
      const courseTitle = courses.find(course => course.id === id)?.title;
      console.log(`تم نشر دورة: ${courseTitle}`);

      setError(null);
    } catch (err) {
      console.error("Error:", err);
      
      setError(err.message);
    }
  };
  const tableStyle = {
    width: '100%',
    maxWidth: '1100px',
    borderCollapse: 'collapse',
    marginTop: '20px',
    direction: 'rtl',
    fontFamily: '"Tajawal", sans-serif',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const thStyle = {
    border: '1px solid #E6E6E6',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    fontWeight: 'bold',
  };

  const tdStyle = {
    border: '1px solid #E6E6E6',
    padding: '12px',
    textAlign: 'center',
  };
  return (
    <>
      <Navbar />
      <div 

      style={dashboardContainer}>
        <Sidebar />
        <div style={mainContent}>
          <h1>قائمة الدورات</h1>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
            <Link to="/add-course" style={addButtonStyle}
              onMouseEnter={e => { e.currentTarget.style.background = '#17b893'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1EC8A0'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              + إضافة دورة جديدة
            </Link>
            
          </div>

          {loading && <p>جاري التحميل...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
            <div style={{ maxWidth: '1100px' }}>
              <table style={tableStyle}>
                <thead>
                  <tr /*style={tableHeaderRowStyle}*/>
                    <th style={thStyle}>العنوان</th>
                    <th style={thStyle}>الحالة</th>
                    <th style={thStyle}>إضافة فيديو</th> 
                    <th style={thStyle}>نشر؟</th>
                    <th style={thStyle}>حذف؟</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td style={tdStyle}>
                        <Link to={`/course/${course.id}`} style={{ color: "black", textDecoration: "none"}}>
                          {course.title}
                        </Link>
                      </td>
                      <td style={tdStyle}>{course.status}</td>
                      <td style={tdStyle}>
                        <Link
                          
                          to={`/add-video/${course.id}`} 
                          style={{
                            backgroundColor: "#1EC8A0",
                            color: "#fff",
                            border: "none",
                            padding: "7px 15px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            textDecoration: "none",
                          }}
                        >
                          إضافة فيديو
                        </Link>
                      </td>
                      <td style={tdStyle}>
                        {course.status !== 'published' && (
                          <button onClick={() => openModal('publish', course.id)} style={{ background: '#1EC8A0', color: '#fff', border: 'none', borderRadius: '5px', padding: '6px 14px', cursor: 'pointer' }}>نشر</button>
                        )}
                        {course.status === 'published' && <span style={{ color: '#1EC8A0', fontWeight: 'bold' }}>تم النشر</span>}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button onClick={() => openModal('delete', course.id)} style={{ background: '#FF4D4F', color: '#fff', border: 'none', borderRadius: '5px', padding: '6px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 'bold', fontFamily: '"Tajawal", sans-serif' }}>
                            <Trash2 size={18} /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div 

        style={modalOverlayStyle}>
          <div 

          style={modalStyle}>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>
              {modalType === "delete"
                ? "هل أنت متأكد أنك تريد حذف الدورة؟"
                : "هل أنت متأكد أنك تريد نشر الدورة؟"}
            </p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button onClick={confirmAction} style={yesButtonStyle}>
                نعم
              </button>
              <button onClick={closeModal} style={noButtonStyle}>
                لا
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const dashboardContainer = {
  display: "flex",
  flexDirection: "row-reverse",
  direction: "rtl",
  width: "100%",
  minHeight: "100vh",
};

const mainContent = {
  padding: "20px",
  width: "100%",
  boxSizing: "border-box",
  marginRight: "220px",
  "@media (max-width: 768px)": {
    marginRight: "0",
  },
};
// const tableContainerStyle = {
//   width: "100%",
//   overflowX: "auto",
//   backgroundColor: "#fff",
//   borderRadius: "10px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   padding: "15px",
// };

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
//   textAlign: "right",
//   minWidth: "600px",
// };

// const tableHeaderRowStyle = {
//   backgroundColor: "#f8f9fa",
// };

// const thStyle = {
//   padding: "12px",
//   textAlign: "right",
//   fontWeight: "bold",
//   borderBottom: "2px solid #ddd",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

const addButtonStyle = {
  backgroundColor: "#1EC8A0",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  fontSize: "1rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  "@media (max-width: 768px)": {
    fontSize: "0.9rem",
    padding: "8px 12px",
  },
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  width: "90%",
  maxWidth: "400px",
  "@media (max-width: 768px)": {
    padding: "15px",
    maxWidth: "90%",
  },
};

const yesButtonStyle = {
  backgroundColor: "#1EC8A0",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
  "@media (max-width: 768px)": {
    padding: "8px 15px",
    fontSize: "0.9rem",
  },
};

const noButtonStyle = {
  backgroundColor: "#ccc",
  color: "#000",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
  "@media (max-width: 768px)": {
    padding: "8px 15px",
    fontSize: "0.9rem",
  },
};

// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" };
// const tableContainerStyle = { width: "100%", overflowX: "auto", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "15px" };
// const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "right" };
// const tableHeaderRowStyle = { backgroundColor: "#f8f9fa" };
// const thStyle = { padding: "12px", textAlign: "right", fontWeight: "bold", borderBottom: "2px solid #ddd" };
// const tableRowStyle = { borderBottom: "1px solid #ddd" };
// const tdStyle = { padding: "12px" };
// const addButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "18px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   textDecoration: "none",
// };
// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "30px",
//   borderRadius: "10px",
//   boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
//   textAlign: "center",
//   minWidth: "300px",
// };

// const yesButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
// };

// const noButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#000",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
// };

export default Courses;
/*************************************************************************** */
// import React, { useState, useEffect } from "react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { Link, useNavigate } from "react-router-dom"; 
// import { FaTrash } from "react-icons/fa";

// const Courses = () => {
//   const navigate = useNavigate(); 
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(""); // "delete" or "publish"
//   const [selectedCourseId, setSelectedCourseId] = useState(null);

//   const openModal = (type, id) => {
//     setModalType(type);
//     setSelectedCourseId(id);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedCourseId(null);
//     setModalType("");
//   };

//   const confirmAction = () => {
//     if (modalType === "delete") {
//       handleDeleteCourse(selectedCourseId);
//     } else if (modalType === "publish") {
//       handlePublishCourse(selectedCourseId);
//     }
//     closeModal();
//   };


//   useEffect(() => {
//     const fetchCourses = async () => {
//       const token = localStorage.getItem("access_token"); 
//       if (!token) {
//         setError("الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:8000/api/v1/teacher/get_courses", {
//           method: "GET",
//           headers: {
//             "Accept": "application/json",
//             "Authorization": `Bearer ${token}`, 
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token");
//             setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 1000);
//             return;
//           }
//           throw new Error("فشل في جلب البيانات");
//         }

//         const data = await response.json();
//         console.log("Courses data:", data); // Debug
//         setCourses(data.data.data); 
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [navigate]);

//   const handleDeleteCourse = async (id) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/delete_course/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       console.log("Delete response:", data);

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في حذف الدورة");
//       }

//       setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
//       const courseTitle = courses.find(course => course.id === id)?.title;
//       console.log(`تم حذف الدورة: ${courseTitle}`);
//       setError(null); 
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handlePublishCourse = async (id) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/publish_course/${id}`, {
//         method: "PUT",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       console.log("Publish response:", data);

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error(data.message || "فشل في نشر الدورة");
//       }

//       setCourses(prevCourses =>
//         prevCourses.map(course =>
//           course.id === id ? { ...course, status: "published" } : course
//         )
//       );
//       const courseTitle = courses.find(course => course.id === id)?.title;
//       console.log(`تم نشر دورة: ${courseTitle}`);

//       setError(null);
//     } catch (err) {
//       console.error("Error:", err);
//       setError(err.message);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1>قائمة الدورات</h1>
//           <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
//             <Link to="/add-course" style={addButtonStyle}>
//               + إضافة دورة جديدة
//             </Link>
//           </div>

//           {loading && <p>جاري التحميل...</p>}
//           {error && <p style={{ color: "red" }}>{error}</p>}

//           {!loading && !error && (
//             <div style={tableContainerStyle}>
//               <table style={tableStyle}>
//                 <thead>
//                   <tr style={tableHeaderRowStyle}>
//                     <th style={thStyle}>العنوان</th>
//                     <th style={thStyle}>الوصف</th>
//                     <th style={thStyle}>الحالة</th>
//                     <th style={thStyle}>إضافة فيديو</th> 
//                     <th style={thStyle}>نشر؟</th>
//                     <th style={thStyle}>حذف؟</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {courses.map((course) => (
//                     <tr key={course.id} style={tableRowStyle}>
//                       <td style={tdStyle}>{course.title}</td>
//                       <td style={tdStyle}>{course.description}</td>
//                       <td style={tdStyle}>{course.status}</td>
//                       <td style={tdStyle}>
//                         <Link
//                           to={`/add-video/${course.id}`} 
//                           style={{
//                             backgroundColor: "#1EC8A0",
//                             color: "#fff",
//                             border: "none",
//                             padding: "7px 15px",
//                             borderRadius: "5px",
//                             fontWeight: "bold",
//                             cursor: "pointer",
//                             textDecoration: "none",
//                           }}
//                         >
//                           إضافة فيديو
//                         </Link>
//                       </td>
//                       <td style={tdStyle}>
//                         {course.status === "draft" && (
//                           <button
//                             style={{
//                               backgroundColor: "#1EC8A0",
//                               color: "#fff",
//                               border: "none",
//                               padding: "7px 15px",
//                               borderRadius: "5px",
//                               fontWeight: "bold",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => openModal("publish", course.id)}
//                           >
//                             نشر
//                           </button>
//                         )}
//                       </td>
//                       <td style={tdStyle}>
//                         <button
//                           style={{
//                             backgroundColor: "red",
//                             color: "white",
//                             border: "none",
//                             padding: "7px 15px",
//                             borderRadius: "5px",
//                             fontWeight: "bold",
//                             cursor: "pointer",
//                           }}
//                           onClick={() => openModal("delete", course.id)}
//                         >
//                           <FaTrash /> حذف
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//       {showModal && (
//         <div style={modalOverlayStyle}>
//           <div style={modalStyle}>
//             <p style={{ fontSize: "18px", marginBottom: "20px" }}>
//               {modalType === "delete"
//                 ? "هل أنت متأكد أنك تريد حذف الدورة؟"
//                 : "هل أنت متأكد أنك تريد نشر الدورة؟"}
//             </p>
//             <div style={{ display: "flex", justifyContent: "space-around" }}>
//               <button onClick={confirmAction} style={yesButtonStyle}>
//                 نعم
//               </button>
//               <button onClick={closeModal} style={noButtonStyle}>
//                 لا
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </>
//   );
// };

// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" };
// const tableContainerStyle = { width: "100%", overflowX: "auto", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "15px" };
// const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "right" };
// const tableHeaderRowStyle = { backgroundColor: "#f8f9fa" };
// const thStyle = { padding: "12px", textAlign: "right", fontWeight: "bold", borderBottom: "2px solid #ddd" };
// const tableRowStyle = { borderBottom: "1px solid #ddd" };
// const tdStyle = { padding: "12px" };
// const addButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "18px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   textDecoration: "none",
// };
// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "30px",
//   borderRadius: "10px",
//   boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
//   textAlign: "center",
//   minWidth: "300px",
// };

// const yesButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
// };

// const noButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#000",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
// };


// export default Courses;
import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/get_courses", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTExMjAzNywiZXhwIjoxNzQxMTE1NjM3LCJuYmYiOjE3NDExMTIwMzcsImp0aSI6ImRqZVRzRDdTUWhUUzc4VnYiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.ZAFuFhIRconjUh9-we238qm_Ti_NT-app8vHHegAQsQ"
          }
        });
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        setCourses(data.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/delete_course/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTExMzcwMywiZXhwIjoxNzQxMTE3MzAzLCJuYmYiOjE3NDExMTM3MDMsImp0aSI6IkV3Qno4TktYNmF1MW1lZnkiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.HzZfhXqS3EAVOXW2RwxmpvYNOuT1cTtnZgFe7_e-GRc",
        },
      });
  
      if (!response.ok) {
        throw new Error("فشل في حذف الدورة");
      }
  
      // تحديث قائمة الدورات بعد الحذف
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  const handlePublishCourse = async (id) => {
    try {
      const response = await fetch(`https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/publish_course/${id}`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTExMzcwMywiZXhwIjoxNzQxMTE3MzAzLCJuYmYiOjE3NDExMTM3MDMsImp0aSI6IkV3Qno4TktYNmF1MW1lZnkiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.HzZfhXqS3EAVOXW2RwxmpvYNOuT1cTtnZgFe7_e-GRc",
        },
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "فشل في نشر الدورة");
      }
  
      // تحديث حالة الدورة في القائمة
      setCourses(prevCourses => prevCourses.map(course =>
        course.id === id ? { ...course, status: "published" } : course
      ));
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };
  
  

  return (
    <>
      <Navbar />
      <div style={dashboardContainer}>
        <Sidebar />
        <div style={mainContent}>
          <h1>قائمة الدورات</h1>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
            <Link to="/add-course" style={addButtonStyle}>
              + إضافة دورة جديدة
            </Link>
          </div>

          {loading && <p>جاري التحميل...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRowStyle}>
                    <th style={tableHeaderCellStyle}>العنوان</th>
                    <th style={tableHeaderCellStyle}>الوصف</th>
                    <th style={tableHeaderCellStyle}>الحالة</th>
                    <th style={tableHeaderCellStyle}>نشر؟</th>
                    <th style={tableHeaderCellStyle}>حذف؟</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} style={tableRowStyle}>
                      <td style={tableCellStyle}>{course.title}</td>
                      <td style={tableCellStyle}>{course.description}</td>
                      <td style={tableCellStyle}>{course.status}</td>
                      <td style={tableCellStyle}>
                        {course.status === "draft" && (
                          <button
                            style={{ backgroundColor: "#1EC8A0", color: "#fff",
                              border: "none",
                              padding: "7px 15px",
                              borderRadius: "5px",
                              fontWeight: "bold",cursor: "pointer" }}
                            onClick={() => handlePublishCourse(course.id)}
                          >
                            نشر
                          </button>
                        )}
                      </td>
                      <td style={tableCellStyle}>
                        <button
                          style={{ backgroundColor: "red", color:"white", border: "none",
                            padding: "7px 15px",
                            borderRadius: "5px",
                            fontWeight: "bold", cursor: "pointer" }}
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <FaTrash /> حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
const mainContent = { marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" };
const tableContainerStyle = { width: "100%", overflowX: "auto", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "15px" };
const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "right" };
const tableHeaderRowStyle = { backgroundColor: "#f8f9fa" };
const tableHeaderCellStyle = { padding: "12px", textAlign: "right", fontWeight: "bold", borderBottom: "2px solid #ddd" };
const tableRowStyle = { borderBottom: "1px solid #ddd" };
const tableCellStyle = { padding: "12px" };
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

export default Courses;


/****************************************** */
// import React, { useState, useEffect } from "react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { Link } from "react-router-dom";
// import axios from 'axios';
// import { FaTrash } from "react-icons/fa";

// const api = axios.create({
//   baseURL: 'https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/',
//   headers: {
//     'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTExMTc3MywiZXhwIjoxNzQxMTE1MzczLCJuYmYiOjE3NDExMTE3NzMsImp0aSI6Ijl6NWlzZ0pTWGpkaTJuSnEiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.W9hzp5FfAHEXqiQwpHm7Q4LbMlp7KQLMBCOozHJiXh4`,
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
// });

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteError, setDeleteError] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await api.get('get_courses');
//         setCourses(response.data.data);
//       } catch (err) {
//         setError(err.response?.data.message || 'فشل في جلب البيانات');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`delete_course/${id}`);
//       setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
//       setDeleteError(null);
//     } catch (err) {
//       setDeleteError(err.response?.data.message || 'حدث خطأ أثناء حذف الدورة');
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
//           {deleteError && (
//             <div style={{ color: "red", marginBottom: "10px" }}>{deleteError}</div>
//           )}
          

//           {!loading && !error && (
//             <div style={tableContainerStyle}>
//               <table style={tableStyle}>
//                 <thead>
//                   <tr style={tableHeaderRowStyle}>
//                     <th style={tableHeaderCellStyle}>العنوان</th>
//                     <th style={tableHeaderCellStyle}>الوصف</th>
//                     <th style={tableHeaderCellStyle}>الحالة</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {courses.map((course) => (
//                     <tr key={course.id} style={tableRowStyle}>
//                       <td style={tableCellStyle}>{course.title}</td>
//                       <td style={tableCellStyle}>{course.description}</td>
//                       <td style={tableCellStyle}>{course.status}</td>
//                       <td style={tableCellStyle}>
//                         <button
//                           style={deleteButtonStyle}
//                           onClick={() => handleDelete(course.id)}
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
//     </>
//   );
// };

// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" };
// const tableContainerStyle = { width: "100%", overflowX: "auto", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "15px" };
// const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "right" };
// const tableHeaderRowStyle = { backgroundColor: "#f8f9fa" };
// const tableHeaderCellStyle = { padding: "12px", textAlign: "right", fontWeight: "bold", borderBottom: "2px solid #ddd" };
// const tableRowStyle = { borderBottom: "1px solid #ddd" };
// const tableCellStyle = { padding: "12px" };
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
// const deleteButtonStyle = { backgroundColor: "transparent", color: "#dc3545", border: "2px solid #dc3545", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };

// export default Courses;
/*************************************************************** */
// import React, { useState, useEffect } from "react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { Link } from "react-router-dom";
// import axios from 'axios';
// import { FaTrash } from "react-icons/fa";

// const api = axios.create({
//   baseURL: 'https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/',
//   headers: {
//     'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTExMTc3MywiZXhwIjoxNzQxMTE1MzczLCJuYmYiOjE3NDExMTE3NzMsImp0aSI6Ijl6NWlzZ0pTWGpkaTJuSnEiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.W9hzp5FfAHEXqiQwpHm7Q4LbMlp7KQLMBCOozHJiXh4`,
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
// });

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteError, setDeleteError] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Add timeout for better UX
//         const timeoutPromise = new Promise((_, reject) => 
//           setTimeout(() => reject(new Error('فشل في جلب البيانات بسبب انتهاء وقت الانتظار')), 15000)
//         );

//         const response = await Promise.race([
//           api.get('get_courses'),
//           timeoutPromise
//         ]);

//         // Validate response structure
//         if (!response.data?.data || !Array.isArray(response.data.data)) {
//           throw new Error('بيانات غير صالحة من الخادم');
//         }

//         setCourses(response.data.data);
//       } catch (err) {
//         setError(err.response?.data.message || err.message || 'فشل في جلب البيانات');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`delete_course/${id}`);
      
//       // Use functional update to ensure we're working with latest courses array
//       setCourses(prevCourses => 
//         prevCourses.filter(course => course.id !== id)
//       );
//       setDeleteError(null);
//     } catch (err) {
//       setDeleteError(err.response?.data.message || err.message || 'حدث خطأ أثناء حذف الدورة');
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
          
//           {/* Add loading skeleton */}
//           {loading && (
//             <div style={{ padding: '20px', textAlign: 'center' }}>
//               جاري التحميل...
//             </div>
//           )}

//           {/* Display errors */}
//           {error && (
//             <div style={{ color: "red", padding: '10px', marginBottom: '10px' }}>
//               {error}
//             </div>
//           )}
          
//           {deleteError && (
//             <div style={{ color: "red", marginBottom: "10px" }}>
//               {deleteError}
//             </div>
//           )}

//           {!loading && !error && (
//             <div style={tableContainerStyle}>
//               <table style={tableStyle}>
//                 <thead>
//                   <tr style={tableHeaderRowStyle}>
//                     <th style={tableHeaderCellStyle}>العنوان</th>
//                     <th style={tableHeaderCellStyle}>الوصف</th>
//                     <th style={tableHeaderCellStyle}>الحالة</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {courses.map((course) => (
//                     <tr key={course.id} style={tableRowStyle}>
//                       <td style={tableCellStyle}>{course.title}</td>
//                       <td style={tableCellStyle}>{course.description}</td>
//                       <td style={tableCellStyle}>{course.status}</td>
//                       <td style={tableCellStyle}>
//                         <button
//                           style={deleteButtonStyle}
//                           onClick={() => handleDelete(course.id)}
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
//     </>
//   );
// };

// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" };
// const tableContainerStyle = { width: "100%", overflowX: "auto", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "15px" };
// const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "right" };
// const tableHeaderRowStyle = { backgroundColor: "#f8f9fa" };
// const tableHeaderCellStyle = { padding: "12px", textAlign: "right", fontWeight: "bold", borderBottom: "2px solid #ddd" };
// const tableRowStyle = { borderBottom: "1px solid #ddd" };
// const tableCellStyle = { padding: "12px" };
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
// const deleteButtonStyle = { backgroundColor: "transparent", color: "#dc3545", border: "2px solid #dc3545", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };
// export default Courses;

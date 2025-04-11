import React, { useState, useEffect } from "react";
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = 'http://localhost:8000/api/v1/teacher/';

const ExamDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getApiInstance = () => {
    const token = localStorage.getItem("access_token");
    return axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  };

  useEffect(() => {
    const fetchExamDetails = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("❌ الرجاء تسجيل الدخول أولاً");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const api = getApiInstance();
        const response = await api.get(`get_exam/${id}`);
        console.log("Exam details response:", response.data);
        setExam(response.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
        setError(err.response?.data.message || '❌ حدث خطأ أثناء جلب تفاصيل الاختبار');
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [id, navigate]);

  return (
    <>
      <Navbar />
      <div style={styles.dashboardContainer}>
        <button
          style={{
            display: window.innerWidth <= 768 ? "block" : "none",
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 1001,
            backgroundColor: "#1EC8A0",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>

        <div
          style={{
            ...styles.sidebarContainer,
            display: isSidebarOpen || window.innerWidth > 768 ? "block" : "none",
          }}
        >
          <Sidebar />
        </div>

        <div style={styles.mainContent}>
          <h1 style={styles.pageTitle}>تفاصيل الاختبار</h1>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
          ) : !exam ? (
            <div style={{ textAlign: 'center', color: '#666' }}>
              لم يتم العثور على الاختبار
            </div>
          ) : (
            <div style={styles.examDetailsContainer}>
              <h2 style={styles.examTitleStyle}>{exam.title}</h2>
              <p><strong>المعرف:</strong> {exam.id}</p>
              <button
                style={styles.viewQuestionsButtonStyle}
                onClick={() => navigate(`/exam/${id}/questions`)}
              >
                عرض الأسئلة
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    direction: "rtl",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  sidebarContainer: {
    width: "250px",
    "@media (max-width: 768px)": {
      position: "fixed",
      top: 0,
      right: 0,
      height: "100vh",
      zIndex: 1000,
      backgroundColor: "#fff",
      boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
      width: "200px",
    },
  },
  mainContent: {
    marginRight: "250px",
    padding: "30px",
    width: "calc(100% - 250px)",
    "@media (max-width: 768px)": {
      marginRight: "0",
      width: "100%",
      padding: "20px",
    },
  },
  pageTitle: {
    textAlign: "right",
    fontSize: "30px",
    marginBottom: "20px",
    "@media (max-width: 768px)": {
      fontSize: "24px",
    },
  },
  examDetailsContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    "@media (max-width: 768px)": {
      padding: "15px",
    },
  },
  examTitleStyle: {
    textAlign: "right",
    fontSize: "24px",
    marginBottom: "15px",
    "@media (max-width: 768px)": {
      fontSize: "20px",
    },
  },
  viewQuestionsButtonStyle: {
    backgroundColor: "#1EC8A0",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
    marginTop: "10px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "8px 12px",
      width: "100%",
    },
  },
};

export default ExamDetails;
/************************************** Latest ******************************************** */
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { useNavigate, useParams } from "react-router-dom";

// const API_URL = 'http://localhost:8000/api/v1/teacher/';

// const ExamDetails = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [exam, setExam] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getApiInstance = () => {
//     const token = localStorage.getItem("access_token");
//     return axios.create({
//       baseURL: API_URL,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });
//   };

//   useEffect(() => {
//     const fetchExamDetails = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const api = getApiInstance();
//         const response = await api.get(`get_exam/${id}`);
//         console.log("Exam details response:", response.data);
//         setExam(response.data.data);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         setError(err.response?.data.message || '❌ حدث خطأ أثناء جلب تفاصيل الاختبار');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExamDetails();
//   }, [id, navigate]);

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1 style={pageTitle}>تفاصيل الاختبار</h1>

//           {error && (
//             <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
//           )}

//           {loading ? (
//             <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
//           ) : !exam ? (
//             <div style={{ textAlign: 'center', color: '#666' }}>
//               لم يتم العثور على الاختبار
//             </div>
//           ) : (
//             <div style={examDetailsContainer}>
//               <h2 style={examTitleStyle}>{exam.title}</h2>
//               <p><strong>المعرف:</strong> {exam.id}</p>
//               <button
//                 style={viewQuestionsButtonStyle}
//                 onClick={() => navigate(`/exam/${id}/questions`)}
//               >
//                 عرض الأسئلة
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // Styles
// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "250px", padding: "30px", width: "calc(100% - 250px)" };
// const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
// const examDetailsContainer = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "12px",
//   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
// };
// const examTitleStyle = { textAlign: "right", fontSize: "24px", marginBottom: "15px" };
// const viewQuestionsButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   border: "none",
//   fontSize: "16px",
//   marginTop: "10px",
// };

// export default ExamDetails;
/********************************************************************************************** */
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { useNavigate, useParams } from "react-router-dom";

// const API_URL = 'http://localhost:8000/api/v1/teacher/';

// const ExamDetails = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); 
//   const [exam, setExam] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getApiInstance = () => {
//     const token = localStorage.getItem("access_token");
//     return axios.create({
//       baseURL: API_URL,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });
//   };

//   useEffect(() => {
//     const fetchExamDetails = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const api = getApiInstance();
//         const response = await api.get(`get_exam/${id}`);
//         console.log("Exam details response:", response.data); // Debug
//         setExam(response.data.data); // افترضنا إن الـ data بتيجي في response.data.data
//       } catch (err) {
//         if (err.response?.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         setError(err.response?.data.message || '❌ حدث خطأ أثناء جلب تفاصيل الاختبار');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExamDetails();
//   }, [id, navigate]);

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1 style={pageTitle}>تفاصيل الاختبار</h1>

//           {error && (
//             <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
//           )}

//           {loading ? (
//             <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
//           ) : !exam ? (
//             <div style={{ textAlign: 'center', color: '#666' }}>
//               لم يتم العثور على الاختبار
//             </div>
//           ) : (
//             <div style={examDetailsContainer}>
//               <h2 style={examTitleStyle}>{exam.title}</h2>
//               <p><strong>المعرف:</strong> {exam.id}</p>
//               {/* ممكن أضيف أي تفاصيل تانية ممكن تكون موجودة في الـ response */}
//               {/* مثال: لو فيه أسئلة أو تاريخ الاختبار */}
//               {/* <p><strong>تاريخ الاختبار:</strong> {exam.date || "غير متاح"}</p> */}
//               {/* <p><strong>عدد الأسئلة:</strong> {exam.questions?.length || 0}</p> */}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // Styles
// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "250px", padding: "30px", width: "calc(100% - 250px)" };
// const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
// const examDetailsContainer = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "12px",
//   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
// };
// const examTitleStyle = { textAlign: "right", fontSize: "24px", marginBottom: "15px" };

// export default ExamDetails;
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const TodaysSessions = () => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = "http://localhost:8000/api/v1/teacher/today_sessions"
  const CANCEL_SESSION_URL = "http://localhost:8000/api/v1/teacher/cancel_session/"
  const FINISH_SESSION_URL = "http://localhost:8000/api/v1/teacher/finish_session/"
  const DELETE_SESSION_URL = "http://localhost:8000/api/v1/teacher/delete_session/"

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("access_token")
      console.log("Fetching sessions... Token:", token ? "Found" : "Not found")
      if (!token) {
        setError("❌ الرجاء تسجيل الدخول أولاً")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
        return
      }

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("API Response Status:", response.status)
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token")
            setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
            setTimeout(() => {
              navigate("/login")
            }, 1000)
            return
          }
          throw new Error("فشل في جلب الجلسات")
        }

        const data = await response.json()
        console.log("Fetched Sessions Data:", data)
        if (data?.data?.data) {
          setSessions(data.data.data)
          console.log("Sessions set successfully:", data.data.data.length, "sessions")
        } else {
          setSessions([])
          console.log("No sessions found")
        }
      } catch (error) {
        console.log("Error fetching sessions:", error.message)
        setError("❌ حدث خطأ أثناء جلب الجلسات: " + error.message)
      } finally {
        setLoading(false)
        console.log("Loading state set to false")
      }
    }

    fetchSessions()
  }, [navigate])

  const handleCancelSession = async (sessionId) => {
    const token = localStorage.getItem("access_token")
    console.log("Attempting to cancel session ID:", sessionId, "Token:", token ? "Found" : "Not found")
    try {
      const response = await fetch(`${CANCEL_SESSION_URL}${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Cancel Session API Response Status:", response.status)
      if (!response.ok) throw new Error("فشل في إلغاء الجلسة")

      const updatedSessions = sessions.filter((session) => session.id !== sessionId)
      setSessions(updatedSessions)
      console.log("Session cancelled, updated sessions count:", updatedSessions.length)
      setError("تم إلغاء الجلسة بنجاح")
      setTimeout(() => setError(null), 3000)
    } catch (error) {
      console.log("Error cancelling session:", error.message)
      setError("❌ حدث خطأ أثناء إلغاء الجلسة: " + error.message)
    }
  }

  const handleFinishSession = async (sessionId) => {
    const token = localStorage.getItem("access_token")
    console.log("Attempting to finish session ID:", sessionId, "Token:", token ? "Found" : "Not found")
    try {
      const response = await fetch(`${FINISH_SESSION_URL}${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback: "تم الإنهاء" }),
      })

      console.log("Finish Session API Response Status:", response.status)
      if (!response.ok) throw new Error("فشل في إنهاء الجلسة")

      const updatedSessions = sessions.filter((session) => session.id !== sessionId)
      setSessions(updatedSessions)
      console.log("Session finished, updated sessions count:", updatedSessions.length)
      setError("تم إنهاء الجلسة بنجاح")
      setTimeout(() => setError(null), 3000)
    } catch (error) {
      console.log("Error finishing session:", error.message)
      setError("❌ حدث خطأ أثناء إنهاء الجلسة: " + error.message)
    }
  }

  const handleDeleteSession = async (sessionId) => {
    const token = localStorage.getItem("access_token")
    console.log("Attempting to delete session ID:", sessionId, "Token:", token ? "Found" : "Not found")
    try {
      const response = await fetch(`${DELETE_SESSION_URL}${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Delete Session API Response Status:", response.status)
      if (!response.ok) throw new Error("فشل في حذف الجلسة")

      const updatedSessions = sessions.filter((session) => session.id !== sessionId)
      setSessions(updatedSessions)
      console.log("Session deleted, updated sessions count:", updatedSessions.length)
      setError("تم حذف الجلسة بنجاح")
      setTimeout(() => setError(null), 3000)
    } catch (error) {
      console.log("Error deleting session:", error.message)
      setError("❌ حدث خطأ أثناء حذف الجلسة: " + error.message)
    }
  }

  const containerStyle = {
    backgroundColor: "#f5f9f8",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "20px",
    boxSizing: "border-box",
    border: "1px solid #e0f0ed",
    boxShadow: "0 4px 6px rgba(32, 201, 151, 0.1)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }

  const titleStyle = {
    textAlign: "right",
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#20c997",
    marginBottom: "20px",
    marginTop: "0",
  }

  const sessionCardStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    border: "1px solid #e0f0ed",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  }

  const sessionCardHoverStyle = {
    ...sessionCardStyle,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(32, 201, 151, 0.15)",
  }

  const sessionInfoStyle = {
    textAlign: "right",
    flex: "1",
    minWidth: "200px",
  }

  const studentNameStyle = {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  }

  const sessionDetailsStyle = {
    margin: "5px 0",
    color: "#666",
    fontSize: "0.9375rem",
    lineHeight: "1.5",
  }

  const buttonContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "center",
  }

  const baseButtonStyle = {
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  }

  const primaryButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: "#20c997",
    color: "white",
  }

  const primaryButtonHoverStyle = {
    backgroundColor: "#1db386",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(32, 201, 151, 0.3)",
  }

  const dangerButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: "#ff6b6b",
    color: "white",
  }

  const dangerButtonHoverStyle = {
    backgroundColor: "#fa5252",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
  }

  const warningButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: "#ffa726",
    color: "white",
  }

  const warningButtonHoverStyle = {
    backgroundColor: "#ff9800",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(255, 167, 38, 0.3)",
  }

  const messageStyle = {
    textAlign: "center",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontWeight: "500",
  }

  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: error?.includes("❌") ? "#fee" : "#e8f5e8",
    color: error?.includes("❌") ? "#c53030" : "#20c997",
    border: `1px solid ${error?.includes("❌") ? "#fed7d7" : "#c6f6d5"}`,
  }

  const loadingStyle = {
    ...messageStyle,
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    border: "1px solid #bae6fd",
  }

  const noSessionsStyle = {
    ...messageStyle,
    backgroundColor: "#f9fafb",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
  }

  const completedStatusStyle = {
    color: "#20c997",
    fontWeight: "600",
    fontSize: "0.9375rem",
    marginLeft: "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>جلسات اليوم</h3>

      {error && <div style={errorMessageStyle}>{error}</div>}

      {loading ? (
        <div style={loadingStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #bae6fd",
                borderTop: "2px solid #0369a1",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            جاري تحميل الجلسات...
          </div>
        </div>
      ) : sessions.length === 0 ? (
        <div style={noSessionsStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.25rem" }}>📅</span>
            لا توجد جلسات اليوم.
          </div>
        </div>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            style={sessionCardStyle}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, sessionCardHoverStyle)
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, sessionCardStyle)
            }}
          >
            <div style={sessionInfoStyle}>
              <div style={studentNameStyle}>{session.student?.fullName || "اسم الطالب غير متاح"}</div>
              <div style={sessionDetailsStyle}>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ fontWeight: "500" }}>⏰ الوقت:</span> {session.time || "غير متاح"}
                </div>
                <div>
                  <span style={{ fontWeight: "500" }}>📅 التاريخ:</span> {session.date || "غير متاح"}
                </div>
              </div>
            </div>
            <div style={buttonContainerStyle}>
              {session.status === "pending" && (
                <>
                  <a
                    href={session.teacher?.teacherinfo?.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={primaryButtonStyle}
                    onClick={() => console.log("Joining session ID:", session.id)}
                    onMouseEnter={(e) => Object.assign(e.target.style, primaryButtonHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, primaryButtonStyle)}
                  >
                    <span>🎥</span> دخول الجلسة
                  </a>
                  <button
                    style={dangerButtonStyle}
                    onClick={() => handleDeleteSession(session.id)}
                    onMouseEnter={(e) => Object.assign(e.target.style, dangerButtonHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, dangerButtonStyle)}
                  >
                    <span>🗑️</span> حذف الجلسة
                  </button>
                  <button
                    style={warningButtonStyle}
                    onClick={() => handleCancelSession(session.id)}
                    onMouseEnter={(e) => Object.assign(e.target.style, warningButtonHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, warningButtonStyle)}
                  >
                    <span>❌</span> إلغاء الجلسة
                  </button>
                </>
              )}
              {session.status === "in_progress" && (
                <>
                  <a
                    href={session.teacher?.teacherinfo?.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={primaryButtonStyle}
                    onClick={() => console.log("Rejoining session ID:", session.id)}
                    onMouseEnter={(e) => Object.assign(e.target.style, primaryButtonHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, primaryButtonStyle)}
                  >
                    <span>🎥</span> دخول مجددًا
                  </a>
                  <button
                    style={primaryButtonStyle}
                    onClick={() => handleFinishSession(session.id)}
                    onMouseEnter={(e) => Object.assign(e.target.style, primaryButtonHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, primaryButtonStyle)}
                  >
                    <span>✅</span> إنهاء الجلسة
                  </button>
                </>
              )}
              {session.status === "completed" && (
                <div style={completedStatusStyle}>
                  <span>✅</span>
                  الجلسة مكتملة
                </div>
              )}
            </div>
          </div>
        ))
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default TodaysSessions
/********************************************************************************* */
// import React, { useEffect, useState } from 'react';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useNavigate } from 'react-router-dom';

// const TodaysSessions = () => {
//   const navigate = useNavigate();
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_URL = "http://localhost:8000/api/v1/teacher/today_sessions";
//   const CANCEL_SESSION_URL = "http://localhost:8000/api/v1/teacher/cancel_session/";
//   const FINISH_SESSION_URL = "http://localhost:8000/api/v1/teacher/finish_session/";
//   const DELETE_SESSION_URL = "http://localhost:8000/api/v1/teacher/delete_session/";

//   useEffect(() => {
//     const fetchSessions = async () => {
//       const token = localStorage.getItem("access_token");
//       console.log("Fetching sessions... Token:", token ? "Found" : "Not found");
//       if (!token) {
        
//       setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         const response = await fetch(API_URL, {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("API Response Status:", response.status);
//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token");
            
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 1000);
//             return;
//           }
//           throw new Error("فشل في جلب الجلسات");
//         }

//         const data = await response.json();
//         console.log("Fetched Sessions Data:", data);
//         if (data?.data?.data) {
//           setSessions(data.data.data);
//           console.log("Sessions set successfully:", data.data.data.length, "sessions");
//         } else {
//           setSessions([]);
//           console.log("No sessions found");
//         }
//       } catch (error) {
        
//       console.log("Error fetching sessions:", error.message);
        
//       setError("❌ حدث خطأ أثناء جلب الجلسات: " + error.message);
//       } finally {
//         setLoading(false);
//         console.log("Loading state set to false");
//       }
//     };

//     fetchSessions();
//   }, [navigate]);

  
// const handleCancelSession = async (sessionId) => {
//     const token = localStorage.getItem("access_token");
//     console.log("Attempting to cancel session ID:", sessionId, "Token:", token ? "Found" : "Not found");
//     try {
//       const response = await fetch(`${CANCEL_SESSION_URL}${sessionId}`, {
//         method: "PUT",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Cancel Session API Response Status:", response.status);
//       if (!response.ok) throw new Error("فشل في إلغاء الجلسة");
      
//     const updatedSessions = sessions.filter(session => session.id !== sessionId);
      
//     setSessions(updatedSessions);
//       console.log("Session cancelled, updated sessions count:", updatedSessions.length);
      
//     setError("تم إلغاء الجلسة بنجاح");
//       setTimeout(() => setError(null), 3000);
//     } catch (error) {
      
//     console.log("Error cancelling session:", error.message);
      
//     setError("❌ حدث خطأ أثناء إلغاء الجلسة: " + error.message);
//     }
//   };

  
// const handleFinishSession = async (sessionId) => {
//     const token = localStorage.getItem("access_token");
//     console.log("Attempting to finish session ID:", sessionId, "Token:", token ? "Found" : "Not found");
//     try {
//       const response = await fetch(`${FINISH_SESSION_URL}${sessionId}`, {
//         method: "PUT",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ feedback: "تم الإنهاء" }),
//       });

//       console.log("Finish Session API Response Status:", response.status);
//       if (!response.ok) throw new Error("فشل في إنهاء الجلسة");
      
//     const updatedSessions = sessions.filter(session => session.id !== sessionId);
      
//     setSessions(updatedSessions);
//       console.log("Session finished, updated sessions count:", updatedSessions.length);
      
//     setError("تم إنهاء الجلسة بنجاح");
//       setTimeout(() => setError(null), 3000);
//     } catch (error) {
      
//     console.log("Error finishing session:", error.message);
      
//     setError("❌ حدث خطأ أثناء إنهاء الجلسة: " + error.message);
//     }
//   };

  
// const handleDeleteSession = async (sessionId) => {
//     const token = localStorage.getItem("access_token");
//     console.log("Attempting to delete session ID:", sessionId, "Token:", token ? "Found" : "Not found");
//     try {
//       const response = await fetch(`${DELETE_SESSION_URL}${sessionId}`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Delete Session API Response Status:", response.status);
//       if (!response.ok) throw new Error("فشل في حذف الجلسة");
      
//     const updatedSessions = sessions.filter(session => session.id !== sessionId);
      
//     setSessions(updatedSessions);
//       console.log("Session deleted, updated sessions count:", updatedSessions.length);
      
//     setError("تم حذف الجلسة بنجاح");
//       setTimeout(() => setError(null), 3000);
//     } catch (error) {
      
//     console.log("Error deleting session:", error.message);
      
//     setError("❌ حدث خطأ أثناء حذف الجلسة: " + error.message);
//     }
//   };

//   const containerStyle = {
//     backgroundColor: '#E1EFEA',
//     borderRadius: '10px',
//     padding: '15px',
//     marginTop: '20px',
//     boxSizing: 'border-box',
//   };

//   const sessionCardStyle = {
//     backgroundColor: '#F2F8F6',
    
//   borderRadius: '8px',
//     padding: '10px',
//     marginBottom: '10px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   };

//   const sessionInfoStyle = {
//     textAlign: 'right',
//   };

//   const buttonStyle = {
//     backgroundColor: '#1EC8A0',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '7px 15px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '5px',
//     marginLeft: '10px',
//   };

//   const cancelButtonStyle = {
//     ...buttonStyle,
//     backgroundColor: '#FF4444',
//   };

//   return (
//     <div 
//     style={containerStyle}>
//       <h3 style={{ textAlign: 'right' }}>جلسات اليوم</h3>

//       {error && (
//         <p style={{ textAlign: 'center', color: error.includes("❌") ? 'red' : 'green' }}>{error}</p>
//       )}

//       {loading ? (
//         <p style={{ textAlign: 'center' }}>جاري تحميل الجلسات...</p>
//       ) : sessions.length === 0 ? (
//         <p style={{ textAlign: 'center' }}>لا توجد جلسات اليوم.</p>
//       ) : (
//         sessions.map((session) => (
//           <div key={session.id} style={sessionCardStyle}>
//             <div 
//             style={sessionInfoStyle}>
//               <strong>{session.student?.fullName || "اسم الطالب غير متاح"}</strong>
//               <p style={{ margin: '5px 0' }}>
//                 الوقت: {session.time || "غير متاح"} - التاريخ: {session.date || "غير متاح"}
//               </p>
//             </div>
//             <div>
//               {session.status === 'pending' && (
//                 <>
//                   <a
                    
//                   href={session.teacher?.teacherinfo?.link || "#"}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={buttonStyle}
                    
//                   onClick={() => console.log("Joining session ID:", session.id)}
//                   >
//                     <i className="fas fa-video"></i> دخول الجلسة
//                   </a>
//                   <button
//                     style={cancelButtonStyle}
                    
//                   onClick={() => handleDeleteSession(session.id)}
//                   >
//                     <i className="fas fa-trash-can"></i> حذف الجلسة
//                   </button>
//                   <button
//                     style={cancelButtonStyle}
                    
//                   onClick={() => handleCancelSession(session.id)}
//                   >
//                     <i className="fas fa-times"></i> إلغاء الجلسة
//                   </button>
//                 </>
//               )}
//               {session.status === 'in_progress' && (
//                 <>
//                   <a
                    
//                   href={session.teacher?.teacherinfo?.link || "#"}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={buttonStyle}
                    
//                   onClick={() => console.log("Rejoining session ID:", session.id)}
//                   >
//                     <i className="fas fa-video"></i> دخول مجددًا
//                   </a>
//                   <button
//                     style={buttonStyle}
                    
//                   onClick={() => handleFinishSession(session.id)}
//                   >
//                     <i className="fas fa-check"></i> إنهاء الجلسة
//                   </button>
//                 </>
//               )}
//               {session.status === 'completed' && (
//                 <p style={{ color: 'green', marginLeft: '10px' }}>الجلسة مكتملة</p>
//               )}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default TodaysSessions;
/****************************************************************************** */
// 
//import React, { useEffect, useState } from 'react';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// 
//import { useNavigate } from 'react-router-dom'; 

// 
//const TodaysSessions = () => {
//   const navigate = useNavigate(); 
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_URL = "http://localhost:8000/api/v1/teacher/today_sessions"; 

//   useEffect(() => {
//     const fetchSessions = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         
//        setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         const response = await fetch(API_URL, {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`, 
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token");
//             
//            setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 1000);
//             return;
//           }
//           throw new Error("فشل في جلب الجلسات");
//         }

//         const data = await response.json();
//         console.log("Today's sessions response:", data); // Debug
//         if (data?.data?.data) {
//           setSessions(data.data.data); 
//         } else {
//           setSessions([]); // لو مفيش جلسات
//         }
//       } catch (error) {
//         
//        setError("❌ حدث خطأ أثناء جلب الجلسات: " + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSessions();
//   }, [navigate]);

//   const containerStyle = {
//     backgroundColor: '#E1EFEA',
//     borderRadius: '10px',
//     padding: '15px',
//     marginTop: '20px',
//     boxSizing: 'border-box',
//   };

//   const sessionCardStyle = {
//     backgroundColor: '#F2F8F6',
//     borderRadius: '8px',
//     padding: '10px',
//     marginBottom: '10px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   };

//   const sessionInfoStyle = {
//     textAlign: 'right',
//   };

//   const joinButtonStyle = {
//     backgroundColor: '#1EC8A0',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '7px 15px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '5px',
//   };

//   return (
//     <div 
// 
//    style={containerStyle}>
//       <h3 style={{ textAlign: 'right' }}>جلسات اليوم</h3>

//       {error && (
//         <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
//       )}

//       {loading ? (
//         <p style={{ textAlign: 'center' }}>جاري تحميل الجلسات...</p>
//       ) : sessions.length === 0 ? (
//         <p style={{ textAlign: 'center' }}>لا توجد جلسات اليوم.</p>
//       ) : (
//         sessions.map((session, index) => (
//           <div key={index} 
// 
//          style={sessionCardStyle}>
//             <div 
// 
//            style={sessionInfoStyle}>
//               <strong>{session.
// 
//              name || "اسم غير متاح"}</strong>
//               <p style={{ margin: '5px 0' }}>
//                 الوقت: {session.
// 
//                time || "غير متاح"} - المدة: {session.duration || "غير متاح"}
//               </p>
//             </div>
//             <a
//               
//              href={session.zoom_link || "#"} 
//               target="_blank"
//               rel="noopener noreferrer"
//               style={joinButtonStyle}
//             >
//               <i className="fas fa-video"></i> الانضمام إلى الزوم
//             </a>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// 
//export default TodaysSessions;
/********************************************************************************** */
// import React from 'react';
// import '@fortawesome/fontawesome-free/css/all.min.css';


// const TodaysSessions = () => {
//   const containerStyle = {
//     backgroundColor: '#E1EFEA',
//     borderRadius: '10px',
//     padding: '15px',
//     marginTop: '20px',
//     boxSizing: 'border-box',
//   };

//   const sessionCardStyle = {
//     backgroundColor: '#F2F8F6',
//     borderRadius: '8px',
//     padding: '10px',
//     marginBottom: '10px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   };

//   const sessionInfoStyle = {
//     textAlign: 'right',
//   };

//   const joinButtonStyle = {
//     backgroundColor: '#1EC8A0',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '7px 15px', // ⭐ Smaller button size
//     cursor: 'pointer',
//     fontSize: '14px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '5px',
//   };

//   return (
//     <div style={containerStyle}>
//       <h3 style={{ textAlign: 'right' }}>جلسات اليوم</h3>
//       {[{ name: 'أحمد علي', time: '10:00 ص', duration: '45 دقيقة' },
//         { name: 'سارة خالد', time: '11:00 ص', duration: '45 دقيقة' },
//         { name: 'عمر حامد', time: '12:00 ص', duration: '45 دقيقة' }].map((session, index) => (
//         <div key={index} style={sessionCardStyle}>
//           <div style={sessionInfoStyle}>
//             <strong>{session.name}</strong>
//             <p style={{ margin: '5px 0' }}>الوقت: {session.time} - المدة: {session.duration}</p>
//           </div>
//           <button style={joinButtonStyle}>
//           <i className="fas fa-video"></i>الانضمام إلى الزوم
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TodaysSessions;

// import React, { useEffect, useState } from 'react';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// const TodaysSessions = () => {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const API_URL = "http://localhost:8000/api/v1/teacher/today_sessions";
//   const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTE5NzYwMywiZXhwIjoxNzQxMjAxMjAzLCJuYmYiOjE3NDExOTc2MDMsImp0aSI6IlRKbk8zbXV5Sk5MWUtTM2UiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.nylBicij7P_XbdcW3zd712M3BpfUfPjUaTBj9qL0f2w";

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await fetch(API_URL, {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${ACCESS_TOKEN}`,
//             "Content-Type": "application/json"
//           }
//         });
//         const data = await response.json();
//         if (data?.data?.data) {
//           setSessions(data.data.data); 
//         }
//       } catch (error) {
//         console.error("Error fetching today's sessions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSessions();
//   }, []);

//   const containerStyle = {
//     backgroundColor: '#E1EFEA',
//     borderRadius: '10px',
//     padding: '15px',
//     marginTop: '20px',
//     boxSizing: 'border-box',
//   };

//   const sessionCardStyle = {
//     backgroundColor: '#F2F8F6',
//     borderRadius: '8px',
//     padding: '10px',
//     marginBottom: '10px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   };

//   const sessionInfoStyle = {
//     textAlign: 'right',
//   };

//   const joinButtonStyle = {
//     backgroundColor: '#1EC8A0',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '7px 15px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '5px',
//   };

//   return (
//     <div style={containerStyle}>
//       <h3 style={{ textAlign: 'right' }}>جلسات اليوم</h3>

//       {loading ? (
//         <p style={{ textAlign: 'center' }}>جاري تحميل الجلسات...</p>
//       ) : sessions.length === 0 ? (
//         <p style={{ textAlign: 'center' }}>لا توجد جلسات اليوم.</p>
//       ) : (
//         sessions.map((session, index) => (
//           <div key={index} style={sessionCardStyle}>
//             <div style={sessionInfoStyle}>
//               <strong>{session.name || "اسم غير متاح"}</strong>
//               <p style={{ margin: '5px 0' }}>
//                 الوقت: {session.time || "غير متاح"} - المدة: {session.duration || "غير متاح"}
//               </p>
//             </div>
//             <button style={joinButtonStyle}>
//               <i className="fas fa-video"></i>الانضمام إلى الزوم
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default TodaysSessions;

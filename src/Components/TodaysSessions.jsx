// @ts-ignore
import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const TodaysSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:8000/api/v1/teacher/today_sessions";
  const CANCEL_SESSION_URL = "http://localhost:8000/api/v1/teacher/cancel_session/";
  const FINISH_SESSION_URL = "http://localhost:8000/api/v1/teacher/finish_session/";
  const DELETE_SESSION_URL = "http://localhost:8000/api/v1/teacher/delete_session/";

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("access_token");
      console.log("Fetching sessions... Token:", token ? "Found" : "Not found");
      if (!token) {
        // @ts-ignore
        setError("❌ الرجاء تسجيل الدخول أولاً");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API Response Status:", response.status);
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            // @ts-ignore
            setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
            return;
          }
          throw new Error("فشل في جلب الجلسات");
        }

        const data = await response.json();
        console.log("Fetched Sessions Data:", data);
        if (data?.data?.data) {
          setSessions(data.data.data);
          console.log("Sessions set successfully:", data.data.data.length, "sessions");
        } else {
          setSessions([]);
          console.log("No sessions found");
        }
      } catch (error) {
        // @ts-ignore
        console.log("Error fetching sessions:", error.message);
        // @ts-ignore
        setError("❌ حدث خطأ أثناء جلب الجلسات: " + error.message);
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchSessions();
  }, [navigate]);

  // @ts-ignore
  const handleCancelSession = async (sessionId) => {
    const token = localStorage.getItem("access_token");
    console.log("Attempting to cancel session ID:", sessionId, "Token:", token ? "Found" : "Not found");
    try {
      const response = await fetch(`${CANCEL_SESSION_URL}${sessionId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Cancel Session API Response Status:", response.status);
      if (!response.ok) throw new Error("فشل في إلغاء الجلسة");
      // @ts-ignore
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      // @ts-ignore
      setSessions(updatedSessions);
      console.log("Session cancelled, updated sessions count:", updatedSessions.length);
      // @ts-ignore
      setError("تم إلغاء الجلسة بنجاح");
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      // @ts-ignore
      console.log("Error cancelling session:", error.message);
      // @ts-ignore
      setError("❌ حدث خطأ أثناء إلغاء الجلسة: " + error.message);
    }
  };

  // @ts-ignore
  const handleFinishSession = async (sessionId) => {
    const token = localStorage.getItem("access_token");
    console.log("Attempting to finish session ID:", sessionId, "Token:", token ? "Found" : "Not found");
    try {
      const response = await fetch(`${FINISH_SESSION_URL}${sessionId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback: "تم الإنهاء" }),
      });

      console.log("Finish Session API Response Status:", response.status);
      if (!response.ok) throw new Error("فشل في إنهاء الجلسة");
      // @ts-ignore
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      // @ts-ignore
      setSessions(updatedSessions);
      console.log("Session finished, updated sessions count:", updatedSessions.length);
      // @ts-ignore
      setError("تم إنهاء الجلسة بنجاح");
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      // @ts-ignore
      console.log("Error finishing session:", error.message);
      // @ts-ignore
      setError("❌ حدث خطأ أثناء إنهاء الجلسة: " + error.message);
    }
  };

  // @ts-ignore
  const handleDeleteSession = async (sessionId) => {
    const token = localStorage.getItem("access_token");
    console.log("Attempting to delete session ID:", sessionId, "Token:", token ? "Found" : "Not found");
    try {
      const response = await fetch(`${DELETE_SESSION_URL}${sessionId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete Session API Response Status:", response.status);
      if (!response.ok) throw new Error("فشل في حذف الجلسة");
      // @ts-ignore
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      // @ts-ignore
      setSessions(updatedSessions);
      console.log("Session deleted, updated sessions count:", updatedSessions.length);
      // @ts-ignore
      setError("تم حذف الجلسة بنجاح");
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      // @ts-ignore
      console.log("Error deleting session:", error.message);
      // @ts-ignore
      setError("❌ حدث خطأ أثناء حذف الجلسة: " + error.message);
    }
  };

  const containerStyle = {
    backgroundColor: '#E1EFEA',
    borderRadius: '10px',
    padding: '15px',
    marginTop: '20px',
    boxSizing: 'border-box',
  };

  const sessionCardStyle = {
    backgroundColor: '#F2F8F6',
    // @ts-ignore
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const sessionInfoStyle = {
    textAlign: 'right',
  };

  const buttonStyle = {
    backgroundColor: '#1EC8A0',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '7px 15px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginLeft: '10px',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#FF4444',
  };

  return (
    <div 
// @ts-ignore
    style={containerStyle}>
      <h3 style={{ textAlign: 'right' }}>جلسات اليوم</h3>

      {error && (
        <p style={{ textAlign: 'center', color: error.
// @ts-ignore
        includes("❌") ? 'red' : 'green' }}>{error}</p>
      )}

      {loading ? (
        <p style={{ textAlign: 'center' }}>جاري تحميل الجلسات...</p>
      ) : sessions.length === 0 ? (
        <p style={{ textAlign: 'center' }}>لا توجد جلسات اليوم.</p>
      ) : (
        sessions.map((session) => (
          <div key={session.
// @ts-ignore
          id} style={sessionCardStyle}>
            <div 
// @ts-ignore
            style={sessionInfoStyle}>
              <strong>{session.
// @ts-ignore
              student?.fullName || "اسم الطالب غير متاح"}</strong>
              <p style={{ margin: '5px 0' }}>
                الوقت: {session.
// @ts-ignore
                time || "غير متاح"} - التاريخ: {session.date || "غير متاح"}
              </p>
            </div>
            <div>
              {session.
// @ts-ignore
              status === 'pending' && (
                <>
                  <a
                    // @ts-ignore
                    href={session.teacher?.teacherinfo?.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={buttonStyle}
                    // @ts-ignore
                    onClick={() => console.log("Joining session ID:", session.id)}
                  >
                    <i className="fas fa-video"></i> دخول الجلسة
                  </a>
                  <button
                    style={cancelButtonStyle}
                    // @ts-ignore
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <i className="fas fa-trash-can"></i> حذف الجلسة
                  </button>
                  <button
                    style={cancelButtonStyle}
                    // @ts-ignore
                    onClick={() => handleCancelSession(session.id)}
                  >
                    <i className="fas fa-times"></i> إلغاء الجلسة
                  </button>
                </>
              )}
              {session.
// @ts-ignore
              status === 'in_progress' && (
                <>
                  <a
                    // @ts-ignore
                    href={session.teacher?.teacherinfo?.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={buttonStyle}
                    // @ts-ignore
                    onClick={() => console.log("Rejoining session ID:", session.id)}
                  >
                    <i className="fas fa-video"></i> دخول مجددًا
                  </a>
                  <button
                    style={buttonStyle}
                    // @ts-ignore
                    onClick={() => handleFinishSession(session.id)}
                  >
                    <i className="fas fa-check"></i> إنهاء الجلسة
                  </button>
                </>
              )}
              {session.
// @ts-ignore
              status === 'completed' && (
                <p style={{ color: 'green', marginLeft: '10px' }}>الجلسة مكتملة</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TodaysSessions;
/****************************************************************************** */
// // @ts-ignore
// import React, { useEffect, useState } from 'react';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// // @ts-ignore
// import { useNavigate } from 'react-router-dom'; 

// // @ts-ignore
// const TodaysSessions = () => {
//   const navigate = useNavigate(); 
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_URL = "http://localhost:8000/api/v1/teacher/today_sessions"; 

//   useEffect(() => {
//     const fetchSessions = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         // @ts-ignore
//         setError("❌ الرجاء تسجيل الدخول أولاً");
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
//             // @ts-ignore
//             setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
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
//         // @ts-ignore
//         setError("❌ حدث خطأ أثناء جلب الجلسات: " + error.message);
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
// // @ts-ignore
//     style={containerStyle}>
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
// // @ts-ignore
//           style={sessionCardStyle}>
//             <div 
// // @ts-ignore
//             style={sessionInfoStyle}>
//               <strong>{session.
// // @ts-ignore
//               name || "اسم غير متاح"}</strong>
//               <p style={{ margin: '5px 0' }}>
//                 الوقت: {session.
// // @ts-ignore
//                 time || "غير متاح"} - المدة: {session.duration || "غير متاح"}
//               </p>
//             </div>
//             <a
//               // @ts-ignore
//               href={session.zoom_link || "#"} 
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

// // @ts-ignore
// export default TodaysSessions;
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

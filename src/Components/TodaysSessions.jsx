import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom'; 

const TodaysSessions = () => {
  const navigate = useNavigate(); 
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:8000/api/v1/teacher/today_sessions"; 

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
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

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
            return;
          }
          throw new Error("فشل في جلب الجلسات");
        }

        const data = await response.json();
        console.log("Today's sessions response:", data); // Debug
        if (data?.data?.data) {
          setSessions(data.data.data); 
        } else {
          setSessions([]); // لو مفيش جلسات
        }
      } catch (error) {
        setError("❌ حدث خطأ أثناء جلب الجلسات: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  const containerStyle = {
    backgroundColor: '#E1EFEA',
    borderRadius: '10px',
    padding: '15px',
    marginTop: '20px',
    boxSizing: 'border-box',
  };

  const sessionCardStyle = {
    backgroundColor: '#F2F8F6',
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

  const joinButtonStyle = {
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
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ textAlign: 'right' }}>جلسات اليوم</h3>

      {error && (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      )}

      {loading ? (
        <p style={{ textAlign: 'center' }}>جاري تحميل الجلسات...</p>
      ) : sessions.length === 0 ? (
        <p style={{ textAlign: 'center' }}>لا توجد جلسات اليوم.</p>
      ) : (
        sessions.map((session, index) => (
          <div key={index} style={sessionCardStyle}>
            <div style={sessionInfoStyle}>
              <strong>{session.name || "اسم غير متاح"}</strong>
              <p style={{ margin: '5px 0' }}>
                الوقت: {session.time || "غير متاح"} - المدة: {session.duration || "غير متاح"}
              </p>
            </div>
            <a
              href={session.zoom_link || "#"} 
              target="_blank"
              rel="noopener noreferrer"
              style={joinButtonStyle}
            >
              <i className="fas fa-video"></i> الانضمام إلى الزوم
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default TodaysSessions;

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

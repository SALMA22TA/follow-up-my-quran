
import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from "../Components/DashboardNavbar";
import { useNavigate } from 'react-router-dom'; 

const API_BASE_URL = "http://localhost:8000/api/v1/teacher"; 

const ScheduleRequests = () => {
  const navigate = useNavigate(); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
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
        const response = await fetch(`${API_BASE_URL}/get_schedules_requests`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json',
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
          throw new Error("فشل في جلب الطلبات");
        }

        const result = await response.json();
        console.log("Schedule requests response:", result); // Debug
        if (result?.data?.data) {
          setRequests(result.data.data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        
        setError("❌ حدث خطأ أثناء جلب الطلبات: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  
  const handleAction = async (id, action) => {
    const url = `${API_BASE_URL}/${action}_schedule/${id}`;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        
        setError("❌ الرجاء تسجيل الدخول أولاً");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      console.log(`${action} schedule response:`, result); // Debug
      if (response.ok) {
        
        setRequests(prev => prev.filter(request => request.id !== id));
        setError(null);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          
          setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
        
        setError(`❌ خطأ: ${result.message || 'حدث خطأ ما'}`);
      }
    } catch (error) {
      
      setError(`❌ فشل العملية: ${error.message}`);
    }
  };

  
  const handleDelete = async (id) => {
    const url = `${API_BASE_URL}/delete_schedule/${id}`;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        
        setError("❌ الرجاء تسجيل الدخول أولاً");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      console.log("Delete schedule response:", result); // Debug
      if (response.ok) {
        
        setRequests(prev => prev.filter(request => request.id !== id));
        setError(null);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          
          setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
        
        setError(`❌ خطأ: ${result.message || 'حدث خطأ ما'}`);
      }
    } catch (error) {
      
      setError(`❌ فشل العملية: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
        <Sidebar />
        <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
          <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>

          {error && (
            <p style={{ textAlign: 'center', color: 'red', marginBottom: '15px' }}>{error}</p>
          )}

          <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#777' }}>
                جاري تحميل الطلبات...
              </p>
            ) : requests.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#777' }}>
                لا يوجد طلبات جدولة حالياً
              </p>
            ) : (
              requests.map((request) => (
                <div key={request.id} style={{
                  backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.name}</p>
                    <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
                    <p style={{ margin: 0 }}>المدة: {request.duration}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleAction(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
                    <button onClick={() => handleAction(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
                    <button onClick={() => handleDelete(request.id)} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleRequests;


// /******************    Fetch initial requests (mocked for now)   ******************** */
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher";
// const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTE5Nzg2OCwiZXhwIjoxNzQxMjAxNDY4LCJuYmYiOjE3NDExOTc4NjgsImp0aSI6Ik5kd25EUmt4cmtDR2JyOGQiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.LoF7Iemws58Uot87sWDVHmbP4diTjIDx9JKgM2Vs1A4";

// const ScheduleRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     // Fetch initial requests (mocked for now)
//     setRequests([
//       { id: 1, name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
//       { id: 2, name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
//       { id: 3, name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
//     ]);
//   }, []);

//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(`تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب بنجاح`);
//         setRequests(prev => prev.filter(request => request.id !== id));
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert('تم حذف الطلب بنجاح');
//         setRequests(prev => prev.filter(request => request.id !== id));
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
//         <Sidebar />
//         <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>
//           <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
//             {requests.map((request) => (
//               <div key={request.id} style={{
//                 backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                 boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
//               }}>
//                 <div>
//                   <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.name}</p>
//                   <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                   <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                 </div>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   <button onClick={() => handleAction(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
//                   <button onClick={() => handleAction(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
//                   <button onClick={() => handleDelete(request.id)} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;
/************************************************************************ */

/******************wooooooooooooooooooooooooooooooo************************ */
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher";
// const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTE5ODUxMCwiZXhwIjoxNzQxMjAyMTEwLCJuYmYiOjE3NDExOTg1MTAsImp0aSI6ImtmeDd3VjBnM1dQbkZVS1ciLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.q3yJqpLf_zGs3RbgIl6cLY0ly-7O37XmoxrPFgTCmZQ";

// const ScheduleRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     // Fetch initial requests (mocked for now)
//     setRequests([
//       { id: 1, name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
//       { id: 2, name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
//       { id: 3, name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
//     ]);
//   }, []);

//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(`تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب بنجاح`);
//         setRequests(prev => prev.filter(request => request.id !== id));
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert('تم حذف الطلب بنجاح');
//         setRequests(prev => prev.filter(request => request.id !== id));
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
//         <Sidebar />
//         <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>
//           <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
//             {requests.length === 0 ? (
//               <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#777' }}>
//                 لا يوجد طلبات جدولة حالياً
//               </p>
//             ) : (
//               requests.map((request) => (
//                 <div key={request.id} style={{
//                   backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
//                 }}>
//                   <div>
//                     <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.name}</p>
//                     <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                     <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                   </div>
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <button onClick={() => handleAction(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
//                     <button onClick={() => handleAction(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
//                     <button onClick={() => handleDelete(request.id)} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;


// /******************    Fetching Actual Requests   ******************** */
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher";
// const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTE5NjI1NiwiZXhwIjoxNzQxMTk5ODU2LCJuYmYiOjE3NDExOTYyNTYsImp0aSI6IjRTV1RTMXljaUZGUjBqRnYiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.4IfVRRYEKg4URh5T_8Kw5F1fxlzDmC_bca_HfodUe8U";

// const ScheduleRequests = () => {
//   const [requests, setRequests] = useState([]);
  
//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/schedule_requests`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch schedule requests");
//       }

//       const data = await response.json();
//       setRequests(data.requests || []); // تأكدي أن المفتاح الصحيح هو "requests"
//     } catch (error) {
//       console.error("Error fetching schedule requests:", error);
//     }
//   };

//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(`تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب بنجاح`);
//         fetchRequests(); // تحديث القائمة بعد الإجراء
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert('تم حذف الطلب بنجاح');
//         fetchRequests(); // تحديث القائمة بعد الحذف
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
//         <Sidebar />
//         <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>
//           <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
//             {requests.length > 0 ? (
//               requests.map((request) => (
//                 <div key={request.id} style={{
//                   backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
//                 }}>
//                   <div>
//                     <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.student_name || "مجهول"}</p>
//                     <p style={{ margin: '5px 0' }}>الأيام: {request.days?.join(", ") || "غير محدد"} - الساعة: {request.time || "غير محددة"}</p>
//                     <p style={{ margin: 0 }}>المدة: {request.duration || "غير محددة"}</p>
//                   </div>
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <button onClick={() => handleAction(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
//                     <button onClick={() => handleAction(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
//                     <button onClick={() => handleDelete(request.id)} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>لا توجد طلبات جدولة حالياً</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;

/**************************************************************** */

// import React from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const ScheduleRequests = () => {
//   const requests = [
//     { name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
//     { name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
//     { name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
//   ];

//   const handleAccept = (name) => alert(`تم قبول الطلب: ${name}`);
//   const handleReject = (name) => alert(`تم رفض الطلب: ${name}`);

//   const containerStyle = {
//     display: 'flex',
//     flexDirection: 'row-reverse', // Keep sidebar on the right
//     direction: 'rtl',
//   };

//   const mainContentStyle = {
//     marginRight: '220px', // Same as dashboard
//     padding: '20px',
//     width: '100%',
//     boxSizing: 'border-box',
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={containerStyle}>
//         <Sidebar />

//         <div style={mainContentStyle}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>
//             جميع طلبات الجدولة
//           </h1>

//           <div style={{
//             backgroundColor: '#F2F8F6',
//             borderRadius: '10px',
//             padding: '20px',
//             boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//           }}>
//             {requests.map((request, index) => (
//               <div key={index} style={{
//                 backgroundColor: '#E9F3F1',
//                 borderRadius: '8px',
//                 padding: '15px',
//                 marginBottom: '15px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
//               }}>
//                 <div>
//                   <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.name}</p>
//                   <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                   <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                 </div>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   <button onClick={() => handleAccept(request.name)} style={{
//                     backgroundColor: '#1EC8A0',
//                     color: '#fff',
//                     border: 'none',
//                     padding: '10px 20px',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                   }}>
//                     قبول
//                   </button>
//                   <button onClick={() => handleReject(request.name)} style={{
//                     backgroundColor: '#FF4C4C',
//                     color: '#fff',
//                     border: 'none',
//                     padding: '10px 20px',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                   }}>
//                     رفض
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;


/************************ Old ********************************/
// import React from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const ScheduleRequests = () => {
//   const requests = [
//     { name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
//     { name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
//     { name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
//   ];

//   const handleAccept = (name) => alert(`تم قبول الطلب: ${name}`);
//   const handleReject = (name) => alert(`تم رفض الطلب: ${name}`);

//   return (
//     <>
//            <h1 style={{
//             marginBottom: '20px',
//             fontWeight: 'bold',
//             display: 'flex',
//             justifyContent: 'right',
//             alignItems: 'flex-start',
//             paddingRight:'250px',
//             paddingTop:'12px'
//           }}>
//             جميع طلبات الجدولة
//           </h1>
//         <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
//       <Sidebar />
//       <div style={{ flexGrow: 1, paddingRight: '220px' }}>
        
//         <Navbar />
//         <div
//           style={{
//             direction: 'rtl',
//             padding: '20px',
//             marginTop: '20px',
//             backgroundColor: '#F9F9F9',
//             minHeight: '100vh',
//             boxSizing: 'border-box',
//           }}
//         > 
    
          
//           <div
//             style={{
//               backgroundColor: '#F2F8F6',
//               borderRadius: '10px',
//               padding: '20px',
//               boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             {requests.map((request, index) => (
//               <div
//                 key={index}
//                 style={{
//                   backgroundColor: '#E9F3F1',
//                   borderRadius: '8px',
//                   padding: '15px',
//                   marginBottom: '15px',
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
//                 }}
//               >
//                 <div>
//                   <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.name}</p>
//                   <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                   <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                 </div>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   <button
//                     onClick={() => handleAccept(request.name)}
//                     style={{
//                       backgroundColor: '#1EC8A0',
//                       color: '#fff',
//                       border: 'none',
//                       padding: '10px 20px',
//                       borderRadius: '5px',
//                       cursor: 'pointer',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     قبول
//                   </button>
//                   <button
//                     onClick={() => handleReject(request.name)}
//                     style={{
//                       backgroundColor: '#FF4C4C',
//                       color: '#fff',
//                       border: 'none',
//                       padding: '10px 20px',
//                       borderRadius: '5px',
//                       cursor: 'pointer',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     رفض
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div></>

//   );
// };

// export default ScheduleRequests;

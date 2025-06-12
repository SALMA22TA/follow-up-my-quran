import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";


const GenerateSessions = () => {
  const [schedules, setSchedules] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // دالة لجلب الجداول المقبولة من الـ API
  const getAcceptedSchedules = async () => {
    console.log('Starting to fetch accepted schedules...'); 
    try {
      const response = await axios.get('http://localhost:8000/api/v1/teacher/accepted_schedules', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      console.log('Accepted schedules fetched successfully:', response.data); 
      const acceptedSchedules = response.data.data.data;

      // Mapping للبيانات
      const mappedSchedules = acceptedSchedules.map((schedule) => {
        try {
          const daysArray = JSON.parse(schedule.days);
          const daysInArabic = daysArray
            .map((day) => {
              const daysMap = {
                Saturday: 'السبت',
                Sunday: 'الأحد',
                Monday: 'الإثنين',
                Tuesday: 'الثلاثاء',
                Wednesday: 'الأربعاء',
                Thursday: 'الخميس',
                Friday: 'الجمعة',
              };
              return daysMap[day] || day;
            })
            .join('، ');
          
          const mappedSchedule = {
            id: schedule.id,
            name: `طالب ${schedule.student_id}`,
            sessionTime: schedule.time.split(':').slice(0, 2).join(':'),
            days: daysInArabic,
          };
          console.log(`Mapped schedule for student ${schedule.student_id}:`, mappedSchedule); // طباعة كل جدول بعد الـ mapping
          return mappedSchedule;
        } catch (error) {
          console.error(`Error mapping schedule for student ${schedule.student_id}:`, error); // رسالة خطأ لو حصل مشكلة في الـ mapping
          return null;
        }
      }).filter(schedule => schedule !== null); // إزالة أي عناصر فاشلة في الـ mapping

      console.log('All schedules mapped successfully:', mappedSchedules); // طباعة الجداول بعد الـ mapping
      return { schedules: mappedSchedules };
    } catch (error) {
      console.error('Error fetching accepted schedules:', error.response?.data || error); // رسالة خطأ لو حصل مشكلة في جلب الجداول
      throw error.response?.data || error;
    }
  };

  // دالة لإنشاء الجلسات
  const generateSessions = async (scheduleId) => {
    console.log(`Starting to generate sessions for schedule ID ${scheduleId}...`); 
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/teacher/generate_sessions/${scheduleId}`,
        {},
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      console.log(`Sessions generated successfully for schedule ID ${scheduleId}:`, response.data); // رسالة نجاح إنشاء الجلسات
      return response.data;
    } catch (error) {
      console.error(`Error generating sessions for schedule ID ${scheduleId}:`, error.response?.data || error); // رسالة خطأ لو حصل مشكلة في إنشاء الجلسات
      throw error.response?.data || error;
    }
  };

  // جلب الجداول المقبولة عند تحميل الصفحة
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getAcceptedSchedules();
        console.log('Setting schedules in state:', data.schedules); // رسالة قبل تحديث الـ state
        setSchedules(data.schedules || []);
      } catch (error) {
        console.error('Error in fetchSchedules:', error); // رسالة خطأ لو حصل مشكلة في الـ fetch
      }
    };
    fetchSchedules();
  }, []);

  // دالة لفتح الـ pop-up للتأكيد
  const handleGenerateClick = (scheduleId) => {
    console.log(`Generate button clicked for schedule ID ${scheduleId}`); // رسالة لما الشيخ يضغط على زرار "إنشاء جلسة"
    setSelectedScheduleId(scheduleId);
    setShowConfirmModal(true);
  };

  // دالة لإنشاء الجلسات بعد التأكيد
  const confirmGenerateSession = async () => {
    console.log(`User confirmed generating session for schedule ID ${selectedScheduleId}`); // رسالة لما الشيخ يضغط "نعم" في الـ pop-up
    setLoading(true);
    try {
      await generateSessions(selectedScheduleId);
      setSuccessMessage('!تم إنشاء الجلسات بنجاح');
      setShowConfirmModal(false);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // إعادة جلب الجداول بعد إنشاء الجلسات
      const updatedSchedules = await getAcceptedSchedules();
      setSchedules(updatedSchedules.schedules || []);
    } catch (error) {
      setSuccessMessage('حدث خطأ أثناء إنشاء الجلسات. يرجى المحاولة مرة أخرى.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // دالة لإلغاء التأكيد
  const cancelGenerateSession = () => {
    console.log('User cancelled generating session'); // رسالة لما الشيخ يضغط "لا" في الـ pop-up
    setShowConfirmModal(false);
    setSelectedScheduleId(null);
  };

  const tableStyle = {
    width: '100%',
    maxWidth: '1100px',
    marginRight: '220px',
    marginLeft: 'auto',
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

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: '"Tajawal", sans-serif',
  };

  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    fontFamily: '"Tajawal", sans-serif',
    direction: 'rtl',
  };

  const modalButtonStyle = {
    padding: '8px 16px',
    margin: '0 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: '"Tajawal", sans-serif',
  };

  const confirmButtonStyle = {
    ...modalButtonStyle,
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
  };

  const cancelButtonStyle = {
    ...modalButtonStyle,
    backgroundColor: '#FF4D4F',
    color: '#FFFFFF',
  };

  const successMessageStyle = {
    color: '#1EC8A0',
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: '"Tajawal", sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  return (
    <><Navbar /><Sidebar />
    <div style={{ padding: '20px', marginTop: '90px', maxWidth: '1100px', marginRight: '220px', marginLeft: 'auto' }}>
      <h2 style={{ textAlign: 'center', fontFamily: '"Tajawal", sans-serif', direction: 'rtl', marginBottom: '30px' }}>
        إنشاء الجلسات
      </h2>
      {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
      {schedules.length === 0 ? (
        <p style={{ textAlign: 'center', fontFamily: '"Tajawal", sans-serif', direction: 'rtl' }}>
          لا يوجد جداول مقبولة لإنشاء جلسات.
        </p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>رقم الطالب</th>
              <th style={thStyle}>موعد الجلسة</th>
              <th style={thStyle}>الأيام</th>
              <th style={thStyle}>إنشاء جلسة</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td style={tdStyle}>{schedule.name}</td>
                <td style={tdStyle}>{schedule.sessionTime}</td>
                <td style={tdStyle}>{schedule.days}</td>
                <td style={tdStyle}>
                  <button
                    style={buttonStyle}
                    onClick={() => handleGenerateClick(schedule.id)}
                    disabled={loading}
                  >
                    {loading && selectedScheduleId === schedule.id ? 'جاري الإنشاء...' : 'إنشاء جلسة'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showConfirmModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <p>هل أنت متأكد أنك تريد إنشاء جلسة لهذا الطالب؟</p>
            <button style={confirmButtonStyle} onClick={confirmGenerateSession} disabled={loading}>
              نعم
            </button>
            <button style={cancelButtonStyle} onClick={cancelGenerateSession} disabled={loading}>
              لا
            </button>
          </div>
        </div>
      )}
    </div></>
  );
};

export default GenerateSessions;
/************************************************************************** */
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const GenerateSessions = () => {
//   const [schedules, setSchedules] = useState([]); // غيّرنا الاسم من students إلى schedules
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedScheduleId, setSelectedScheduleId] = useState(null); // غيّرنا الاسم من selectedStudentId إلى selectedScheduleId
//   const [successMessage, setSuccessMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   // دالة لجلب الجداول المقبولة من الـ API
//   const getAcceptedSchedules = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/api/v1/teacher/accepted_schedules', {
//         headers: {
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });

//       const acceptedSchedules = response.data.data.data; // البيانات في response.data.data.data
//       // Mapping للبيانات عشان تتناسب مع الجدول
//       const mappedSchedules = acceptedSchedules.map((schedule) => {
//         // تحويل الأيام من JSON string إلى array ثم string مفصول بفواصل
//         const daysArray = JSON.parse(schedule.days); // تحويل "[\"Saturday\", \"Sunday\"]" إلى ["Saturday", "Sunday"]
//         const daysInArabic = daysArray.map((day) => {
//           const daysMap = {
//             Saturday: 'السبت',
//             Sunday: 'الأحد',
//             Monday: 'الإثنين',
//             Tuesday: 'الثلاثاء',
//             Wednesday: 'الأربعاء',
//             Thursday: 'الخميس',
//             Friday: 'الجمعة',
//           };
//           return daysMap[day] || day;
//         }).join('، ');

//         return {
//           id: schedule.id, // هنا بنستخدم schedule.id بدل student_id لأن ده الـ ID اللي هنستخدمه في generate_sessions
//           name: `طالب ${schedule.student_id}`, // مؤقتًا لحد ما نجيب اسم الطالب من API
//           sessionTime: schedule.time.split(':').slice(0, 2).join(':'), // تحويل "14:00:00" إلى "14:00"
//           days: daysInArabic, // "السبت، الأحد"
//         };
//       });

//       return { schedules: mappedSchedules };
//     } catch (error) {
//       console.error('Get accepted schedules error:', error.response?.data || error);
//       throw error.response?.data || error;
//     }
//   };

//   // دالة لإنشاء الجلسات
//   const generateSessions = async (scheduleId) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:8000/api/v1/teacher/generate_sessions/${scheduleId}`,
//         {},
//         {
//           headers: {
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Generate sessions error:', error.response?.data || error);
//       throw error.response?.data || error;
//     }
//   };

//   // جلب الجداول المقبولة عند تحميل الصفحة
//   useEffect(() => {
//     const fetchSchedules = async () => {
//       try {
//         const data = await getAcceptedSchedules();
//         setSchedules(data.schedules || []);
//       } catch (error) {
//         console.error('Error fetching schedules:', error);
//       }
//     };
//     fetchSchedules();
//   }, []);

//   // دالة لفتح الـ pop-up للتأكيد
//   const handleGenerateClick = (scheduleId) => {
//     setSelectedScheduleId(scheduleId);
//     setShowConfirmModal(true);
//   };

//   // دالة لإنشاء الجلسات بعد التأكيد
//   const confirmGenerateSession = async () => {
//     setLoading(true);
//     try {
//       const response = await generateSessions(selectedScheduleId);
//       setSuccessMessage(response.message || 'تم إنشاء جلسة بنجاح!');
//       setShowConfirmModal(false);
//       setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);

//       // إعادة جلب الجداول بعد إنشاء الجلسات
//       const updatedSchedules = await getAcceptedSchedules();
//       setSchedules(updatedSchedules.schedules || []);
//     } catch (error) {
//       console.error('Error generating sessions:', error);
//       setSuccessMessage('فشل إنشاء الجلسة. حاول مرة أخرى.');
//       setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // دالة لإلغاء التأكيد
//   const cancelGenerateSession = () => {
//     setShowConfirmModal(false);
//     setSelectedScheduleId(null);
//   };

//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginTop: '20px',
//     direction: 'rtl',
//     fontFamily: '"Tajawal", sans-serif',
//   };

//   const thStyle = {
//     border: '1px solid #E6E6E6',
//     padding: '10px',
//     backgroundColor: '#f9f9f9',
//     textAlign: 'center',
//   };

//   const tdStyle = {
//     border: '1px solid #E6E6E6',
//     padding: '10px',
//     textAlign: 'center',
//   };

//   const buttonStyle = {
//     padding: '8px 16px',
//     backgroundColor: '#1EC8A0',
//     color: '#FFFFFF',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontFamily: '"Tajawal", sans-serif',
//   };

//   const modalStyle = {
//     position: 'fixed',
//     top: '0',
//     left: '0',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   };

//   const modalContentStyle = {
//     backgroundColor: '#FFFFFF',
//     padding: '20px',
//     borderRadius: '8px',
//     textAlign: 'center',
//     fontFamily: '"Tajawal", sans-serif',
//     direction: 'rtl',
//   };

//   const modalButtonStyle = {
//     padding: '8px 16px',
//     margin: '0 10px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontFamily: '"Tajawal", sans-serif',
//   };

//   const confirmButtonStyle = {
//     ...modalButtonStyle,
//     backgroundColor: '#1EC8A0',
//     color: '#FFFFFF',
//   };

//   const cancelButtonStyle = {
//     ...modalButtonStyle,
//     backgroundColor: '#FF4D4F',
//     color: '#FFFFFF',
//   };

//   const successMessageStyle = {
//     color: 'green',
//     textAlign: 'center',
//     marginTop: '20px',
//     fontFamily: '"Tajawal", sans-serif',
//   };

//   return (
//     <div style={{ padding: '20px', marginTop: '90px' }}>
//       <h2 style={{ textAlign: 'center', fontFamily: '"Tajawal", sans-serif', direction: 'rtl' }}>
//         إنشاء الجلسات
//       </h2>
//       {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
//       {schedules.length === 0 ? (
//         <p style={{ textAlign: 'center', fontFamily: '"Tajawal", sans-serif', direction: 'rtl' }}>
//           لا يوجد جداول مقبولة لإنشاء جلسات.
//         </p>
//       ) : (
//         <table style={tableStyle}>
//           <thead>
//             <tr>
//               <th style={thStyle}>اسم الطالب</th>
//               <th style={thStyle}>موعد الجلسة</th>
//               <th style={thStyle}>الأيام</th>
//               <th style={thStyle}>إنشاء جلسة</th>
//             </tr>
//           </thead>
//           <tbody>
//             {schedules.map((schedule) => (
//               <tr key={schedule.id}>
//                 <td style={tdStyle}>{schedule.name}</td>
//                 <td style={tdStyle}>{schedule.sessionTime}</td>
//                 <td style={tdStyle}>{schedule.days}</td>
//                 <td style={tdStyle}>
//                   <button
//                     style={buttonStyle}
//                     onClick={() => handleGenerateClick(schedule.id)}
//                     disabled={loading}
//                   >
//                     {loading && selectedScheduleId === schedule.id ? 'جاري الإنشاء...' : 'إنشاء جلسة'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showConfirmModal && (
//         <div style={modalStyle}>
//           <div style={modalContentStyle}>
//             <p>هل أنت متأكد أنك تريد إنشاء جلسة لهذا الطالب؟</p>
//             <button style={confirmButtonStyle} onClick={confirmGenerateSession} disabled={loading}>
//               نعم
//             </button>
//             <button style={cancelButtonStyle} onClick={cancelGenerateSession} disabled={loading}>
//               لا
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateSessions;
/************************************************************************************* */

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";

// const GenerateSessions = () => {
//   const [students, setStudents] = useState([]);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedStudentId, setSelectedStudentId] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   // دالة لجلب بيانات الطلاب (مؤقتة لحد ما الـ API تكون جاهزة)
//   const getStudents = async () => {
//     // بيانات تجريبية مؤقتة
//     const mockStudents = [
//       { id: 1, name: 'طالب 1', sessionTime: '14:00', days: 'السبت، الأحد' },
//       { id: 2, name: 'طالب 2', sessionTime: '15:00', days: 'الإثنين، الثلاثاء' },
//       { id: 3, name: 'طالب 3', sessionTime: '16:00', days: 'الأربعاء، الخميس' },
//     ];
//     return { students: mockStudents };

//     // The actual code when the API is ready (I will replace the above code with this code):
//     /*
//     try {
//       const response = await axios.get('http://localhost:8000/api/v1/teacher/students', {
//         headers: {
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Get students error:', error.response?.data || error);
//       throw error.response?.data || error;
//     }
//     */
//   };

//   // دالة لإنشاء الجلسات
//   const generateSessions = async (studentId) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:8000/api/v1/teacher/generate_sessions/${studentId}`,
//         {},
//         {
//           headers: {
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Generate sessions error:', error.response?.data || error);
//       throw error.response?.data || error;
//     }
//   };

//   // جلب بيانات الطلاب عند تحميل الصفحة
//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const data = await getStudents();
//         setStudents(data.students || []);
//       } catch (error) {
//         console.error('Error fetching students:', error);
//       }
//     };
//     fetchStudents();
//   }, []);

//   // دالة لفتح الـ pop-up للتأكيد
//   const handleGenerateClick = (studentId) => {
//     setSelectedStudentId(studentId);
//     setShowConfirmModal(true);
//   };

//   // دالة لإنشاء الجلسات بعد التأكيد
//   const confirmGenerateSession = async () => {
//     setLoading(true);
//     try {
//       const response = await generateSessions(selectedStudentId);
//       setSuccessMessage(response.message || 'تم إنشاء جلسة بنجاح!');
//       setShowConfirmModal(false);
//       setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);

//       // إعادة جلب بيانات الطلاب بعد إنشاء الجلسات (اختياري)
//       const updatedStudents = await getStudents();
//       setStudents(updatedStudents.students || []);
//     } catch (error) {
//       console.error('Error generating sessions:', error);
//       setSuccessMessage('فشل إنشاء الجلسة. حاول مرة أخرى.');
//       setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // دالة لإلغاء التأكيد
//   const cancelGenerateSession = () => {
//     setShowConfirmModal(false);
//     setSelectedStudentId(null);
//   };

//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginTop: '20px',
//     direction: 'rtl',
//     fontFamily: '"Tajawal", sans-serif',
//   };

//   const thStyle = {
//     border: '1px solid #E6E6E6',
//     padding: '10px',
//     backgroundColor: '#f9f9f9',
//     textAlign: 'center',
//   };

//   const tdStyle = {
//     border: '1px solid #E6E6E6',
//     padding: '10px',
//     textAlign: 'center',
//   };

//   const buttonStyle = {
//     padding: '8px 16px',
//     backgroundColor: '#1EC8A0',
//     color: '#FFFFFF',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontFamily: '"Tajawal", sans-serif',
//   };

//   const modalStyle = {
//     position: 'fixed',
//     top: '0',
//     left: '0',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   };

//   const modalContentStyle = {
//     backgroundColor: '#FFFFFF',
//     padding: '20px',
//     borderRadius: '8px',
//     textAlign: 'center',
//     fontFamily: '"Tajawal", sans-serif',
//     direction: 'rtl',
//   };

//   const modalButtonStyle = {
//     padding: '8px 16px',
//     margin: '0 10px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontFamily: '"Tajawal", sans-serif',
//   };

//   const confirmButtonStyle = {
//     ...modalButtonStyle,
//     backgroundColor: '#1EC8A0',
//     color: '#FFFFFF',
//   };

//   const cancelButtonStyle = {
//     ...modalButtonStyle,
//     backgroundColor: '#FF4D4F',
//     color: '#FFFFFF',
//   };

//   const successMessageStyle = {
//     color: 'green',
//     textAlign: 'center',
//     marginTop: '20px',
//     fontFamily: '"Tajawal", sans-serif',
//   };
//   const contentContainerStyle = {
//     padding: '20px',
//     marginTop: '90px', 
//     marginRight: '220px', 
//     direction: 'rtl',
//     minHeight: 'calc(100vh - 90px)', 
//   };
//   return (
//     <>
//       <Navbar />
//       <Sidebar />
//       <div style={contentContainerStyle}>
//         <h2 style={{ textAlign: 'center', fontFamily: '"Tajawal", sans-serif' }}>
//           إنشاء الجلسات
//         </h2>
//         {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
//         {students.length === 0 ? (
//           <p style={{ textAlign: 'center', fontFamily: '"Tajawal", sans-serif' }}>
//             لا يوجد طلاب متاحين لإنشاء جلسات.
//           </p>
//         ) : (
//           <table style={tableStyle}>
//             <thead>
//               <tr>
//                 <th style={thStyle}>اسم الطالب</th>
//                 <th style={thStyle}>موعد الجلسة</th>
//                 <th style={thStyle}>الأيام</th>
//                 <th style={thStyle}>إنشاء جلسة</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((student) => (
//                 <tr key={student.id}>
//                   <td style={tdStyle}>{student.name}</td>
//                   <td style={tdStyle}>{student.sessionTime}</td>
//                   <td style={tdStyle}>{student.days}</td>
//                   <td style={tdStyle}>
//                     <button
//                       style={buttonStyle}
//                       onClick={() => handleGenerateClick(student.id)}
//                       disabled={loading}
//                     >
//                       {loading && selectedStudentId === student.id ? 'جاري الإنشاء...' : 'إنشاء جلسة'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {showConfirmModal && (
//           <div style={modalStyle}>
//             <div style={modalContentStyle}>
//               <p>هل أنت متأكد أنك تريد إنشاء جلسة لهذا الطالب؟</p>
//               <button style={confirmButtonStyle} onClick={confirmGenerateSession} disabled={loading}>
//                 نعم
//               </button>
//               <button style={cancelButtonStyle} onClick={cancelGenerateSession} disabled={loading}>
//                 لا
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default GenerateSessions;
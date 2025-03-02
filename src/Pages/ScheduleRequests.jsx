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

import React from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from "../Components/DashboardNavbar";

const ScheduleRequests = () => {
  const requests = [
    { name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
    { name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
    { name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
  ];

  const handleAccept = (name) => alert(`تم قبول الطلب: ${name}`);
  const handleReject = (name) => alert(`تم رفض الطلب: ${name}`);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row-reverse', // Keep sidebar on the right
    direction: 'rtl',
  };

  const mainContentStyle = {
    marginRight: '220px', // Same as dashboard
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <Sidebar />

        <div style={mainContentStyle}>
          <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>
            جميع طلبات الجدولة
          </h1>

          <div style={{
            backgroundColor: '#F2F8F6',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}>
            {requests.map((request, index) => (
              <div key={index} style={{
                backgroundColor: '#E9F3F1',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.name}</p>
                  <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
                  <p style={{ margin: 0 }}>المدة: {request.duration}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleAccept(request.name)} style={{
                    backgroundColor: '#1EC8A0',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}>
                    قبول
                  </button>
                  <button onClick={() => handleReject(request.name)} style={{
                    backgroundColor: '#FF4C4C',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}>
                    رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleRequests;

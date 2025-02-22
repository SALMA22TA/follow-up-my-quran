import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


const TodaysSessions = () => {
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
    padding: '7px 15px', // ⭐ Smaller button size
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ textAlign: 'right' }}>جلسات اليوم</h3>
      {[{ name: 'أحمد علي', time: '10:00 ص', duration: '45 دقيقة' },
        { name: 'سارة خالد', time: '11:00 ص', duration: '45 دقيقة' },
        { name: 'عمر حامد', time: '12:00 ص', duration: '45 دقيقة' }].map((session, index) => (
        <div key={index} style={sessionCardStyle}>
          <div style={sessionInfoStyle}>
            <strong>{session.name}</strong>
            <p style={{ margin: '5px 0' }}>الوقت: {session.time} - المدة: {session.duration}</p>
          </div>
          <button style={joinButtonStyle}>
          <i className="fas fa-video"></i>الانضمام إلى الزوم
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodaysSessions;

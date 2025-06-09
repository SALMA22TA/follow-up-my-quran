import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import "../styles/coming-soon-teacher.css"
import Sidebar from '../Components/Sidebar'

const ComingSoonTeacher = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.style.background = '#fff';
    return () => { document.body.style.background = ''; };
  }, []);

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#fff', width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', minHeight: '100vh', width: '100vw', background: 'transparent' }}>
        {/* Sidebar toggle button */}
        <button
          className="toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ position: 'fixed', top: '15px', right: 0, zIndex: 1100, marginRight: '16px', transition: 'background 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#EAF8F4'; e.currentTarget.style.cursor = 'pointer'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; }}
        >
          ☰
        </button>
        {/* Sidebar */}
        {isSidebarOpen && (
          <div style={{ width: '220px', minHeight: '100vh', background: '#fff', boxShadow: '-2px 0 5px rgba(0,0,0,0.07)', zIndex: 1000 }}>
            <Sidebar />
          </div>
        )}
        {/* Main content */}
        <div className="coming-soon-container" style={{ flex: 1, marginRight: isSidebarOpen ? 220 : 0, transition: 'margin 0.3s', background: 'transparent' }}>
          <div className="coming-soon-card" style={{ background: '#f0f0f0', borderRadius: 20 }}>
            <div className="feature-badge">للمعلمين</div>

            <h1 className="coming-soon-title">المحادثات</h1>

            <div className="coming-soon-icon">
              <div className="pulse-circle"></div>
              <div className="teacher-icon">
                <div className="teacher-icon-inner"></div>
              </div>
            </div>

            <h2 className="coming-soon-subtitle">قريباً...</h2>

            <p className="coming-soon-description">
              نعمل حالياً على تطوير محادثات متكاملة للمعلمين، ستمكنك من التواصل بشكل فعال مع طلابك، متابعة تقدمهم،
              وتقديم الإرشادات المخصصة لكل طالب. ستكون أداة قوية تساعدك في تحسين جودة التعليم وتوفير الوقت والجهد.
            </p>

            <div className="teacher-benefits">
              <h3 className="benefits-title">مميزات للمعلمين</h3>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon students-icon"></div>
                  <div className="benefit-content">
                    <h4>إدارة الطلاب</h4>
                    <p>تنظيم الطلاب في مجموعات وإدارة جلسات التعليم بكفاءة</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon feedback-icon"></div>
                  <div className="benefit-content">
                    <h4>تقديم الملاحظات</h4>
                    <p>إرسال ملاحظات صوتية ونصية مخصصة لكل طالب</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon schedule-icon"></div>
                  <div className="benefit-content">
                    <h4>جدولة الدروس</h4>
                    <p>تنظيم مواعيد الدروس وإرسال تذكيرات تلقائية للطلاب</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon analytics-icon"></div>
                  <div className="benefit-content">
                    <h4>تحليلات وإحصائيات</h4>
                    <p>متابعة تقدم الطلاب من خلال تقارير وإحصائيات مفصلة</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <Link to="/sheikh-dashboard" className="dashboard-button">
                لوحة تحكم المعلم
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonTeacher

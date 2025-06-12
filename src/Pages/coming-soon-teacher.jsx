import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import "../styles/coming-soon-teacher.css"
import Sidebar from '../Components/Sidebar'
import StudentSidebar from '../Components/StudentSidebar'
import { getUserRole } from '../services/authService'

const ComingSoonTeacher = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const userRole = getUserRole()

  useEffect(() => {
    document.body.style.background = '#fff';
    return () => { document.body.style.background = ''; };
  }, []);

  const SidebarComponent = userRole === '2' ? Sidebar : StudentSidebar;

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
            <SidebarComponent />
          </div>
        )}
        {/* Main content */}
        <div className="coming-soon-container" style={{ flex: 1, marginRight: isSidebarOpen ? 220 : 0, transition: 'margin 0.3s', background: 'transparent' }}>
          <div className="coming-soon-card" style={{ background: '#f0f0f0', borderRadius: 20 }}>
            <div className="feature-badge">{userRole === '2' ? 'للمعلمين' : 'للطلاب'}</div>

            <h1 className="coming-soon-title">المحادثات</h1>

            <div className="coming-soon-icon">
              <div className="pulse-circle"></div>
              <div className="teacher-icon">
                <div className="teacher-icon-inner"></div>
              </div>
            </div>

            <h2 className="coming-soon-subtitle">قريباً...</h2>

            <p className="coming-soon-description">
              نعمل حالياً على تطوير محادثات متكاملة {userRole === '2' ? 'للمعلمين' : 'للطلاب'}، ستمكنك من التواصل بشكل فعال {userRole === '2' ? 'مع طلابك' : 'مع معلميك'}، متابعة تقدمك،
              وتقديم الإرشادات المخصصة. ستكون أداة قوية تساعدك في تحسين جودة التعليم وتوفير الوقت والجهد.
            </p>

            <div className="teacher-benefits">
              <h3 className="benefits-title">مميزات {userRole === '2' ? 'للمعلمين' : 'للطلاب'}</h3>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon students-icon"></div>
                  <div className="benefit-content">
                    <h4>{userRole === '2' ? 'إدارة الطلاب' : 'التواصل مع المعلم'}</h4>
                    <p>{userRole === '2' ? 'تنظيم الطلاب في مجموعات وإدارة جلسات التعليم بكفاءة' : 'التواصل المباشر مع المعلم وطرح الأسئلة'}</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon feedback-icon"></div>
                  <div className="benefit-content">
                    <h4>تقديم الملاحظات</h4>
                    <p>إرسال ملاحظات صوتية ونصية مخصصة</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon schedule-icon"></div>
                  <div className="benefit-content">
                    <h4>جدولة الدروس</h4>
                    <p>تنظيم مواعيد الدروس وإرسال تذكيرات تلقائية</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon analytics-icon"></div>
                  <div className="benefit-content">
                    <h4>تحليلات وإحصائيات</h4>
                    <p>متابعة التقدم من خلال تقارير وإحصائيات مفصلة</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <Link to={userRole === '2' ? "/sheikh-dashboard" : "/student-dashboard"} className="dashboard-button">
                {userRole === '2' ? 'لوحة تحكم المعلم' : 'لوحة تحكم الطالب'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonTeacher

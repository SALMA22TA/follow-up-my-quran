import React, { useState, useEffect } from 'react';
import Navbar from '../Components/DashboardNavbar';
import AdminSidebar from '../Components/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUsers, faGraduationCap, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AdminDashboard = () => {
  const [hovered, setHovered] = useState(-1);
  const [studentRowHover, setStudentRowHover] = useState(-1);
  const [courseRowHover, setCourseRowHover] = useState(-1);
  const [insights, setInsights] = useState({
    total_students: 0,
    total_teachers: 0,
    total_courses: 0
  });
  const [latestData, setLatestData] = useState({
    latest_students: [],
    latest_courses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Get the access token from localStorage
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        // Configure axios headers with the token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
        
        // Fetch insights data
        const insightsResponse = await axios.get('http://localhost:8000/api/v1/admin/get/insights', config);
        console.log('Insights Response:', insightsResponse.data);
        
        if (insightsResponse.data && insightsResponse.data.data) {
          setInsights(insightsResponse.data.data);
        }

        // Fetch latest summary data
        const latestResponse = await axios.get('http://localhost:8000/api/v1/admin/latest-summary', config);
        console.log('Latest Summary Response:', latestResponse.data);
        
        if (latestResponse.data && latestResponse.data.data) {
          setLatestData(latestResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.message === 'No access token found') {
          setError('يرجى تسجيل الدخول للوصول إلى لوحة التحكم');
        } else {
          setError('حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryCards = [
    {
      label: 'إجمالي الدورات',
      value: insights.total_courses || 0,
      icon: faBookOpen,
      color: '#F6A700',
      percent: '+5%',
      percentColor: '#F6A700',
      link: '/admin/courses',
    },
    {
      label: 'إجمالي الطلاب',
      value: insights.total_students || 0,
      icon: faUsers,
      color: '#4B9EFF',
      percent: '+18%',
      percentColor: '#4B9EFF',
      link: '/admin/students',
    },
    {
      label: 'إجمالي المعلمين',
      value: insights.total_teachers || 0,
      icon: faGraduationCap,
      color: '#1EC8A0',
      percent: '+12%',
      percentColor: '#1EC8A0',
      link: '/admin/teachers',
    },
  ];

  // Add error display component
  const ErrorMessage = () => (
    <div style={{
      background: '#FFF3F3',
      border: '1px solid #FFE0E0',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      color: '#D32F2F',
      textAlign: 'center',
      direction: 'rtl'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>خطأ في تحميل البيانات</div>
      <div>{error}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FCFB', width: '100vw', overflowX: 'hidden' }}>
      <Navbar />
      <div style={{ maxWidth: '1600px', margin: '0 auto', paddingTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
          <AdminSidebar />
          <div style={{ marginRight: '220px', padding: '0 30px 30px 30px', width: '100%', boxSizing: 'border-box' }}>
            <h1 style={{ color: '#222', fontWeight: 'bold', fontSize: '2rem', margin: '32px 0 40px 0', textAlign: 'right', direction: 'rtl' }}>لوحة التحكم</h1>
            
            {error && <ErrorMessage />}

            {/* Top Row: 3 Summary Cards */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap', marginTop: '32px' }}>
              {summaryCards.map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 220px',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: hovered === idx ? '0 4px 16px rgba(30,200,160,0.13)' : '0 2px 8px rgba(30,200,160,0.07)',
                    padding: '24px',
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    position: 'relative',
                    transform: hovered === idx ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    opacity: error ? 0.7 : 1
                  }}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(-1)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      background: card.color + '10',
                      color: card.color,
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.7rem',
                      marginLeft: '12px',
                    }}>
                      <FontAwesomeIcon icon={card.icon} />
                    </span>
                    <div>
                      <div style={{ color: '#888', fontSize: '1rem', fontWeight: 500 }}>{card.label}</div>
                      <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: card.color }}>
                        {loading ? '...' : card.value}
                      </div>
                    </div>
                  </div>
                  <div style={{ color: card.percentColor, fontSize: '0.95rem', fontWeight: 500, marginBottom: '8px' }}>{card.percent} زيادة</div>
                  <a
                    href={card.link}
                    style={{
                      color: card.color,
                      fontWeight: 500,
                      textDecoration: 'underline',
                      fontSize: '1rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.color = '#222'}
                    onMouseOut={e => e.currentTarget.style.color = card.color}
                  >
                    عرض التفاصيل
                  </a>
                </div>
              ))}
            </div>

            {/* Second Row: 2 Info Cards in a row */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', flexDirection: 'row', marginTop: '0' }}>
              {/* Latest Students */}
              <div style={{ flex: '1 1 320px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(30,200,160,0.07)', padding: '24px', minWidth: '320px' }}>
                <div style={{ color: '#222', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px', textAlign: 'right' }}>آخر الطلاب المسجلين</div>
                <div style={{ borderBottom: '1px solid #E0E0E0', marginBottom: '18px' }} />
                {loading ? (
                  <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>جاري التحميل...</div>
                ) : latestData.latest_students.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>لا يوجد طلاب مسجلين حديثاً</div>
                ) : (
                  latestData.latest_students.map((student, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        background: studentRowHover === idx ? '#F3F6F6' : 'transparent',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setStudentRowHover(idx)}
                      onMouseLeave={() => setStudentRowHover(-1)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          background: '#EAF8F4',
                          color: '#1EC8A0',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                        }}>
                          <FontAwesomeIcon icon={faUser} />
                        </span>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#222' }}>{student.fullName}</div>
                          <div style={{ color: '#888', fontSize: '0.95rem' }}>
                            {student.time ? `انضم منذ ${student.time}` : 'انضم حديثاً'}
                          </div>
                        </div>
                      </div>
                      <span style={{ background: '#EAF8F4', color: '#1EC8A0', borderRadius: '8px', padding: '4px 10px', fontSize: '0.95rem', fontWeight: 500 }}>{student.level}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Latest Courses */}
              <div style={{ flex: '1 1 320px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(30,200,160,0.07)', padding: '24px', minWidth: '320px' }}>
                <div style={{ color: '#222', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px', textAlign: 'right' }}>آخر الدورات المضافة</div>
                <div style={{ borderBottom: '1px solid #E0E0E0', marginBottom: '18px' }} />
                {loading ? (
                  <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>جاري التحميل...</div>
                ) : latestData.latest_courses.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>لا توجد دورات مضافة حديثاً</div>
                ) : (
                  latestData.latest_courses.map((course, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        background: courseRowHover === idx ? '#F3F6F6' : 'transparent',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setCourseRowHover(idx)}
                      onMouseLeave={() => setCourseRowHover(-1)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          background: '#EAF8F4',
                          color: '#F6A700',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                        }}>
                          <FontAwesomeIcon icon={faBookOpen} />
                        </span>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#222' }}>{course.title}</div>
                          <div style={{ color: '#888', fontSize: '0.95rem' }}>
                            {course.updated_at ? `تم التحديث ${new Date(course.updated_at).toLocaleDateString('ar-SA')}` : 'تمت الإضافة حديثاً'}
                          </div>
                        </div>
                      </div>
                      <button
                        style={{
                          background: '#fff',
                          border: '1px solid #1EC8A0',
                          color: '#1EC8A0',
                          borderRadius: '8px',
                          padding: '4px 14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = '#EAF8F4';
                          e.currentTarget.style.color = '#17997A';
                          e.currentTarget.style.borderColor = '#17997A';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#1EC8A0';
                          e.currentTarget.style.borderColor = '#1EC8A0';
                        }}
                      >
                        عرض
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
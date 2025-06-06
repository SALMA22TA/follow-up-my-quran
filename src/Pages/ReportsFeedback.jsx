import React from 'react';
import Navbar from '../Components/DashboardNavbar';
import AdminSidebar from '../Components/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faStar, faCommentDots, faSearch, faEye, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const topTeachers = [
  { name: 'خالد عبدالله', initial: 'خ', rating: 5.0 },
  { name: 'أحمد محمد', initial: 'أ', rating: 5.0 },
  { name: 'سمية محمد', initial: 'س', rating: 4.0 },
];

const ReportsFeedback = () => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [feedbacks, setFeedbacks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 5;

  React.useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:8000/api/v1/admin/get/feedbacks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log('Feedbacks API Response:', data);
        if (data.status === 200 && Array.isArray(data.data)) {
          setFeedbacks(data.data);
        } else {
          setError('Failed to fetch feedbacks');
        }
      } catch (err) {
        setError('An error occurred while fetching feedbacks');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
    // eslint-disable-next-line
  }, []);

  // Filtered feedbacks (by search and rating)
  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesSearch = 
      (f.students && f.students.fullname && f.students.fullname.includes(search)) ||
      (f.teacher && f.teacher.fullname && f.teacher.fullname.includes(search)) ||
      (f.feedback && f.feedback.includes(search));
    
    const matchesRating = filter === 'all' || f.rate === parseInt(filter);
    
    return matchesSearch && matchesRating;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / rowsPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Calculate dynamic summary data from feedbacks
  const ratings = feedbacks.map(f => f.rate).filter(r => typeof r === 'number');
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '-';
  const totalRatings = ratings.length;
  const satisfaction = ratings.length ? Math.round((ratings.filter(r => r >= 4).length / ratings.length) * 100) : 0;

  const summaryCards = [
    {
      label: 'متوسط التقييم',
      value: avgRating,
      desc: `مبنية على ${totalRatings} من إجمالي التقييمات`,
      icon: faStar,
      color: '#1EC8A0',
    },
    {
      label: 'إجمالي التقييمات',
      value: totalRatings,
      desc: `${totalRatings} تقييمات حتى الآن`,
      icon: faCommentDots,
      color: '#4B9EFF',
    },
    {
      label: 'نسبة الرضا',
      value: `${satisfaction}%`,
      desc: `مرتفعة لدى ${satisfaction}% من التقييمات`,
      icon: faThumbsUp,
      color: '#F6A700',
    },
  ];

  // Add dynamic ratingsDistribution calculation here
  const ratingsDistribution = [
    { stars: 5, count: feedbacks.filter(f => f.rate === 5).length, color: '#F6A700' },
    { stars: 4, count: feedbacks.filter(f => f.rate === 4).length, color: '#F6A700' },
    { stars: 3, count: feedbacks.filter(f => f.rate === 3).length, color: '#F6A700' },
    { stars: 2, count: feedbacks.filter(f => f.rate === 2).length, color: '#F6A700' },
    { stars: 1, count: feedbacks.filter(f => f.rate === 1).length, color: '#F6A700' },
  ];

  // Calculate top teachers (5 or 4 star average)
  const teacherRatingsMap = {};
  feedbacks.forEach(f => {
    if (f.teacher && f.teacher.fullname) {
      const key = f.teacher.fullname;
      if (!teacherRatingsMap[key]) {
        // Get first letter of first and last word (or first two words if only two)
        const words = f.teacher.fullname.trim().split(/\s+/);
        let initials = '';
        if (words.length === 1) {
          initials = words[0][0];
        } else if (words.length === 2) {
          initials = words[0][0] + words[1][0];
        } else {
          initials = words[0][0] + words[words.length - 1][0];
        }
        teacherRatingsMap[key] = { name: key, count: 0, sum: 0, initials };
      }
      teacherRatingsMap[key].count += 1;
      teacherRatingsMap[key].sum += f.rate;
    }
  });
  const topTeachers = Object.values(teacherRatingsMap)
    .map(t => ({ ...t, avg: t.count ? t.sum / t.count : 0 }))
    .filter(t => t.avg >= 4)
    .sort((a, b) => b.avg - a.avg || a.name.localeCompare(b.name));

  return (
    <div style={{ minHeight: '100vh', background: '#F8FCFB', width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <div style={{ maxWidth: '1310px', marginLeft: 0, marginRight: 'auto', paddingTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
          <AdminSidebar />
          <div style={{ padding: '0 30px 30px 30px', width: '100%', boxSizing: 'border-box', paddingRight: '220px' }}>
            <h1 style={{ color: '#222', fontWeight: 'bold', fontSize: '2rem', margin: '32px 0 16px 0', textAlign: 'right', direction: 'rtl' }}>التقارير والآراء</h1>
            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap', marginTop: '32px', marginLeft: '16px' }}>
              {summaryCards.map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 220px',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(30,200,160,0.07)',
                    padding: '24px',
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,200,160,0.13)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,200,160,0.07)'; }}
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
                      <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: card.color }}>{card.value}</div>
                    </div>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.95rem', fontWeight: 500, marginBottom: '8px' }}>{card.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
              {/* Table and Ratings Distribution Side by Side */}
              <div style={{ flex: 2, background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(30,200,160,0.07)', padding: '28px', minWidth: '400px', maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#222', marginBottom: '6px', textAlign: 'right' }}>قائمة التقييمات</div>
                <div style={{ color: '#888', fontSize: '1rem', marginBottom: '18px', textAlign: 'right' }}>تقييمات الطلاب للمعلمين بناءً على تجربتهم</div>
                <div style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '18px', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input
                        type="text"
                        placeholder="بحث عن طالب أو معلم..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '1px solid #E0E0E0',
                          padding: '6px 36px 6px 12px',
                          fontSize: '0.95rem',
                          width: '90%',
                          direction: 'rtl',
                        }}
                      />
                      <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1.2rem', pointerEvents: 'none' }} />
                    </div>
                    <select value={filter} onChange={e => setFilter(e.target.value)} style={{ borderRadius: '8px', border: '1px solid #E0E0E0', padding: '6px 12px', fontSize: '0.95rem', color: '#444', minWidth: '140px' }}>
                      <option value="all">جميع التقييمات</option>
                      <option value="5">5 نجوم</option>
                      <option value="4">4 نجوم</option>
                      <option value="3">3 نجوم</option>
                      <option value="2">2 نجوم</option>
                      <option value="1">1 نجمة</option>
                    </select>
                  </div>
                </div>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 10px', direction: 'rtl' }}>
                    <thead>
                      <tr style={{ background: '#F3F6F6', color: '#222', fontWeight: 'bold', fontSize: '1rem' }}>
                        <th style={{ padding: '10px', textAlign: 'right', paddingRight: '24px' }}>اسم الطالب</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>اسم المعلم</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>رأي الطالب في المعلم</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: '#888', padding: '32px', fontSize: '1.1rem' }}>
                            جاري التحميل...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: '#D32F2F', padding: '32px', fontSize: '1.1rem' }}>
                            {error}
                          </td>
                        </tr>
                      ) : paginatedFeedbacks.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: '#888', padding: '32px', fontSize: '1.1rem' }}>
                            لا يوجد  تقييمات تناسب معايير البحث
                          </td>
                        </tr>
                      ) : (
                        paginatedFeedbacks.map((feedback, idx) => (
                          <tr
                            key={feedback.id}
                            style={{
                              borderBottom: '1px solid #F3F6F6',
                              background: idx % 2 === 0 ? '#F8FCFB' : '#fff',
                              transition: 'background 0.2s',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#EAF8F4'}
                            onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#F8FCFB' : '#fff'}
                          >
                            {/* Student Name + Initial */}
                            <td style={{ padding: '12px 8px', textAlign: 'right', paddingRight: '24px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ background: '#EAF8F4', color: '#4B9EFF', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', marginRight: 8 }}>{feedback.students && feedback.students.fullname ? feedback.students.fullname[0] : '-'}</span>
                                <span style={{ color: '#222', fontWeight: 500 }}>{feedback.students && feedback.students.fullname ? feedback.students.fullname : '-'}</span>
                              </span>
                            </td>
                            {/* Teacher Name + Initial */}
                            <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ background: '#EAF8F4', color: '#1EC8A0', borderRadius: '50%', width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>{feedback.teacher && feedback.teacher.fullname ? feedback.teacher.fullname[0] : '-'}</span>
                                <span style={{ color: '#222', fontWeight: 500 }}>{feedback.teacher && feedback.teacher.fullname ? feedback.teacher.fullname : '-'}</span>
                              </span>
                            </td>
                            {/* Feedback + Rating */}
                            <td style={{ padding: '12px 8px', textAlign: 'right', color: '#666', fontSize: '0.97rem', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                              <div style={{ color: '#F6A700', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>
                                {feedback.rate ? (
                                  <span>{'★'.repeat(feedback.rate)}{'☆'.repeat(5 - feedback.rate)}</span>
                                ) : (
                                  <span style={{ color: '#888' }}>-</span>
                                )}
                              </div>
                              {feedback.feedback || '-'}
                            </td>
                            {/* Date */}
                            <td style={{ padding: '12px 8px', textAlign: 'right', color: '#888', fontSize: '0.98rem' }}>{feedback.created_at ? new Date(feedback.created_at).toLocaleDateString('ar-EG') : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', color: '#888', fontSize: '1rem', borderTop: '1px solid #F3F6F6', background: '#FAFAFA', borderRadius: '0 0 16px 16px', marginTop: '18px' }}>
                  <div>عرض {filteredFeedbacks.length === 0 ? 0 : ((currentPage - 1) * rowsPerPage + 1)}-{Math.min(currentPage * rowsPerPage, filteredFeedbacks.length)} من {filteredFeedbacks.length} ملاحظة</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{ background: '#fff', border: '1px solid #E0E0E0', color: currentPage === 1 ? '#ccc' : '#888', borderRadius: '8px', padding: '4px 18px', fontWeight: 500, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                      disabled={currentPage === 1}
                      onClick={handlePrevPage}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                      السابق
                    </button>
                    <button
                      style={{ background: '#fff', border: '1px solid #E0E0E0', color: currentPage === totalPages || totalPages === 0 ? '#ccc' : '#888', borderRadius: '8px', padding: '4px 18px', fontWeight: 500, cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={handleNextPage}
                    >
                      التالي
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Ratings Distribution Card */}
              <div style={{ flex: '1 1 260px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(30,200,160,0.07)', padding: '24px', minWidth: '260px', maxWidth: '320px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#222', marginBottom: '18px', textAlign: 'right' }}>توزيع التقييمات</div>
                {ratingsDistribution.map((rating, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ color: rating.color, fontWeight: 'bold', fontSize: '1.1rem', marginLeft: 8 }}>
                      {rating.stars} <FontAwesomeIcon icon={faStar} style={{ color: '#F6A700' }} />
                    </div>
                    <div style={{ flex: 1, height: '8px', background: '#F3F6F6', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(rating.count / totalRatings) * 100}%`, height: '100%', background: '#1EC8A0' }} />
                    </div>
                    <div style={{ color: '#888', fontSize: '0.9rem', marginRight: 8 }}>
                      {rating.count}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '20px', borderTop: '1px solid #E0E0E0', paddingTop: '10px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#222', marginBottom: '10px', textAlign: 'right' }}>أفضل المعلمين تقييمًا</div>
                  {topTeachers.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8, direction: 'rtl', justifyContent: 'space-between' }}>
                      <span style={{ background: '#EAF8F4', color: '#1EC8A0', borderRadius: '50%', width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.0rem' }}>{t.initials}</span>
                      <span style={{ color: '#222', fontWeight: 500, flex: 1, textAlign: 'right', marginRight: 6 }}>{t.name}</span>
                      <span style={{ color: '#F6A700', fontWeight: 'bold', fontSize: '1.1rem', minWidth: 38, display: 'flex', alignItems: 'center', gap: 2, marginLeft: 6, justifyContent: 'flex-end' }}>
                        {t.avg.toFixed(1)}
                        <FontAwesomeIcon icon={faStar} style={{ fontSize: '1rem', color: '#F6A700' }} />
                      </span>         
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsFeedback; 
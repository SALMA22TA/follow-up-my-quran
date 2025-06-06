import React, { useState, useEffect } from 'react';
import Navbar from '../Components/DashboardNavbar';
import AdminSidebar from '../Components/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCalendarAlt, faClipboardList, faEdit, faTrash, faEye, faSearch, faClock, faChevronLeft, faChevronRight, faFileAlt, faCheck, faTimes, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { Trash2, X } from 'lucide-react';

const summaryCards = [
  {
    label: 'الاختبارات النشطة',
    value: 2,
    icon: faCheckCircle,
    color: '#1EC8A0',
    desc: 'زيادة 10% عن الشهر الماضي',
  },
  {
    label: 'الاختبارات القادمة',
    value: 2,
    icon: faCalendarAlt,
    color: '#4B9EFF',
    desc: 'أقرب اختبار بعد 3 أيام',
  },
  {
    label: 'متوسط الدرجات',
    value: '85%',
    icon: faClipboardList,
    color: '#F6A700',
    desc: 'تحسن بنسبة 10% عن الفترة السابقة',
  },
];

const tabList = [
  { label: 'جميع الاختبارات', value: 'all' },
  { label: 'نشط', value: 'active' },
  { label: 'قادم', value: 'upcoming' },
  { label: 'مكتمل', value: 'completed' },
];

const SuperviseExams = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  const [search, setSearch] = useState('');
  const [rowHover, setRowHover] = useState(-1);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = React.useState(-1);
  const [hoveredIcon, setHoveredIcon] = React.useState({ row: -1, icon: '' });
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = React.useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = React.useState(false);
  const [selectedExam, setSelectedExam] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({
    title: '',
    teacher: '',
    date: '',
    duration: '',
    questions: 0,
    branch: '',
    status: ''
  });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/v1/admin/get/exams', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log('Raw API Response:', response);
        console.log('Parsed API Data:', data);
        if (data.status === 200 && Array.isArray(data.data)) {
          console.log('Exams Data:', data.data);
          setExams(data.data);
        } else {
          console.error('API Error:', data);
          setError('Failed to fetch exams');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('An error occurred while fetching exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Filter and search logic
  const filteredExams = exams.filter(exam =>
    exam.title.includes(search) || (exam.teacher && exam.teacher.fullName && exam.teacher.fullName.includes(search))
  );

  // Handle delete modal
  const openDeleteModal = (exam) => {
    setSelectedExam(exam);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedExam(null);
  };

  const handleDeleteExam = () => {
    // Here you would typically make an API call to delete the exam
    console.log('Deleting exam:', selectedExam.title);
    // After successful deletion, you would update the state
    closeDeleteModal();
    // Show success modal
    setShowDeleteSuccessModal(true);
    // Auto close success modal after 2 seconds
    setTimeout(() => {
      setShowDeleteSuccessModal(false);
    }, 2000);
  };

  // Handle edit modal
  const openEditModal = (exam) => {
    setSelectedExam(exam);
    setEditFormData({
      title: exam.title,
      teacher: exam.teacher,
      date: exam.date,
      duration: exam.duration,
      questions: exam.questions,
      branch: exam.branch,
      status: exam.status
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedExam(null);
    setEditFormData({
      title: '',
      teacher: '',
      date: '',
      duration: '',
      questions: 0,
      branch: '',
      status: ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditExam = () => {
    // Here you would typically make an API call to update the exam
    console.log('Updating exam:', selectedExam.title, editFormData);
    // After successful update, you would update the state
    closeEditModal();
    // Show success modal
    setShowEditSuccessModal(true);
    // Auto close success modal after 2 seconds
    setTimeout(() => {
      setShowEditSuccessModal(false);
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FCFB', width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <div style={{ maxWidth: '1600px', margin: '0 auto', paddingTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
          <AdminSidebar />
          <div style={{ marginRight: '220px', padding: '0 30px 30px 30px', width: '100%', boxSizing: 'border-box' }}>
            <h1 style={{ color: '#222', fontWeight: 'bold', fontSize: '2rem', margin: '32px 0 8px 0', textAlign: 'right', direction: 'rtl' }}>الإشراف على الاختبارات</h1>
            <div style={{ color: '#888', fontSize: '1rem', marginBottom: '24px', textAlign: 'right' }}>
              يمكنك الإطلاع على جميع الاختبارات المرفوعة وإدارتها
            </div>
            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap', marginTop: '32px', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
              {summaryCards.map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 220px',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: hoveredCard === idx ? '0 4px 16px rgba(30,200,160,0.13)' : '0 2px 8px rgba(30,200,160,0.07)',
                    padding: '24px',
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    position: 'relative',
                    transform: hoveredCard === idx ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(-1)}
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
            {/* Search and Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '18px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  placeholder=" البحث عن اختبار أو معلم..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 12px',
                    borderRadius: '10px',
                    border: '1px solid #E0E0E0',
                    fontSize: '1rem',
                    marginBottom: '0',
                    direction: 'rtl',
                    boxSizing: 'border-box',
                    position: 'relative'
                  }}
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1.5rem', pointerEvents: 'none' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '0', marginBottom: '0', flexWrap: 'nowrap', width: '100%', marginTop: '8px', marginBottom: '8px' }}>
                {tabList.map((tab, i) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    style={{
                      background: activeTab === tab.value ? '#1EC8A0' : '#F3F6F6',
                      color: activeTab === tab.value ? '#fff' : '#222',
                      border: 'none',
                      borderRadius: '10px',
                      marginLeft: i !== tabList.length - 1 ? '8px' : 0,
                      marginRight: i !== 0 ? '8px' : 0,
                      padding: '10px 0',
                      fontWeight: 500,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s, color 0.2s',
                      flex: 1,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(30,200,160,0.07)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl' }}>
                <thead>
                  <tr style={{ background: '#F8FCFB', color: '#888', fontWeight: 500, fontSize: '1rem' }}>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>عنوان الاختبار</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>اسم المعلم</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>تاريخ الإضافة</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>عدد الأسئلة</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>النوع</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: '32px 0', fontSize: '1.1rem' }}>
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#D32F2F', padding: '32px 0', fontSize: '1.1rem' }}>
                        {error}
                      </td>
                    </tr>
                  ) : filteredExams.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: '32px 0', fontSize: '1.1rem' }}>
                        لا يوجد اختبارات تناسب معايير البحث
                      </td>
                    </tr>
                  ) : (
                    filteredExams.map((exam, idx) => (
                      <tr
                        key={exam.id}
                        style={{
                          borderBottom: '1px solid #F3F6F6',
                          background: rowHover === idx ? '#F3F6F6' : idx % 2 === 0 ? '#F8FCFB' : '#fff',
                          transition: 'background 0.2s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={() => setRowHover(idx)}
                        onMouseLeave={() => setRowHover(-1)}
                      >
                        {/* Exam Title with Book Icon */}
                        <td style={{ padding: '12px 8px', textAlign: 'right', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ background: '#EAF8F4', color: '#F6A700', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', marginLeft: 4 }}>
                              <FontAwesomeIcon icon={faBookOpen} />
                            </span>
                            <span style={{ color: '#222', fontWeight: 500, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exam.title || '-'}</span>
                          </div>
                        </td>
                        {/* Teacher Name with Initial */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                            {exam.teacher && exam.teacher.fullName ? (
                              <>
                                <span style={{ background: '#EAF8F4', color: '#1EC8A0', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', marginLeft: 4 }}>
                                  {exam.teacher.fullName[0]}
                                </span>
                                <span style={{ color: '#222', fontWeight: 500, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exam.teacher.fullName}</span>
                              </>
                            ) : <span>-</span>}
                          </div>
                        </td>
                        {/* Date with Calendar Icon */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                            <span style={{ background: '#F5F7FB', color: '#4B9EFF', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.95rem', marginLeft: 2 }}>
                              <FontAwesomeIcon icon={faCalendarAlt} />
                            </span>
                            <span style={{ color: '#444', fontWeight: 500, fontSize: '0.97rem', whiteSpace: 'nowrap' }}>{exam.created_at ? new Date(exam.created_at).toLocaleDateString('ar-EG') : '-'}</span>
                          </div>
                        </td>
                        {/* Questions Count */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#444', fontWeight: 500, verticalAlign: 'middle' }}>
                          {typeof exam.questions_count === 'number' ? exam.questions_count : '-'}
                        </td>
                        {/* Type (static 'اختر من المتعدد') */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#222', fontWeight: 500, verticalAlign: 'middle' }}>
                          اختر من المتعدد
                        </td>
                      </tr>
                    ))
                  )}
                </tbody> 
              </table>
              {/* Pagination summary row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', color: '#888', fontSize: '1rem', borderTop: '1px solid #F3F6F6', background: '#FAFAFA', borderRadius: '0 0 16px 16px' }}>
                <div>عرض 1-{filteredExams.length} من {filteredExams.length} اختبارات</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ background: '#fff', border: '1px solid #E0E0E0', color: '#888', borderRadius: '8px', padding: '4px 18px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} disabled>
                    <FontAwesomeIcon icon={faChevronRight} />
                    السابق
                  </button>
                  <button style={{ background: '#fff', border: '1px solid #E0E0E0', color: '#888', borderRadius: '8px', padding: '4px 18px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} disabled>
                    التالي
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          direction: 'rtl'
        }} className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') closeDeleteModal();
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            minWidth: '340px',
            boxShadow: '0 8px 32px rgba(30,200,160,0.13)',
            position: 'relative'
          }}>
            <button onClick={closeDeleteModal} style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'none',
              border: 'none',
              fontSize: '1.3rem',
              color: '#888',
              cursor: 'pointer'
            }}>
              <X size={20} />
            </button>
            
            <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#222', fontSize: '1.3rem' }}>حذف الاختبار</h2>
            <p style={{ textAlign: 'center', marginBottom: '24px', color: '#666', fontSize: '0.95rem' }}>هل أنت متأكد من رغبتك في حذف هذا الاختبار؟</p>
            
            {selectedExam && (
              <div style={{ 
                background: '#F8FCFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #E0F2EE'
              }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px', color: '#222' }}>{selectedExam.title}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>المعلم: {selectedExam.teacher}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>تاريخ الاختبار: {selectedExam.date}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>عدد الأسئلة: {selectedExam.questions}</p>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={closeDeleteModal}
                style={{
                  padding: '8px 24px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  background: '#fff',
                  color: '#666',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteExam}
                style={{
                  padding: '8px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#F44336',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          direction: 'rtl'
        }} className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') closeEditModal();
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            width: '400px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            boxShadow: '0 8px 32px rgba(30,200,160,0.13)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{ 
              padding: '16px 20px 0 20px',
              borderBottom: 'none',
              position: 'relative',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              background: '#fff'
            }}>
              <button onClick={closeEditModal} style={{
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '4px',
                position: 'absolute',
                left: 10,
                top: 10
              }}>
                <X size={20} />
              </button>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h2 style={{ margin: 0, color: '#222', fontSize: '1.3rem', fontWeight: 'bold' }}>تعديل الاختبار</h2>
                <p style={{ color: '#666', fontSize: '0.95rem', margin: '8px 0 0 0' }}>قم بتعديل بيانات الاختبار</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ 
              padding: '0 20px 16px 20px',
              overflowY: 'auto',
              flex: 1
            }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>عنوان الاختبار</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E0E0E0',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>المعلم</label>
                <input
                  type="text"
                  name="teacher"
                  value={editFormData.teacher}
                  onChange={handleEditFormChange}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E0E0E0',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>تاريخ الاختبار</label>
                <input
                  type="text"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditFormChange}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E0E0E0',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>المدة</label>
                <input
                  type="text"
                  name="duration"
                  value={editFormData.duration}
                  onChange={handleEditFormChange}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E0E0E0',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>عدد الأسئلة</label>
                <input
                  type="number"
                  name="questions"
                  value={editFormData.questions}
                  onChange={handleEditFormChange}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E0E0E0',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>النوع</label>
                <select
                  name="branch"
                  value={editFormData.branch}
                  onChange={handleEditFormChange}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E0E0E0',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="تحريري">تحريري</option>
                  <option value="شفهي">شفهي</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>الحالة</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #E0E0E0',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="نشط">نشط</option>
                  <option value="قادم">قادم</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              padding: '12px 20px',
              borderTop: '1px solid #E0E0E0',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              background: '#fff',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px'
            }}>
              <button
                onClick={closeEditModal}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  background: '#fff',
                  color: '#666',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                إلغاء
              </button>
              <button
                onClick={handleEditExam}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#1EC8A0',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          direction: 'rtl'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            width: '320px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(30,200,160,0.13)',
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: '#F0FDF9', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <FontAwesomeIcon icon={faCheck} style={{ color: '#1EC8A0', fontSize: '28px' }} />
            </div>
            <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: '8px' }}>تم الحذف بنجاح</h2>
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم حذف الاختبار بنجاح من النظام</p>
          </div>
        </div>
      )}

      {/* Edit Success Modal */}
      {showEditSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          direction: 'rtl'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            width: '320px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(30,200,160,0.13)',
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: '#F0FDF9', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <FontAwesomeIcon icon={faCheck} style={{ color: '#1EC8A0', fontSize: '28px' }} />
            </div>
            <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: '8px' }}>تم التعديل بنجاح</h2>
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم تحديث بيانات الاختبار بنجاح</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperviseExams; 
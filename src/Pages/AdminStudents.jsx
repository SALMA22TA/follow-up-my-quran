import React, { useState, useEffect } from 'react';
import Navbar from '../Components/DashboardNavbar';
import AdminSidebar from '../Components/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBookOpen, faGraduationCap, faStar, faEdit, faTrash, faBell, faSearch, faChevronLeft, faChevronRight, faChevronUp, faClock, faBook } from '@fortawesome/free-solid-svg-icons';
import { Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const studentsData = [
  {
    id: 1,
    name: 'محمد أحمد',
    email: 'mohammed.ahmed@example.com',
    initial: 'مأ',
    level: 'متقدم',
    registeredCourses: 3,
    lastActivity: 'منذ يومين',
    progress: 85,
  },
  {
    id: 2,
    name: 'سارة علي',
    email: 'sara.ali@example.com',
    initial: 'سع',
    level: 'متوسط',
    registeredCourses: 2,
    lastActivity: 'منذ 5 أيام',
    progress: 65,
  },
  {
    id: 3,
    name: 'أحمد خالد',
    email: 'ahmed.khalid@example.com',
    initial: 'أخ',
    level: 'مبتدئ',
    registeredCourses: 1,
    lastActivity: 'منذ أسبوع',
    progress: 30,
  },
  {
    id: 4,
    name: 'نورا محمد',
    email: 'noura.mohamed@example.com',
    initial: 'نم',
    level: 'متقدم',
    registeredCourses: 4,
    lastActivity: 'اليوم',
    progress: 92,
  },
  {
    id: 5,
    name: 'عبدالله سعيد',
    email: 'abdullah.saeed@example.com',
    initial: 'عس',
    level: 'متوسط',
    registeredCourses: 2,
    lastActivity: 'أمس',
    progress: 70,
  },
];

const summary = {
  totalStudents: 5,
  activeStudents: 3,
  registeredCourses: 12,
  completedCourses: 7,
  avgProgress: 68,
};

const cardHoverStyle = {
  transform: 'translateY(-2px) scale(1.03)',
  boxShadow: '0 4px 16px rgba(30,200,160,0.13)',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const levels = ['جميع المستويات', 'متقدم', 'متوسط', 'مبتدئ'];

const AdminStudents = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [levelFilter, setLevelFilter] = useState('جميع المستويات');
  const [cardHover, setCardHover] = useState(-1);
  const [rowHover, setRowHover] = useState(-1);
  const [iconHover, setIconHover] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showNotifySuccessModal, setShowNotifySuccessModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
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
        
        const response = await axios.get('http://localhost:8000/api/v1/admin/get/students', config);
        console.log('Students Response:', response.data);
        
        if (response.data && response.data.data) {
          setStudents(response.data.data.students);
          setPagination(response.data.data.pagination);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        if (error.message === 'No access token found') {
          setError('يرجى تسجيل الدخول للوصول إلى قائمة الطلاب');
        } else {
          setError('حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesTab = tab === 'all' || (tab === 'active' && student.is_verified === 1) || (tab === 'inactive' && student.is_verified !== 1);
    const matchesSearch = student.fullName.toLowerCase().includes(search.toLowerCase()) || 
                         student.email.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'جميع المستويات' || student.level === levelFilter;
    return matchesTab && matchesSearch && matchesLevel;
  });

  // Calculate summary data from students array
  const summary = {
    totalStudents: students.length,
    activeStudents: students.filter(student => student.is_verified === 1).length,
    registeredCourses: 0,
    completedCourses: 0
  };

  // Modals logic
  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };
  const handleDeleteStudent = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.delete(
        `http://localhost:8000/api/v1/admin/delete/${selectedStudent.id}`,
        config
      );

      if (response.data && response.data.status === 200) {
        // Remove the deleted student from the list
        setStudents(prevStudents => 
          prevStudents.filter(student => student.id !== selectedStudent.id)
        );
        closeDeleteModal();
        setShowDeleteSuccessModal(true);
        setTimeout(() => setShowDeleteSuccessModal(false), 2000);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      // You might want to show an error message to the user here
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      name: student.fullName,
      email: student.email,
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedStudent(null);
    setEditFormData({
      name: '',
      email: '',
    });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditStudent = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.patch(
        `http://localhost:8000/api/v1/admin/update/${selectedStudent.id}`,
        {
          fullName: editFormData.name,
          email: editFormData.email
        },
        config
      );

      if (response.data && response.data.data) {
        // Update the students list with the new data
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student.id === selectedStudent.id ? response.data.data : student
          )
        );
        closeEditModal();
        setShowEditSuccessModal(true);
        setTimeout(() => setShowEditSuccessModal(false), 2000);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      // You might want to show an error message to the user here
    }
  };

  const openNotifyModal = (student) => {
    setSelectedStudent(student);
    setShowNotifyModal(true);
  };
  const closeNotifyModal = () => {
    setShowNotifyModal(false);
    setSelectedStudent(null);
  };
  const handleNotifyStudent = () => {
    closeNotifyModal();
    setShowNotifySuccessModal(true);
    setTimeout(() => setShowNotifySuccessModal(false), 2000);
    navigate(`/admin/student-notification/${selectedStudent.id}`);
  };

  // Cards order: الدورات المكتملة, الطلاب النشطين, الدورات المسجلة, إجمالي الطلاب
  const cards = [
    {
      bg: '#FFF8E6', iconBg: '#FFF3CD', iconColor: '#F6A700', color: '#A67C00', label: 'الدورات المكتملة', value: summary.completedCourses, icon: faStar
    },
    {
      bg: '#F5F7FB', iconBg: '#E3E8F9', iconColor: '#1A237E', color: '#1A237E', label: 'الطلاب النشطين', value: summary.activeStudents, icon: faGraduationCap
    },
    {
      bg: '#F6F3FF', iconBg: '#E9E3F7', iconColor: '#A259FF', color: '#A259FF', label: 'الدورات المسجلة', value: summary.registeredCourses, icon: faBookOpen
    },
    {
      bg: '#F3FDF9', iconBg: '#E0F2EE', iconColor: '#1EC8A0', color: '#1EC8A0', label: 'إجمالي الطلاب', value: summary.totalStudents, icon: faUsers
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FCFB', width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <div style={{ maxWidth: '1600px', margin: '0 auto', paddingTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
          <AdminSidebar />
          <div style={{ marginRight: '220px', padding: '0 30px 30px 30px', width: '100%', boxSizing: 'border-box' }}>
            {/* Page title at the top */}
            <h1 style={{ color: '#222', fontWeight: 'bold', fontSize: '2rem', margin: '32px 0 8px 0', textAlign: 'right', direction: 'rtl' }}>الطلاب</h1>
            {/* Summary Cards - moved directly under the title */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '24px', 
              flexWrap: 'wrap', 
              flexDirection: 'row-reverse',
              justifyContent: 'flex-end',
              marginRight: '0',
              marginTop: '0'
            }}>
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 200px',
                    minWidth: '200px',
                    maxWidth: 'calc(25% - 9px)',
                    background: card.bg,
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 2px 8px rgba(30,200,160,0.07)',
                    ...(cardHover === idx ? cardHoverStyle : { transition: 'all 0.2s' })
                  }}
                  onMouseEnter={() => setCardHover(idx)}
                  onMouseLeave={() => setCardHover(-1)}
                >
                  <span style={{
                    background: card.iconBg,
                    color: card.iconColor,
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={card.icon} />
                  </span>
                  <div style={{ textAlign: 'right', minWidth: 0 }}>
                    <div style={{ color: card.color, fontWeight: 500, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.label}</div>
                    <div style={{ color: card.iconColor, fontWeight: 'bold', fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Section title and subtitle under cards */}
            <h2 style={{ color: '#222', fontWeight: 'bold', fontSize: '1.5rem', margin: '0 0 8px 0', textAlign: 'right', direction: 'rtl' }}>قائمة الطلاب</h2>
            <div style={{ color: '#888', fontSize: '1rem', marginBottom: '24px', textAlign: 'right' }}>
              إدارة الطلاب والتواصل معهم
            </div>
            {/* Controls: search and filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '340px' }}>
                <input
                  type="text"
                  placeholder="ابحث عن طالب..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '94.5%', minWidth: '340px', padding: '8px 40px 8px 16px', borderRadius: '8px', border: '1px solid #E0E0E0', background: '#fff', color: '#444', fontSize: '1rem', textAlign: 'right' }}
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1rem', pointerEvents: 'none' }} 
                />
              </div>
              <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E0E0E0', background: '#fff', color: '#444', fontSize: '1rem', minWidth: '140px' }}>
                {levels.map(lvl => <option key={lvl}>{lvl}</option>)}
              </select>
            </div>
            {/* Tabs - full width of table */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E0E0E0', width: '100%', background: '#F8FCFB', maxWidth: '100%' }}>
              <button onClick={() => setTab('all')} style={{ flex: 1, padding: '10px 32px', background: tab === 'all' ? '#EAF8F4' : 'transparent', color: tab === 'all' ? '#1EC8A0' : '#888', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>جميع الطلاب</button>
              <button onClick={() => setTab('active')} style={{ flex: 1, padding: '10px 32px', background: tab === 'active' ? '#EAF8F4' : 'transparent', color: tab === 'active' ? '#1EC8A0' : '#888', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>نشط</button>
              <button onClick={() => setTab('inactive')} style={{ flex: 1, padding: '10px 32px', background: tab === 'inactive' ? '#EAF8F4' : 'transparent', color: tab === 'inactive' ? '#1EC8A0' : '#888', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>غير نشط</button>
            </div>
            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(30,200,160,0.07)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl' }}>
                <thead>
                  <tr style={{ background: '#F8FCFB', color: '#888', fontWeight: 500, fontSize: '1rem' }}>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>اسم الطالب</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={2} style={{ textAlign: 'center', color: '#888', padding: '32px 0', fontSize: '1.1rem' }}>
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ textAlign: 'center', color: '#888', padding: '32px 0', fontSize: '1.1rem' }}>
                        لا يوجد طالب يناسب معايير البحث
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => (
                      <tr
                        key={student.id}
                        style={{
                          borderBottom: '1px solid #F3F6F6',
                          background: rowHover === idx ? '#F3F6F6' : idx % 2 === 0 ? '#F8FCFB' : '#fff',
                          transition: 'background 0.2s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={() => setRowHover(idx)}
                        onMouseLeave={() => setRowHover(-1)}
                      >
                        {/* Student Name */}
                        <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ background: '#EAF8F4', color: '#1EC8A0', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                            {student.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#222', fontWeight: 'bold', fontSize: '1.05rem' }}>{student.fullName}</div>
                            <div style={{ color: '#888', fontSize: '0.97rem', marginTop: 2 }}>{student.email}</div>
                          </div>
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: iconHover[idx + '-edit'] ? '#17997A' : '#1EC8A0',
                              cursor: 'pointer',
                              marginLeft: 6,
                              fontSize: '1.1rem',
                              transition: 'color 0.2s',
                            }}
                            title="تعديل"
                            onMouseEnter={() => setIconHover({ ...iconHover, [idx + '-edit']: true })}
                            onMouseLeave={() => setIconHover({ ...iconHover, [idx + '-edit']: false })}
                            onClick={() => openEditModal(student)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: iconHover[idx + '-delete'] ? '#c62828' : '#F44336',
                              cursor: 'pointer',
                              marginLeft: 6,
                              fontSize: '1.1rem',
                              transition: 'color 0.2s',
                            }}
                            title="حذف"
                            onMouseEnter={() => setIconHover({ ...iconHover, [idx + '-delete']: true })}
                            onMouseLeave={() => setIconHover({ ...iconHover, [idx + '-delete']: false })}
                            onClick={() => openDeleteModal(student)}
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: iconHover[idx + '-bell'] ? '#1565c0' : '#4B9EFF',
                              cursor: 'pointer',
                              fontSize: '1.1rem',
                              transition: 'color 0.2s',
                              marginLeft: 6
                            }}
                            title="إخطار"
                            onMouseEnter={() => setIconHover({ ...iconHover, [idx + '-bell']: true })}
                            onMouseLeave={() => setIconHover({ ...iconHover, [idx + '-bell']: false })}
                            onClick={() => navigate(`/admin/student-notification/${student.id}`)}
                          >
                            <FontAwesomeIcon icon={faBell} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination summary row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', color: '#888', fontSize: '1rem', borderTop: '1px solid #F3F6F6', background: '#FAFAFA', borderRadius: '0 0 16px 16px' }}>
                <div>عرض {((pagination.current_page - 1) * pagination.per_page) + 1}-{Math.min(pagination.current_page * pagination.per_page, pagination.total)} من {pagination.total} طالب</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    style={{ 
                      background: '#fff', 
                      border: '1px solid #E0E0E0', 
                      color: pagination.current_page === 1 ? '#ccc' : '#888', 
                      borderRadius: '8px', 
                      padding: '4px 18px', 
                      fontWeight: 500, 
                      cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      transition: 'all 0.2s' 
                    }}
                    disabled={pagination.current_page === 1}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                    السابق
                  </button>
                  <button 
                    style={{ 
                      background: '#fff', 
                      border: '1px solid #E0E0E0', 
                      color: pagination.current_page === pagination.last_page ? '#ccc' : '#888', 
                      borderRadius: '8px', 
                      padding: '4px 18px', 
                      fontWeight: 500, 
                      cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      transition: 'all 0.2s' 
                    }}
                    disabled={pagination.current_page === pagination.last_page}
                  >
                    التالي
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
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
                  <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#222', fontSize: '1.3rem' }}>حذف الطالب</h2>
                  <p style={{ textAlign: 'center', marginBottom: '24px', color: '#666', fontSize: '0.95rem' }}>هل أنت متأكد من رغبتك في حذف هذا الطالب؟</p>
                  {selectedStudent && (
                    <div style={{
                      background: '#F8FCFB',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '24px',
                      border: '1px solid #E0F2EE'
                    }}>
                      <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px', color: '#222' }}>{selectedStudent.fullName}</p>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>البريد الإلكتروني: {selectedStudent.email}</p>
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
                      onClick={handleDeleteStudent}
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
                direction: 'rtl',
              }} className="modal-overlay" onClick={(e) => {
                if (e.target.className === 'modal-overlay') closeEditModal();
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  width: '340px',
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  boxShadow: '0 8px 32px rgba(30,200,160,0.13)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* Header */}
                  <div style={{
                    padding: '16px 20px 0 20px',
                    borderBottom: 'none',
                    position: 'relative',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    background: '#fff',
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
                      <h2 style={{ margin: 0, color: '#222', fontSize: '1.3rem', fontWeight: 'bold' }}>تعديل بيانات الطالب</h2>
                      <p style={{ color: '#666', fontSize: '0.95rem', margin: '8px 0 0 0' }}>قم بتعديل بيانات الطالب</p>
                    </div>
                  </div>
                  {/* Scrollable Content */}
                  <div style={{ padding: '0 20px 16px 20px', overflowY: 'auto', flex: 1 }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>اسم الطالب</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #E0E0E0', fontSize: '0.9rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>البريد الإلكتروني</label>
                      <input
                        type="text"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #E0E0E0', fontSize: '0.9rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  {/* Footer */}
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #E0E0E0', display: 'flex', justifyContent: 'center', gap: '8px', background: '#fff', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                    <button
                      onClick={closeEditModal}
                      style={{ padding: '6px 16px', borderRadius: '8px', border: '1px solid #E0E0E0', background: '#fff', color: '#666', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleEditStudent}
                      style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: '#1EC8A0', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      حفظ التغييرات
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Notify Modal */}
            {showNotifyModal && (
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
                direction: 'rtl',
              }} className="modal-overlay" onClick={(e) => {
                if (e.target.className === 'modal-overlay') closeNotifyModal();
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  minWidth: '340px',
                  boxShadow: '0 8px 32px rgba(30,200,160,0.13)',
                  position: 'relative'
                }}>
                  <button onClick={closeNotifyModal} style={{
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
                  <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#222', fontSize: '1.3rem' }}>إرسال إشعار</h2>
                  <p style={{ textAlign: 'center', marginBottom: '24px', color: '#666', fontSize: '0.95rem' }}>هل أنت متأكد أنك تريد إرسال إشعار إلى الطالب <span style={{ color: '#17997A', fontWeight: 'bold' }}>{selectedStudent?.fullName}</span>؟</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                      onClick={closeNotifyModal}
                      style={{ padding: '8px 24px', borderRadius: '8px', border: '1px solid #E0E0E0', background: '#fff', color: '#666', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleNotifyStudent}
                      style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', background: '#1EC8A0', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      تأكيد
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
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F0FDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <Trash2 size={28} style={{ color: '#F44336' }} />
                  </div>
                  <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: '8px' }}>تم الحذف بنجاح</h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم حذف الطالب بنجاح من النظام</p>
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
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F0FDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <FontAwesomeIcon icon={faEdit} style={{ color: '#1EC8A0', fontSize: '28px' }} />
                  </div>
                  <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: '8px' }}>تم التعديل بنجاح</h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم تحديث بيانات الطالب بنجاح</p>
                </div>
              </div>
            )}
            {/* Notify Success Modal */}
            {showNotifySuccessModal && (
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
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F0FDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <FontAwesomeIcon icon={faBell} style={{ color: '#1EC8A0', fontSize: '28px' }} />
                  </div>
                  <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: '8px' }}>تم إرسال الإشعار</h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم إرسال الإشعار بنجاح إلى الطالب <span style={{ color: '#17997A', fontWeight: 'bold' }}>{selectedStudent?.fullName}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents; 
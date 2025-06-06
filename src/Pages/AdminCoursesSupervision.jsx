import React, { useState, useEffect } from 'react';
import Navbar from '../Components/DashboardNavbar';
import AdminSidebar from '../Components/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUser, faUsers, faEdit, faEye, faChevronLeft, faChevronRight, faTimes, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Trash2, X } from 'lucide-react';

const AdminCoursesSupervision = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('جميع الحالات');
  const [rowHover, setRowHover] = useState(-1);
  const [iconHover, setIconHover] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    teacher: '',
    students: 0,
    status: ''
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/v1/admin/get/courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.status === 200 && data.data && data.data.courses) {
          setCourses(data.data.courses);
          setPagination(data.data.pagination);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (err) {
        setError('An error occurred while fetching courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter and search logic
  const filteredCourses = courses.filter(course => {
    const matchesStatus = filter === 'جميع الحالات' || course.status === filter;
    const matchesSearch =
      course.title.includes(search) ||
      course.teacher.includes(search);
    return matchesStatus && matchesSearch;
  });

  // Handle delete modal
  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleDeleteCourse = () => {
    // Here you would typically make an API call to delete the course
    console.log('Deleting course:', selectedCourse.id);
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
  const openEditModal = (course) => {
    setSelectedCourse(course);
    setEditFormData({
      name: course.name,
      teacher: course.teacher,
      students: course.students,
      status: course.status
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCourse(null);
    setEditFormData({
      name: '',
      teacher: '',
      students: 0,
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

  const handleEditCourse = () => {
    // Here you would typically make an API call to update the course
    console.log('Updating course:', selectedCourse.id, editFormData);
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
    <div style={{ minHeight: '100vh', background: '#F8FCFB', width: '100vw', overflowX: 'hidden' }}>
      <Navbar />
      <div style={{ maxWidth: '1600px', margin: '0 auto', paddingTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
          <AdminSidebar />
          <div style={{ marginRight: '220px', padding: '0 30px 30px 30px', width: '100%', boxSizing: 'border-box' }}>
            <h1 style={{ color: '#222', fontWeight: 'bold', fontSize: '2rem', margin: '32px 0 8px 0', textAlign: 'right', direction: 'rtl' }}>الإشراف على الدورات</h1>
            <div style={{ color: '#888', fontSize: '1rem', marginBottom: '24px', textAlign: 'right' }}>
              يمكنك الإطلاع على جميع الدورات المرفوعة وإدارتها
            </div>
            {/* Controls: search then filter, search full width */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', justifyContent: 'flex-end', position: 'relative' }}>
              <input
                type="text"
                placeholder="ابحث عن دورة أو معلم..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: '260px', padding: '8px 40px 8px 16px', borderRadius: '8px', border: '1px solid #E0E0E0', background: '#fff', color: '#444', fontSize: '1rem', textAlign: 'right', position: 'relative' }}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1rem', pointerEvents: 'none' }} 
              />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E0E0E0', background: '#fff', color: '#444', fontSize: '1rem', minWidth: '140px' }}
              >
                <option>جميع الحالات</option>
                <option>نشط</option>
                <option>مكتمل</option>
              </select>
            </div>
            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(30,200,160,0.07)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl' }}>
                <thead>
                  <tr style={{ background: '#F8FCFB', color: '#888', fontWeight: 500, fontSize: '1rem' }}>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>اسم الدورة</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>اسم المعلم</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>تاريخ الإضافة</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>الحالة</th>
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
                  ) : filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: '32px 0', fontSize: '1.1rem' }}>
                        لا يوجد دورة أو معلم يناسب معايير البحث
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course, idx) => (
                      <tr
                        key={course.title + course.teacher + idx}
                        style={{
                          borderBottom: '1px solid #F3F6F6',
                          background: rowHover === idx ? '#F3F6F6' : idx % 2 === 0 ? '#F8FCFB' : '#fff',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={() => setRowHover(idx)}
                        onMouseLeave={() => setRowHover(-1)}
                      >
                        {/* Course Name */}
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <span style={{ background: '#EAF8F4', color: '#F6A700', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginLeft: 6 }}>
                            <FontAwesomeIcon icon={faBookOpen} />
                          </span>
                          <span style={{ color: '#222', fontWeight: 500 }}>{course.title}</span>
                        </td>
                        {/* Teacher */}
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <span style={{ background: '#EAF8F4', color: '#1EC8A0', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginLeft: 6 }}>{course.teacher[0]}</span>
                          <span style={{ color: '#222', fontWeight: 500 }}>{course.teacher}</span>
                        </td>
                        {/* Created At */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#444' }}>{course.created_at ? new Date(course.created_at).toLocaleDateString('ar-EG') : '-'}</td>
                        {/* Status */}
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <span style={{ background: (course.status === 'published' ? '#1EC8A0' : '#A0AEC0') + '20', color: course.status === 'published' ? '#1EC8A0' : '#A0AEC0', borderRadius: '8px', padding: '4px 14px', fontWeight: 500, fontSize: '0.97rem' }}>{course.status === 'published' ? 'نشط' : course.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination summary row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', color: '#888', fontSize: '1rem', borderTop: '1px solid #F3F6F6', background: '#FAFAFA', borderRadius: '0 0 16px 16px' }}>
                <div>عرض 1-5 من 5 دورات</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ background: '#fff', border: '1px solid #E0E0E0', color: '#888', borderRadius: '8px', padding: '4px 18px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FontAwesomeIcon icon={faChevronRight} />
                    السابق
                  </button>
                  <button style={{ background: '#fff', border: '1px solid #E0E0E0', color: '#888', borderRadius: '8px', padding: '4px 18px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            
            <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#222', fontSize: '1.3rem' }}>حذف الدورة</h2>
            <p style={{ textAlign: 'center', marginBottom: '24px', color: '#666', fontSize: '0.95rem' }}>هل أنت متأكد من رغبتك في حذف هذه الدورة؟</p>
            
            {selectedCourse && (
              <div style={{ 
                background: '#F8FCFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #E0F2EE'
              }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px', color: '#222' }}>{selectedCourse.name}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>المعلم: {selectedCourse.teacher}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>عدد الطلاب: {selectedCourse.students}</p>
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
                onClick={handleDeleteCourse}
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
            padding: '24px',
            width: '400px',
            maxWidth: '90vw',
            boxShadow: '0 8px 32px rgba(30,200,160,0.13)',
            position: 'relative'
          }}>
            <button onClick={closeEditModal} style={{
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
            
            <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#222', fontSize: '1.3rem' }}>تعديل الدورة</h2>
            <p style={{ textAlign: 'center', marginBottom: '24px', color: '#666', fontSize: '0.95rem' }}>قم بتعديل بيانات الدورة</p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#444', fontWeight: 'bold', textAlign: 'right', paddingRight: '5%' }}>اسم الدورة</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                style={{
                  width: '90%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  fontSize: '1rem',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#444', fontWeight: 'bold', textAlign: 'right', paddingRight: '5%' }}>المعلم</label>
              <input
                type="text"
                name="teacher"
                value={editFormData.teacher}
                onChange={handleEditFormChange}
                style={{
                  width: '90%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  fontSize: '1rem',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#444', fontWeight: 'bold', textAlign: 'right', paddingRight: '5%' }}>عدد الطلاب</label>
              <input
                type="number"
                name="students"
                value={editFormData.students}
                onChange={handleEditFormChange}
                style={{
                  width: '90%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  fontSize: '1rem',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#444', fontWeight: 'bold', textAlign: 'right', paddingRight: '5%' }}>الحالة</label>
              <select
                name="status"
                value={editFormData.status}
                onChange={handleEditFormChange}
                style={{
                  width: '90%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  fontSize: '1rem',
                  margin: '0 auto',
                  display: 'block'
                }}
              >
                <option value="نشط">نشط</option>
                <option value="مكتمل">مكتمل</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={closeEditModal}
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
                onClick={handleEditCourse}
                style={{
                  padding: '8px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#1EC8A0',
                  color: '#fff',
                  fontSize: '1rem',
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
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم حذف الدورة بنجاح من النظام</p>
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
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم تحديث بيانات الدورة بنجاح</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesSupervision; 
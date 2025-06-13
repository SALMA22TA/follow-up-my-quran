import React, { useState, useEffect } from 'react';
import Navbar from '../Components/DashboardNavbar';
import AdminSidebar from '../Components/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faBookOpen, faGraduationCap, faStar, faEdit, faTrash, faBell, faSearch, faChevronLeft, faChevronRight, faBook, faVideo } from '@fortawesome/free-solid-svg-icons';
import { Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const teachersData = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed.mohamed@example.com',
    initial: 'أ',
    specialty: 'تعليم القرآن الكريم',
    activeCourses: 3,
    students: 45,
    rating: 4.8,
    status: 'نشط',
    zoomLink: '',
  },
  {
    id: 2,
    name: 'فاطمة أحمد',
    email: 'fatima.ahmed@example.com',
    initial: 'فا',
    specialty: 'تجويد القرآن الكريم',
    activeCourses: 2,
    students: 32,
    rating: 4.9,
    status: 'نشط',
    zoomLink: '',
  },
  {
    id: 3,
    name: 'عمر حسن',
    email: 'omar.hassan@example.com',
    initial: 'عح',
    specialty: 'حفظ القرآن الكريم',
    activeCourses: 4,
    students: 60,
    rating: 4.7,
    status: 'نشط',
    zoomLink: '',
  },
  {
    id: 4,
    name: 'خالد عبدالله',
    email: 'khalid.abdullah@example.com',
    initial: 'خع',
    specialty: 'تفسير القرآن الكريم',
    activeCourses: 1,
    students: 25,
    rating: 5.0,
    status: 'نشط',
    zoomLink: '',
  },
  {
    id: 5,
    name: 'سمية محمد',
    email: 'sumaya.mohamed@example.com',
    initial: 'سم',
    specialty: 'أحكام التلاوة',
    activeCourses: 2,
    students: 38,
    rating: 4.6,
    status: 'نشط',
    zoomLink: '',
  },
];

const summary = {
  totalTeachers: 5,
  totalStudents: 200,
  avgRating: 4.8,
  activeCourses: 12,
};

const cardHoverStyle = {
  transform: 'translateY(-2px) scale(1.03)',
  boxShadow: '0 4px 16px rgba(30,200,160,0.13)',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const AdminTeachers = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('جميع التخصصات');
  const [tab, setTab] = useState('all');
  const [cardHover, setCardHover] = useState(-1);
  const [rowHover, setRowHover] = useState(-1);
  const [iconHover, setIconHover] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showZoomSuccessModal, setShowZoomSuccessModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    zoomLink: ''
  });
  const [zoomLink, setZoomLink] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
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
        
        const response = await axios.get('http://localhost:8000/api/v1/admin/get/teachers', config);
        console.log('Teachers Response:', response.data);
        
        if (response.data && response.data.data) {
          setTeachers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        if (error.message === 'No access token found') {
          setError('يرجى تسجيل الدخول للوصول إلى قائمة المعلمين');
        } else {
          setError('حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSpecialty = filter === 'جميع التخصصات' || teacher.teacherinfo?.specialty === filter;
    const matchesSearch = teacher.fullName.toLowerCase().includes(search.toLowerCase()) || 
                         teacher.email.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || (tab === 'active' && teacher.is_verified === 1) || 
                      (tab === 'inactive' && teacher.is_verified !== 1);
    return matchesSpecialty && matchesSearch && matchesTab;
  });

  // Calculate summary data from teachers array
  const summary = {
    totalTeachers: teachers.length,
    totalStudents: teachers.reduce((sum, teacher) => sum + teacher.subscribed_students_count, 0),
    avgRating: teachers.reduce((sum, teacher) => sum + parseFloat(teacher.feedbacks_avg_rate || 0), 0) / teachers.length || 0,
    activeCourses: teachers.reduce((sum, teacher) => sum + teacher.courses_count, 0),
  };

  // Handle delete modal
  const openDeleteModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedTeacher(null);
  };
  const handleDeleteTeacher = async () => {
    try {
      if (!selectedTeacher) {
        console.error('No teacher selected');
        return;
      }

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

      // Send the delete request
      const response = await axios.delete(
        `http://localhost:8000/api/v1/admin/delete/${selectedTeacher.id}`,
        config
      );

      console.log('Delete Response:', response.data);

      if (response.data.status === 200) {
        // Remove the deleted teacher from the local state
        const updatedTeachers = teachers.filter(teacher => teacher.id !== selectedTeacher.id);
        setTeachers(updatedTeachers);

        // Show success message
        closeDeleteModal();
        setShowDeleteSuccessModal(true);
        setTimeout(() => setShowDeleteSuccessModal(false), 2000);
      } else {
        throw new Error(response.data.message || 'Failed to delete teacher');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      setError('Failed to delete teacher');
    }
  };

  // Handle edit modal
  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setEditFormData({
      name: `${teacher.teacherinfo?.fname || ''} ${teacher.teacherinfo?.lname || ''}`,
      email: teacher.email,
      zoomLink: teacher.zoomLink || ''
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTeacher(null);
    setEditFormData({
      name: '',
      email: '',
      zoomLink: ''
    });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditTeacher = async () => {
    try {
      if (!selectedTeacher) {
        console.error('No teacher selected');
        return;
      }

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

      // Split the full name into first and last name
      const nameParts = editFormData.name.trim().split(' ');
      const fname = nameParts[0] || '';
      const lname = nameParts.slice(1).join(' ') || '';

      // Send the update request
      const response = await axios.patch(
        `http://localhost:8000/api/v1/admin/update/${selectedTeacher.id}`,
        {
          fullName: editFormData.name,
          email: editFormData.email,
          teacherinfo: {
            fname: fname,
            lname: lname
          }
        },
        config
      );

      // If there's a new zoom link, update it
      if (editFormData.zoomLink && editFormData.zoomLink !== selectedTeacher.zoomLink) {
        await axios.put(
          `http://localhost:8000/api/v1/admin/assign_link/${selectedTeacher.id}`,
          { link: editFormData.zoomLink },
          config
        );
      }

      console.log('Update Response:', response.data);

      if (response.data.status === 200) {
        // Update the local state with the new teacher data
        const updatedTeachers = teachers.map(teacher => 
          teacher.id === selectedTeacher.id 
            ? { 
                ...teacher, 
                ...response.data.data,
                teacherinfo: {
                  ...teacher.teacherinfo,
                  fname: fname,
                  lname: lname
                },
                zoomLink: editFormData.zoomLink
              }
            : teacher
        );
        setTeachers(updatedTeachers);

        // Show success message
        closeEditModal();
        setShowEditSuccessModal(true);
        setTimeout(() => setShowEditSuccessModal(false), 2000);
      } else {
        throw new Error(response.data.message || 'Failed to update teacher');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      setError('Failed to update teacher');
    }
  };

  // Handle zoom modal
  const openZoomModal = (teacher) => {
    setSelectedTeacher(teacher);
    setZoomLink(teacher.zoomLink || '');
    setShowZoomModal(true);
  };

  const closeZoomModal = () => {
    setShowZoomModal(false);
    setSelectedTeacher(null);
    setZoomLink('');
  };

  const handleZoomLinkChange = (e) => {
    setZoomLink(e.target.value);
  };

  const handleSaveZoomLink = async () => {
    if (!zoomLink.trim()) {
      setError('يرجى إدخال رابط زووم');
      return;
    }
    try {
      if (!selectedTeacher) {
        console.error('No teacher selected');
        return;
      }

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

      // Send the zoom link to the API using PUT method
      const response = await axios.put(
        `http://localhost:8000/api/v1/admin/assign_link/${selectedTeacher.id}`,
        { link: zoomLink },
        config
      );

      console.log('Zoom Link Assignment Response:', response.data);

      if (response.data.status === 200) {
        // Update the local state with the new zoom link
        const updatedTeachers = teachers.map(teacher => 
          teacher.id === selectedTeacher.id 
            ? { ...teacher, zoomLink: zoomLink }
            : teacher
        );
        setTeachers(updatedTeachers);

        // Show success message
        closeZoomModal();
        setShowZoomSuccessModal(true);
        setTimeout(() => setShowZoomSuccessModal(false), 2000);
      } else {
        throw new Error(response.data.message || 'Failed to assign zoom link');
      }
    } catch (error) {
      console.error('Error assigning zoom link:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FCFB', width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <div style={{ maxWidth: '1600px', margin: '0 auto', paddingTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
          <AdminSidebar />
          <div style={{ marginRight: '220px', padding: '0 30px 30px 30px', width: '100%', boxSizing: 'border-box' }}>
            {/* Page title at the top */}
            <h1 style={{ color: '#222', fontWeight: 'bold', fontSize: '2rem', margin: '32px 0 18px 0', textAlign: 'right', direction: 'rtl' }}>المعلمون</h1>
            
            {error && (
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
            )}

            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: '18px', marginBottom: '32px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              {[
                {
                  bg: '#FFF8E6', iconBg: '#FFF3CD', iconColor: '#F6A700', color: '#A67C00', label: 'إجمالي الطلاب', value: loading ? '...' : summary.totalStudents, icon: faUsers
                },
                {
                  bg: '#F6F3FF', iconBg: '#E9E3F7', iconColor: '#A259FF', color: '#A259FF', label: 'متوسط التقييم', value: loading ? '...' : summary.avgRating.toFixed(1), icon: faStar
                },
                {
                  bg: '#F5F7FB', iconBg: '#E3E8F9', iconColor: '#1A237E', color: '#1A237E', label: 'الدورات النشطة', value: loading ? '...' : summary.activeCourses, icon: faBookOpen
                },
                {
                  bg: '#F3FDF9', iconBg: '#E0F2EE', iconColor: '#1EC8A0', color: '#1EC8A0', label: 'إجمالي المعلمين', value: loading ? '...' : summary.totalTeachers, icon: faGraduationCap
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  style={{ flex: 1, minWidth: 180, background: card.bg, borderRadius: '14px', padding: '18px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(30,200,160,0.07)', ...(cardHover === idx ? cardHoverStyle : { transition: 'all 0.2s' }) }}
                  onMouseEnter={() => setCardHover(idx)}
                  onMouseLeave={() => setCardHover(-1)}
                >
                  <span style={{ background: card.iconBg, color: card.iconColor, borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', transition: 'all 0.2s' }}>
                    <FontAwesomeIcon icon={card.icon} />
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: card.color, fontWeight: 500, fontSize: '1.1rem' }}>{card.label}</div>
                    <div style={{ color: card.iconColor, fontWeight: 'bold', fontSize: '1.7rem' }}>{card.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Section title and subtitle under cards */}
            <h2 style={{ color: '#222', fontWeight: 'bold', fontSize: '1.5rem', margin: '0 0 8px 0', textAlign: 'right', direction: 'rtl' }}>قائمة المعلمين</h2>
            <div style={{ color: '#888', fontSize: '1rem', marginBottom: '24px', textAlign: 'right' }}>
              إدارة المعلمين والتواصل معهم
            </div>
            {/* Controls: search and filter swapped */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', marginTop: '18px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '340px' }}>
                <input
                  type="text"
                  placeholder="ابحث غن معلم..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '94.5%', minWidth: '340px', padding: '8px 40px 8px 16px', borderRadius: '8px', border: '1px solid #E0E0E0', background: '#fff', color: '#444', fontSize: '1rem', textAlign: 'right' }}
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1rem', pointerEvents: 'none' }} 
                />
              </div>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E0E0E0', background: '#fff', color: '#444', fontSize: '1rem', minWidth: '140px' }}
              >
                <option>جميع التخصصات</option>
                <option>تعليم القرآن الكريم</option>
                <option>تجويد القرآن الكريم</option>
                <option>حفظ القرآن الكريم</option>
                <option>تفسير القرآن الكريم</option>
                <option>أحكام التلاوة</option>
              </select>
            </div>
            {/* Tabs - full width of table */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E0E0E0', width: '100%', background: '#F8FCFB', maxWidth: '100%' }}>
              <button onClick={() => setTab('all')} style={{ flex: 1, padding: '10px 32px', background: tab === 'all' ? '#EAF8F4' : 'transparent', color: tab === 'all' ? '#1EC8A0' : '#888', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>جميع المعلمين</button>
              <button onClick={() => setTab('active')} style={{ flex: 1, padding: '10px 32px', background: tab === 'active' ? '#EAF8F4' : 'transparent', color: tab === 'active' ? '#1EC8A0' : '#888', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>نشط</button>
              <button onClick={() => setTab('inactive')} style={{ flex: 1, padding: '10px 32px', background: tab === 'inactive' ? '#EAF8F4' : 'transparent', color: tab === 'inactive' ? '#1EC8A0' : '#888', border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>غير نشط</button>
            </div>
            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(30,200,160,0.07)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl' }}>
                <thead>
                  <tr style={{ background: '#F8FCFB', color: '#888', fontWeight: 500, fontSize: '1rem' }}>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>اسم المعلم</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>التخصص</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>الدورات النشطة</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>عدد الطلاب</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>التقييم</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>رابط زووم</th>
                    <th style={{ padding: '16px 8px', borderBottom: '1px solid #E0E0E0' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '32px 0', fontSize: '1.1rem' }}>
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '32px 0', fontSize: '1.1rem' }}>
                        لا يوجد معلم يناسب معايير البحث
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((teacher, idx) => (
                      <tr
                        key={teacher.id}
                        style={{
                          borderBottom: '1px solid #F3F6F6',
                          background: rowHover === idx ? '#F3F6F6' : idx % 2 === 0 ? '#F8FCFB' : '#fff',
                          transition: 'background 0.2s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={() => setRowHover(idx)}
                        onMouseLeave={() => setRowHover(-1)}
                      >
                        {/* Teacher Name */}
                        <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ background: '#EAF8F4', color: '#1EC8A0', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                            {teacher.teacherinfo?.fname?.[0]}{teacher.teacherinfo?.lname?.[0]}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#222', fontWeight: 500, marginRight: 8 }}>{teacher.teacherinfo?.fname} {teacher.teacherinfo?.lname}</div>
                            <div style={{ color: '#888', fontSize: '0.9rem', marginRight: 8 }}>{teacher.email}</div>
                          </div>
                        </td>
                        {/* Specialty */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#444' }}>
                          {teacher.teacherinfo?.specialty || 'غير محدد'}
                        </td>
                        {/* Active Courses */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#444', fontWeight: 500 }}>
                          <span style={{
                            background: '#EAF8F4',
                            color: '#1EC8A0',
                            borderRadius: '50%',
                            width: 22,
                            height: 22,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 6,
                            fontSize: '0.95rem',
                            verticalAlign: 'middle',
                          }}>
                            <FontAwesomeIcon icon={faBook} />
                          </span>
                          {teacher.courses_count}
                        </td>
                        {/* Students */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#444', fontWeight: 500 }}>
                          {teacher.subscribed_students_count}
                        </td>
                        {/* Rating */}
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#F6A700', fontWeight: 500 }}>
                          <FontAwesomeIcon icon={faStar} style={{ marginLeft: 4, color: '#F6A700' }} />
                          {parseFloat(teacher.feedbacks_avg_rate || 0).toFixed(1)}
                        </td>
                        {/* Zoom Link */}
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: iconHover[idx + '-zoom'] ? '#1565c0' : '#4B9EFF',
                              cursor: 'pointer',
                              fontSize: '1.1rem',
                              transition: 'color 0.2s',
                            }}
                            title="تعيين رابط زووم"
                            onMouseEnter={() => setIconHover({ ...iconHover, [idx + '-zoom']: true })}
                            onMouseLeave={() => setIconHover({ ...iconHover, [idx + '-zoom']: false })}
                            onClick={() => openZoomModal(teacher)}
                          >
                            <FontAwesomeIcon icon={faVideo} />
                          </button>
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
                            onClick={() => openEditModal(teacher)}
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
                            onClick={() => openDeleteModal(teacher)}
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
                            }}
                            title="إخطار"
                            onMouseEnter={() => setIconHover({ ...iconHover, [idx + '-bell']: true })}
                            onMouseLeave={() => setIconHover({ ...iconHover, [idx + '-bell']: false })}
                            onClick={() => navigate(`/admin/teacher-notification/${teacher.id}`)}
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
                <div>عرض {filteredTeachers.length > 0 ? `1-${filteredTeachers.length}` : '0'} من {teachers.length} معلمين</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    style={{ 
                      background: '#fff', 
                      border: '1px solid #E0E0E0', 
                      color: '#888', 
                      borderRadius: '8px', 
                      padding: '4px 18px', 
                      fontWeight: 500, 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      transition: 'all 0.2s',
                      opacity: filteredTeachers.length === 0 ? 0.5 : 1,
                      pointerEvents: filteredTeachers.length === 0 ? 'none' : 'auto'
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                    السابق
                  </button>
                  <button 
                    style={{ 
                      background: '#fff', 
                      border: '1px solid #E0E0E0', 
                      color: '#888', 
                      borderRadius: '8px', 
                      padding: '4px 18px', 
                      fontWeight: 500, 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      transition: 'all 0.2s',
                      opacity: filteredTeachers.length === 0 ? 0.5 : 1,
                      pointerEvents: filteredTeachers.length === 0 ? 'none' : 'auto'
                    }}
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
                  <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#222', fontSize: '1.3rem' }}>حذف المعلم</h2>
                  <p style={{ textAlign: 'center', marginBottom: '24px', color: '#666', fontSize: '0.95rem' }}>هل أنت متأكد من رغبتك في حذف هذا المعلم؟</p>
                  {selectedTeacher && (
                    <div style={{
                      background: '#F8FCFB',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '24px',
                      border: '1px solid #E0F2EE'
                    }}>
                      <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px', color: '#222' }}>
                        {selectedTeacher.teacherinfo?.fname} {selectedTeacher.teacherinfo?.lname}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>البريد الإلكتروني: {selectedTeacher.email}</p>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>التخصص: {selectedTeacher.teacherinfo?.specialty || 'غير محدد'}</p>
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
                      onClick={handleDeleteTeacher}
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
                      <h2 style={{ margin: 0, color: '#222', fontSize: '1.3rem', fontWeight: 'bold' }}>تعديل بيانات المعلم</h2>
                      <p style={{ color: '#666', fontSize: '0.95rem', margin: '8px 0 0 0' }}>قم بتعديل بيانات المعلم</p>
                    </div>
                  </div>
                  {/* Scrollable Content */}
                  <div style={{
                    padding: '0 20px 16px 20px',
                    overflowY: 'auto',
                    flex: 1,
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>اسم المعلم</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
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
                      <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>البريد الإلكتروني</label>
                      <input
                        type="text"
                        name="email"
                        value={editFormData.email}
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
                      <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>رابط زووم</label>
                      <input
                        type="text"
                        name="zoomLink"
                        value={editFormData.zoomLink}
                        onChange={handleEditFormChange}
                        placeholder={selectedTeacher?.zoomLink || 'https://zoom.us/j/...'}
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
                    borderBottomRightRadius: '16px',
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
                      onClick={handleEditTeacher}
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
                    <Trash2 size={28} style={{ color: '#F44336' }} />
                  </div>
                  <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: '8px' }}>تم الحذف بنجاح</h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم حذف المعلم بنجاح من النظام</p>
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
                    <FontAwesomeIcon icon={faEdit} style={{ color: '#1EC8A0', fontSize: '28px' }} />
                  </div>
                  <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: '8px' }}>تم التعديل بنجاح</h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم تحديث بيانات المعلم بنجاح</p>
                </div>
              </div>
            )}

            {/* Zoom Link Modal */}
            {showZoomModal && (
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
                if (e.target.className === 'modal-overlay') closeZoomModal();
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  width: '340px',
                  maxWidth: '90vw',
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
                    <button onClick={closeZoomModal} style={{
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
                      <h2 style={{ margin: 0, color: '#222', fontSize: '1.3rem', fontWeight: 'bold' }}>تعيين رابط زووم</h2>
                      <p style={{ color: '#666', fontSize: '0.95rem', margin: '8px 0 0 0' }}>قم بإضافة رابط زووم للمعلم</p>
                    </div>
                  </div>
                  {/* Content */}
                  <div style={{
                    padding: '20px',
                    flex: 1,
                  }}>
                    {selectedTeacher && (
                      <div style={{
                        background: '#F8FCFB',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        border: '1px solid #E0F2EE',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          background: '#EAF8F4',
                          color: '#1EC8A0',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}>
                          {selectedTeacher.teacherinfo?.fname?.[0]}{selectedTeacher.teacherinfo?.lname?.[0]}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#222', fontWeight: 'bold', fontSize: '1rem' }}>{selectedTeacher.teacherinfo?.fname} {selectedTeacher.teacherinfo?.lname}</div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>{selectedTeacher.email}</div>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div style={{ color: '#F44336', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'right' }}>
                        {error}
                      </div>
                    )}
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '3px', color: '#444', fontWeight: 'bold', textAlign: 'right', fontSize: '0.9rem' }}>رابط زووم</label>
                      <input
                        type="text"
                        value={zoomLink}
                        onChange={handleZoomLinkChange}
                        placeholder="https://zoom.us/j/..."
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
                    borderBottomRightRadius: '16px',
                  }}>
                    <button
                      onClick={closeZoomModal}
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
                      onClick={handleSaveZoomLink}
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
                      حفظ الرابط
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Zoom Success Modal */}
            {showZoomSuccessModal && (
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
                    <FontAwesomeIcon icon={faVideo} style={{ color: '#1EC8A0', fontSize: '28px' }} />
                  </div>
                  <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: '8px' }}>تم ارسال الرابط بنجاح</h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0' }}>تم ارسال رابط زووم بنجاح</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeachers; 
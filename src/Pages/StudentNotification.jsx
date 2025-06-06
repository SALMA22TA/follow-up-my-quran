import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Send, CheckCircle, Info } from 'lucide-react';
import Navbar from '../Components/DashboardNavbar';
import AdminSidebar from '../Components/AdminSidebar';
import axios from 'axios';

const StudentNotification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [type, setType] = useState('عام');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
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

        const response = await axios.get(`http://localhost:8000/api/v1/admin/get/students`, config);
        const studentData = response.data.data.students.find(s => String(s.id) === String(id));
        
        if (studentData) {
          setStudent(studentData);
        } else {
          setError('لم يتم العثور على الطالب');
        }
      } catch (error) {
        console.error('Error fetching student:', error);
        setError('حدث خطأ في تحميل بيانات الطالب');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSend = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    try {
      // Validate required fields
      if (!title.trim()) {
        setError('يرجى إدخال عنوان الإشعار');
        return;
      }
      if (!message.trim()) {
        setError('يرجى إدخال نص الإشعار');
        return;
      }

      setShowConfirm(false);
      setSending(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      // Log the user ID
      console.log('Sending notification to user ID:', id);
      console.log('Parsed user ID:', parseInt(id));

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Send the notification with the same format as TeacherNotification
      const response = await axios.post(
        'http://localhost:8000/api/v1/admin/send/notification',
        {
          user_id: parseInt(id),
          message: `${title}\n${message}` // Combine title and message
        },
        config
      );

      console.log('Notification Response:', response.data);

      if (response.data.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate(-1);
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      let errorMessage = 'حدث خطأ في إرسال الإشعار';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'No access token found') {
        errorMessage = 'يرجى تسجيل الدخول للوصول إلى هذه الصفحة';
      } else if (error.message === 'Validation failed') {
        errorMessage = 'يرجى التأكد من صحة البيانات المدخلة';
      }
      
      setError(errorMessage);
      setSending(false);
    }
  };

  const handleCancelSend = () => {
    setShowConfirm(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl', paddingTop: '80px' }}>
          <AdminSidebar />
          <div style={{ marginRight: '220px', width: '100%', boxSizing: 'border-box', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>جاري التحميل...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl', paddingTop: '80px' }}>
          <AdminSidebar />
          <div style={{ marginRight: '220px', width: '100%', boxSizing: 'border-box', padding: '0 20px' }}>
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
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>خطأ</div>
              <div>{error}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl', paddingTop: '80px' }}>
        <AdminSidebar />
        <div style={{ marginRight: '220px', width: '100%', boxSizing: 'border-box', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 24, gap: 8 }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
              <ArrowRight size={26} />
            </button>
            <span style={{ color: '#222', fontWeight: 'bold', fontSize: '1.5rem' }}>إرسال إشعار</span>
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto', paddingTop: 0 }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(30,200,160,0.07)', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '24px 24px 0 24px', background: '#F8FCFB', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <h2 style={{ color: '#17997A', fontWeight: 'bold', fontSize: '1.25rem', margin: 0, marginBottom: 18 }}>إرسال إشعار للطالب</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ background: '#EAF8F4', color: '#1EC8A0', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 16 }}>
                    {student?.fullName.split(' ').map(n => n[0]).join('')}
                  </div>  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#222', fontWeight: 'bold', fontSize: '1.1rem' }}>{student?.fullName}</div>
                    <div style={{ color: '#888', fontSize: '0.97rem', marginTop: 2 }}>طالب • {student?.email}</div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSend} style={{ padding: '24px', background: '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: 180 }}>
                    <label style={{ display: 'block', color: '#444', fontWeight: 'bold', marginBottom: 6, textAlign: 'right' }}>عنوان الإشعار</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      placeholder="أدخل عنوان الإشعار" 
                      style={{ width: '96%', padding: '10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: '1rem', textAlign: 'right' }} 
                      required 
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 90, maxWidth: 120 }}>
                    <label style={{ display: 'block', color: '#444', fontWeight: 'bold', marginBottom: 6, textAlign: 'right' }}>نوع الإشعار</label>
                    <select 
                      value={type} 
                      onChange={e => setType(e.target.value)} 
                      style={{ width: '100%', maxWidth: '120px', padding: '10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: '1rem', textAlign: 'right' }}
                    >
                      <option value="عام">عام</option>
                      <option value="تذكير">تذكير</option>
                      <option value="ملاحظة">ملاحظة</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', color: '#444', fontWeight: 'bold', marginBottom: 6, textAlign: 'right' }}>نص الإشعار</label>
                  <textarea 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    placeholder="أدخل نص الإشعار هنا..." 
                    style={{ width: '97%', minHeight: 90, borderRadius: 8, border: '1px solid #E0E0E0', fontSize: '1rem', padding: '10px', textAlign: 'right', resize: 'vertical' }} 
                    required 
                  />
                </div>
                <div style={{ background: '#F3F6F6', color: '#17997A', borderRadius: 8, padding: '10px 14px', fontSize: '0.97rem', marginBottom: 18, textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Info size={18} style={{ color: '#1EC8A0' }} />
                  سيتم إرسال هذا الإشعار مباشرة إلى الطالب {student?.fullName} وسيظهر في لوحة الإشعارات الخاصة به.
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    style={{ padding: '10px 28px', borderRadius: 8, border: '1px solid #E0E0E0', background: '#fff', color: '#666', fontSize: '1rem', cursor: 'pointer', fontWeight: 500 }}
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    disabled={sending} 
                    style={{ 
                      padding: '10px 28px', 
                      borderRadius: 8, 
                      border: 'none', 
                      background: '#1EC8A0', 
                      color: '#fff', 
                      fontSize: '1rem', 
                      fontWeight: 'bold', 
                      cursor: sending ? 'not-allowed' : 'pointer', 
                      opacity: sending ? 0.7 : 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8 
                    }}
                  >
                    {sending ? '...جاري الإرسال' : <><Send size={18} /> إرسال الإشعار</>}
                  </button>
                </div>
              </form>
            </div>
            {showConfirm && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 280, textAlign: 'center', boxShadow: '0 8px 32px rgba(30,200,160,0.13)' }}>
                  <h2 style={{ color: '#222', fontSize: '1.2rem', marginBottom: 16 }}>تأكيد الإرسال</h2>
                  <p style={{ color: '#666', fontSize: '1rem', marginBottom: 24 }}>هل أنت متأكد أنك تريد إرسال هذا الإشعار إلى الطالب <span style={{ color: '#17997A', fontWeight: 'bold' }}>{student?.fullName}</span>؟</p>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button 
                      onClick={handleCancelSend} 
                      style={{ padding: '10px 28px', borderRadius: 8, border: '1px solid #E0E0E0', background: '#fff', color: '#666', fontSize: '1rem', cursor: 'pointer', fontWeight: 500 }}
                    >
                      إلغاء
                    </button>
                    <button 
                      onClick={handleConfirmSend} 
                      style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#1EC8A0', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      تأكيد
                    </button>
                  </div>
                </div>
              </div>
            )}
            {success && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 280, textAlign: 'center', boxShadow: '0 8px 32px rgba(30,200,160,0.13)' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#F0FDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <CheckCircle size={40} color="#1EC8A0" />
                  </div>
                  <h2 style={{ color: '#222', fontSize: '1.3rem', marginBottom: 8 }}>تم إرسال الإشعار</h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 0 }}>تم إرسال الإشعار بنجاح إلى الطالب <span style={{ color: '#17997A', fontWeight: 'bold' }}>{student?.fullName}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentNotification; 
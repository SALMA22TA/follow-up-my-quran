import React, { useState, useEffect } from "react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import axios from "axios";

const StudentPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: '', amount: '', number_of_days: '', task_per_day: '' });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingPlanObj, setEditingPlanObj] = useState(null);
  const [checkedDays, setCheckedDays] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token not found");

      console.log("Fetching plans...");
      const response = await axios.get('http://localhost:8000/api/v1/student/get_plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Plans Response:", response.data);

      const formattedPlans = response.data.data.data.map(plan => ({
        id: plan.id,
        title: plan.title || `حفظ ${plan.amount} صفحة`,
        pages: plan.amount,
        days: plan.number_of_days,
        progress: plan.progress,
        task_per_day: plan.task_per_day
      }));

      console.log("Formatted Plans:", formattedPlans);
      setPlans(formattedPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressChange = (id, value) => {
    setPlans(plans => plans.map(plan => plan.id === id ? { ...plan, progress: Number(value) } : plan));
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (
      !newPlan.title ||
      Number(newPlan.amount) < 1 ||
      Number(newPlan.number_of_days) < 1
    ) {
      setError('الرجاء ملء جميع الحقول');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token not found");

      console.log("Creating new plan with data:", newPlan);
      const response = await axios.post('http://localhost:8000/api/v1/student/request_plan', {
        title: newPlan.title,
        amount: Number(newPlan.amount),
        number_of_days: Number(newPlan.number_of_days),
        task_per_day: Number(newPlan.task_per_day)
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Create Plan Response:", response.data);

      // Refresh plans after adding new one
      await fetchPlans();
      
      setNewPlan({ title: '', amount: '', number_of_days: '', task_per_day: '' });
      setShowModal(false);
      setError('');
    } catch (error) {
      console.error("Error creating plan:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleUpdateProgressClick = (plan) => {
    setEditingPlanId(plan.id);
    setEditingPlanObj(plan);
    const checked = [];
    const totalChecked = Math.round((plan.progress / 100) * plan.days);
    for (let i = 1; i <= totalChecked; i++) checked.push(i);
    setCheckedDays(checked);
  };

  const handleSaveProgress = async () => {
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    if (editingPlanId == null) return;
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token not found");

      const plan = plans.find(p => p.id === editingPlanId);
      const newProgress = Math.round((checkedDays.length / plan.days) * 100);

      console.log("Updating plan progress:", { planId: editingPlanId, newProgress });
      const response = await axios.put(`http://localhost:8000/api/v1/student/update_progress/${editingPlanId}`, {
        progress: newProgress
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Update Progress Response:", response.data);

      setPlans(plans => plans.map(p => 
        p.id === editingPlanId 
          ? { ...p, progress: response.data.percentage_of_progress }
          : p
      ));
      
      setEditingPlanId(null);
      setCheckedDays([]);
      setEditingPlanObj(null);
      setShowConfirm(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating plan progress:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleCancelSave = () => {
    setShowConfirm(false);
  };

  const handleCancelProgressModal = () => {
    setEditingPlanId(null);
    setCheckedDays([]);
    setEditingPlanObj(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafbfc" }}>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl", paddingTop: 40 }}>
        {sidebarOpen && <Sidebar />}
        <div style={{ marginRight: 220, width: "100%", padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, color: "#222" }}>الخطط</h2>
            <button onClick={() => setShowModal(true)} style={{ background: "#1EC8A0", color: "#fff", marginTop:"auto", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
              + إضافة خطة جديدة
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {plans.map(plan => (
              <div
                key={plan.id}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  minHeight: 90,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(30,200,160,0.10)";
                  e.currentTarget.style.transform = "scale(1.015)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {/* Plan Details (right) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", padding: "24px 40px 24px 0", minWidth: 220 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#222", marginBottom: 12, textAlign: "right", width: "100%" }}>
                    {plan.title}
                  </div>
                  <div style={{ color: "#888", fontSize: 15, display: "flex", gap: 18 }}>
                    <span>{plan.pages} صفحة 📄</span>
                    <span>{plan.days} يوم 🗓️</span>
                  </div>
                </div>
                {/* Progress Bar (center) */}
                <div style={{ flex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ color: "#1EC8A0", fontWeight: 500, fontSize: 15 }}>التقدم</span>
                    <span style={{ color: "#1EC8A0", fontSize: 18 }}>📈</span>
                  </div>
                  <div style={{ width: 180, height: 8, background: "#eee", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: `${plan.progress}%`, height: "100%", background: "#222", borderRadius: 6, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ color: "#1EC8A0", fontWeight: 600, fontSize: 18 }}>{plan.progress}%</div>
                </div>
                {/* Update Button (left) */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "24px 24px 24px 16px", minWidth: 160 }}>
                  <button 
                    style={{ 
                      background: "#eafff6", 
                      color: "#1EC8A0", 
                      border: "none", 
                      borderRadius: 6, 
                      padding: "4px 16px", 
                      fontWeight: 500, 
                      fontSize: 14, 
                      marginBottom: 8, 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 6,
                      transition: "all 0.2s ease",
                      ":hover": {
                        background: "#1EC8A0",
                        color: "#fff"
                      }
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "#1EC8A0";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "#eafff6";
                      e.currentTarget.style.color = "#1EC8A0";
                    }}
                    onClick={() => handleUpdateProgressClick(plan)}
                  >
                    تحديث التقدم
                    <span style={{ fontSize: 16 }}>⟳</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PlanProgressUpdate Modal */}
          {editingPlanId && editingPlanObj && (
            <PlanProgressUpdate
              plan={editingPlanObj}
              checkedDays={checkedDays}
              setCheckedDays={setCheckedDays}
              onSave={handleSaveProgress}
              onCancel={handleCancelProgressModal}
            />
          )}

          {/* Confirmation Modal */}
          {showConfirm && (
            <ConfirmSaveModal onConfirm={handleConfirmSave} onCancel={handleCancelSave} />
          )}

          {/* Modal for adding a new plan */}
          {showModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.3)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: 32,
                minWidth: 340,
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                position: "relative"
              }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ position: "absolute", left: 16, top: 16, background: "none", border: "none", fontSize: 22, color: "#888", cursor: "pointer" }}
                  aria-label="إغلاق"
                >×</button>
                <h3 style={{ textAlign: "center", fontWeight: 700, marginBottom: 24 }}>طلب خطة جديدة</h3>
                <form onSubmit={handleAddPlan} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ color: "#666", fontSize: 14 }}>الهدف</label>
                    <input
                      type="text"
                      value={newPlan.title}
                      onChange={e => setNewPlan({ ...newPlan, title: e.target.value })}
                      style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 }}
                      placeholder="أدخل هدف الخطة"
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ color: "#666", fontSize: 14 }}>عدد الصفحات</label>
                    <input
                      type="number"
                      min="1"
                      value={newPlan.amount}
                      onChange={e => setNewPlan({ ...newPlan, amount: e.target.value })}
                      style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ color: "#666", fontSize: 14 }}>عدد الأيام</label>
                    <input
                      type="number"
                      min="1"
                      value={newPlan.number_of_days}
                      onChange={e => setNewPlan({ ...newPlan, number_of_days: e.target.value })}
                      style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 }}
                    />
                  </div>
                  {error && (
                    <div style={{ color: "#dc3545", fontSize: 14, textAlign: "center" }}>
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    style={{ 
                      background: "#1EC8A0", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: 6, 
                      padding: "10px 20px", 
                      fontWeight: 600, 
                      fontSize: 15, 
                      cursor: "pointer",
                      margin: "0 auto",
                      width: "fit-content"
                    }}
                  >
                    طلب خطة
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Success Modal for progress update */}
          {showSuccessModal && (
            <SuccessProgressModal onClose={() => setShowSuccessModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

function PlanProgressUpdate({ plan, checkedDays, setCheckedDays, onSave, onCancel }) {
  const totalDays = plan.days;
  const totalPages = plan.pages;
  const daysArr = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Distribute pages as evenly as possible
  const basePages = Math.floor(totalPages / totalDays);
  const extraPages = totalPages % totalDays;
  const pagesPerDay = daysArr.map((day, idx) => idx < extraPages ? basePages + 1 : basePages);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        margin: '0',
        boxShadow: '0 1px 16px rgba(0,0,0,0.12)',
        padding: 0,
        border: '1px solid #eaf8f4',
        overflow: 'hidden',
        maxWidth: 600,
        minWidth: 340,
        width: '100%',
        position: 'relative',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <button
          onClick={onCancel}
          style={{ position: 'absolute', left: 16, top: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer', zIndex: 10 }}
          aria-label="إغلاق"
        >×</button>
        <div style={{ background: '#eafaf4', padding: '24px 0 8px 0', textAlign: 'center', borderRadius: '12px 12px 0 0' }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#218838', marginBottom: 4 }}>{plan.title}</div>
          <div style={{ color: '#4e8574', fontSize: 15 }}>قم بتحديد المهام التي أكملتها</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {daysArr.map((day, idx) => (
            <div key={day} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 24px',
              borderBottom: day === totalDays ? 'none' : '1px solid #f2f2f2',
              background: checkedDays.includes(day) ? '#f6fefa' : 'transparent',
              fontSize: 16
            }}>
              <span style={{ color: '#1EC8A0', fontWeight: checkedDays.includes(day) ? 600 : 400 }}>
                {`يوم ${day} - ${pagesPerDay[idx]} صفحة`}
              </span>
              <input
                type="checkbox"
                checked={checkedDays.includes(day)}
                onChange={() => {
                  if (checkedDays.includes(day)) {
                    setCheckedDays(checkedDays.filter(d => d !== day));
                  } else {
                    setCheckedDays([...checkedDays, day]);
                  }
                }}
                style={{ width: 20, height: 20, accentColor: '#1EC8A0', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', padding: 24, background: '#fafbfc', borderRadius: '0 0 12px 12px' }}>
          <button
            onClick={onSave}
            style={{
              background: '#1EC8A0',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 36px',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            حفظ <span role="img" aria-label="save">💾</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Confirmation Modal Component
function ConfirmSaveModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 2100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        minWidth: 320,
        padding: '32px 24px 24px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        position: 'relative',
        textAlign: 'center',
      }}>
        <button
          onClick={onCancel}
          style={{ position: 'absolute', left: 16, top: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}
          aria-label="إغلاق"
        >×</button>
        <h3 style={{ fontWeight: 700, marginBottom: 18 }}>تأكيد الحفظ</h3>
        <p style={{ marginBottom: 28, fontSize: 16 }}>هل أنت متأكد من حفظ التغييرات التي قمت بها؟</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={onCancel}
            style={{
              background: '#fff',
              color: '#222',
              border: '1px solid #e6e6e6',
              borderRadius: 6,
              padding: '8px 28px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            لا
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: '#1EC8A0',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 28px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            نعم
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessProgressModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 2200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        minWidth: 320,
        padding: '32px 24px 24px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        position: 'relative',
        textAlign: 'center',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', left: 16, top: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}
          aria-label="إغلاق"
        >×</button>
        <div style={{ marginBottom: 18 }}>
          <span style={{
            display: 'inline-block',
            background: '#eafaf4',
            borderRadius: '50%',
            width: 56,
            height: 56,
            lineHeight: '56px',
            fontSize: 32,
            color: '#1EC8A0',
            marginBottom: 12,
          }}>✓</span>
        </div>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>تم حفظ التعديلات بنجاح</h3>
        <p style={{ marginBottom: 28, fontSize: 16 }}>تم تحديث تقدمك في الخطة بنجاح</p>
        <button
          onClick={onClose}
          style={{
            background: '#1EC8A0',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 28px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          حسناً
        </button>
      </div>
    </div>
  );
}

export default StudentPlansPage; 

 
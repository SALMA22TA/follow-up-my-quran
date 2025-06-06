import React, { useState, useEffect } from "react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { User, X } from "lucide-react";
import RequestDetailsModal from "../Components/RequestDetailsModal";
import axios from "axios";

const StudentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("No token found in localStorage");
            setLoading(false);
            return;
        }

        axios
            .get("http://localhost:8000/api/v1/student/schedules_requests_list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log("API response:", response);
                const data = response.data.data.data || [];

                const dayTranslation = {
                    Saturday: "السبت",
                    Sunday: "الأحد",
                    Monday: "الإثنين",
                    Tuesday: "الثلاثاء",
                    Wednesday: "الأربعاء",
                    Thursday: "الخميس",
                    Friday: "الجمعة",
                };

                const formattedRequests = data.map((req) => {
                    const daysArray = JSON.parse(req.days).map(day => dayTranslation[day] || day);
                    const timeParts = req.time.split(":");
                    let hours = parseInt(timeParts[0]);
                    const minutes = timeParts[1];
                    const period = hours >= 12 ? "م" : "ص";
                    if (hours > 12) hours -= 12;
                    if (hours === 0) hours = 12;
                    const time = `${hours}:${minutes} ${period}`;

                    return {
                        id: req.id,
                        teacher: {
                            fullName: req.teacher.teacherinfo ? `${req.teacher.teacherinfo.fname} ${req.teacher.teacherinfo.lname}` : 'المدرس',
                            specialization: req.teacher.teacherinfo?.specialty || "القرآن الكريم",
                            email: req.teacher.email
                        },
                        status: req.status === "approved" ? "تمت الموافقة" : "قيد الانتظار",
                        schedule: `${daysArray.join(" - ")}\n${time}`,
                        startDate: req.start_date,
                        endDate: req.end_date,
                        days: daysArray.join(" - "),
                        time: `${time} - ${req.duration} دقيقة`,
                    };
                });

                setRequests(formattedRequests);
                setLoading(false);
            })
            .catch((error) => {
                console.error("❌ Error fetching requests:", error);
                setError("فشل في جلب الطلبات");
                setLoading(false);
            });
    }, []);

    const openModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setIsModalOpen(false);
    };

    const deleteRequest = (id) => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        const request = requests.find((r) => r.id === id);

        if (request?.status === "تمت الموافقة") {
            setError("❌ لا يمكن حذف طلب تمت الموافقة عليه.");
            setTimeout(() => setError(null), 4000); 
            setIsModalOpen(false); 
            return;
        }

        axios
            .delete(`http://localhost:8000/api/v1/student/cancel_schedule_request/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("✅ Request cancelled successfully");
                    setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
                    closeModal();
                }
            })
            .catch((error) => {
                console.error("❌ Error cancelling request:", error);
                setError("فشل في إلغاء الطلب");
                setTimeout(() => setError(null), 4000); 
            });
    };


    
    const dashboardContainer = {
        display: "flex",
        flexDirection: "row-reverse",
        direction: "rtl",
    };

    const mainContent = {
        marginRight: "220px",
        padding: "20px",
        width: "100%",
        boxSizing: "border-box",
    };

    return (
        <>
            <Navbar />
            <div style={dashboardContainer}>
                <Sidebar />
                <div style={mainContent}>
                    <h1 style={{ textAlign: "right", color: "black" }}>قائمة طلبات الجدولة</h1>
                    <p style={{ textAlign: "right", color: "#666" }}>
                        عرض وإدارة طلبات الجدولة مع المعلمين
                    </p>

                    {/* Loading Message */}
                    {loading && <p style={{ textAlign: "center", color: "#1EC8A0" }}>جار تحميل البيانات...</p>}

                    {/* Error Message */}
                    {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

                    {/* Requests Table */}
                    {!loading && !error && (
                        <div
                            style={{
                                backgroundColor: "#EAF8F4",
                                padding: "15px",
                                borderRadius: "12px",
                                marginTop: "10px",
                            }}
                        >
                            <table style={{ width: "100%", textAlign: "center", direction: "rtl" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#1EC8A0", color: "#333" }}>
                                        <th style={{ padding: "10px", color: "white", textAlign: "right", paddingRight: "50px" }}>المعلم المطلوب</th>
                                        <th style={{ padding: "10px", color: "white" }}>الحالة</th>
                                        <th style={{ padding: "10px", color: "white" }}>الجدول</th>
                                        <th style={{ padding: "10px", color: "white" }}>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req) => (
                                        <tr
                                            key={req.id}
                                            style={{ backgroundColor: "white", transition: "background-color 0.2s", cursor: "pointer" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8F9FA")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                                            onClick={() => openModal(req)}
                                        >
                                            <td
                                                style={{
                                                    padding: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-start",
                                                    gap: "12px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#EAF8F4",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        marginLeft: "15px",
                                                        marginRight: "8px",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <User size={24} color="#1EC8A0" />
                                                </div>

                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ fontWeight: "bold", color: "#333", display: "block" }}>
                                                        الشيخ {req.teacher.fullName}
                                                    </span>
                                                    <span style={{ fontSize: "14px", color: "#666" }}>
                                                       متخصص في {req.teacher.specialization}
                                                    </span>
                                                </div>
                                            </td>

                                            <td style={{ padding: "10px", color: "#E2A200", fontWeight: "bold" }}>
                                                {req.status}
                                            </td>
                                            <td style={{ padding: "10px", whiteSpace: "pre-line", textAlign: "center" }}>
                                                {req.schedule}
                                            </td>
                                            <td style={{ padding: "10px" }}>
                                                <button
                                                    style={{
                                                        backgroundColor: "#E74C3C",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "8px 15px",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        margin: "auto",
                                                        gap: "5px",
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRequestToDelete(req);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                >
                                                    <X size={16} color="white" /> إلغاء الطلب
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details Modal */}
            <RequestDetailsModal
                isOpen={isModalOpen}
                request={selectedRequest}
                onClose={closeModal}
                onDelete={() => deleteRequest(selectedRequest?.id)}
            />
            {showDeleteConfirm && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "30px",
                            borderRadius: "10px",
                            textAlign: "center",
                            direction: "rtl",
                        }}
                    >
                        <h3>تأكيد إلغاء الطلب</h3>
                        <p>هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.</p>
                        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "right" }}>
                            <button
                                onClick={() => {
                                    deleteRequest(requestToDelete?.id);
                                    setShowDeleteConfirm(false);
                                }}
                                style={{
                                    backgroundColor: "#E74C3C",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                }}
                            >
                                نعم، إلغاء الطلب
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                style={{
                                    backgroundColor: "#ccc",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                    border: "none",
                                }}
                            >
                                لا
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentRequests;

import React from "react";
import { X, Calendar, Clock, User } from "lucide-react";

const statusMessages = {
    pending: "قيد الانتظار - في انتظار رد المعلم على الجدولة",
    accepted: "تمت الموافقة - تم تأكيد الجدولة من قبل المعلم",
    rejected: "مرفوض - المعلم رفض طلب الجدولة",
    completed: "مكتمل - تم الانتهاء من جميع الدروس",
    cancelled: "ملغى - تم إلغاء الطلب",
};

const statusMapping = {
    "قيد الانتظار": "pending",
    "تمت الموافقة": "accepted",
    "مرفوض": "rejected",
    "مكتمل": "completed",
    "ملغى": "cancelled",
};

export default function RequestDetailsModal({
    isOpen,
    onClose,
    request,
    onDelete,
    errorMessage,
}) {
    if (!isOpen || !request) return null;

    const mappedStatus = statusMapping[request.status];
    const statusMessage = statusMessages[mappedStatus] || "غير معروف";

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button onClick={onClose} style={styles.closeButton}>
                    <X size={20} />
                </button>
                <h2 style={styles.title}>تفاصيل الطلب</h2>
                <p style={styles.subtitle}>معلومات تفصيلية عن طلب الجدولة</p>

                {/* Error Message */}
                {errorMessage && (
                    <div style={styles.errorBox}>
                        {errorMessage}
                    </div>
                )}

                {/* User Info */}
                <div style={styles.userInfo}>
                    <div>
                        <p style={styles.userName}>
                            {request?.teacher?.teacherinfo 
                                ? `${request.teacher.teacherinfo.fname} ${request.teacher.teacherinfo.lname}`
                                : request?.teacher?.fullName || "اسم الشيخ"}
                        </p>
                        <p style={styles.userRole}>
                            {request?.teacher?.teacherinfo?.specialty || request?.teacher?.specialization || "التخصص"}
                        </p>
                    </div>
                    <div style={styles.userIconContainer}>
                        {request?.teacher?.teacherinfo?.profile_pic ? (
                            <img src={request.teacher.teacherinfo.profile_pic} alt="Profile" style={styles.profileImg} />
                        ) : (
                            <User size={24} color="#1EC8A0" />
                        )}
                    </div>
                </div>

                {/* Schedule Details */}
                <div style={styles.detailsBox}>
                    <p style={styles.sectionTitle}>تفاصيل الجدول</p>
                    
                    <div style={styles.detailRow}>
                        <Calendar size={16} color="#1EC8A0" />
                        <p>أيام الدراسة: <span style={styles.highlight}>{request?.days || "الأحد"}</span></p>
                    </div>

                    <div style={styles.detailRow}>
                        <Clock size={16} color="#1EC8A0" />
                        <p>وقت ومدّة الدرس: <span style={styles.highlight}>{request?.time || "7:30 PM - 60 دقيقة"}</span></p>
                    </div>

                    <div style={styles.detailRow}>
                        <Calendar size={16} color="#1EC8A0" />
                        <p>فترة الدراسة : <span>{request?.startDate || "10/03/2025"} - {request?.endDate || "10/06/2025"}</span></p>
                    </div>
                </div>

                {/* Status */}
                <div style={styles.statusBox}>
                    <p style={styles.statusText}>حالة الطلب</p>
                    <p style={styles.statusDetail}>{statusMessage}</p>
                </div>

                {/* Cancel Button */}
                <button 
                    style={styles.cancelButton} 
                    onClick={() => onDelete(request.id)}
                >
                    إلغاء الطلب
                </button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: "12px",
        width: "360px",
        maxHeight: "100vh",
        overflowY: "auto",
        textAlign: "right",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        fontFamily: "Tajawal",
    },
    closeButton: {
        position: "absolute",
        top: "8px",
        left: "8px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
    },
    title: {
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: "12px",
        color: "#666",
        textAlign: "center",
    },
    userInfo: {
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        backgroundColor: "#E3F7F1",
        padding: "8px",
        borderRadius: "6px",
        marginTop: "6px",
    },
    userName: {
        fontSize: "14px",
        marginRight: "20px",
        fontWeight: "bold",
    },
    userRole: {
        fontSize: "12px",
        color: "#666",
        marginRight: "20px",
    },
    userIconContainer: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#EAF8F4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    profileImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%",
    },
    detailsBox: {
        backgroundColor: "#f9f9f9",
        padding: "8px",
        borderRadius: "6px",
        marginTop: "6px",
    },
    detailRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "4px",
    },
    highlight: {
        fontWeight: "bold",
        color: "#1EC8A0",
    },
    statusBox: {
        backgroundColor: "#FFF5CC",
        padding: "6px",
        borderRadius: "6px",
        marginTop: "6px",
    },
    statusText: {
        fontWeight: "bold",
    },
    statusDetail: {
        fontSize: "12px",
        color: "#666",
    },
    cancelButton: {
        backgroundColor: "#E74C3C",
        color: "#fff",
        border: "none",
        padding: "6px",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "8px",
    },
    errorBox: {
        backgroundColor: "#fdd",
        color: "#a00",
        padding: "8px",
        borderRadius: "6px",
        marginTop: "8px",
        fontSize: "13px",
        textAlign: "center",
    },
};

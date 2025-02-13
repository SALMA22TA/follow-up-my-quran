import React from "react";
import mashariImage from "../Pages/images/Mashari.jpeg";
import verifyIcon from "../Pages/images/verify.svg.svg"; // Add the verification icon
import { Link } from "react-router-dom";

const TeachersSection = () => {
    const teachers = [
        {
            name: "مشاري راشد العفاسي",
            description:
                "هو قارئ القرآن الكريم ومنشد، وقد أحرز إجازات في قراءة عاصم بروايتي حفص وشعبة من طريق الطيبة",
            image: mashariImage,
        },
        {
            name: "مشاري راشد العفاسي",
            description:
                "هو قارئ القرآن الكريم ومنشد، وقد أحرز إجازات في قراءة عاصم بروايتي حفص وشعبة من طريق الطيبة",
            image: mashariImage,
        },
        {
            name: "مشاري راشد العفاسي",
            description:
                "هو قارئ القرآن الكريم ومنشد، وقد أحرز إجازات في قراءة عاصم بروايتي حفص وشعبة من طريق الطيبة",
            image: mashariImage,
        },
        {
            name: "مشاري راشد العفاسي",
            description:
                "هو قارئ القرآن الكريم ومنشد، وقد أحرز إجازات في قراءة عاصم بروايتي حفص وشعبة من طريق الطيبة",
            image: mashariImage,
        },
    ];

    return (
        <div style={styles.container}>
            <p style={styles.subheading}>المعلمون</p>
            <h2 style={styles.heading}>إليكم معلمو منصة هدى القرآن</h2>

            <div style={styles.teachersGrid}>
                {teachers.map((teacher, index) => (
                    <div key={index} style={styles.teacherCard}>
                        <img src={teacher.image} alt={teacher.name} style={styles.image} />
                        <div style={styles.nameContainer}>
                            <h3 style={styles.teacherName}>{teacher.name}</h3>
                            <img src={verifyIcon} alt="Verified" style={styles.verifyIcon} />
                        </div>
                        <p style={styles.teacherDescription}>{teacher.description}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "40px" }}>
                <Link to="/teacher-list" style={styles.moreButton}>
                    عرض المزيد
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "3rem 6rem",
        direction: "rtl",
        backgroundColor: "#F8F8F8",
    },
    subheading: {
        fontFamily: "'Aref Ruqaa', sans-serif",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#D4A800",
    },
    heading: {
        fontFamily: '"Tajawal", sans-serif',
        fontSize: "28px",
        fontWeight: "bold",
        color: "#090909",
        marginBottom: "20px",
    },
    teachersGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
    },
    teacherCard: {
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "20px",
        textAlign: "right",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    },
    image: {
        width: "100%",
        borderRadius: "10px",
    },
    nameContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "right",
        gap: "5px",
    },
    teacherName: {
        fontSize: "18px",
        fontWeight: "bold",
        marginTop: "10px",
    },
    verifyIcon: {
        width: "18px",
        height: "18px",
    },
    teacherDescription: {
        fontSize: "14px",
        color: "#5A5A5A",
        marginTop: "10px",
        textAlign: "right",
    },
    moreButton: {
        fontFamily: '"Tajawal", sans-serif',
        marginTop: "20px",
        padding: "10px 48px",
        backgroundColor: "transparent",
        color: "#20C997",
        border: "1px solid #20C997",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.3s ease",
    },
};

export default TeachersSection;

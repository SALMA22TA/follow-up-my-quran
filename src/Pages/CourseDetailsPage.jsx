import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function CourseDetailsPage() {

    const courses = [
        { title: "الحياة البرية", description: "لمحة عن الحياة البرية" },
        { title: "لمحة عن الطبيعة الأمريكية", description: "لمحة عن الطبيعة الأمريكية" },
        { title: "الحياة الاسكتلندية", description: "لمحة عن الحياة الاسكتلندية" },
    ];

      

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <Sidebar/>

            {/* Main Content */}
            <main style={styles.main}>
                <div style={styles.card}>
                    {/* Upload Button */}
                    <Link to="/add-video" style={styles.button}>هل تريد تحميل فيديو؟</Link>

                    <h1 style={styles.title}>تفاصيل الدورة</h1>

                    <div style={{ borderBottom: "2px solid black", paddingBottom: "5px", marginBottom: "15px" }}>
                        <h2 style={styles.sectionTitle}>:عنوان الفيديو</h2>
                        <p style={{ fontSize: "30px", fontWeight: "bold", color: "#374151" }}>لمحة عن الدب القطبي</p>
                    </div>

                    <div style={{ borderBottom: "2px solid black", paddingBottom: "15px", marginBottom: "15px" }}>
                        <h2 style={styles.sectionTitle}>:الوصف</h2>
                        <p style={{ fontSize: "16px", color: "#374151" }}>الدُّبُّ القُطبيّ أو الدُّبّ الأبيض نوع من الدببة يتواجد في منطقة القطب الشمالي الممتدة عبر شمالي ألاسكا، كندا، روسيا، النرويج، وجرينلاند وما حولها</p>
                    </div>

                    {/* Video List */}
                    <h2 style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>الفيديوهات المتاحة</h2>
                    <div style={styles.videoList}>
                        {courses.map((course, index) => (
                            <Link to={`/course-details/${course.title}`} key={index} style={{ ...styles.videoCard, textDecoration: "none" }}>
                                <h3 style={{ color: "rgb(30, 200, 160)", fontSize: "16px", fontWeight: "bold" }}>{course.title}</h3>
                                <p style={{ color: "#6b7280", fontSize: "14px" }}>{course.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
const styles = {
    container: {
        display: "flex",
        height: "auto",
        backgroundColor: "#fff",
        flexDirection: "row-reverse"
    },
    // sidebar: {
    //     backgroundColor: "#fff",
    //     boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    //     padding: "20px",
    //     transition: "width 0.3s ease",
    //     textAlign: "right",
    //     fontFamily: "Tajawal",
    //     height: "auto",
    // },
    // sidebarButton: {
    //     marginBottom: "20px",
    //     background: "none",
    //     border: "none",
    //     cursor: "pointer",
    // },
    // nav: {
    //     display: "flex",
    //     flexDirection: "column",
    //     gap: "15px",
    // },
    // navLink: {
    //     textDecoration: "none",
    //     color: "#333",
    //     padding: "5px 0",
    //     display: "block",
    //     fontWeight: "700",
    //     fontFamily: "Tajawal",
    // },
    main: {
        flex: 1,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    card: {
        padding: "20px",
        // backgroundColor: "white",
        backgroundColor: '#D5E7E1',
        borderRadius: "15px",
        boxShadow: "0 4px 10px #666",
        width: "100%",
        maxWidth: "700px",
        textAlign: "right",
        position: "relative",
    },
    button: {
        position: "absolute",
        top: "15px",
        left: "15px",
        backgroundColor: "#1EC8A0",
        color: "#fff",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        textDecoration: "none",
    },
    title: {
        fontSize: "30px",
        fontWeight: "bold",
        textAlign: "center",
        color: "rgb(30, 200, 160)",
    },
    sectionTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "rgb(30, 200, 160)",
    },
    videoList: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        marginTop: "20px"
    },
    videoCard: {
        padding: "15px",
        border: "2px solid #1EC8A0",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.3s",

    },
};

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Upload } from "lucide-react";

export default function UploadVideoPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);

    const handleUpload = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleSubmit = () => {
        if (videoFile) {
            alert(`تم رفع الفيديو: ${videoTitle || "بدون عنوان"}`);
            setVideoTitle("");
            setVideoDescription("");
            setVideoFile(null);
        } else {
            alert("يرجى اختيار فيديو قبل الإضافة!");
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={{ ...styles.sidebar, width: sidebarOpen ? "250px" : "60px" }}>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.sidebarButton}>
                    <Menu size={24} style={{ color: "#666" }} />
                </button>
                <nav style={styles.nav}>
                    <Link to="/" style={styles.navLink}>الصفحة الرئيسية</Link>
                    <Link to="/courses" style={styles.navLink}>الدورات</Link>
                    <Link to="/schedule-requests" style={styles.navLink}>طلبات الجدولة</Link>
                    <Link to="/chat" style={styles.navLink}>المحادثة</Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                <div style={styles.card}>
                    <div style={styles.decorative}></div>
                    <h1 style={styles.title}>رفع فيديو جديد</h1>

                    <input
                        type="text"
                        placeholder="عنوان الفيديو"
                        style={styles.input}
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="وصف الفيديو"
                        style={styles.textarea}
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                    ></textarea>

                    <label style={styles.uploadBox}>
                        <Upload size={50} style={{ color: "green", marginBottom: "10px" }} />
                        <span>{videoFile ? videoFile.name : "اضغط هنا لرفع الفيديو"}</span>
                        <input type="file" accept="video/*" style={styles.hiddenInput} onChange={handleUpload} />
                    </label>

                    <button style={styles.button} onClick={handleSubmit}>أضف الفيديو</button>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        color: "#000",
        flexDirection: "row-reverse",
        fontFamily: "Tajawal",
    },
    sidebar: {
        backgroundColor: "#fff",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        padding: "20px",
        transition: "width 0.3s ease",
        textAlign: "right",
        fontFamily: "Tajawal",
    },
    sidebarButton: {
        marginBottom: "20px",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    navLink: {
        textDecoration: "none",
        color: "#333",
        padding: "5px 0",
        display: "block",
        fontWeight: "700",
        fontFamily: "Tajawal",
    },
    main: {
        flex: 1,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "right",
    },
    card: {
        padding: "30px",
        width: "100%",
        maxWidth: "600px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        position: "relative",
    },
    decorative: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "60px",
        height: "60px",
        backgroundColor: "green",
        borderBottomRightRadius: "100%",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
        color: "#333",
        fontFamily: "Tajawal",
    },
    input: {
        width: "90%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "right",
        marginBottom: "15px",
        fontSize: "16px",
        fontFamily: "Tajawal",
    },
    textarea: {
        width: "90%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "right",
        marginBottom: "15px",
        fontSize: "16px",
        resize: "none",
        fontFamily: "Tajawal",
    },
    uploadBox: {
        width: "77.5%",
        padding: "50px",
        border: "2px dashed #666",
        borderRadius: "8px",
        textAlign: "center",
        color: "#444",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
        fontFamily: "Tajawal",
        marginLeft: "auto",
    }
    ,
  hiddenInput: {
        display: "none",
    },
    button: {
        width: "100%",
        backgroundColor: "green",
        color: "#fff",
        fontWeight: "bold",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontFamily: "Tajawal",
    },
};
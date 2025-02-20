import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, PlusCircle } from "lucide-react";

export default function AddCoursePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? "250px" : "60px" }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.sidebarButton}>
          <Menu size={24} style={{ color: "#666" }} />
        </button>
        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link to="/" style={styles.navLink}>الصفحة الرئيسية</Link>
          <Link to="/courses" style={styles.navLink}>الدورات</Link>
          <Link to="/requests" style={styles.navLink}>طلبات الجدولة</Link>
          <Link to="/chat" style={styles.navLink}>المحادثة</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>إضافة دورة جديدة</h1>
        </div>

        {/* Course Form */}
        <div style={styles.card}>
          <h2 style={styles.title}>
            إضافة دورة <PlusCircle style={{ marginLeft: "8px" }} />
          </h2>

          {/* Input Fields */}
          <div style={styles.form}>
            <div>
              <label style={styles.label}>العنوان</label>
              <input type="text" placeholder="أدخل عنوان الدورة" style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>الوصف</label>
              <textarea placeholder="أدخل وصف الدورة" rows={4} style={styles.input}></textarea>
            </div>
            <button style={styles.button}>إضافة الدورة</button>
          </div>
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
  navLink: {
    textDecoration: "none",
    color: "#333",
    padding: "5px 0",
    display: "block",
    fontWeight: "700",
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
  header: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "20px",
  },
  card: {
    padding: "30px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "green",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "5px",
  },
  input: {
    width: "90%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "right",
    fontFamily: "Tajawal",
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
  },
};

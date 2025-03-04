import { useState } from "react";
import { PlusCircle } from "lucide-react";
import Sidebar from '../Components/Sidebar';
import Navbar from "../Components/DashboardNavbar";
import { useNavigate } from "react-router-dom";

export default function AddCoursePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddCourse = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/create_course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTA5ODEwMCwiZXhwIjoxNzQxMTAxNzAwLCJuYmYiOjE3NDEwOTgxMDAsImp0aSI6ImJXUXdkekU5VFJjUkJVdEkiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.ejJNkc3wpT5socKxcslEPV92uCBDw_L4lEi6ULCHZLw',
        },
        body: JSON.stringify({ title, description })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ الدورة أضيفت بنجاح!");
        console.log("Response Data:", data);
        setTitle("");
        setDescription("");
        setTimeout(() => {
          navigate('/courses');
        }, 1000);
      } else {
        setMessage(`❌ فشل الإضافة: ${data.message || "خطأ غير معروف"}`);
      }
    } catch (error) {
      console.log("Error:", error);
      setMessage("❌ حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
    }
    setLoading(false);
  };

  return (
    <><Navbar /><div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>إضافة دورة جديدة</h1>
        </div>
        <div style={styles.card}>
          <h2 style={styles.title}>
            إضافة دورة <PlusCircle style={{ marginLeft: "8px" }} />
          </h2>
          <div style={styles.form}>
            <div>
              <label style={styles.label}>العنوان</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="أدخل عنوان الدورة" style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>الوصف</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="أدخل وصف الدورة" rows={4} style={styles.input}></textarea>
            </div>
            <button onClick={handleAddCourse} style={styles.button} disabled={loading}>
              {loading ? "جاري الإضافة..." : "إضافة الدورة"}
            </button>
            {message && <p style={{ textAlign: "center", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
          </div>
        </div>
      </main>
    </div></>
  );
}


const styles = {
  container: {
    display: "flex",
    height: "100vh",
    // backgroundColor: "#f5f5f5",
    backgroundColor: '#fff',
    color: "#000",
    flexDirection: "row-reverse",
    fontFamily: "Tajawal",
  },
  // sidebar: {
  //   backgroundColor: "#fff",
  //   boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  //   padding: "20px",
  //   transition: "width 0.3s ease",
  //   textAlign: "right",
  //   fontFamily: "Tajawal",
  // },
  // sidebarButton: {
  //   marginBottom: "20px",
  //   background: "none",
  //   border: "none",
  //   cursor: "pointer",
  // },
  // navLink: {
  //   textDecoration: "none",
  //   color: "#333",
  //   padding: "5px 0",
  //   display: "block",
  //   fontWeight: "700",
  // },
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
    backgroundColor: '#D5E7E1',
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "rgb(30, 200, 160)",
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
    backgroundColor: "#1EC8A0",
    color: "#fff",
    fontWeight: "bold",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};

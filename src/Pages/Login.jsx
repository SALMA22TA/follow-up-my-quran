import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // تصفير الرسالة قبل بدء العملية
    
    try {
      const response = await axios.post(
        "https://graduation-main-0wwkv3.laravel.cloud/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Login Response:", response.data); // طباعة الاستجابة في الكونسول
      
      if (response.data.access_token) {
        setMessage("تم تسجيل الدخول بنجاح!");
        localStorage.setItem("token", response.data.access_token); // حفظ التوكن
      } else {
        setMessage("حدث خطأ غير متوقع.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
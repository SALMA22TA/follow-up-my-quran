// import { useState } from "react"
// import { Link } from "react-router-dom"
import "../styles/coming-soon-teacher.css"

const ComingSoonTeacher = () => {
  // const [email, setEmail] = useState("")
  // const [feedback, setFeedback] = useState("")
  // const [isSubmitted, setIsSubmitted] = useState(false)
  // const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   // Here you would typically send the email to your backend
  //   console.log("Email submitted:", email)
  //   setIsSubmitted(true)
  //   setEmail("")

  //   // Reset the submission state after 3 seconds
  //   setTimeout(() => {
  //     setIsSubmitted(false)
  //   }, 3000)
  // }

  // const handleFeedbackSubmit = (e) => {
  //   e.preventDefault()
  //   // Here you would send the feedback to your backend
  //   console.log("Feedback submitted:", feedback)
  //   setFeedback("")
  //   setShowFeedbackForm(false)
  //   alert("شكراً لك! تم إرسال ملاحظاتك بنجاح.")
  // }

  return (
    <div dir="rtl" className="coming-soon-container">
      <div className="coming-soon-card">
        <div className="feature-badge">للمعلمين</div>

        <h1 className="coming-soon-title">المحادثات</h1>

        <div className="coming-soon-icon">
          <div className="pulse-circle"></div>
          <div className="teacher-icon">
            <div className="teacher-icon-inner"></div>
          </div>
        </div>

        <h2 className="coming-soon-subtitle">قريباً...</h2>

        <p className="coming-soon-description">
          نعمل حالياً على تطوير محادثات متكاملة للمعلمين، ستمكنك من التواصل بشكل فعال مع طلابك، متابعة تقدمهم،
          وتقديم الإرشادات المخصصة لكل طالب. ستكون أداة قوية تساعدك في تحسين جودة التعليم وتوفير الوقت والجهد.
        </p>

        <div className="teacher-benefits">
          <h3 className="benefits-title">مميزات للمعلمين</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon students-icon"></div>
              <div className="benefit-content">
                <h4>إدارة الطلاب</h4>
                <p>تنظيم الطلاب في مجموعات وإدارة جلسات التعليم بكفاءة</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon feedback-icon"></div>
              <div className="benefit-content">
                <h4>تقديم الملاحظات</h4>
                <p>إرسال ملاحظات صوتية ونصية مخصصة لكل طالب</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon schedule-icon"></div>
              <div className="benefit-content">
                <h4>جدولة الدروس</h4>
                <p>تنظيم مواعيد الدروس وإرسال تذكيرات تلقائية للطلاب</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon analytics-icon"></div>
              <div className="benefit-content">
                <h4>تحليلات وإحصائيات</h4>
                <p>متابعة تقدم الطلاب من خلال تقارير وإحصائيات مفصلة</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="notification-form">
          <h3 className="form-title">الوصول المبكر للمعلمين</h3>
          <p className="form-description">
            سجل بريدك الإلكتروني للحصول على وصول مبكر عند إطلاق المنصة وكن من أوائل المعلمين المستفيدين من هذه الميزات
          </p>

          <form onSubmit={handleSubmit} className="email-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              className="email-input"
            />
            <button type="submit" className="submit-button">
              تسجيل للوصول المبكر
            </button>
          </form>

          {isSubmitted && (
            <div className="success-message">تم التسجيل بنجاح! سنتواصل معك قريباً بخصوص الوصول المبكر للمنصة.</div>
          )}
        </div> */}

        {/* {!showFeedbackForm ? (
          <button onClick={() => setShowFeedbackForm(true)} className="feedback-button">
            شاركنا اقتراحاتك لتطوير المنصة
          </button>
        ) : (
          <div className="feedback-form">
            <h3 className="feedback-title">شاركنا اقتراحاتك</h3>
            <p className="feedback-description">نرحب بأفكارك واقتراحاتك لتطوير منصة المحادثات للمعلمين</p>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="اكتب اقتراحاتك هنا..."
                required
                className="feedback-textarea"
              ></textarea>
              <div className="feedback-actions">
                <button type="submit" className="send-feedback-button">
                  إرسال
                </button>
                <button type="button" onClick={() => setShowFeedbackForm(false)} className="cancel-button">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )} */}

        {/* <div className="action-buttons">
          <Link to="/" className="home-button">
            العودة للصفحة الرئيسية
          </Link>
          <Link to="/sheikh-dashboard" className="dashboard-button">
            لوحة تحكم المعلم
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default ComingSoonTeacher

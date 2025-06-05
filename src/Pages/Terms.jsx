import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/terms.css"

const Terms = () => {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const sections = [
    {
      id: 1,
      title: "١. قبول الشروط",
      content: `باستخدامك لمنصة هدى القرآن، فإنك توافق على الالتزام بكافة شروط الاستخدام المذكورة في هذه الصفحة. إذا كنت لا توافق على أي جزء من هذه الشروط، يجب عليك عدم استخدام المنصة.`,
    },
    {
      id: 2,
      title: "٢. الاستخدام المشروع",
      content: `يحق لك استخدام المنصة فقط للأغراض المشروعة. أي استخدام مخالف للقوانين أو الذي قد يضر بالمنصة أو مستخدميها ممنوع تمامًا.`,
    },
    {
      id: 3,
      title: "٣. الحسابات الشخصية",
      content: `يجب أن تقدم معلومات دقيقة عند إنشاء حسابك على المنصة. كما أنك مسؤول عن الحفاظ على سرية بيانات الدخول الخاصة بك.`,
    },
    {
      id: 4,
      title: "٤. المحتوى المقدم من المستخدمين",
      content: `المستخدمون ملزمون بنشر محتوى يتماشى مع القيم الإسلامية، ونحن نحتفظ بالحق في إزالة أي محتوى يتعارض مع هذه القيم أو مع الشروط المذكورة.`,
    },
    {
      id: 5,
      title: "٥. حقوق الملكية الفكرية",
      content: `جميع حقوق الملكية الفكرية المتعلقة بالمنصة، بما في ذلك النصوص، الصور، والشعارات، تعود لـ هدى القرآن ولا يجوز استخدامها دون إذن.`,
    },
    {
      id: 6,
      title: "٦. إخلاء المسؤولية",
      content: `يتم تقديم المنصة "كما هي"، ونحن لا نتحمل أي مسؤولية عن الأضرار أو الخسائر التي قد تنجم عن استخدام المنصة.`,
    },
    {
      id: 7,
      title: "٧. تحديد المسؤولية",
      content: `لا يمكن تحميل هدى القرآن أي مسؤولية عن الأضرار غير المباشرة أو التبعية التي قد تنجم عن استخدام المنصة.`,
    },
    {
      id: 8,
      title: "٨. التعديلات على الشروط",
      content: `نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يوصى بمراجعة الشروط بانتظام لضمان استمرار توافقك مع التعديلات.`,
    },
    {
      id: 9,
      title: "٩. إنهاء الاستخدام",
      content: `يحق لنا تعليق أو إنهاء حسابك في حال انتهاك هذه الشروط، دون الحاجة إلى إشعار مسبق.`,
    },
    {
      id: 10,
      title: "١٠. القانون المعمول به",
      content: `تخضع هذه الشروط لأحكام قوانين [البلد/المدينة]، وأي نزاع ينشأ عن هذه الشروط يخضع لاختصاص المحاكم المحلية.`,
    },
    {
      id: 11,
      title: "١١. الاتصال بنا",
      content: `إذا كان لديك أي استفسار بخصوص شروط الاستخدام، يمكنك التواصل معنا عبر البريد الإلكتروني: support@hudaalquran.com`,
    },
  ]

  return (
    <div dir="rtl" className="terms-container">
      <div className="terms-header">
        <h1 className="terms-title">شروط الاستخدام</h1>
        <p className="terms-subtitle">
          مرحبا بك في منصة <strong>هدى القرآن</strong>! قبل البدء في استخدام الموقع، يرجى قراءة الشروط بعناية.
        </p>
      </div>

      <div className="terms-content">
        {sections.map((section) => (
          <div key={section.id} className="dropdown-section">
            <button
              className={`dropdown-header ${openSections[section.id] ? "active" : ""}`}
              onClick={() => toggleSection(section.id)}
            >
              <span className="dropdown-title">{section.title}</span>
              <span className={`dropdown-arrow ${openSections[section.id] ? "rotated" : ""}`}>▼</span>
            </button>
            <div className={`dropdown-content ${openSections[section.id] ? "open" : ""}`}>
              <p className="dropdown-text">{section.content}</p>
              {section.id === 11 && (
                <div className="contact-links">
                  <a href="mailto:support@hudaalquran.com" className="email-link">
                    support@hudaalquran.com
                  </a>
                  <Link to="/login" className="login-link">
                    الذهاب لتسجيل الدخول
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="terms-footer">
        <p className="footer-text">
          © 2025 <strong>هدى القرآن</strong>. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  )
}

export default Terms
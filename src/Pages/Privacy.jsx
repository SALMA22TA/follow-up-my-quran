import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/privacy.css"

const Privacy = () => {
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
      title: "١. المعلومات التي نجمعها",
      content: (
        <div>
          <p>نحن نجمع المعلومات التالية:</p>
          <ul>
            <li>المعلومات الشخصية: مثل الاسم، والبريد الإلكتروني، وكلمة المرور عند التسجيل.</li>
            <li>
              بيانات الاستخدام: تتضمن عنوان IP، ونوع المتصفح، والمعلومات المتعلقة بالجهاز، والصفحات التي تمت زيارتها.
            </li>
            <li>الكوكيز: نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل البيانات.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 2,
      title: "٢. كيف نستخدم معلوماتك",
      content: (
        <div>
          <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
          <ul>
            <li>إدارة الحساب وتقديم الوصول إلى الميزات.</li>
            <li>تخصيص تجربتك وتقديم محتوى مخصص.</li>
            <li>التواصل معك عبر البريد الإلكتروني أو الرسائل المتعلقة بحسابك أو منصتنا.</li>
            <li>تحسين خدماتنا وتحليل تفاعلك مع المنصة.</li>
            <li>الامتثال للمتطلبات القانونية.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 3,
      title: "٣. كيف نحمي معلوماتك",
      content: `نحن نستخدم تدابير أمان قياسية مثل التشفير والبروتوكولات الآمنة لحماية بياناتك من الوصول غير المصرح به. ومع ذلك، لا توجد طريقة نقل بيانات عبر الإنترنت أو تخزين إلكتروني مضمونة بنسبة 100%.`,
    },
    {
      id: 4,
      title: "٤. مشاركة معلوماتك",
      content: (
        <div>
          <p>
            نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة لأغراض تسويقية. ومع ذلك، قد نشارك بياناتك في الحالات
            التالية:
          </p>
          <ul>
            <li>مقدمو الخدمات الذين يساعدوننا في تشغيل منصتنا.</li>
            <li>متطلبات قانونية: إذا كنا ملزمين بكشف البيانات بموجب القانون.</li>
            <li>الانتقال التجاري: في حالة دمج أو بيع أو نقل جزء من أعمالنا.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 5,
      title: "٥. حقوقك",
      content: (
        <div>
          <p>وفقًا للقوانين المعمول بها، يحق لك:</p>
          <ul>
            <li>طلب الوصول إلى بياناتك الشخصية وتصحيح أي معلومات غير دقيقة.</li>
            <li>طلب حذف حسابك وبياناتك الشخصية.</li>
            <li>إلغاء الاشتراك في تلقي رسائل ترويجية.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 6,
      title: "٦. الاحتفاظ بالبيانات",
      content: `سنحتفظ بمعلوماتك الشخصية فقط طالما كان ذلك ضروريًا للأغراض التي تم جمعها من أجلها، أو كما تقتضي القوانين السارية.`,
    },
    {
      id: 7,
      title: "٧. خصوصية الأطفال",
      content: `منصتنا غير مخصصة للأطفال دون سن 13 عامًا. إذا اكتشفنا أننا جمعنا بيانات شخصية من طفل دون سن 13، سنتخذ خطوات لحذف تلك البيانات.`,
    },
    {
      id: 8,
      title: "٨. التغييرات في سياسة الخصوصية",
      content: `نحتفظ بالحق في تعديل سياسة الخصوصية هذه في أي وقت. سيتم نشر التغييرات على هذه الصفحة مع تاريخ سريان جديد. نوصي بمراجعة هذه السياسة بشكل دوري للبقاء على اطلاع.`,
    },
    {
      id: 9,
      title: "٩. كيفية الاتصال بنا",
      content: (
        <div>
          <p>
            إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية هذه أو طريقة تعاملنا مع بياناتك، يمكنك الاتصال بنا
            عبر:
          </p>
          <p>
            <strong>البريد الإلكتروني: support@hudaalquran.com</strong>
          </p>
          <div className="contact-links">
            <a href="mailto:support@hudaalquran.com" className="email-link">
              support@hudaalquran.com
            </a>
            <Link to="/login" className="login-link">
              الذهاب لتسجيل الدخول
            </Link>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div dir="rtl" className="privacy-container">
      <div className="privacy-header">
        <h1 className="privacy-title">سياسة الخصوصية</h1>
        <p className="privacy-subtitle">
          مرحباً بك في موقع <strong>هدى القرآن</strong>. نحن ملتزمون بحماية خصوصيتك وتوفير تجربة آمنة. تسرد هذه السياسة
          كيفية جمع واستخدام وحماية بياناتك الشخصية عند استخدامك لمنصتنا.
        </p>
      </div>

      <div className="privacy-content">
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
              <div className="dropdown-text">
                {typeof section.content === "string" ? <p>{section.content}</p> : section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="privacy-footer">
        <p className="footer-text">
          © 2024 <strong>هدى القرآن</strong>. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  )
}

export default Privacy
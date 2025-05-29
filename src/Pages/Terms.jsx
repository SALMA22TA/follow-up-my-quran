// @ts-ignore
import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {

  return (
    <div 
// @ts-ignore
    style={styles.pageContainer}>
      <div 
// @ts-ignore
      style={styles.headerContainer}>
        <h1 style={styles.header}>شروط الاستخدام</h1>
        <p style={styles.subHeader}>مرحبا بك في منصة <strong>هدى القرآن</strong>! قبل البدء في استخدام الموقع، يرجى قراءة الشروط بعناية.</p>
      </div>
      
      <div style={styles.contentContainer}>
        <h2 style={styles.sectionHeader}>١. قبول الشروط</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          باستخدامك لمنصة <strong>هدى القرآن</strong>، فإنك توافق على الالتزام بكافة شروط الاستخدام المذكورة في هذه الصفحة. إذا كنت لا توافق على أي جزء من هذه الشروط، يجب عليك عدم استخدام المنصة.
        </p>

        <h2 style={styles.sectionHeader}>٢. الاستخدام المشروع</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          يحق لك استخدام المنصة فقط للأغراض المشروعة. أي استخدام مخالف للقوانين أو الذي قد يضر بالمنصة أو مستخدميها ممنوع تمامًا.
        </p>

        <h2 style={styles.sectionHeader}>٣. الحسابات الشخصية</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          يجب أن تقدم معلومات دقيقة عند إنشاء حسابك على المنصة. كما أنك مسؤول عن الحفاظ على سرية بيانات الدخول الخاصة بك.
        </p>

        <h2 style={styles.sectionHeader}>٤. المحتوى المقدم من المستخدمين</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          المستخدمون ملزمون بنشر محتوى يتماشى مع القيم الإسلامية، ونحن نحتفظ بالحق في إزالة أي محتوى يتعارض مع هذه القيم أو مع الشروط المذكورة.
        </p>

        <h2 style={styles.sectionHeader}>٥. حقوق الملكية الفكرية</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          جميع حقوق الملكية الفكرية المتعلقة بالمنصة، بما في ذلك النصوص، الصور، والشعارات، تعود لـ <strong>هدى القرآن</strong> ولا يجوز استخدامها دون إذن.
        </p>

        <h2 style={styles.sectionHeader}>٦. إخلاء المسؤولية</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          يتم تقديم المنصة "كما هي"، ونحن لا نتحمل أي مسؤولية عن الأضرار أو الخسائر التي قد تنجم عن استخدام المنصة.
        </p>

        <h2 style={styles.sectionHeader}>٧. تحديد المسؤولية</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          لا يمكن تحميل <strong>هدى القرآن</strong> أي مسؤولية عن الأضرار غير المباشرة أو التبعية التي قد تنجم عن استخدام المنصة.
        </p>

        <h2 style={styles.sectionHeader}>٨. التعديلات على الشروط</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يوصى بمراجعة الشروط بانتظام لضمان استمرار توافقك مع التعديلات.
        </p>

        <h2 style={styles.sectionHeader}>٩. إنهاء الاستخدام</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          يحق لنا تعليق أو إنهاء حسابك في حال انتهاك هذه الشروط، دون الحاجة إلى إشعار مسبق.
        </p>

        <h2 style={styles.sectionHeader}>١٠. القانون المعمول به</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          تخضع هذه الشروط لأحكام قوانين [البلد/المدينة]، وأي نزاع ينشأ عن هذه الشروط يخضع لاختصاص المحاكم المحلية.
        </p>

        <h2 style={styles.sectionHeader}>١١. الاتصال بنا</h2>
        <p 
// @ts-ignore
        style={styles.text}>
          إذا كان لديك أي استفسار بخصوص شروط الاستخدام، يمكنك التواصل معنا عبر البريد الإلكتروني:
          <br />
          <a href="mailto:support@hudaalquran.com" style={styles.emailLink}>support@hudaalquran.com</a>
        </p>
        <p>
          <Link to="/login" style={styles.loginLink}>الذهاب لتسجيل الدخول</Link>
        </p>
      </div>

      <div 
// @ts-ignore
      style={styles.footerContainer}>
        <p style={styles.footerText}>
          © 2024 <strong>هدى القرآن</strong>. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#f3f4f6',
    fontFamily: '"Arial", sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '2rem',
    textAlign: 'right',
  },
  headerContainer: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  header: {
    fontSize: '3rem',
    color: "rgb(30, 200, 160)",
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: '1.2rem',
    color: '#333',
    maxWidth: '800px',
    margin: '0 auto',
    fontWeight: 'lighter',
  },
  contentContainer: {
    width: '80%',
    maxWidth: '800px',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  },
  sectionHeader: {
    fontSize: '1.6rem',
    marginBottom: '1rem',
    color: '#333',
    fontWeight: 'bold',
  },
  text: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    textAlign: 'right',
  },
  emailLink: {
    color: '#4caf50',
    textDecoration: 'underline',
  },
  footerContainer: {
    width: '100%',
    textAlign: 'center',
    marginTop: 'auto',
    padding: '1rem',
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#777',
  },
  loginLink: {
    color: '#4caf50',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
};

export default Terms;

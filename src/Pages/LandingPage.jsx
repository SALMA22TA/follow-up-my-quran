import React from 'react';
import FeaturesSection from '../Components/FeaturesSection';
import TeachersSection from '../Components/TeachersSection';

const LandingPage = () => {
  return (
    <div>
      {/* Existing Sections */}
      <div style={styles.container}>
        {/* Left Section */}
        <div style={styles.leftSection}>
          <p style={styles.subheading}>نبذة عن المنصة</p>
          <h2 style={styles.heading}>نبذة عن منصة هدى القرآن</h2>
          <p style={styles.description}>
            افضل منصة في الشرق الاوسط لتحفيظ القرآن الكريم
            بمتابعه دورية مع افضل المعلمين والمعلمات باي وقت واي مكان...
            ابدأ فحفظ ومراجعة القرآن الكريم في الحال على منصة هدى القرآن
          </p>

          {/* List of Features */}
          <ul style={styles.list}>
            {features.map((feature, index) => (
              <li key={index} style={styles.listItem}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="green" 
                  width="20px" 
                  height="20px"
                  style={styles.checkIcon}
                >
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z"/>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - YouTube Video */}
        <div style={styles.rightSection}>
          <iframe 
            style={styles.video}
            src="https://www.youtube.com/embed/zSH15dIl7D0" 
            title="منصة هدى القرآن"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* The Features Section */}
      <FeaturesSection />
      {/* The Teachers Section */}
      <TeachersSection />
    </div>
  );
};

const features = [
  "13000 معلم ومعلمة من جميع أنحاء الشرق الأوسط.",
  "600000 طالب وطالبة يستخدمون منصة هدى القرآن.",
  "إحياء تعاليم الدين الإسلامي عن طريق مراجعة وحفظ القرآن.",
  "إمكانية الوصول إلى المنصة من أكثر من 120 دولة حول العالم.",
  "تجربة تعليمية متكاملة مع اختبارات دورية لتقييم الأداء وتحديد مستواك في الحفظ.",
  "خطة حفظ مرنة تناسب جميع الأعمار والمستويات، من المبتدئين إلى المتقدمين."
];

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3rem 6rem',
    backgroundColor: '#F8F8F8',
    borderRadius: '10px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  },
  leftSection: {
    flex: 1,
    textAlign: 'right',
    paddingRight: '2rem',
    direction: 'rtl',
  },
  subheading: {
    fontFamily: '"Tajawal", sans-serif',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#D4A800', 
  },
  heading: {
    fontFamily: '"Tajawal", sans-serif',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#090909',
    margin: '10px 0',
  },
  description: {
    fontFamily: '"Tajawal", sans-serif',
    fontSize: '16px',
    color: '#5A5A5A',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    color: '#090909',
  },
  listItem: {
    fontFamily: '"Tajawal", sans-serif',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    marginBottom: '10px',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: '8px',
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '350px',
    borderRadius: '10px',
    border: 'none',
  },
};

export default LandingPage;

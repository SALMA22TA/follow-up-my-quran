// import React from 'react';
import clock from "../Pages/images/clock.png";
import time from "../Pages/images/time.png";
import teacher from "../Pages/images/teacher.png";
import nan from "../Pages/images/nan.png";


const FeaturesSection = () => {
  return (
    <div id="features" 

    style={styles.container}>
      <p style={styles.subheading}>مميزاتنا</p>
      <h2 style={styles.heading}>ما يميز منصة هدى القرآن</h2>

      <div style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div 
            key={index} 
            
            style={{ 
              ...styles.featureBox, 
              backgroundColor: feature.highlight ? '#20C997' : '#FFFFFF', 
              color: feature.highlight ? '#FFFFFF' : '#000000' 
            }}>
            <img src={feature.icon} alt="icon" 

            style={styles.icon} />
            <div style={styles.textContent}>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const features = [
  {
    title: "على مدار الساعة",
    description: "يمكنك تتبع الخدمه مباشرة بالصوت او الفيديو علي مدار 24 ساعه من تطبيق واتموا مع امكانية تقيم مقدم الخدمة",
    icon: clock,
    highlight: true
  },
  {
    title: "مختلف الجنسيات والأعمار",
    description: "مهما كان عمرك وجنسيتك يمكنك استخدام المنصة لحفظ القرآن الكريم ومراجعتة مع افضل المعلمين في الشرق الاوسط",
    icon: nan,
    highlight: false
  },
  {
    title: "أكثر من معلم ومعلمة",
    description: "اكثر من 12000 معلم ومعلمة تحفيظ قرآن اخترناهم بعناية من بين الاف المتقدمين لتقديم خدمة مميزه اليكم",
    icon: teacher,
    highlight: false
  },
  {
    title: "تحديد وقت المراجعة",
    description: "يمكنك تحديد وقت المراجعة في اليوم والوقت الذي ترغب في مراجعة ماتم حفظة علي افضل المعلمين لديك",
    icon: time,
    highlight: false
  }
];

const styles = {
  container: {
    textAlign: 'center',
    padding: '3rem 6rem',
    direction: 'rtl',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
  },
  subheading: {
    fontFamily: '"Aref Ruqaa", sans-serif',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#D4A800',
  },
  heading: {
    fontFamily: '"Tajawal", sans-serif',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#090909',
    marginBottom: '20px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  featureBox: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'right',
    minHeight: '120px',
  },
  icon: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    width: '40px',
    height: '40px',
  },
  textContent: {
    paddingRight: '50px', 
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  featureDescription: {
    fontSize: '14px',
    color: '#5A5A5A',
    marginTop: '10px',
  }
};

export default FeaturesSection;

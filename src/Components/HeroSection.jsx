import React from 'react';
import Navbar from '../Components/Navbar'

const HeroSection = () => {
  return ( 
    <div id="hero" style={{ position: 'relative', width: '100%' }}>
      <Navbar />
       <div style={{
      backgroundImage: "url('/quraan.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
      position: 'relative',
      backdropFilter: 'blur(5px)',
      overflow: 'hidden',
      width: '100%',
    }}>
     <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, rgba(16, 24, 40, 0)  ,  rgba(16, 24, 40, 1))',
      }}></div>

      {/* Content Box */}
      <div style={{
        position: 'relative',
        padding: '40px',
        maxWidth: '800px',
        borderRadius: '8px',
        
      }}>
        
        <p style={{ color: '#DBA438', fontFamily:"'Aref Ruqaa', sans-serif", fontSize: '25px',fontWeight: '700', lineHeight: '37.51px' }}>معك في رحلة القرآن الكريم</p>
        <h1 style={{ fontFamily: "'Tajawal', sans-serif",fontWeight: '700', fontSize: '37px' }}>
          " منصتك الشاملة لحفظ وتدبر آيات القرآن الكريم "
        </h1>
        <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: '16px', margin: '20px 0' }}>
          اكتشف نور القرآن وابدا رحلتك في الحفظ والتدبر بخطوات بسيطة من خلال منصتنا مع أمهر المعلمين والمعلمات في الشرق الأوسط والحاصلين على إجازات في حفظ القرآن الكريم
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button style={{
            backgroundColor: 'transparent',
            color: ' #1EC8A0',
            padding: '10px 27px',
            borderRadius: '5px',
            border: '2px solid #1EC8A0',
            cursor: 'pointer',
            fontFamily: "'Tajawal', sans-serif"
          }}>
                انضم معنا كمعلم
          </button>
          <button style={{
            backgroundColor: '#00C896',
            color: 'white',
            padding: '10px 27px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Tajawal', sans-serif"
          }}>
               ابدأ الاستخدام الآن
     
          </button>
        </div>
      </div>
    </div>
    </div>
    
    
   
  );
};

export default HeroSection;

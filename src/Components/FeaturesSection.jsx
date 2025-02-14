import React from 'react';

const FeaturesSection = () => {
  return (
    <div style={styles.container}>
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
            <img src={feature.icon} alt="icon" style={styles.icon} />
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
    icon: "https://s3-alpha-sig.figma.com/img/cd93/f486/15e27cda31af8282f30871aad1c1d0c9?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=XfPV0-V404i36xlJvcoYaNRYRr3wqRK0~e5KilQOMaT0kKd41g~3JBYrktnd~sf87rR-GVKNWQdygeD3WuprwgpLlBWxna~LxrPwTp3v1tK-Y3-b2YKJ215iEYb0MpDmYU5Psk8Y4~r8nCR~I0L35kzMA1nTQ1qXUzW7KqqFz2DjntGLWfzEwD6iShHv9bpL4A3UgLALiwBd~QyHLROzwkFXO75kKWmpCgWndsEfTDQF3v5D6rSMCEuqok-hnkiFY~xszv-htYybsyEviP-CO6Vi2YTxBSNti6MxShfJMXEFv~nrwFLzThPk2psqeya0t6KgYpqkPYYifmMb7AU8wA__",
    highlight: true
  },
  {
    title: "مختلف الجنسيات والأعمار",
    description: "مهما كان عمرك وجنسيتك يمكنك استخدام المنصة لحفظ القرآن الكريم ومراجعتة مع افضل المعلمين في الشرق الاوسط",
    icon: "https://s3-alpha-sig.figma.com/img/364d/6a4a/6992b2e58ce4be1f7daf320cce642c65?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=iYYbGGkziCDQnXSMdMCRPKtC6OrNLboxbCPW-Dir7GUdhfDhzvvfY5PqX0aulXRCOdg~nhClKqGPrAAzrQeeuJlaRQdlo7Wc1zg9ztE7bHxSUHems4P2GUzE6fFuWb-pLKOt680JJmFMod-NwQ~9u3S3em-c-N6-zs~aATM3KsWtC8SVYYIVWHZaCtxtDzWD0R8TPu4fAWhUXgFUUsjyE8R9n7PPB25xTv3X5I0wH9z-encdpih~yjQo6jKsm0l7weW93KZtNX0rXpn5nTdMFPvxnO-A0nzJwpZ7eQlokjGI-FD6NL3q2dyCZ1GEwIi8t7t4PwehIHW98mDdAQu3~Q__",
    highlight: false
  },
  {
    title: "أكثر من معلم ومعلمة",
    description: "اكثر من 12000 معلم ومعلمة تحفيظ قرآن اخترناهم بعناية من بين الاف المتقدمين لتقديم خدمة مميزه اليكم",
    icon: "https://s3-alpha-sig.figma.com/img/d8d0/0e48/9131cccc32fe604c5ace785a76db5581?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=BQXWwIIlIsBPag1tw~Dn0wjVtG2JalXPwjI9bt0ymr2mmm7I83geCnkszne8lyM4x4tmVDUXp0686W2LUa2aDtWD8cFj942RunZHPnSi5WIZoRZEkR5PzJ96qfE8WOr7xO-rg4vsMKaQMXCeRdhaTTETCvZJnFYSuwcxz0rF6r03oXUe6U734LwyAIrT2gs7mWCy6RH2AOn1gdg39-avX0f9bDcF8WpcV3JvSQIO3uqMZmiOJ6Et1prMt~RnJePBTPAT5~wq0qOKuwAQ8toRqy1NOFb3w13uRXGIMsoTuMXS1u5yCwKb5bL-bsJqIbae7xmiz~dMHJOV33ecFo2p1g__",
    highlight: false
  },
  {
    title: "تحديد وقت المراجعة",
    description: "يمكنك تحديد وقت المراجعة في اليوم والوقت الذي ترغب في مراجعة ماتم حفظة علي افضل المعلمين لديك",
    icon: "https://s3-alpha-sig.figma.com/img/e251/9333/066890a4c28a6abf9611fd00586569cf?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=F1Ef5YrX13X5PzPa~AxomW9vn9fTRkOqTuFZEagfcy-73uKSV4o0nRyU47LaYJ9KrLrD8etfbPrrhIX10mvaQHoydulUhscpFkIlhK-NVAoIsJa4idbEg~~jNagPliPCRMSEEBaf5OfYuUn4mYvIpYr6e97UoSL4guQ9thgozKe3PJkKlOgbdd2c-~b7-UBqrDQ-S6MQpvSf0WF1unJzo7YAFeh3AIseq1lXIeCcr7BqzQ-~GT3GznAqWzJqR1TbUZlcOhkd~5lQ2FoIHxJ8dy091oMSWtOL3dZa17O7IqIFXydnnBaLzZgqVlnC693SfG3Dm-y-fF4dluvtEvCrwg__",
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

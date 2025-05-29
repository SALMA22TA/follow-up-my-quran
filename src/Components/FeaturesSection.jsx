// import React from 'react';

const FeaturesSection = () => {
  return (
    <div id="features" 
// @ts-ignore
    style={styles.container}>
      <p style={styles.subheading}>مميزاتنا</p>
      <h2 style={styles.heading}>ما يميز منصة هدى القرآن</h2>

      <div style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div 
            key={index} 
            // @ts-ignore
            style={{ 
              ...styles.featureBox, 
              backgroundColor: feature.highlight ? '#20C997' : '#FFFFFF', 
              color: feature.highlight ? '#FFFFFF' : '#000000' 
            }}>
            <img src={feature.icon} alt="icon" 
// @ts-ignore
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
    icon: "https://s3-alpha-sig.figma.com/img/cd93/f486/15e27cda31af8282f30871aad1c1d0c9?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jOei0UX1csAr6mfo2DgVKHOC-oU17YwM~-oFwwocUkVt4pgxMMbOGfpj1hRnABeA3OLqOvhvFH12NnhKRIwEMzqSgmP9uGmN8mJv42iwNYuu7TxrGvULaqVfF2ny~HH7nVfjmd9rcDLdfCcETFY2Z1Cc3jHzEBlXfV3d8xZBY1y3qMQaKiccFJyRVQ~ZVOrtgJvEbIrSKqkxhsSPaQkbU93i5kwWK7CSLZo2juRUKIRagAZsW-xcCgz462sgj3rMQ2vJmXoMa9PNLuaEOF9p0Jh61lFh3Vi9a0tRu6oUbsdypGnuPkasSMJ4-28PFEfyl2T7Xh5r2mSUf0~geqlU~w__",
    highlight: true
  },
  {
    title: "مختلف الجنسيات والأعمار",
    description: "مهما كان عمرك وجنسيتك يمكنك استخدام المنصة لحفظ القرآن الكريم ومراجعتة مع افضل المعلمين في الشرق الاوسط",
    icon: "https://s3-alpha-sig.figma.com/img/364d/6a4a/6992b2e58ce4be1f7daf320cce642c65?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ThSwhFYo7~rzp9P6bq6NGZf8LnJgXc~dLCtTpQXSZ3SF3ZUAIayN0R0eYYlLKu6t6W8qEOXvpjbwhoCXwHwDXqRcTeE99em~QQAgm2I0c9Yq7eMBr4kvJHLI6D~9qVUMhcIL8FJPs0leWp4SFqXFMvx~gu2b5cjBTtdLgySy2ZFtwTZjjsXYXXn9uFANe9BPjIjfJ7AW63OcyGuQLkPB0htSbiPcHBpaAFu9z2pmRy9KQEyXDEU0GhKCURwAXizI75iqr~50T1U9TDMerxjPskhVLtSYia9~GuUBWmklRpIIvsqPQS5-Hfs3PijL0eDRt1ipGdSOrLt5LuybiGNHfA__",
    highlight: false
  },
  {
    title: "أكثر من معلم ومعلمة",
    description: "اكثر من 12000 معلم ومعلمة تحفيظ قرآن اخترناهم بعناية من بين الاف المتقدمين لتقديم خدمة مميزه اليكم",
    icon: "https://s3-alpha-sig.figma.com/img/d8d0/0e48/9131cccc32fe604c5ace785a76db5581?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Cah3FLeMirJEsYcCPFuSPC5mBpLWcaI68VIt2lnZ2R4GB~DyxdqvXaJxzkqk59DhYqBuWEYWcMIL9cL7ea3691a2FYPn00c3vJzZYzXOZB-xwiWJFGMWQjfUZttv0NoifB09FeCGQMSDSPWjlXg3gfuZSH3ansevVw7ifjXZQaUA4B5d7CF8BpbyUzgbAGEkizEbYSh2Tn2JnCZNYTY9gaAu88P5QWK-79sNcJerph96fxYmPA8ZYLxFbbhojZNkdhXftGst-ZQf8DV7Zrs2vi3LAv5aqUC7Ut-MNKNeqM8jcYvzmmI3gKqNMNOKRf506yAOmkPqJwZ47DrxzGo2LA__",
    highlight: false
  },
  {
    title: "تحديد وقت المراجعة",
    description: "يمكنك تحديد وقت المراجعة في اليوم والوقت الذي ترغب في مراجعة ماتم حفظة علي افضل المعلمين لديك",
    icon: "https://s3-alpha-sig.figma.com/img/e251/9333/066890a4c28a6abf9611fd00586569cf?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=VilIaNWkeg0UOdrt1eau85Thp6nZ9vDQ2bEVVLHF16iJG5k31dXF1LLS~a2ns6KQ9PZBsbquHap~ECSjM3KQki3BaymS4u3wFA0GOg1jFmKF8oCD1pE5sCS1xnD4SlmDUyonyaS8ZJp63~s70Ym1ajOjHi1rETRd6RhsuU3PebBbN21M6oS4POwAzmHvktHlXrb4rUoneE82LiCk2p8RIgZjp5A5VGauDc5KaeC~iz6TO--16IjFToHGIfPkZgrK210awlpR7MvWzbh3CQiUPJxkc0yNZWc7AWODULDkdZyMxxnTxsS4LWoCSKAq~UWe3nQqzdulWGWDDQeBd~IGVA__",
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

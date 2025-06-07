import React, { useState } from "react";

const faqData = [
  {
    question: "ما هي الخدمات التي تقدمها منصة هدى القرآن؟",
    answer:
      "توفر منصة هدى القرآن مجموعة متنوعة من الدورات المنظمة على التلاوة والحفظ، إضافة إلى التقييم الدوري لدعم المستخدمين، كما تتيح الانضمام إلى مجموعات حفظ ومتابعة تشجيع وتحفيز الحفظة، مما يسهل عملية المتابعة اليومية للحفظ ويساعد على فهم معاني القرآن الكريم."
  },
  {
    question: "كيف يمكنني التسجيل في منصة هدى القرآن؟",
    answer: "يمكنك التسجيل بسهولة عبر الموقع الرسمي واتباع الخطوات المبينة."
  },
  {
    question: "هل تقدم المنصة خططًا مخصصة لحفظ القرآن خلال فترات زمنية محددة؟",
    answer: "نعم، تتوفر خطط متنوعة تناسب جميع المستويات."
  },
  {
    question: "هل أحتاج إلى دفع اشتراك للاستفادة من خدمات منصة هدى القرآن؟",
    answer: "هناك خطط مجانية ومدفوعة، يمكنك الاختيار حسب احتياجاتك."
  },
  {
    question: "هل يمكنني التواصل مع مدرس لتدريس القرآن الكريم؟",
    answer: "نعم، توفر المنصة إمكانية التواصل مع مدرسين معتمدين."
  },
  {
    question: "هل توفر مواعيد أو تنبيهات تذكيرية لمتابعة الحفظ والمراجعة؟",
    answer: "نعم، هناك نظام تنبيهات يساعدك في متابعة الحفظ."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq"     style={styles.container}>
      <p       style={styles.subheading}>الأسئلة الشائعة</p>
      <h2       style={styles.heading}>أشياء من المحتمل أن تكون فضوليًا بشأنها</h2>
      <div       style={styles.faqList}>
        {faqData.map((item, index) => (
          <div
            key={index}
            
        style={openIndex === index ? styles.faqItemOpen : styles.faqItem}
          >
            <div style={styles.question} onClick={() => toggleFAQ(index)}>
              <span>{item.question}</span>
              <span>{openIndex === index ? "✖" : "＋"}</span>
            </div>
            {openIndex === index && <p style={styles.answer}>{item.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "auto",
    padding: "50px 20px",
    textAlign: "center",
    direction: "rtl",
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 4px 20px #EDEEF7",
    borderRadius: "8px",
  },
  subheading: {
    fontFamily: "'Aref Ruqaa', sans-serif",
    fontWeight: "bold",
    fontSize: "24px",
    lineHeight: "37.51px",
    textAlign: "center",
    color: "#D4A800",
  },
  heading: {
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 'bold',
    fontSize: "28px",
    lineHeight: "47.04px",
    textAlign: "center",
    color: "#090909",

  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    alignItems: "center",
  },
  faqItem: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    padding: "32px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "right",
  },
  faqItemOpen: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: "32px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "right",
    border: "2px solid #1EC8A0",
    boxShadow: "0px 4px 20px #EDEEF7",
  },
  question: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "18px",
    fontWeight: "bold",
  },
  answer: {
    fontSize: "16px",
    marginTop: "10px",
    color: "#5A5A5A",
  },
};

export default FAQSection;

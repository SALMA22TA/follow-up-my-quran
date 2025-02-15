import React from 'react';
import FeaturesSection from '../Components/FeaturesSection';
import TeachersSection from '../Components/TeachersSection';
import TestimonialsSection from "../Components/TestimonialsSection";
import Footer from "../Components/Footer";
import FAQSection from "../Components/FAQSection";



const LandingPage = () => {
    return (
        <div>
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
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={styles.checkIcon}
                                >
                                    <path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9958 7.34913 18.9408 4.80805 17.0664 2.93361C15.192 1.05916 12.6509 0.00423124 10 0ZM14.78 7.7L9.11 13.37C9.04051 13.4398 8.95791 13.4952 8.86696 13.5329C8.77601 13.5707 8.67849 13.5902 8.58 13.5902C8.48152 13.5902 8.384 13.5707 8.29305 13.5329C8.2021 13.4952 8.1195 13.4398 8.05 13.37L5.22 10.54C5.08752 10.3978 5.0154 10.2098 5.01883 10.0155C5.02226 9.82118 5.10097 9.63579 5.23838 9.49838C5.3758 9.36096 5.56118 9.28225 5.75548 9.27882C5.94978 9.2754 6.13783 9.34752 6.28 9.48L8.58 11.78L13.72 6.64C13.7887 6.56631 13.8715 6.50721 13.9635 6.46622C14.0555 6.42523 14.1548 6.40318 14.2555 6.40141C14.3562 6.39963 14.4562 6.41816 14.5496 6.45588C14.643 6.4936 14.7278 6.54974 14.799 6.62096C14.8703 6.69218 14.9264 6.77701 14.9641 6.8704C15.0018 6.96379 15.0204 7.06382 15.0186 7.16452C15.0168 7.26522 14.9948 7.36454 14.9538 7.45654C14.9128 7.54854 14.8537 7.63134 14.78 7.7Z" fill="#0FB10F" />
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
            {/* The Testimonials Section */}
            <TestimonialsSection />
            {/* The FAQ Section */}
            <FAQSection />
            {/* The Footer */}
            <Footer />
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
        fontFamily: '"Aref Ruqaa", sans-serif',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#D4A800',
    },
    heading: {
        fontFamily: '"Tajawal", sans-serif',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#090909',
        margin: '10px 0',
    },
    description: {
        fontFamily: '"Tajawal", sans-serif',
        fontSize: '15px',
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
        flexShrink: 0,
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

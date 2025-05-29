// import React from "react";
// @ts-ignore
import Ye from "../Pages/images/Ye.jpg";
// @ts-ignore
import Ya from "../Pages/images/Ya.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
    {
        name: "أحمد بن علي",
        image: Ya,
        text: "التجربة كانت ممتازة جدًا، وجدت فيها ما كنت أبحث عنه، متابعة مستمرة وتفاعل رائع، شكرًا لكل القائمين على المنصة.",
        highlight: false,
    },
    {
        name: "ياسر بن حمد",
        image: Ye,
        text: "منصة رائعة وسهلة الاستخدام، تتيح لك تعلم القرآن الكريم مع معلمين متميزين، أنصح الجميع بالانضمام والاستفادة منها.",
        highlight: true,
    },
    {
        name: "علي بن حسن",
        image: "https://t3.ftcdn.net/jpg/02/75/16/64/360_F_275166434_7bF6xdlFGkKGudHiLGpJ64o1NpWnWG9T.jpg",
        text: "منصة مثالية لكل من يريد حفظ القرآن بإتقان، الأساتذة محترفون جدًا والتقنيات الحديثة جعلت التعلم أكثر سهولة ومتعة.",
        highlight: false,
    },
    {
        name: "حنان بنت فهد",
        image: "https://img.drz.lazcdn.com/g/kf/S0eae316ec7ec48afadd2ca5ad3e464804.jpg_720x720q80.jpg",
        text: "منصة رائعة وسهلة الاستخدام، تتيح لك تعلم القرآن الكريم مع معلمين متميزين، أنصح الجميع بالانضمام والاستفادة منها.",
        highlight: true,
    },
    {
        name: "سليمان بن عبدالله",
        image: "https://i0.wp.com/www.familytravel-middleeast.com/wp-content/uploads/2020/10/What-to-wear-Saudi-Arabia-2.jpg?resize=1080%2C540&ssl=1",
        text: "منصة مثالية لكل من يريد حفظ القرآن بإتقان، الأساتذة محترفون جدًا والتقنيات الحديثة جعلت التعلم أكثر سهولة ومتعة.",
        highlight: false,
    },
    {
        name: "خديجة بنت عثمان",
        image: "https://beingselfish.net/wp-content/uploads/2024/04/Hijab-Dp.png",
        text: "تجربة مذهلة! توفر المنصة بيئة مثالية لحفظ القرآن الكريم بسهولة وتفاعل مميز مع المعلمين.",
        highlight: true,
    },
    {
        name: "عثماء بنت خالد",
        image: "https://i.pinimg.com/736x/68/7e/88/687e88b3bf7e8af3418a76c683aba708.jpg",
        text: "بفضل هذه المنصة، استطعت الالتزام بخطة حفظي اليومية، شكرًا لكم على هذا الجهد العظيم!",
        highlight: false,
    },
    {
        name: "يوسف بن وليد",
        image: "https://t3.ftcdn.net/jpg/02/75/16/64/360_F_275166434_7bF6xdlFGkKGudHiLGpJ64o1NpWnWG9T.jpg",
        text: "منصة متكاملة تساعد على تعلم القرآن بأسلوب حديث ومبتكر، أوصي بها للجميع. تحفيز رائع ومتابعة مستمرة من المعلمين، لم أشعر بهذه السهولة في التعلم من قبل!",
        highlight: true,
    },
];

const TestimonialsSection = () => {
    return (
        <div id="testimonials" 
// @ts-ignore
        style={styles.container}>
            <p style={styles.subheading}>اراء الطلاب</p>
            <h2 style={styles.heading}>ماذا قالوا عن منصة هدى القرآن</h2>
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true, el: ".custom-pagination" }}
                loop
                style={styles.swiper}
            >
                {reviews.map((
// @ts-ignore
                review, index) => {
                    if (index % 2 !== 0) return null;
                    return (
                        <SwiperSlide key={index}>
                            <div style={styles.slideContainer}>
                                {[reviews[index], reviews[index + 1]].map(
                                    (item, i) =>
                                        item && (
                                            <div
                                                key={i}
                                                // @ts-ignore
                                                style={{
                                                    ...styles.reviewCard,
                                                    backgroundColor: item.highlight ? "#20C997" : "#F8F8F8",
                                                    color: item.highlight ? "white" : "#090909",
                                                    position: "relative",
                                                }}
                                            >
                                                {/* Quotation Icon */}
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    // @ts-ignore
                                                    style={{
                                                        ...styles.quotationIcon,
                                                        fill: item.highlight ? "#E9E9E9" : "#E9E9E98F",
                                                    }}
                                                >
                                                    <path
                                                        d="M9 10.5C10.1046 10.5 11 11.3954 11 12.5V21C11 22.1046 10.1046 23 9 23H3C1.89543 23 1 22.1046 1 21V10.5C1 4 6.5 2 9 1C10 0.5 11 2 10 3.5C9 5 6 5.5 6 9C6 10 7 10.5 9 10.5ZM22 10.5C23.1046 10.5 24 11.3954 24 12.5V21C24 22.1046 23.1046 23 22 23H16C14.8954 23 14 22.1046 14 21V10.5C14 4 19.5 2 22 1C23 0.5 24 2 23 3.5C22 5 19 5.5 19 9C19 10 20 10.5 22 10.5Z"
                                                    />
                                                </svg>
                                                <img src={item.image} alt={item.name} style={styles.image} />
                                                <div style={styles.textContainer}>
                                                    <h3 style={styles.name}>{item.name}</h3>
                                                    <p style={styles.text}>{item.text}</p>
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <div className="custom-pagination" 
// @ts-ignore
            style={styles.pagination}></div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "white",
        padding: "3rem 1rem",
        textAlign: "center",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#090909",
        marginBottom: "1.5rem",
    },
    subheading: {
        fontFamily: "'Aref Ruqaa', sans-serif",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#D4A800",
    },
    swiper: {
        width: "100%",
        maxWidth: "1000px",
        margin: "auto",
        paddingBottom: "50px",
    },
    slideContainer: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
    },
    reviewCard: {
        display: "flex",
        alignItems: "center",
        width: "650px",
        height: "120px",
        gap: "16px",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
        textAlign: "right",
        flexDirection: "row-reverse",
    },
    image: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        border: "2px solid #0FB10F",
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    text: {
        fontSize: "14px",
        lineHeight: "1.6",
        marginTop: "8px",
    },
    quotationIcon: {
        position: "absolute",
        top: "33px",
        left: "10px",
        opacity: 1,
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
        direction: "rtl",
    },
};
// Global styles for Swiper pagination bars
const paginationBarStyle = `
    .swiper-pagination-bullet {
        width: 30px !important;
        height: 6px !important;
        background: #20C997 !important;
        border-radius: 10px !important;
        opacity: 0.4 !important;
        transition: opacity 0.3s ease-in-out, width 0.3s ease-in-out;
    }

    .swiper-pagination-bullet-active {
        opacity: 1 !important;
        width: 40px !important;
    }
`;

// Injecting styles into the document
const styleTag = document.createElement("style");
styleTag.innerHTML = paginationBarStyle;
document.head.appendChild(styleTag);

export default TestimonialsSection;
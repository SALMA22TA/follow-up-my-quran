import { Link } from "react-router-dom"
import "../styles/Footer.css"
import Logo from "../Pages/images/Logo Container.png"
import WhatsAppIcon from "../Pages/images/whatsApp.svg.png";
import FacebookIcon from "../Pages/images/facebook.svg.png";
import YouTubeIcon from "../Pages/images/youTube.svg.png";
import InstagramIcon from "../Pages/images/instagram.svg fill.png";
import MailIcon from "../Pages/images/message.svg fill.png"
import TwitterIcon from "../Pages/images/twitter.svg fill.png"
import LinkedInIcon from "../Pages/images/linkedIn.svg fill.png"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="newsletter">
                <p>يمكنك إلغاء الاشتراك في أي وقت.</p>
                <div className="newsletter-content">
                    <div className="newsletter-icon">
                        <svg width="64" height="65" viewBox="0 0 64 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="0.986328" width="64" height="64" rx="32" fill="#DDFFF7" />
                            <path
                                d="M42.866 44.7635H21.1343C19.8338 44.7619 18.587 44.2444 17.6674 43.3247C16.7479 42.4049 16.2306 41.1581 16.2292 39.8575V26.1149C16.2306 24.8144 16.7479 23.5676 17.6675 22.648C18.5871 21.7284 19.8339 21.2112 21.1343 21.2097H42.866C44.1666 21.2112 45.4134 21.7284 46.3332 22.6479C47.2529 23.5675 47.7703 24.8143 47.772 26.1149V39.8575C47.7706 41.1582 47.2532 42.4052 46.3335 43.325C45.4137 44.2447 44.1667 44.7621 42.866 44.7635ZM21.1343 23.4954C20.4398 23.4962 19.774 23.7724 19.2829 24.2634C18.7918 24.7545 18.5156 25.4204 18.5149 26.1149V39.8575C18.5154 40.5521 18.7915 41.2182 19.2826 41.7095C19.7737 42.2008 20.4397 42.4771 21.1343 42.4778H42.866C43.5607 42.4771 44.2268 42.2008 44.718 41.7096C45.2093 41.2183 45.4856 40.5522 45.4863 39.8575V26.1149C45.4854 25.4203 45.209 24.7544 44.7177 24.2634C44.2265 23.7723 43.5606 23.4962 42.866 23.4954H21.1343Z"
                                fill="#1EC8A0"
                            />
                            <path
                                d="M31.9863 36.0626C31.0274 36.0721 30.0933 35.758 29.3349 35.1712L17.1127 25.4313C16.8757 25.2423 16.7235 24.9669 16.6895 24.6656C16.6556 24.3644 16.7427 24.062 16.9317 23.8249C17.1207 23.5879 17.3961 23.4357 17.6974 23.4017C17.9987 23.3678 18.3011 23.4549 18.5381 23.6439L30.7566 33.3838C31.1175 33.6398 31.5494 33.7768 31.9919 33.7756C32.4344 33.7745 32.8656 33.6353 33.2252 33.3774L45.2928 23.6485C45.5286 23.4583 45.8304 23.3695 46.1316 23.4017C46.4329 23.434 46.709 23.5845 46.8992 23.8204C47.0895 24.0562 47.1782 24.3579 47.146 24.6592C47.1137 24.9604 46.9632 25.2365 46.7273 25.4268L34.6633 35.1557C33.8997 35.7528 32.9557 36.0727 31.9863 36.0626Z"
                                fill="#1EC8A0"
                            />
                        </svg>
                    </div>
                    <div className="newsletter-text">
                        <h3>اشترك في النشرة الإخبارية</h3>
                        <p>كن أول من يعرف عن المجموعات الجديدة والعروض الحصرية والأحداث.</p>
                    </div>
                    <div className="newsletter-input">
                        <input type="email" placeholder="أدخل بريدك الإلكتروني" />
                        <button>اشترك الآن </button>
                    </div>
                </div>
            </div>

            <div className="footer-main">
                <nav className="footer-nav">
                    <Link to="/">الرئيسية</Link>
                    <Link to="/features">مميزاتنا</Link>
                    <Link to="/about">معلومات عنا</Link>
                    <Link to="/teachers">المعلمون</Link>
                    <Link to="/reviews">آراء الطلاب</Link>
                    <Link to="/faq">الأسئلة الشائعة</Link>
                </nav>

                <div className="footer-logo">
                    <img src={Logo || "/placeholder.svg"} alt="هدى القرآن" />
                </div>

                <p className="footer-description">
                    اكتشف نور القرآن وابدأ رحلتك في الحفظ والتدبر بخطوات بسيطة من خلال منصتنا مع أمهر المعلمين والمعلمات في الشرق
                    الأوسط والحاصلين على إجازات في حفظ القرآن الكريم.
                </p>
                <div className="footer-bottom">
                    <div className="copyright">
                        Copyright © 2025. All rights reserved
                    </div>
                    <div className="social-links">
                        {/* Social media icons here */}
                        <a href="https://facebook.com/yourPage" target="_blank" rel="noopener noreferrer">
                            <img src={FacebookIcon} alt="Facebook" width="32" height="32" />
                        </a>
                        <a href="https://instagram.com/yourProfile" target="_blank" rel="noopener noreferrer">
                            <img src={InstagramIcon} alt="Instagram" width="32" height="32" />
                        </a>
                        <a href="https://linkedIn.com/yourProfile" target="_blank" rel="noopener noreferrer">
                            <img src={LinkedInIcon} alt="LinkedIn" width="32" height="32" />
                        </a>
                        <a href="https://mail.com/yourProfile" target="_blank" rel="noopener noreferrer">
                            <img src={MailIcon} alt="Mail" width="32" height="32" />
                        </a>
                        <a href="https://twitter.com/yourProfile" target="_blank" rel="noopener noreferrer">
                            <img src={TwitterIcon} alt="Twitter" width="32" height="32" />
                        </a>
                        <a href="https://wa.me/yourNumber" target="_blank" rel="noopener noreferrer">
                            <img src={WhatsAppIcon} alt="WhatsApp" width="32" height="32" />
                        </a>
                        <a href="https://youtube.com/yourChannel" target="_blank" rel="noopener noreferrer">
                            <img src={YouTubeIcon} alt="YouTube" width="32" height="32" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer


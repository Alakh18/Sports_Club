import { Link, useNavigate, useLocation } from "react-router-dom";
import { goTo, scrollToTop, handleAboutClick } from "../../utils/ui";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">🏆 SVNIT Sports Club</div>

        <nav className="footer__nav">
          <a onClick={() => goTo(navigate, location, "hero")}>Home</a>
          <Link
            to="/about"
            onClick={() => handleAboutClick(navigate, location)}
          >
            About
          </Link>
          <a onClick={() => goTo(navigate, location, "sports")}>Sports</a>
          <Link
            to="/about"
            onClick={() => handleAboutClick(navigate, location, "contact")}
          >
            Contact
          </Link>
          <Link to="/calender" onClick={scrollToTop}>
            Calender
          </Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/admin" onClick={scrollToTop}>
            Admin
          </Link>
        </nav>

        <div className="footer__socials">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>

        <button className="back-to-top" onClick={scrollToTop}>
          ↑ Back to Top
        </button>

        <p className="footer__copyright">
          © {new Date().getFullYear()} SVNIT Sports Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

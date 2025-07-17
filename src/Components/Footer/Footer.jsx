import { Link } from "react-router-dom";
import "./Footer.css";
import { useNavigate, useLocation } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = useNavigate();
  const location = useLocation();

  function goTo(id) {
    if (location.pathname === "/") {
      const elementID = document.getElementById(id);
      if (elementID) {
        elementID.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const elementID = document.getElementById(id);
        elementID?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">🏆 SVNIT Sports Club</div>

        <nav className="footer__nav">
          <a onClick={() => goTo("hero")}>Home</a>
          <a href="#about">About</a>
          <a onClick={() => goTo("sports")}>Sports</a>
          <a href="#events">Events</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
          <Link to="/faq">FAQ</Link>
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

import { Link } from "react-router-dom";
import "./Footer.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = useNavigate();
  const location = useLocation();

  const goToHero = () => {
    if (location.pathname === "/") {
      const hero = document.getElementById("hero");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");

      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const hero = document.getElementById("hero");
        hero?.scrollIntoView({ behavior: "smooth" });
      }, 300); // Adjust timing if needed
    }
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">🏆 SVNIT Sports Club</div>

        <nav className="footer__nav">
          <a onClick={goToHero}>Home</a>
          <a href="#about">About</a>
          <a href="#sports-grid">Sports</a>
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

import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/usercontext";
import AuthModal from "../AuthModal/AuthModal";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const goToHero = () => {
    navigate("/");
    setTimeout(() => {
      const hero = document.getElementById("hero");
      hero?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const goToSports = () => {
    navigate("/");
    setTimeout(() => {
      const sportsSection = document.getElementById("sports");
      sportsSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const closeMenu = () => setMenuOpen(false);

  const goTo = (section) => {
    if (location.pathname === "/") {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: section } });
    }
  };

  const handleAboutClick = (tab = "about") => {
    navigate("/about", { state: { activeTab: tab } });
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    closeMenu();
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="header" id="header">
        <div className="header__container">
          <div className="header__logo">🏆 SVNIT Sports Club</div>

          <button
            className="header__toggle-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <nav className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}>
            <Link
              to="/"
              className="header__nav-link"
              onClick={(e) => {
                e.preventDefault();
                goTo("hero");
                goToHero();
                closeMenu();
              }}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="header__nav-link"
              onClick={() => {
                handleAboutClick("about");
                closeMenu();
              }}
            >
            </a>
            <a href="#about" className="header__nav-link" onClick={closeMenu}>
              About
            </Link>
            <Link
              to="/"
            </a>
            <a
              href="/"
              className="header__nav-link"
              onClick={(e) => {
                e.preventDefault();
                goTo("sports");
                goToSports();
                closeMenu();
              }}
            >
              Sports
            </Link>
            <Link
              to="/about"
              className="header__nav-link"
              onClick={() => {
                handleAboutClick("contact");
                closeMenu();
              }}
            >
            </a>
            <a href="#events" className="header__nav-link" onClick={closeMenu}>
              Events
            </a>
            <a href="#gallery" className="header__nav-link" onClick={closeMenu}>
              Gallery
            </a>
            <a href="#contact" className="header__nav-link" onClick={closeMenu}>
              Contact
            </Link>
            <Link 
              to="/faq" 
              className="header__nav-link" 
              onClick={closeMenu}
            >
            </a>
            <Link to="/faq" className="header__nav-link" onClick={closeMenu}>
              FAQ
            </Link>

            {!user ? (
              <>
                <button
                  className="cta small"
                  onClick={() => setAuthModal("login")}
                >
                  Login
                </button>
                <button
                  className="cta small"
                  onClick={() => setAuthModal("signup")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="profile-dropdown" ref={dropdownRef}>
                <div
                  className="profile-icon"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  title={user.admission || "Profile"}
                >
                  <span>{(user.admission || "U").charAt(0)}</span>
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-item"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {authModal && (
        <AuthModal 
          type={authModal} 
          onClose={() => setAuthModal(null)} 
        />
      )}
    </>
  );
}

export default Header;
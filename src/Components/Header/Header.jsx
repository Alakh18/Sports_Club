import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/usercontext.js";
import AuthModal from "../AuthModal/AuthModal.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleAboutClick, goTo } from "../../utils/ui.js";
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

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    closeMenu();
    navigate("/");
  };

  // Close dropdown if clicked outside
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
            <a
              href=""
              className="header__nav-link"
              onClick={(e) => {
                e.preventDefault();
                goTo(navigate, location, "hero");
                goTo("hero");
                goToHero();
                closeMenu();
              }}
            >
              Home
            </a>
            <Link
              to="/about"
              onClick={() => handleAboutClick(navigate, location)}
              className="header__nav-link"
            >
            </a>
            <a href="#about" className="header__nav-link" onClick={closeMenu}>
              About
            </Link>
            <a
              href=""
            <Link
              to="/"
            </a>
            <a
              href="/"
              className="header__nav-link"
              onClick={(e) => {
                e.preventDefault();
                goTo(navigate, location, "sports");
                goTo("sports");
                goToSports();
                closeMenu();
              }}
            >
              Sports
            </a>
            <Link
              to="/about"
              className="header__nav-link"
              onClick={() => handleAboutClick(navigate, location, "contact")}
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
            <Link to="/faq" className="header__nav-link">
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
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" />
                  ) : (
                    <span>{(user.admission || "U").charAt(0)}</span>
                  )}
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Update Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
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
          onClose={(newType) => {
            if (newType === "login" || newType === "signup") {
              setAuthModal(newType);
            } else {
              setAuthModal(null);
            }
          }}
        />
      )}
    </>
  );
}

export default Header;

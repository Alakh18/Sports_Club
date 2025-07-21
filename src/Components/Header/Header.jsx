import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/usercontext";
import AuthModal from "../AuthModal/AuthModal";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

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
            <a
              href="/"
              className="header__nav-link"
              onClick={(e) => {
                e.preventDefault();
                goTo(navigate, location, "hero");
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
              About
            </Link>
            <a
              href="/"
              className="header__nav-link"
              onClick={(e) => {
                e.preventDefault();
                goTo(navigate, location, "sports");
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
              Contact
            </Link>
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
          onClose={() => setAuthModal(null)} 
        />
      )}
    </>
  );
}

export default Header;
import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/usercontext.js";
import AuthModal from "./AuthModal";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useUser();
  const navigate = useNavigate();

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
                closeMenu();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </a>
            <a href="#about" className="header__nav-link" onClick={closeMenu}>
              About
            </a>
            <a
              href="#sports-grid"
              className="header__nav-link"
              onClick={closeMenu}
            >
              Sports
            </a>
            <a href="#events" className="header__nav-link" onClick={closeMenu}>
              Events
            </a>
            <a href="#gallery" className="header__nav-link" onClick={closeMenu}>
              Gallery
            </a>
            <a href="#contact" className="header__nav-link" onClick={closeMenu}>
              Contact
            </a>
            <li><Link to="/faq">FAQ</Link></li>


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
                  title={user.firstName || "Profile"}
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" />
                  ) : (
                    <span>{(user.firstName || "U")[0]}</span>
                  )}
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                      Update Profile
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {authModal && (
        <AuthModal type={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}

export default Header;

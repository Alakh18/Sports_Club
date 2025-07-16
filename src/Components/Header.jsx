import React, { useState } from 'react';
import AuthModal from './AuthModal';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__logo">🏆 SVNIT Sports Club</div>

          <button
            className="header__toggle-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
            <a href="#" className="header__nav-link">Home</a>
            <a href="#" className="header__nav-link">About</a>
            <a href="#" className="header__nav-link">Sports</a>
            <a href="#" className="header__nav-link">Events</a>
            <a href="#" className="header__nav-link">Gallery</a>
            <a href="#" className="header__nav-link">Contact</a>
            <button className="cta small" onClick={() => setAuthModal('login')}>Login</button>
            <button className="cta small" onClick={() => setAuthModal('signup')}>Sign Up</button>
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

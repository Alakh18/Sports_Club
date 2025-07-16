import React from 'react';

function AuthModal({ type = 'login', onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form>
          <input type="text" placeholder="Admission Number" required />
          {type === 'signup' && (
            <input type="email" placeholder="Email" required />
          )}
          <input type="password" placeholder="Password" required />
          <button type="submit" className="cta full">
            {type === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default AuthModal;

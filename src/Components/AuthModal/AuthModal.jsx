import React, { useState } from 'react';
import { useUser } from '../../context/usercontext';
import './AuthModal.css';

function AuthModal({ type, onClose }) {
  const { login, signup } = useUser();
  const [admission, setAdmission] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let result;
      if (type === 'login') {
        result = await login(admission, password);
      } else {
        result = await signup(admission, email, password);
      }

      if (!result.success) {
        setError(result.error);
        return;
      }

      onClose();
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admission Number</label>
            <input
              type="text"
              value={admission}
              onChange={(e) => setAdmission(e.target.value)}
              required
            />
          </div>

          {type === 'signup' && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {type === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          {type === 'login' ? (
            <p>Don't have an account? <button onClick={() => onClose('signup')}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => onClose('login')}>Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
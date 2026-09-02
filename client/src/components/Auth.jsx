import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = isLogin 
        ? await loginUser({ email: formData.email, password: formData.password })
        : await registerUser(formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onAuthSuccess(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-hero">
        <h1>Track consistency.<br />Build momentum.</h1>
        <p>A minimalist habit vertical tracker designed for simple daily execution and 100-day milestone streaks.</p>
      </div>

      <div className="auth-container">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                className="input-field"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button 
          className="btn-toggle-auth"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
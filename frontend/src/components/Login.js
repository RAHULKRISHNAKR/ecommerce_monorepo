import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URLS = {
  auth: process.env.REACT_APP_AUTH_URL || 'http://localhost:3001'
};

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URLS.auth}/login`, formData);
      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
        Demo: user@example.com / 123456
      </p>
    </div>
  );
}

export default Login;

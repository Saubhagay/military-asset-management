import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      const { token, role, base, username: loggedInUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('base', base);
      localStorage.setItem('username', loggedInUser);

      setUser({ token, role, base, username: loggedInUser });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Military Asset Management System</h2>
      <form onSubmit={handleLogin} className="login-form">
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '6px', fontSize: '13px' }}>
        <strong>Test Credentials:</strong>
        <table style={{ width: '100%', marginTop: '8px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '4px' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '4px' }}>Username</th>
              <th style={{ textAlign: 'left', padding: '4px' }}>Password</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '4px' }}>Admin</td>
              <td style={{ padding: '4px' }}><code>admin</code></td>
              <td style={{ padding: '4px' }}><code>admin123</code></td>
            </tr>
            <tr>
              <td style={{ padding: '4px' }}>Base Commander</td>
              <td style={{ padding: '4px' }}><code>commander_alpha</code></td>
              <td style={{ padding: '4px' }}><code>commander123</code></td>
            </tr>
            <tr>
              <td style={{ padding: '4px' }}>Logistics Officer</td>
              <td style={{ padding: '4px' }}><code>logistics_bravo</code></td>
              <td style={{ padding: '4px' }}><code>logistics123</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Login;

// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy authentication (replace with actual authentication logic)
    if (username === 'admin' && password === 'krazzyy') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dash');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Barangay Hindang</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
  
};

export default Login;

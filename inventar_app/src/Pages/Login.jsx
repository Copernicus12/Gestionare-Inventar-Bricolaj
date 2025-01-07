import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css'; // Importing the CSS file

function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector('.PageContent').classList.add('login-page');
    return () => {
      document.querySelector('.PageContent').classList.remove('login-page');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication logic for demonstration
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      setAuth(true);
      navigate('/');
    } else {
      console.error('Login failed!');
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> {/* Add inline styles for centering */}
      <div className="login-box">
        <div className="login-form">
          <h2>Login</h2>
          <p className="subtext">Please login to continue</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn btn-small">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

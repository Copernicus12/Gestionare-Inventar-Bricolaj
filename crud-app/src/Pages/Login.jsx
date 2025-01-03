import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importă hook-ul useNavigate
import '../Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inițializează useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // Utilizator și parolă predefinite
    const validUser = 'admin@admin.com';
    const validPassword = 'admin';

    if (email === validUser && password === validPassword) {
      // Stocare simbolică pentru autentificare
      localStorage.setItem('authToken', 'your-token'); // Store a token on successful login
      // Redirecționare către Dashboard
      navigate('/'); // Navigate to home after login
    } else {
      setError('Utilizator sau parolă incorectă!');
    }
  };

  return (
    <div className="LoginContainer">
      <form className="LoginForm" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="FormGroup">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="FormGroup">
          <label>Parolă</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="LoginButton">Autentificare</button>
      </form>
    </div>
  );
}

export default Login;

import React, { useState, useContext } from 'react';
import { login } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // ✅ ІМПОРТУЙ useNavigate

const LoginForm = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ ІНІЦІАЛІЗУЙ

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.username, form.password);
      loginUser(data.access);
      navigate('/dashboard'); // ✅ ПРАВИЛЬНЕ ПЕРЕНАПРАВЛЕННЯ
    } catch (err) {
      setError('❌ Невірний логін або пароль');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserId, setUsername } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [form, setForm] = useState({ userid: '', password: '' });
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', form);
      dispatch(setUserId(res.data.userid));
      dispatch(setUsername(res.data.username));
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input name='userid' placeholder='아이디' onChange={handleChange} required />
        <br />
        <input type='password' name='password' placeholder='비밀번호' onChange={handleChange} required />
        <br />
        <button type='submit'>로그인</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;

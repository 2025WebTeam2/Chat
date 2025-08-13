// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import Header from '../components/Header';

function LoginPage() {
  const [form, setForm] = useState({ userid: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', form);
      dispatch(login(res.data)); // Redux 상태 저장
      navigate('/'); // 로그인 후 메인 페이지
    } catch (err) {
      setMessage(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <>
      <Header />
      <div>
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
    </>
  );
}

export default LoginPage;

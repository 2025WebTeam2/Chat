import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [form, setForm] = useState({ userid: '', password: '' });
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 입력값 관리
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 로그인처리
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', form, { withCredentials: true });

      // 🔹 Redux 상태에 로그인 정보 저장
      dispatch(
        login({
          id: res.data.id, // PK
          userid: res.data.userid, // 로그인 ID
          username: res.data.username, // 닉네임
          email: res.data.email,
          phone: res.data.phone,
        })
      );
      console.log('서버 응답:', res.data);

      // 🔹 localStorage에도 저장 → 새로고침 시 유지
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: res.data.id,
          userid: res.data.userid,
          username: res.data.username,
          email: res.data.email || '',
          phone: res.data.phone || '',
        })
      );

      navigate('/'); // 홈으로 이동
    } catch (err) {
      setMessage(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input name='userid' placeholder='아이디' value={form.userid} onChange={handleChange} required />
        <br />
        <input type='password' name='password' placeholder='비밀번호' value={form.password} onChange={handleChange} required />
        <br />
        <button type='submit'>로그인</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;

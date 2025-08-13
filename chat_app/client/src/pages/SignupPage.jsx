// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', userid: '', password: '', confirmPassword: '', phone: '', email: '' });
  const [emailCode, setEmailCode] = useState('');
  const [sentCode, setSentCode] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendAuthCode = async () => {
    if (!form.email) return alert('이메일을 입력하세요.');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/send-auth-code', { email: form.email });
      alert(res.data.message);
      setSentCode(true);
    } catch (err) {
      alert(err.response?.data?.message || '인증 코드 전송 실패');
    }
  };

  const verifyAuthCode = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/verify-auth-code', { email: form.email, code: emailCode });
      alert(res.data.message);
      setEmailVerified(true);
    } catch (err) {
      alert(err.response?.data?.message || '인증 실패');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) return alert('이메일 인증을 완료하세요.');
    if (form.password !== form.confirmPassword) return alert('비밀번호가 일치하지 않습니다.');

    try {
      const res = await axios.post('http://localhost:4000/api/signup', form);
      alert(res.data.message);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input name='username' placeholder='이름' onChange={handleChange} required />
        <br />
        <input name='userid' placeholder='아이디' onChange={handleChange} required />
        <br />
        <input type='password' name='password' placeholder='비밀번호' onChange={handleChange} required />
        <br />
        <input type='password' name='confirmPassword' placeholder='비밀번호 확인' onChange={handleChange} required />
        <br />
        <input name='phone' placeholder='전화번호' onChange={handleChange} />
        <br />
        <input name='email' placeholder='이메일' value={form.email} onChange={handleChange} disabled={emailVerified} required />
        <button type='button' onClick={sendAuthCode} disabled={emailVerified}>
          인증 코드 보내기
        </button>
        <br />
        {sentCode && !emailVerified && (
          <>
            <input placeholder='인증 코드 입력' value={emailCode} onChange={(e) => setEmailCode(e.target.value)} />
            <button type='button' onClick={verifyAuthCode}>
              인증 확인
            </button>
          </>
        )}
        {emailVerified && <p style={{ color: 'green' }}>이메일 인증 완료 ✅</p>}
        <br />
        <button type='submit' disabled={!emailVerified}>
          가입하기
        </button>
      </form>
    </div>
  );
}

export default SignupPage;

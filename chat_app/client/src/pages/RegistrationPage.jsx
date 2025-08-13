import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

function RegistrationPage() {
  const { userId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });

  if (!userId) return <Navigate to='/' replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('등록 정보:', form);
    alert('등록 완료!');
    navigate('/search');
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📝 등록 페이지</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type='text' name='name' placeholder='이름' value={form.name} onChange={handleChange} required />
        <input type='email' name='email' placeholder='이메일' value={form.email} onChange={handleChange} required />
        <button type='submit'>등록</button>
      </form>
    </div>
  );
}

export default RegistrationPage;

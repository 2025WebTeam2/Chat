// LoginForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserId } from '../store/userSlice';

function LoginForm() {
  const [userIdInput, setUserIdInput] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userIdInput.trim()) return;

    try {
      const res = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userIdInput }),
      });

      const data = await res.json();
      if (data.success) {
        dispatch(setUserId(data.id));
      } else {
        alert('로그인 실패');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>아이디 입력</h2>
      <input value={userIdInput} onChange={(e) => setUserIdInput(e.target.value)} placeholder='아이디 입력' />
      <button type='submit'>로그인</button>
    </form>
  );
}

export default LoginForm;

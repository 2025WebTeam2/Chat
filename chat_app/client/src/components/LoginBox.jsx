// src/components/LoginBox.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

function LoginBox() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.id);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('id');
  };

  if (user) {
    return (
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span>{user}님</span>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    );
  }

  return <button onClick={() => navigate('/login')}>로그인</button>;
}

export default LoginBox;

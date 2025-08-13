// src/components/Header.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/userSlice';

import styles from '../styles/css/com.module.css';
import loImage from '../assets/svg/logo_ver_moon_.svg';

function Header() {
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('id');
    navigate('/'); // 로그아웃 후 홈(로그인 페이지) 이동
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
      }}
    >
      <img src={loImage} alt='로고' className={styles.logo} />

      {userId ? (
        <div>
          <span style={{ marginRight: 15 }}>
            안녕하세요, <strong>{username || userId}</strong>님!
          </span>
          <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
            로그아웃
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate('/signup')} style={{ marginRight: 10 }}>
            회원가입
          </button>
          <button onClick={() => navigate('/')}>로그인</button>
        </div>
      )}
    </header>
  );
}

export default Header;

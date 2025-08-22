// src/components/Header.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/userSlice';
import SearchBox from './SearchBox';
import styles from '../styles/css/com.module.css';

import loImage from '../assets/svg/logo_ver_moon_.svg';

function Header() {
  const userid = useSelector((state) => state.user.userid);
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 검색어를 useState로 관리 (로컬 상태)
  const [query, setQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('userid');
    navigate('/'); // 로그아웃 후 홈 이동
  };

  const goToSearchPage = () => {
    navigate('/');
  };

  const handleSearch = () => {
    if (query.trim() !== '') {
      navigate('/result', { state: { query } });
    }
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
      <button
        onClick={goToSearchPage}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      ></button>

      {/* 🔹 검색박스에 query와 setQuery 전달 */}
      <SearchBox query={query} setQuery={setQuery} onSearch={handleSearch} />

      {userid ? (
        <div>
          <span style={{ marginRight: 15 }}>
            안녕하세요, <strong>{username || userid}</strong>님!
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
          <button onClick={() => navigate('/login')}>로그인</button>
        </div>
      )}
    </header>
  );
}

export default Header;

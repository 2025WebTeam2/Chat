// 모든 페이지 공통 헤더
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/userSlice';
import styles from '../styles/css/com.module.css';
import loImage from '../assets/svg/logo_ver_moon_.svg';

function Header() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('id');
  };
  return (
    <header className={styles.header}>
      <img src={loImage} alt='로고' className={styles.logo} />
      <button onClick={handleLogout}>로그아웃</button>
    </header>
  );
}

export default Header;

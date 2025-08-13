// src/App.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { setUserId } from './store/userSlice';

import Header from './components/Header';
import ChatToggleButton from './components/ChatToggleButton';
import LoginForm from './components/LoginForm';
import SearchPage from './pages/SearchPage';
import ChatPage from './pages/ChatPage';
import SignupPage from './pages/SignupPage';
import ProductPage from './pages/ProductPage';
import RegistrationPage from './pages/RegistrationPage';
import MyPage from './pages/MyPage';
import ResultPage from './pages/ResultPage';
import ListPage from './pages/ListPage';

function App() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);

  // 새로고침 시 localStorage에서 로그인 유지
  useEffect(() => {
    const savedId = localStorage.getItem('id');
    if (savedId) {
      dispatch(setUserId(savedId));
    }
  }, [dispatch]);

  return (
    <Router>
      {/* Router 안으로 Header 이동 */}
      <Header />
      {userId && <ChatToggleButton />}

      <Routes>
        {/* 로그인 여부에 따른 라우팅 */}
        <Route path='/' element={userId ? <SearchPage /> : <LoginForm />} />
        <Route path='/chat/:roomId' element={userId ? <ChatPage /> : <Navigate to='/' replace />} />
        <Route path='/search' element={userId ? <SearchPage /> : <Navigate to='/' replace />} />
        <Route path='/signup' element={userId ? <Navigate to='/' replace /> : <SignupPage />} />
        <Route path='/product/:id' element={userId ? <ProductPage /> : <Navigate to='/' replace />} />
        <Route path='/register-product' element={userId ? <RegistrationPage /> : <Navigate to='/' replace />} />
        <Route path='/mypage' element={userId ? <MyPage /> : <Navigate to='/' replace />} />
        <Route path='/result' element={userId ? <ResultPage /> : <Navigate to='/' replace />} />
        <Route path='/list' element={userId ? <ListPage /> : <Navigate to='/' replace />} />
        {/* 없는 경로는 홈으로 */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

export default App;

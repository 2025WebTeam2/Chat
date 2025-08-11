// App.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { setUserId } from './store/userSlice';
import Header from './components/Header';
import ChatToggleButton from './components/ChatToggleButton';
import LoginForm from './components/LoginForm';
import SearchPage from './pages/SearchPage';
import ChatPage from './pages/ChatPage';

function App() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);

  // 페이지 새로고침 시 DB나 저장소에서 로그인 사용자 복구함
  useEffect(() => {
    // ✅ MySQL에서 로그인 유지하려면 여기에 API 호출해서 세션 확인 가능
    // ---->>> fetch('/api/session').then(...)
    const savedId = localStorage.getItem('id'); // 세션 유지 안 쓰면 그냥 로컬읽기
    if (savedId) {
      dispatch(setUserId(savedId));
    }
  }, [dispatch]);

  return (
    <>
      <Header /> {/* 로그아웃은 Header 내부에서 Redux dispatch */}
      <Router>
        {/* 채팅 토글 버튼 (항상 표시할 거라면 여기) */}
        {userId && <ChatToggleButton />}
        <Routes>
          {/* 로그인 안되어 있으면 "/"에서 바로 LoginForm */}
          <Route path='/' element={userId ? <SearchPage /> : <LoginForm />} />
          {/* 채팅방 - 로그인 안 했으면 로그인 페이지로 보냄 */}
          <Route path='/chat/:roomId' element={userId ? <ChatPage /> : <Navigate to='/' replace />} />
          {/* 검색 페이지 - 로그인 안 했으면 로그인 페이지로 */}
          <Route path='/search' element={userId ? <SearchPage /> : <Navigate to='/' replace />} />
          {/* 없는 경로 → 홈으로 */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

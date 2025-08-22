import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Redux action import
import { login } from './store/userSlice';

// 컴포넌트 import
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

/*
  ResultPageWrapper:
  - location.state로 전달된 이미지 분석 결과 데이터를
    ResultPage 컴포넌트에 props로 전달
  - location.state가 없으면 빈 값으로 초기화
*/
function ResultPageWrapper() {
  const location = useLocation();
  const { labels = [], detected_text = '', detected_logo = '', filename = '', image_url = '', matched_products = [] } = location.state || {};

  return <ResultPage labels={labels} detected_text={detected_text} detected_logo={detected_logo} filename={filename} image_url={image_url} matched_products={matched_products} />;
}

function App() {
  const dispatch = useDispatch();

  //리덕스에서 로그인상태 가져오기
  //const userid = useSelector((state) => state.user.userid);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  /*
    새로고침 시 localStorage에 저장된 로그인 정보를
    Redux 상태로 복원
  */
  useEffect(() => {
    const savedUser = localStorage.getItem('user'); // localStorage에서 user 키 가져오기
    if (savedUser) {
      dispatch(login(JSON.parse(savedUser))); // 문자열 → 객체로 변환 후 login 액션에 전달
    }
  }, [dispatch]);

  return (
    <Router>
      {/* Header는 모든 페이지에서 항상 보여줌 */}
      <Header />

      {/* 로그인한 사용자만 채팅 버튼 표시 */}
      {isLoggedIn && <ChatToggleButton />}

      <Routes>
        {/* 홈: 로그인 여부에 따라 SearchPage 또는 LoginForm */}
        <Route path='/' element={isLoggedIn ? <SearchPage /> : <LoginForm />} />

        {/* 채팅 페이지: 로그인하지 않으면 홈으로 */}
        <Route path='/chat/:roomId' element={isLoggedIn ? <ChatPage /> : <Navigate to='/' replace />} />

        {/* 검색 페이지 */}
        <Route path='/search' element={isLoggedIn ? <SearchPage /> : <Navigate to='/' replace />} />

        {/* 회원가입 페이지: 로그인하면 접근 불가 */}
        <Route path='/signup' element={isLoggedIn ? <Navigate to='/' replace /> : <SignupPage />} />

        {/* 상품 상세 페이지 */}
        <Route path='/product/:id' element={isLoggedIn ? <ProductPage /> : <Navigate to='/' replace />} />

        {/* 상품 등록 페이지 */}
        <Route path='/register-product' element={isLoggedIn ? <RegistrationPage /> : <Navigate to='/' replace />} />

        {/* 마이페이지 */}
        <Route path='/mypage' element={isLoggedIn ? <MyPage /> : <Navigate to='/' replace />} />

        {/* 이미지 분석 결과 페이지 */}
        <Route path='/result' element={isLoggedIn ? <ResultPageWrapper /> : <Navigate to='/' replace />} />

        {/* 목록 페이지 */}
        <Route path='/list' element={isLoggedIn ? <ListPage /> : <Navigate to='/' replace />} />

        {/* 없는 경로는 홈으로 리다이렉트 */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

export default App;

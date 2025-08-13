import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function MyPage() {
  const { userId, username } = useSelector((state) => state.user);

  if (!userId) return <Navigate to='/' replace />;

  return (
    <div style={{ padding: 40 }}>
      <h2>👤 내 정보</h2>
      <p>아이디: {userId}</p>
      <p>닉네임: {username || '설정되지 않음'}</p>
    </div>
  );
}

export default MyPage;

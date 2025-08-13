import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProductPage() {
  const { userId } = useSelector((state) => state.user);

  if (!userId) return <Navigate to='/' replace />;

  return (
    <div style={{ padding: 40 }}>
      <h2>🛒 상품 페이지</h2>
      <p>사용자 {userId}님이 접근했습니다.</p>
      {/* 실제 상품 목록/이미지/가격 표시 */}
    </div>
  );
}

export default ProductPage;

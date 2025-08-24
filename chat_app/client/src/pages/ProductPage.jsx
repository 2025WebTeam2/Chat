import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProductDetail } from '../api/productsApi';
import { createChatRoom } from '../api/chatApi';

function ProductPage() {
  const { id: productId } = useParams();
  const location = useLocation();
  const { id: userId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);

  // ------------------- 상품 상세 정보 불러오기
  useEffect(() => {
    if (product) return; // 이미 state로 받은 경우 재호출 불필요

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductDetail(productId);
        setProduct(res);
      } catch (err) {
        console.error('상품 상세 조회 실패:', err);
        alert('상품 정보를 불러오지 못했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, product, navigate]);

  // ------------------- 판매자 클릭 시 채팅방 생성
  const handleSellerClick = async () => {
    if (!product) return;

    if (product.seller_id === userId) {
      alert('자신과는 채팅할 수 없습니다.');
      return;
    }

    try {
      const res = await createChatRoom(userId, product.seller_id);
      if (res.success && res.roomId) {
        navigate(`/chat/${res.roomId}`, { state: { sellerName: product.seller_name } });
      } else {
        alert('채팅방 생성 실패');
      }
    } catch (err) {
      console.error('채팅방 생성 오류:', err);
      alert('채팅방 생성 실패');
    }
  };

  if (!userId) return <Navigate to='/' replace />;
  if (loading) return <p style={{ padding: 40 }}>상품 정보를 불러오는 중...</p>;
  if (!product) return <p style={{ padding: 40 }}>상품 정보를 찾을 수 없습니다.</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>🛒 {product.title}</h2>

      <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
        {/* 이미지 */}
        <img src={`http://localhost:4000${product.image_url}`} alt={product.title} style={{ width: 300, height: 300, objectFit: 'cover', borderRadius: 10 }} />

        {/* 상세 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p>
            <strong>카테고리:</strong> {product.category_name || '알 수 없음'}
          </p>
          <p>
            <strong>판매자:</strong>{' '}
            <span onClick={handleSellerClick} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
              {product.seller_name || '알 수 없음'}
            </span>
          </p>
          <p>
            <strong>가격:</strong> {Number(product.price).toLocaleString()} 원
          </p>
          <p>
            <strong>등록일:</strong> {new Date(product.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>상태:</strong> {product.product_states}
          </p>
          {product.description && (
            <p>
              <strong>설명:</strong> {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

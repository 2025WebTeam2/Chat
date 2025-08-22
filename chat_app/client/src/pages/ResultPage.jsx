// src/pages/ResultPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ResultPage() {
  const { userId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------------------
  // 1️⃣ 이미지 분석 결과
  // ---------------------------
  console.log('ResultPage location.state:', location.state);
  const { labels = [], detected_text, detected_logo, filename, image_url, matched_products = [] } = location.state || {};

  // ---------------------------
  // 2️⃣ 검색(query) 기반 결과
  // ---------------------------
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (!query) return;
    axios
      .get(`http://localhost:4000/api/product/search?q=${query}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.error(err));
  }, [query]);

  // ---------------------------
  // 로그인 체크
  // ---------------------------
  if (!userId) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      {/* 🔹 이미지 분석 결과 */}
      {filename && (
        <>
          <h2>분석 결과 - {filename}</h2>
          <img src={image_url} alt='Uploaded' style={{ maxWidth: '300px', border: '1px solid #ccc' }} />

          <h3>감지된 라벨(Keywords):</h3>
          {labels.length > 0 ? (
            <ul>
              {labels.map((item, idx) => (
                <li key={idx}>
                  {item.keyword} - 신뢰도: {item.confidence}
                </li>
              ))}
            </ul>
          ) : (
            <p>키워드가 없습니다.</p>
          )}

          <h3>감지된 텍스트:</h3>
          <p>{detected_text || '감지된 텍스트가 없습니다.'}</p>

          <h3>감지된 로고:</h3>
          <p>{detected_logo || '감지된 로고가 없습니다.'}</p>

          <h3>일치하는 상품 목록:</h3>
          {matched_products.length > 0 ? (
            <ul>
              {matched_products.map((prod) => (
                <li key={prod.id}>
                  제품명: {prod.product_name} / 판매자명: {prod.user_name} / 라벨(키워드): {prod.product_label} / 텍스트: {prod.product_text} / 로고: {prod.product_logo}
                </li>
              ))}
            </ul>
          ) : (
            <p>일치하는 상품이 없습니다.</p>
          )}
        </>
      )}

      <hr style={{ margin: '20px 0' }} />

      {/* 🔹 텍스트 검색 결과 */}
      {query && (
        <>
          <h2>🔍 검색 결과: {query}</h2>
          {results.length === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id} onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: 'pointer', marginBottom: 10 }}>
                  {p.title} - {p.price}원
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>
        뒤로가기
      </button>
    </div>
  );
}

export default ResultPage;

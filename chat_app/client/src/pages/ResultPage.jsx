// src/pages/ResultPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header2';

function ResultPage() {
  const { userId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState([]);

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (!query) return;
    axios
      .get(`http://localhost:4000/api/product/search?q=${query}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.error(err));
  }, [query]);

  if (!userId) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
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
      </div>
    </>
  );
}

export default ResultPage;

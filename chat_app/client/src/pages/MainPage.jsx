// SearchPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header2';
import '../styles/Search.css';

function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  return (
    <div className='search-page'>
      <Header />
      <h1>메인 페이지</h1>
    </div>
  );
}

export default SearchPage;

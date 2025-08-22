// src/pages/RegistrationPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegistrationPage() {
  const { userId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // ---------------------------
  // 1️⃣ 사용자 기본 정보
  // ---------------------------
  const [form, setForm] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------
  // 2️⃣ 상품 등록
  // ---------------------------
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/products/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('카테고리 불러오기 실패:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('등록 정보:', form);
    alert('사용자 정보 등록 완료!');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const res = await axios.post('/api/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        timeout: 10000,
      });
      console.log('응답:', res.data);
      alert('등록이 성공했습니다!');

      // 입력값 초기화
      setTitle('');
      setCategory('');
      setPrice('');
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;

      // 등록 완료 후 검색 페이지 이동
      navigate('/search');
    } catch (err) {
      console.error('상품 등록 실패:', err.response || err.message || err);
      alert('상품 등록 실패');
    }
  };

  // ---------------------------
  // 로그인 체크
  // ---------------------------
  if (!userId) return <Navigate to='/' replace />;

  return (
    <>
      <div style={{ padding: 40 }}>
        <h2>📝 사용자 정보 등록</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type='text' name='name' placeholder='이름' value={form.name} onChange={handleChange} required />
          <input type='email' name='email' placeholder='이메일' value={form.email} onChange={handleChange} required />

          <h2>상품 등록</h2>
          <input type='text' placeholder='상품명' value={title} onChange={(e) => setTitle(e.target.value)} required />
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value=''>카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input type='text' placeholder='가격' value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type='file' onChange={handleImageChange} ref={fileInputRef} required />

          {imagePreview && (
            <div>
              <p>이미지 미리보기:</p>
              <img src={imagePreview} alt='미리보기' style={{ maxWidth: '200px', marginTop: '10px' }} />
            </div>
          )}

          <button type='submit'>등록</button>
        </form>
      </div>
    </>
  );
}

export default RegistrationPage;

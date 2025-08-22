import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../store/userSlice';

import SearchBox from '../components/SearchBox';
import ChatToggleButton from '../components/ChatToggleButton';
import ChatList from '../components/ChatList';

function SearchPage() {
  const { userId, username } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  // --------------------------- 카테고리 불러오기
  useEffect(() => {
    axios
      .get('http://localhost:4000/api/products/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('카테고리 불러오기 실패:', err));
  }, []);

  // --------------------------- 상품 검색
  useEffect(() => {
    let url = `http://localhost:4000/api/products?title=${query}`;
    if (selectedCategory) url += `&category=${selectedCategory}`;

    axios
      .get(url, { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('상품 검색 오류:', err));
  }, [query, selectedCategory]);

  // --------------------------- 사용자 목록 (채팅)
  useEffect(() => {
    if (!userId) return;

    axios
      .get('http://localhost:4000/api/users', { withCredentials: true })
      .then((res) => setUsers(res.data.filter((id) => id !== userId)))
      .catch((err) => console.error('사용자 목록 불러오기 실패:', err));
  }, [userId]);

  const generateRoomId = (userA, userB) => `room-${[userA, userB].sort().join('-')}`;

  const handleStartChat = async (otherUserId) => {
    const roomId = generateRoomId(userId, otherUserId);
    try {
      await axios.post('http://localhost:4000/api/chat/create', { roomId, user1: userId, user2: otherUserId }, { withCredentials: true });
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error('채팅방 생성 실패:', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleRegisterProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category_id', category);
    formData.append('price', price);
    formData.append('seller_id', userId);
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:4000/api/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      alert('상품 등록 성공!');
      setProducts((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('상품 등록 실패:', err);
      alert('상품 등록 실패');
    }
  };

  if (!userId) return <Navigate to='/' replace />;

  return (
    <div className='search-page'>
      <div style={{ padding: 40 }}>
        <p>
          환영합니다, <strong>{username}</strong> 님!
          <button onClick={handleLogout} style={{ marginLeft: 20 }}>
            로그아웃
          </button>
        </p>
      </div>

      <SearchBox query={query} setQuery={setQuery} onSearch={() => console.log('검색:', query)} />

      <div style={{ padding: '0 40px 20px 40px' }}>
        <label>카테고리: </label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value=''>전체</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ padding: '0 40px 40px 40px', border: '1px solid #ccc', marginBottom: 20 }}>
        <h3>상품 등록</h3>
        <form onSubmit={handleRegisterProduct} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          {imagePreview && <img src={imagePreview} alt='미리보기' style={{ width: 120, marginTop: 10 }} />}
          <button type='submit'>등록</button>
        </form>
      </div>

      <div style={{ padding: '0 40px 40px 40px' }}>
        <h3>상품 목록</h3>
        {products.length === 0 ? (
          <p>상품이 없습니다.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>이미지</th>
                <th>카테고리</th>
                <th>판매자</th>
                <th>상품명</th>
                <th>가격</th>
                <th>등록일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.products_id}>
                  <td>
                    <img src={`http://localhost:4000${p.image_url}`} alt={p.title} style={{ width: 80, height: 80, objectFit: 'cover' }} />
                  </td>
                  <td>{p.category}</td>
                  <td>{p.seller_id}</td>
                  <td>{p.title}</td>
                  <td>{Number(p.price).toLocaleString()} 원</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>{p.product_states}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ChatToggleButton userId={userId} />
      <ChatList userId={userId} handleStartChat={handleStartChat} />
    </div>
  );
}

export default SearchPage;

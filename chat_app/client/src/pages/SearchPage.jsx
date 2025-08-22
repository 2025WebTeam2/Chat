import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct, getProducts, getCategories } from '../api/productsApi'; // productsApi
import { getProductDetail } from '../api/productsApi';
import { logout } from '../store/userSlice';
import SearchBox from '../components/SearchBox';

function SearchPage() {
  const { id: userId, username } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --------------------------- 검색 및 상품 상태
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);

  // --------------------------- 상품 등록 상태
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  // --------------------------- 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(); // axios.get을 대신하여 getCategories 사용
        setCategories(res); // 반환된 카테고리 목록을 상태에 저장
      } catch (err) {
        console.error('카테고리 불러오기 실패:', err);
      }
    };
    fetchCategories();
  }, []);

  // --------------------------- 상품 검색/조회
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(query, selectedCategory); // getProducts로 쿼리와 카테고리 전달
        setProducts(res); // 반환된 상품 목록을 상태에 저장
      } catch (err) {
        console.error('상품 검색 오류:', err);
      }
    };
    fetchProducts();
  }, [query, selectedCategory]); // 쿼리나 선택된 카테고리가 바뀔 때마다 호출

  // --------------------------- 로그아웃
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // --------------------------- 상품 등록
  const handleRegisterProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category_id', category);
    formData.append('price', price);
    formData.append('seller_id', userId);
    formData.append('image', image);

    try {
      const res = await createProduct(formData); // productsApi.js에서 제공하는 createProduct 함수 사용
      alert('상품 등록 성공!');
      let uploaded = setProducts((prev) => [res, ...prev]); // 등록된 상품을 상품 목록에 추가

      console.log(uploaded);
      // 입력 초기화
      setTitle('');
      setCategory('');
      setPrice('');
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('상품 등록 실패:', err);
      alert('상품 등록 실패');
    }
  };

  // --------------------------- 상품 상세 조회
  const fetchProductDetail = async (productId) => {
    try {
      const res = await getProductDetail(productId);
      console.log(res); // 상품 상세 정보 확인
    } catch (err) {
      console.error('상품 상세 조회 실패:', err);
    }
  };

  // --------------------------- 이미지 변경 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

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
          <option value=''>선택하세요</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ padding: '0 40px 40px 40px', border: '1px solid #ccc', marginBottom: 20 }}>
        <h3>내 물건 팔기</h3>
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
          {imagePreview && <img src={imagePreview} alt='미리보기' style={{ width: '120px', marginTop: 10 }} />}
          <button type='submit'>등록</button>
        </form>
      </div>

      <div style={{ padding: '20px' }}>
        <h3>상품 목록</h3>
        <br />
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
              {products.map((p) => {
                console.log(p);
                return (
                  <tr key={p.products_id} style={{ height: '100px' }}>
                    <td>
                      <img src={`http://localhost:4000${p.image_url}`} alt={p.title} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    </td>
                    <td>{p.category_naame || '무슨카테고리'}</td>
                    <td>{p.seller_name || '알수없음'}</td>
                    <td>{p.title}</td>
                    <td>{Number(p.price).toLocaleString()} 원</td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td>{p.product_states}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SearchPage;

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../components/Header2';

function ListPage() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get('title');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products?title=${title}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('상품 검색 오류:', err);
      }
    };

    fetchProducts();
  }, [title]);

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        <h2>검색 결과: {title}</h2>
        {products.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc' }}>이미지</th>
                <th style={{ border: '1px solid #ccc' }}>카테고리</th>
                <th style={{ border: '1px solid #ccc' }}>판매자 ID</th>
                <th style={{ border: '1px solid #ccc' }}>상품명</th>
                <th style={{ border: '1px solid #ccc' }}>가격</th>
                <th style={{ border: '1px solid #ccc' }}>등록일</th>
                <th style={{ border: '1px solid #ccc' }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>
                    <Link to={`/product/${product.products_id}`}>
                      <img src={`http://localhost:4000${product.image_url}`} alt={product.title} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    </Link>
                  </td>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>{product.category}</td>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>{product.seller_id}</td>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>
                    <Link to={`/product/${product.products_id}`}>{product.title}</Link>
                  </td>
                  <td style={{ border: '1px solid #ccc', textAlign: 'right' }}>{product.price.toLocaleString()} 원</td>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>{new Date(product.created_at).toLocaleDateString()}</td>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>{product.product_states}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default ListPage;

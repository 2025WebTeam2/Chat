import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/products';

// 카테고리 목록 가져오기
export const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data;
};

// 상품 등록
export const createProduct = async (productData) => {
  const response = await axios.post(BASE_URL, productData);
  return response.data;
};

// // 판매자 이름 가져오기
// export const getSellerName = async (seller_id) => {
//   const response = await axios.get(`http://localhost:4000/api/sellers/${seller_id}`); // sellerId를 이용해서 판매자 이름을 가져옴
//   return response.data;
// };
// 상품 리스트 가져오기
export const getProducts = async (query, category) => {
  let url = `${BASE_URL}?`;

  // query가 있을 경우에만 title 파라미터 추가
  if (query) {
    url += `title=${query}&`;
  }

  // selectedCategory가 있을 경우 카테고리 필터 추가
  if (category) {
    url += `category=${category}`;
  }

  const response = await axios.get(url);
  return response.data;
};

// 상품 상세 조회
export const getProductDetail = async (productId) => {
  const response = await axios.get(`${BASE_URL}/${productId}`);
  return response.data;
};

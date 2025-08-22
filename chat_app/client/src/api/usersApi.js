import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/users';

// 회원가입
export const signup = async (userData) => {
  const response = await axios.post(`${BASE_URL}/signup`, userData);
  return response.data;
};

// 로그인
export const login = async (loginData) => {
  const response = await axios.post(`${BASE_URL}/login`, loginData);
  return response.data;
};

// 유저 정보 가져오기 (프로필 페이지)
export const getUser = async (userId) => {
  const response = await axios.get(`${BASE_URL}/${userId}`);
  return response.data;
};

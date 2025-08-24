import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/chat';

// // 채팅방 생성
// export const createRoom = async (roomData) => {
//   const response = await axios.post(`${BASE_URL}/rooms`, roomData);
//   return response.data;
// };

// 채팅방 생성
export const createChatRoom = async (userId, sellerId) => {
  const roomData = {
    user1: userId,
    user2: sellerId,
    roomId: `${userId}_${sellerId}`, // roomId는 userId와 sellerId 조합으로 생성
  };

  const response = await axios.post(`${BASE_URL}/create`, roomData);
  return response.data;
};

// 채팅방 목록 조회
export const getRooms = async (userId) => {
  const response = await axios.get(`${BASE_URL}/rooms/${userId}`);
  return response.data;
};

// 메시지 보내기
export const sendMessage = async (messageData) => {
  const response = await axios.post(`${BASE_URL}/messages`, messageData);
  return response.data;
};

// 특정 방 메시지 불러오기
export const getMessages = async (roomId) => {
  const response = await axios.get(`${BASE_URL}/messages/${roomId}`);
  return response.data;
};

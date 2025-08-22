import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import productReducer from './productSlice';
import chatReducer from './chatSlice';

// 중앙 store 생성
const store = configureStore({
  reducer: {
    user: userReducer, // state.user 로 접근 가능
    products: productReducer, // state.products 로 접근 가능
    chat: chatReducer, // state.chat 로 접근 가능
  },
});

export default store;

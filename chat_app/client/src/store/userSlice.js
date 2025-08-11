// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    userId: '',
  },
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    logout(state) {
      state.username = '';
      state.userId = '';
    },
  },
});

export const { setUsername, setUserId, logout } = userSlice.actions;

export default userSlice.reducer;

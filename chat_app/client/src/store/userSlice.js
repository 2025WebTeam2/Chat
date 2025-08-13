import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: localStorage.getItem('id') || '',
    username: '',
  },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
      localStorage.setItem('id', action.payload);
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    logout(state) {
      state.userId = '';
      state.username = '';
      localStorage.removeItem('id');
    },
  },
});

export const { setUserId, setUsername, logout } = userSlice.actions;
export default userSlice.reducer;

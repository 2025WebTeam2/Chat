import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null, //pk (users.id)
  userid: null, //로그인ID
  usernaem: null, //닉네임
  email: null,
  phone: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { id, userid, username, email, phone } = action.payload;
      state.id = id;
      state.userid = userid;
      state.username = username;
      state.email = email;
      state.phone = phone;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
    updateUsername: (state, action) => {
      state.username = action.payload; // 닉네임 변경할경우
    },
  },
});

export const { login, logout, updateUsername } = userSlice.actions;
export default userSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const userSlice = createSlice({
//   name: 'user',
//   initialState: {
//     userId: localStorage.getItem('userid') || '',
//     username: localStorage.getItem('username') || '',
//   },
//   reducers: {
//     setUser(state, action) {
//       state.userId = action.payload.userid;
//       state.username = action.payload.username;
//       localStorage.setItem('userid', action.payload); // userId
//       localStorage.setItem('username', action.payload); // username
//     },

//     logout(state) {
//       state.userId = '';
//       state.username = '';
//       localStorage.removeItem('userid');
//       localStorage.removeItem('username');
//     },
//   },
// });

// export const { setUser, setUsername, logout } = userSlice.actions;
// export default userSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const userSlice = createSlice({
//   name: 'user',
//   initialState: {
//     userId: localStorage.getItem('userid') || '',
//     username: localStorage.getItem('username') || '',
//   },
//   reducers: {
//     setUser(state, action) {
//       state.userId = action.payload.userid;
//       state.username = action.payload.username;
//       localStorage.setItem('userid', action.payload.userid);
//       localStorage.setItem('username', action.payload.username);
//     },
//     logout(state) {
//       state.userId = '';
//       state.username = '';
//       localStorage.removeItem('userid');
//       localStorage.removeItem('username');
//     },
//   },
// });

// export const { setUser, logout } = userSlice.actions;
// export default userSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const userSlice = createSlice({
//   name: 'user',
//   initialState: {
//     userId: localStorage.getItem('userid') || '',
//     username: localStorage.getItem('username') || '',
//   },
//   reducers: {
//     setUser(state, action) {
//       state.userId = action.payload.userid;
//       state.username = action.payload.username;
//       localStorage.setItem('userid', action.payload.userid);
//       localStorage.setItem('username', action.payload.username);
//     },
//     logout(state) {
//       state.userId = '';
//       state.username = '';
//       localStorage.removeItem('userid');
//       localStorage.removeItem('username');
//     },
//   },
// });

// export const { setUser, logout } = userSlice.actions;
// export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rooms: [], // 방 메타데이터 리스트
  messages: {}, // 방별 메시지 저장소
  unreadCounts: {}, // 방별 안 읽은 메시지 개수
  currentRoomId: null, // 현재 열어둔(화면에 보고 있는) 방의 room_id
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    createRoom: (state, action) => {
      const { room_id, user1, user2, exited_user = null } = action.payload;
      const exists = state.rooms.find((r) => r.room_id === room_id);
      if (!exists) {
        state.rooms.push({ room_id, user1, user2, exited_user });
      }
    },
    setCurrentRoom: (state, action) => {
      state.currentRoomId = action.payload;
    },
    addMessage: (state, action) => {
      const { room_id, sender, message, sent_at } = action.payload;
      if (!state.messages[room_id]) state.messages[room_id] = [];
      state.messages[room_id].push({ sender, message, sent_at });
    },
    exitRoom: (state, action) => {
      const { room_id } = action.payload;
      state.rooms = state.rooms.filter((room) => room.room_id !== room_id);
      delete state.messages[room_id];
      delete state.unreadCounts[room_id];
      if (state.currentRoomId === room_id) {
        state.currentRoomId = null;
      }
    },
    removeRoom: (state, action) => {
      const { room_id } = action.payload;
      state.rooms = state.rooms.filter((r) => r.room_id !== room_id);
      delete state.messages[room_id];
      delete state.unreadCounts[room_id];
    },
  },
});

export const { setRooms, createRoom, setCurrentRoom, addMessage, exitRoom, removeRoom } = chatSlice.actions;

export default chatSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

//초기값정의
const initialState = {
  rooms: [], // 방 메타데이터 리스트 (예: [{ room_id, user1, user2, exited_user }])
  messages: {}, // 방별 메시지 저장소 (키: room_id, 값: 메시지 배열)
  unreadCounts: {}, // 방별 안 읽은 메시지 개수 (키: room_id, 값: 숫자)
  currentRoomId: null, // 현재 열어둔(화면에 보고 있는) 방의 room_id
};

const chatSlice = createSlice({
  name: 'chat',
  initialState, // 위에서 정의한 초기 상태 사용
  reducers: {
    // 서버에서 내 채팅방 목록을 받아와 초기 세팅할 때 사용
    setRooms: (state, action) => {
      // action.payload: [{ room_id, user1, user2, exited_user }, ...]
      state.rooms = action.payload; // 방 메타데이터 업데이트
      action.payload.forEach((r) => {
        // 모든 방을 순회하면서
        if (!state.messages[r.room_id]) state.messages[r.room_id] = []; // 메시지 배열이 없으면 빈 배열로 초기화
        if (typeof state.unreadCounts[r.room_id] !== 'number') {
          // unreadCounts가 없으면
          state.unreadCounts[r.room_id] = 0; // 0으로 초기화
        }
      });
    },

    // ✅ 새로운 방을 만들거나(없으면) 이미 있으면 무시
    createRoom: (state, action) => {
      // action.payload: { room_id, user1, user2, exited_user? }
      const { room_id, user1, user2, exited_user = null } = action.payload; // 페이로드 구조 분해
      const exists = state.rooms.find((r) => r.room_id === room_id); // 이미 존재하는지 확인
      if (!exists) {
        // 없으면
        state.rooms.push({ room_id, user1, user2, exited_user }); // 방 메타데이터 추가
      }
      if (!state.messages[room_id]) state.messages[room_id] = []; // 해당 방 메시지 배열 초기화(없으면)
      if (typeof state.unreadCounts[room_id] !== 'number') {
        // unreadCounts 초기화(없으면)
        state.unreadCounts[room_id] = 0;
      }
    },

    // ✅ 사용자가 채팅 목록에서 특정 방을 클릭해서 들어가는 순간
    setCurrentRoom: (state, action) => {
      // action.payload: room_id (문자열)
      // currentRoomId = null 이라면 어떤 방도 열지않은 상태
      state.currentRoomId = action.payload; // 현재 방 변경
      const roomId = action.payload; // 가독성을 위해 변수로 보관
      if (state.messages[roomId]) {
        // 해당 방의 메시지 배열이 있다면
        state.messages[roomId] = state.messages[roomId].map(
          (
            m // 모든 메시지를 순회하며
          ) => ({ ...m, is_read: true }) // 읽음 처리
        );
      }
      state.unreadCounts[roomId] = 0; // 미읽음 카운트 0으로 초기화
    },

    // ✅ 메시지 추가(소켓 수신/내가 보냄 모두 공용)
    addMessage: (state, action) => {
      // action.payload: { room_id, sender, message, sent_at?, is_read? }
      const { room_id, sender, message, sent_at, is_read } = action.payload; // 페이로드 구조 분해

      if (!state.messages[room_id]) state.messages[room_id] = []; // 메시지 배열이 없으면 먼저 초기화
      // 현재 방이 열려 있으면 즉시 읽음 처리, 아니면 미읽음
      const computedIsRead = typeof is_read === 'boolean' ? is_read : state.currentRoomId === room_id;

      // 메시지 객체를 방에 추가
      state.messages[room_id].push({
        sender, // 보낸 사람 (users.id)
        message, // 메시지 본문
        sent_at: sent_at || new Date().toISOString(), // 보낸 시각(미제공 시 현재시간)
        is_read: computedIsRead, // 읽음 여부
      });

      // 현재 보고 있는 방이 아니면 미읽음 카운트 +1
      if (state.currentRoomId !== room_id) {
        state.unreadCounts[room_id] = (state.unreadCounts[room_id] || 0) + 1;
      }
    },

    // ✅ 특정 방의 메시지를 모두 읽음 처리 (백그라운드에서 호출할 수도 있음)
    markRoomRead: (state, action) => {
      // action.payload: { room_id }
      const { room_id } = action.payload; // room_id 추출
      if (state.messages[room_id]) {
        // 해당 방 메시지가 있다면
        state.messages[room_id] = state.messages[room_id].map((m) => ({ ...m, is_read: true })); // 모두 읽음 처리
      }
      state.unreadCounts[room_id] = 0; // 미읽음 카운트 0
    },

    // ✅ 방에서 누가 나갔는지 상태 반영
    exitRoom: (state, action) => {
      // action.payload: { room_id, exited_user }  // exited_user는 users.id
      const { room_id, exited_user } = action.payload; // 구조 분해
      const room = state.rooms.find((r) => r.room_id === room_id); // 대상 방 찾기
      if (room) {
        // 방이 존재하면
        room.exited_user = exited_user; // 나간 사용자 기록
      }
      if (state.currentRoomId === room_id) {
        // 만약 현재 보고 있던 방이라면
        state.currentRoomId = null; // 현재 방 해제
      }
    },

    // ✅ 방을 목록에서 제거(완전 삭제) — 필요할 때만 사용
    removeRoom: (state, action) => {
      // action.payload: { room_id }
      const { room_id } = action.payload; // room_id 추출
      state.rooms = state.rooms.filter((r) => r.room_id !== room_id); // 방 메타데이터 목록에서 제거
      delete state.messages[room_id]; // 방 메시지 삭제
      delete state.unreadCounts[room_id]; // 방 미읽음 카운트 삭제
      if (state.currentRoomId === room_id) {
        // 현재 방이 삭제 대상이라면
        state.currentRoomId = null; // 현재 방 초기화
      }
    },

    // ✅ 로그아웃 등으로 채팅 상태 전체 초기화가 필요할 때
    resetChatState: () => initialState, // 초기 상태로 되돌림 (새 객체 반환)
  },
});

export const { setRooms, createRoom, setCurrentRoom, addMessage, markRoomRead, exitRoom, removeRoom, resetChatState } = chatSlice.actions;

export default chatSlice.reducer;

export const selectRooms = (state) => state.chat.rooms; // 방 목록
export const selectCurrentRoomId = (state) => state.chat.currentRoomId; // 현재 방 ID
export const selectMessagesByRoom = (roomId) => (state) => state.chat.messages[roomId] || []; // 특정 방 메시지
export const selectUnreadCount = (roomId) => (state) => state.chat.unreadCounts[roomId] || 0; // 특정 방 미읽음 수

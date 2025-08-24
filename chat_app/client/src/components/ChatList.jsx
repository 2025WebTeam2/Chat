import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRooms } from '../store/chatSlice';

function ChatList({ userId }) {
  const [rooms, setRoomsState] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const fetchRooms = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/chat/rooms?user=${userId}`);
        const data = await res.json();
        const uniqueRooms = data.filter((room, index, self) => index === self.findIndex((r) => r.room_id === room.room_id));
        setRoomsState(uniqueRooms);
        dispatch(setRooms(uniqueRooms)); // redux state 업데이트
      } catch (err) {
        console.error('채팅방 목록 조회 실패:', err);
      }
    };

    fetchRooms();
  }, [userId, dispatch]);

  if (!userId) {
    return <div>로그인 후 채팅방을 이용할 수 있습니다.</div>;
  }

  return (
    <ul>
      {rooms.length === 0 ? (
        <li>대화 중인 채팅방이 없습니다</li>
      ) : (
        rooms.map((room) => (
          <li key={room.room_id}>
            <button onClick={() => navigate(`/chat/${room.room_id}`)}>💬 {room.seller_name} 님과의 대화</button>
          </li>
        ))
      )}
    </ul>
  );
}

export default ChatList;

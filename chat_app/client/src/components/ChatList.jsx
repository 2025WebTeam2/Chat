import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';

function ChatList({ userId, handleStartChat }) {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchRooms = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/chat/rooms?user=${userId}`);
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error('💥 채팅방 목록 조회 실패:', err);
      }
    };

    fetchRooms();
  }, [userId]);

  if (!userId) {
    return <div style={{ color: '#888', fontSize: 14, textAlign: 'center', padding: 20 }}>로그인 후 채팅방을 이용할 수 있습니다.</div>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, marginTop: 10 }}>
      {rooms.length === 0 ? (
        <li style={{ textAlign: 'center', color: '#777', padding: 20 }}>🔍 대화 중인 채팅방이 없습니다</li>
      ) : (
        rooms.map((room) => (
          <li key={room.room_id} style={{ marginBottom: 10 }}>
            <button
              onClick={() => navigate(`/chat/${room.room_id}`)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                background: '#f4f4f4',
                borderRadius: 6,
                border: '1px solid #ddd',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#e6f0ff')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#f4f4f4')}
            >
              💬 {room.otherUser} 님과의 대화
            </button>
          </li>
        ))
      )}
    </ul>
  );
}

export default ChatList;

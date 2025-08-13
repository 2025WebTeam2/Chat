import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/userSlice';
import SearchBox from '../components/SearchBox';
import ChatToggleButton from '../components/ChatToggleButton';
import ChatList from '../components/ChatList';

function SearchPage() {
  const { userId } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  const generateRoomId = (userA, userB) => {
    return `room-${[userA, userB].sort().join('-')}`;
  };

  useEffect(() => {
    if (!userId) return;
    fetch('http://localhost:4000/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((id) => id !== userId)))
      .catch((err) => console.error('사용자 목록 불러오기 실패:', err));
  }, [userId]);

  const handleStartChat = async (otherUserId) => {
    const roomId = generateRoomId(userId, otherUserId);
    try {
      await fetch('http://localhost:4000/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, user1: userId, user2: otherUserId }),
      });
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error('채팅방 생성 실패:', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className='search-page'>
      <div style={{ padding: 40 }}>
        <p>
          환영합니다, <strong>{userId}</strong> 님!
          <button onClick={handleLogout} style={{ marginLeft: 20 }}>
            로그아웃
          </button>
        </p>
      </div>

      <SearchBox query={query} setQuery={setQuery} onSearch={() => console.log('검색:', query)} />

      <div style={{ padding: 40 }}>
        <h3>📜 대화할 사용자 목록</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {users.map((otherUserId) => (
            <li key={otherUserId} style={{ marginBottom: 10 }}>
              <button
                onClick={() => handleStartChat(otherUserId)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  background: '#f0f0f0',
                }}
              >
                {otherUserId} 님과 채팅하기 💬
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ChatToggleButton userId={userId} />
      <ChatList userId={userId} />
    </div>
  );
}

export default SearchPage;

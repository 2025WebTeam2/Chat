import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SearchBox from '../components/SearchBox';
import ChatToggleButton from '../components/ChatToggleButton';
import ChatList from '../components/ChatList';
import { logout } from '../store/userSlice';

function SearchPage() {
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const generateRoomId = (userA, userB) => {
    const sorted = [userA, userB].sort();
    return `room-${sorted[0]}-${sorted[1]}`;
  };

  useEffect(() => {
    if (!userId) return;
    fetch('http://localhost:4000/api/users')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((id) => id !== userId);
        setUsers(filtered);
      })
      .catch((err) => console.error('사용자 목록 불러오기 실패:', err));
  }, [userId]);

  const handleStartChat = async (otherUserId) => {
    const roomId = generateRoomId(userId, otherUserId);

    try {
      await fetch('http://localhost:4000/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          user1: userId,
          user2: otherUserId,
        }),
      });

      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error('채팅방 생성 실패:', err);
    }
  };

  const handleLogout = () => {
    // 1) 리덕스 상태 초기화
    dispatch(logout());
    // 2) 로컬스토리지 정리
    localStorage.removeItem('id');
    // 3) 로그인 화면 등으로 리다이렉트 (여기선 그냥 새로고침)
    navigate('/');
  };

  const handleSearch = () => {
    console.log('검색 쿼리:', query);
    // 필요하면 검색 API 호출 또는 필터링 처리
  };

  return (
    <div className='search-page'>
      <div className='search-header'>
        <img src='/pickimg.png' alt='로고' className='logo-image' />
        <h1 className='logo-text'>찍고보고</h1>
      </div>

      <div style={{ padding: '40px' }}>
        <p>
          환영합니다, <strong>{userId}</strong> 님!
          <button onClick={handleLogout} style={{ marginLeft: 20 }}>
            로그아웃
          </button>
        </p>
      </div>

      <SearchBox query={query} setQuery={setQuery} onSearch={handleSearch} />

      <div style={{ padding: '40px' }}>
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

      {/* 말풍선 버튼 및 채팅방 목록 */}
      <ChatToggleButton userId={userId} />
      <ChatList userId={userId} />
    </div>
  );
}

export default SearchPage;

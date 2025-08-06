import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchBox from '../components/SearchBox';
import ChatToggleButton from '../components/ChatToggleButton';
import ChatList from '../components/ChatList';
import '../styles/css/Search.css';

function SearchPage() {
  const username = useSelector((state) => state.user.username);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const generateRoomId = (userA, userB) => {
    const sorted = [userA, userB].sort();
    return `room-${sorted[0]}-${sorted[1]}`;
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/users')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((name) => name !== username);
        setUsers(filtered);
      })
      .catch((err) => console.error('사용자 목록 불러오기 실패:', err));
  }, [username]);

  const handleStartChat = async (otherUser) => {
    //const roomId = `room-${[username, otherUser].sort().join('-')}`;
    const roomId = generateRoomId(username, otherUser);

    try {
      await fetch('http://localhost:4000/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          user1: username, // ✅ 무조건 현재 로그인한 사용자
          user2: otherUser, // ✅ 버튼에서 클릭된 상대방
        }),
      });

      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error('채팅방 생성 실패:', err);
    }
  };

  // // ✅ 대화 시작: 방이 없다면 생성 요청 후 이동
  // const startChat = async (otherUser) => {
  //   const roomId = generateRoomId(username, otherUser);

  //   try {
  //     await fetch('http://localhost:4000/api/chat/start', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ user1: username, user2: otherUser }),
  //     });

  //     navigate(`/chat/${roomId}`);
  //   } catch (err) {
  //     console.error('❌ 채팅방 생성 실패:', err);
  //   }
  // };

  // ✅ 사용자 목록 불러오기 (자기 자신 제외)
  // useEffect(() => {
  //   fetch('http://localhost:4000/api/users')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const filtered = data.filter((name) => name !== username);
  //       setUsers(filtered);
  //     })
  //     .catch((err) => console.error('사용자 목록 불러오기 실패:', err));
  // }, [username]);

  const handleSearch = () => {
    console.log('검색 쿼리:', query);
  };

  const handleLogout = () => {
    localStorage.removeItem('nickname');
    window.location.reload();
  };

  return (
    <div className='search-page'>
      <div className='search-header'>
        <img src='/pickimg.png' alt='로고' className='logo-image' />
        <h1 className='logo-text'>찍고보고</h1>
      </div>

      <div style={{ padding: '40px' }}>
        <p>
          환영합니다, <strong>{username}</strong> 님!
          <button onClick={handleLogout} style={{ marginLeft: 20 }}>
            로그아웃
          </button>
        </p>
      </div>

      <SearchBox query={query} setQuery={setQuery} onSearch={handleSearch} />

      {/* ✅ 사용자 목록 */}
      <div style={{ padding: '40px' }}>
        <h3>📜 대화할 사용자 목록</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {users.map((otherUser) => (
            <li key={otherUser} style={{ marginBottom: 10 }}>
              <button
                onClick={() => handleStartChat(otherUser)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  background: '#f0f0f0',
                }}
              >
                {otherUser} 님과 채팅하기 💬
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 말풍선 버튼 및 채팅방 목록 */}
      <ChatToggleButton username={username} />
      <ChatList />
    </div>
  );
}

export default SearchPage;

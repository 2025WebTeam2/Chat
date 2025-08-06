import React, { useState } from 'react';
import ChatList from './ChatList';

function ChatToggleButton({ username }) {
  console.log(username);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
      {/* 말풍선 아이콘 버튼 */}
      <button
        onClick={toggleChat}
        aria-label='채팅 토글'
        style={{
          backgroundColor: '#0b5ed7',
          color: '#fff',
          borderRadius: '50%',
          width: 60,
          height: 60,
          fontSize: 26,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        💬
      </button>

      {/* 채팅 리스트 패널 */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            right: 0,
            width: 320,
            maxHeight: 400,
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 12,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            padding: 10,
          }}
        >
          <h4 style={{ margin: '0 0 10px' }}>📋 내 채팅방</h4>

          {username ? <ChatList username={username} /> : <div style={{ color: '#888', fontSize: 14 }}>로그인 후 채팅방이 표시됩니다. </div>}
        </div>
      )}
    </div>
  );
}

export default ChatToggleButton;
import React, { useState } from 'react';

function NicknameForm({ onSubmit }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>닉네임을 입력하세요</h2>
      <input type='text' value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder='닉네임 입력' style={{ padding: '10px', width: '100%', marginBottom: '10px' }} />
      <button type='submit' style={{ padding: '10px 20px' }}>
        입장
      </button>
    </form>
  );
}

export default NicknameForm;
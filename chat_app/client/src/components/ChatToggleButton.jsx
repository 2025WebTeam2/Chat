import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ChatList from './ChatList';

function ChatToggleButton() {
  const userId = useSelector((state) => state.user.id); // Redux에서 userId 가져오기
  console.log(userId); // 로그로 확인
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

          {userId ? <ChatList userId={userId} /> : <div style={{ color: '#888', fontSize: 14 }}>로그인 후 채팅방을 이용할 수 있습니다.</div>}
        </div>
      )}
    </div>
  );
}

export default ChatToggleButton;

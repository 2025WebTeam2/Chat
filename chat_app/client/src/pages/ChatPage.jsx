import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function ChatPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    socket.emit('join_room', roomId);

    fetch(`http://localhost:4000/api/chat/messages?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => setChatMessages(data))
      .catch((err) => console.error('💥 이전 메시지 로딩 실패:', err));

    const handleReceive = (data) => {
      setChatMessages((prev) => [...prev, data]);
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [roomId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!message.trim() || !userId) return;

    socket.emit('send_message', {
      roomId,
      sender: userId,
      message,
    });

    setMessage('');
  };

  const leaveRoom = () => {
    fetch('http://localhost:4000/api/chat/exit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, userId }),
    })
      .then((res) => res.json())
      .then(() => {
        socket.emit('send_message', {
          roomId,
          sender: '[안내]',
          message: `${userId}님이 방을 나갔습니다.`,
        });
        navigate('/');
      })
      .catch((err) => console.error('💥 방 나가기 실패:', err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 채팅방: {roomId}</h2>
      <button onClick={() => navigate(-1)}>← 돌아가기</button>
      <button onClick={leaveRoom} style={{ marginLeft: 10 }}>
        나가기
      </button>

      <div
        style={{
          marginTop: 20,
          padding: 10,
          border: '1px solid #ccc',
          height: 400,
          overflowY: 'auto',
          background: '#f9f9f9',
          borderRadius: 8,
        }}
      >
        {chatMessages.map((msg, index) => {
          const isMine = msg.sender === userId;
          const isNotice = msg.sender === '[안내]';

          return (
            <div
              key={index}
              style={{
                textAlign: isNotice ? 'center' : isMine ? 'right' : 'left',
                marginBottom: 12,
              }}
            >
              {!isNotice && <div style={{ fontSize: 12, color: '#888' }}>{msg.sender}</div>}
              <div
                style={{
                  display: 'inline-block',
                  background: isNotice ? '#eee' : isMine ? '#cfe9ff' : '#fff',
                  color: '#000',
                  padding: '8px 12px',
                  borderRadius: 16,
                  maxWidth: '60%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.message}
              </div>
              <div style={{ fontSize: '0.75em', color: '#aaa' }}>{msg.time || msg.sent_at}</div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing) sendMessage();
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder='메시지 입력...'
          style={{ padding: 8, flex: 1 }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default ChatPage;

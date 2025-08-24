import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function ChatPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { id: userId } = useSelector((state) => state.user);
  console.log(userId); // 로그로 확인
  // useLocation을 사용하여 판매자 이름 가져오기
  const location = useLocation();
  const { sellerName } = location.state || {}; // state에서 판매자 이름을 가져옴
  console.log(sellerName);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    socket.emit('join_room', roomId);

    fetch(`http://localhost:4000/api/chat/messages?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setChatMessages(data || []);
      })
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
    if (!roomId || !userId) {
      console.error('Room ID or User ID is missing');
      return;
    }

    fetch('http://localhost:4000/api/chat/exit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, userId }),
    })
      .then((res) => res.json())
      .then(() => {
        socket.emit('send_message', {
          roomId,
          sender: '[안내]', // 서버에서 senderId=0 처리 + senderName='[안내]'
          message: `${userId}님이 방을 나갔습니다.`,
        });
        navigate('/');
      })
      .catch((err) => {
        console.error('💥 방 나가기 실패:', err);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 채팅방: {sellerName ? `${sellerName} 님과의 대화` : '대화 중'}</h2> {/* 판매자 이름 표시 */}
      <div className='Chat_btn' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate(-1)}>← 돌아가기</button>
        <button onClick={leaveRoom} style={{ marginLeft: 10 }}>
          나가기
        </button>
      </div>
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
          const myId = Number(userId);
          const senderId =
            typeof msg.senderId !== 'undefined'
              ? Number(msg.senderId)
              : typeof msg.sender !== 'undefined' // 혹시 남아있을 구형 데이터 대비
              ? Number(msg.sender)
              : NaN;
          console.log({ msg, senderId, senderName: msg.senderName });

          const isNotice = msg.senderName === '[안내]' || senderId === 0;
          const isMine = !isNotice && !isNaN(senderId) && senderId === myId;
          return (
            <div
              key={index}
              style={{
                textAlign: isNotice ? 'center' : isMine ? 'right' : 'left',
                marginBottom: 12,
              }}
            >
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

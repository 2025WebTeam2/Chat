import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChatList({ userId, handleStartChat }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get('http://localhost:4000/api/users', { withCredentials: true })
      .then((res) => setUsers(res.data.filter((id) => id !== userId)))
      .catch((err) => console.error('사용자 목록 불러오기 실패:', err));
  }, [userId]);

  if (!userId) return null;

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 10, backgroundColor: '#fff', width: 200 }}>
      <h4>채팅 시작</h4>
      {users.length === 0 ? (
        <p>사용자가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {users.map((user) => (
            <li key={user} style={{ marginBottom: 8 }}>
              <button onClick={() => handleStartChat(user)} style={{ width: '100%', padding: '5px 10px', textAlign: 'left', borderRadius: 5, border: '1px solid #007bff', backgroundColor: '#f0f8ff' }}>
                {user}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatList;

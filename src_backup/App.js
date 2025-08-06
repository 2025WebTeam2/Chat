import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import ChatPage from './pages/ChatPage';
import NicknameForm from './components/NicknameForm';

function App() {
  const [username, setUsername] = useState(localStorage.getItem('nickname') || '');

  useEffect(() => {
    if (username) {
      localStorage.setItem('nickname', username);
      fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: username }),
      }).catch(console.error);
    }
  }, [username]);

  return (
    <Router>
      <Routes>
        <Route path='/' element={username ? <SearchPage username={username} /> : <NicknameForm onSubmit={setUsername} />} />
        <Route path='/chat/:roomId' element={<ChatPage username={username} />} />
        <Route path='/search' element={<SearchPage username={username} />} />
      </Routes>
    </Router>
  );
}

export default App;

require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/uploads', express.static('uploads'));

// MySQL 연결
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL 연결 실패:', err);
  } else {
    console.log('✅ MySQL 연결 성공!');
  }
});

// 닉네임 등록 말고 아이디로 변경
app.post('/api/users', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: '아이디가 필요합니다.' });

  const sql = `INSERT IGNORE INTO users (id) VALUES (?)`;
  connection.query(sql, [id], (err) => {
    if (err) {
      console.error('DB 오류:'.err);
      return res.status(500).json({ error: 'DB 오류' });
    }
    res.json({ success: true, id });
  });
});

// 닉네임 목록
app.get('/api/users', (req, res) => {
  connection.query('SELECT id FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });
    const ids = results.map((row) => row.id);
    res.json(ids);
  });
});

// 채팅방 목록
app.get('/api/chat/rooms', (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: '사용자 이름이 필요합니다.' });

  const sql = `
    SELECT room_id,
      CASE WHEN user1 = ? THEN user2 ELSE user1 END AS otherUser
    FROM chat_rooms
    WHERE (user1 = ? OR user2 = ?) AND (exited_user IS NULL OR exited_user != ?)
  `;
  connection.query(sql, [user, user, user, user], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });
    res.json(results);
  });
});

// 메시지 불러오기
app.get('/api/chat/messages', (req, res) => {
  const { roomId } = req.query;
  if (!roomId) return res.status(400).json({ error: 'roomId가 필요합니다.' });

  const sql = `SELECT * FROM chat_messages WHERE room_id = ? ORDER BY sent_at ASC`;
  connection.query(sql, [roomId], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });
    res.json(results);
  });
});

// 채팅방 생성
app.post('/api/chat/create', (req, res) => {
  const { roomId, user1, user2 } = req.body;
  if (!roomId || !user1 || !user2) return res.status(400).json({ success: false, error: '모든 필드가 필요합니다' });

  const sql = `
    INSERT INTO chat_rooms (room_id, user1, user2)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE room_id = room_id
  `;
  connection.query(sql, [roomId, user1, user2], (err) => {
    if (err) return res.status(500).json({ success: false, error: 'DB 오류' });
    res.json({ success: true });
  });
});

// 채팅방 나가기
app.post('/api/chat/exit', (req, res) => {
  const { roomId, username } = req.body;
  if (!roomId || !username) return res.status(400).json({ error: 'roomId 또는 username 누락됨' });

  const sql = `UPDATE chat_rooms SET exited_user = ? WHERE room_id = ?`;
  connection.query(sql, [username, roomId], (err) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });
    res.json({ success: true, roomId });
  });
});

// ✅ 메시지 소켓 처리
io.on('connection', (socket) => {
  console.log('✅ 연결됨:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`🟢 ${socket.id} → 방 ${roomId}`);
  });

  socket.on('send_message', (data) => {
    const time = new Date().toLocaleString();

    const messagePayload = {
      sender: data.id,
      message: data.message,
      time,
    };

    const sql = `INSERT INTO chat_messages (room_id, sender, message) VALUES (?, ?, ?)`;
    connection.query(sql, [data.roomId, data.id, data.message], (err) => {
      if (err) {
        console.error('❌ 메시지 저장 오류:', err);
      } else {
        console.log('📝 메시지 저장 완료');
      }
    });

    io.to(data.roomId).emit('receive_message', messagePayload);
  });

  socket.on('disconnect', () => {
    console.log('❌ 연결 종료:', socket.id);
  });
});

// React SPA 대응
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

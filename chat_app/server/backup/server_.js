require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const mysql = require('mysql2/promise');
const router = express.Router();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const emailAuth = require('./routes/emailAuth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', credentials: true },
});

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 },
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DB 연결 ---
let connection;
(async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    console.log('✅ MySQL 연결 성공');
  } catch (err) {
    console.error('❌ MySQL 연결 실패:', err);
  }
})();

// --- 라우트 등록 ---
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', emailAuth);

app.post('/api/login', async (req, res) => {
  const { userid, password } = req.body;
  const sql = 'SELECT * FROM users WHERE id = ? AND password = ?';
  try {
    const [results] = await connection.query(sql, [userid, password]);
    if (results.length === 0) return res.status(401).json({ message: '아이디 또는 비밀번호가 틀립니다.' });
    res.json({ userid: results[0].id, username: results.nickname });
  } catch (err) {
    res.status(500).json({ message: 'DB 에러' });
  }
});
// --- 사용자/채팅 API ---
app.post('/api/users', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: '아이디가 필요합니다.' });

  const sql = `INSERT IGNORE INTO users (id) VALUES (?)`;
  try {
    await connection.query(sql, [id]);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT id FROM users');
    res.json(results.map((r) => r.id));
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

app.get('/api/chat/rooms', async (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: '사용자 이름이 필요합니다.' });

  const sql = `
    SELECT room_id,
      CASE WHEN user1 = ? THEN user2 ELSE user1 END AS otherUser
    FROM chat_rooms
    WHERE (user1 = ? OR user2 = ?) AND (exited_user IS NULL OR exited_user != ?)
  `;
  try {
    const [results] = await connection.query(sql, [user, user, user, user]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

app.get('/api/chat/messages', async (req, res) => {
  const { roomId } = req.query;
  if (!roomId) return res.status(400).json({ error: 'roomId가 필요합니다.' });

  const sql = `SELECT * FROM chat_messages WHERE room_id = ? ORDER BY sent_at ASC`;
  try {
    const [results] = await connection.query(sql, [roomId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

app.post('/api/chat/create', async (req, res) => {
  const { roomId, user1, user2 } = req.body;
  if (!roomId || !user1 || !user2) return res.status(400).json({ success: false, error: '모든 필드가 필요합니다' });

  const sql = `
    INSERT INTO chat_rooms (room_id, user1, user2)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE room_id = room_id
  `;
  try {
    await connection.query(sql, [roomId, user1, user2]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'DB 오류' });
  }
});

app.post('/api/chat/exit', async (req, res) => {
  const { roomId, username } = req.body;
  if (!roomId || !username) return res.status(400).json({ error: 'roomId 또는 username 누락됨' });

  const sql = `UPDATE chat_rooms SET exited_user = ? WHERE room_id = ?`;
  try {
    await connection.query(sql, [username, roomId]);
    res.json({ success: true, roomId });
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

// --- Socket.io ---
io.on('connection', (socket) => {
  console.log('✅ 연결됨:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', async (data) => {
    const time = new Date().toLocaleString();
    const messagePayload = { sender: data.id, message: data.message, time };

    const sql = `INSERT INTO chat_messages (room_id, sender, message) VALUES (?, ?, ?)`;
    try {
      await connection.query(sql, [data.roomId, data.id, data.message]);
    } catch (err) {
      console.error('❌ 메시지 저장 오류:', err);
    }

    io.to(data.roomId).emit('receive_message', messagePayload);
  });

  socket.on('disconnect', () => {
    console.log('❌ 연결 종료:', socket.id);
  });
});

// --- 이미지 업로드 ---
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: '파일이 없습니다.' });

    const data = {
      filename: file.filename,
      labels: [],
      detected_text: '',
      detected_logo: '',
      matched_products: [],
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// // --- React SPA 대응 ---
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
// });

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

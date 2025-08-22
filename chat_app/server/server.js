require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// 라우트들
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const emailAuth = require('./routes/emailAuth');

// 시작
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', credentials: true },
  //credentials:true는 쿠키/세션 전달용
});

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json()); //json바디 파싱
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 },
  })
); //세션 미들웨어 설정(로긴유지용)

//app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //업로드 된 파일 정적 제공

// --- DB 연결 시작 ---
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

// --- 라우트 등록 , 연결 ---
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', emailAuth);

// 회원가입
app.post('/api/register', async (req, res) => {
  const { userid, username, password, email, phone } = req.body;
  if (!userid || !username || !password) return res.status(400).json({ error: '필수 입력값이 누락되었어요' });

  try {
    const hashed = await bcrypt.hash(password, 10); // 비밀번호 암호화
    const sql = `INSERT INTO users (userid, username, password, email, phone) VALUES (?, ?, ?, ?, ?)`;
    await connection.query(sql, [userid, username, hashed, email || null, phone || null]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});
// 로그인
app.post('/api/login', async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) return res.status(400).json({ error: '아이디 또는 비밀번호 누락' });
  const sql = 'SELECT * FROM users WHERE userid = ? AND password = ?';
  try {
    const [results] = await connection.query(sql, [userid, password]);
    if (results.length === 0) return res.status(401).json({ error: '아이디 또는 비밀번호가 틀립니다' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password); // 비밀번호 비교
    if (!match) return res.status(401).json({ error: '아이디 또는 비밀번호가 틀립니다' });

    req.session.userId = user.id; // 세션에 사용자 id 저장

    //res.json({ id: user.id, userid: user.userid, username: user.username });

    res.json({
      id: results[0].id, // PK (int)
      userid: results[0].userid, // 로그인 ID
      username: results[0].username, // 닉네임
    });
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

// 상품등록 / 조회 / 상세페에지

const upload = multer({ dest: 'uploads/' });
// 상품등록 (이미지포함)
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { title, price, product_states, category_id, seller_id } = req.body;
  const file = req.file; // multer가 업로드한 이미지
  if (!title || !price || !seller_id) return res.status(400).json({ error: '필수 필드 누락' });

  try {
    const sql = `
      INSERT INTO products (title, price, product_states, category_id, seller_id, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.query(sql, [title, price, product_states || null, category_id || null, seller_id, file ? file.filename : null]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});
// --- 이미지 검색용 업로드 ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: '파일이 없습니다.' });

    // 검색 서비스용 응답 (DB 저장 안 함)
    const data = {
      filename: file.filename,
      labels: [], // 이미지 라벨링 결과
      detected_text: '', // 텍스트 인식 결과
      detected_logo: '', // 로고 탐지 결과
      matched_products: [], // 관련 상품 매칭
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
});
// 상품 리스트 조회 (판매자이름 포함시키게 수정함)
app.get('/api/products', async (req, res) => {
  try {
    // const [results] = await connection.query('SELECT * FROM products ORDER BY created_at DESC');

    const [results] = await connection.query(`
      SELECT p.*, u.username AS seller_name
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      ORDER BY p.created_at DESC
    `); //seller_id 와 users 테이블과 조인해서 판매자 이름 같이 가져오게 수정
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

// 상품 상세 조회
app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const [results] = await connection.query('SELECT * FROM products WHERE products_id = ?', [productId]);
    if (results.length === 0) return res.status(404).json({ error: '상품 없음' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

// -- 채팅 관련 ----
// 채팅방 생성
app.post('/api/chat/create', async (req, res) => {
  const { roomId, user1, user2 } = req.body;
  if (!roomId || !user1 || !user2) return res.status(400).json({ error: '모든 필드 필요' });

  try {
    const sql = `INSERT INTO chat_rooms (room_id, user1, user2) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE room_id = room_id`;
    await connection.query(sql, [roomId, user1, user2]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

// 채팅방 리스트 조회
app.get('/api/chat/rooms', async (req, res) => {
  const userId = parseInt(req.query.user);
  if (!userId) return res.status(400).json({ error: '사용자 ID 필요' });

  const sql = `
    SELECT room_id,
      CASE WHEN user1 = ? THEN user2 ELSE user1 END AS otherUser
    FROM chat_rooms
    WHERE (user1 = ? OR user2 = ?) AND (exited_user IS NULL OR exited_user != ?)
  `;
  try {
    const [results] = await connection.query(sql, [userId, userId, userId, userId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

// 채팅 메시지 조회
app.get('/api/chat/messages', async (req, res) => {
  const { roomId } = req.query;
  if (!roomId) return res.status(400).json({ error: 'roomId 필요' });

  try {
    const [results] = await connection.query('SELECT * FROM chat_messages WHERE room_id = ? ORDER BY sent_at ASC', [roomId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

// 채팅방 나가기
app.post('/api/chat/exit', async (req, res) => {
  const { roomId, userId } = req.body;
  if (!roomId || !userId) return res.status(400).json({ error: 'roomId 또는 userId 누락' });

  try {
    const sql = `UPDATE chat_rooms SET exited_user = ? WHERE room_id = ?`;
    await connection.query(sql, [userId, roomId]);
    res.json({ success: true, roomId });
  } catch (err) {
    res.status(500).json({ error: 'DB 오류' });
  }
});

// -- 소켓 --- -

io.on('connection', (socket) => {
  console.log('✅ 연결됨:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId); // 특정 채팅방 참여
  });

  socket.on('send_message', async (data) => {
    const { roomId, userId, message } = data;
    const sent_at = new Date();

    try {
      // DB 저장
      await connection.query('INSERT INTO chat_messages (room_id, sender, message) VALUES (?, ?, ?)', [roomId, userId, message]);

      // 같은 방 참여자들에게 전달
      io.to(roomId).emit('receive_message', { sender: userId, message, sent_at });
    } catch (err) {
      console.error('❌ 메시지 저장 오류:', err);
    }
  });

  socket.on('disconnect', () => console.log('❌ 연결 종료:', socket.id));
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

// // --- React SPA 대응 ---
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
// });

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

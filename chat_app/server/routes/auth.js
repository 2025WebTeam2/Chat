// /server/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

// =======================
// 회원가입
// =======================
router.post('/signup', async (req, res) => {
  const { username, userid, password, confirmPassword, phone, email } = req.body;
  console.log('회원가입 요청 데이터:', req.body);

  if (password !== confirmPassword) {
    return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db.execute('INSERT INTO users (username, userid, password, phone, email) VALUES (?, ?, ?, ?, ?)', [username, userid, hashedPassword, phone, email]);

    console.log('DB insert 결과:', result);

    res.status(201).json({ message: '회원가입 성공', userId: result.insertId });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// =======================
// 로그인
// =======================
router.post('/login', async (req, res) => {
  const { userid, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE userid = ?', [userid]);

    if (rows.length === 0) {
      return res.status(400).json({ message: '존재하지 않는 아이디입니다.' });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }

    // 세션에 사용자 정보 저장
    req.session.user = {
      id: user.id,
      userid: user.userid,
      username: user.username,
      phone: user.phone,
      email: user.email,
    };

    // 마지막 로그인 시간 갱신
    await db.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    res.json({
      message: '로그인 성공',
      username: user.username,
      userid: user.userid,
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// =======================
// 로그인 사용자 정보 조회
// =======================
router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: '로그인 필요' });
  res.json(req.session.user);
});

// =======================
// 사용자 정보 수정
// =======================
router.put('/user', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: '로그인 필요' });

  const { userid } = req.session.user;
  const { username, password, phone, email } = req.body;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const sql = hashedPassword ? 'UPDATE users SET username = ?, password = ?, phone = ?, email = ? WHERE userid = ?' : 'UPDATE users SET username = ?, phone = ?, email = ? WHERE userid = ?';

    const params = hashedPassword ? [username, hashedPassword, phone, email, userid] : [username, phone, email, userid];

    await db.execute(sql, params);

    // 세션 정보 업데이트
    req.session.user = { ...req.session.user, username, phone, email };

    res.json({ message: '사용자 정보 수정 완료' });
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// =======================
// 사용자 삭제
// =======================
router.delete('/user', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: '로그인 필요' });

  const { userid } = req.session.user;

  try {
    await db.execute('DELETE FROM users WHERE userid = ?', [userid]);
    req.session.destroy((err) => {
      if (err) console.error('세션 삭제 오류:', err);
    });

    res.json({ message: '사용자 삭제 완료' });
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;

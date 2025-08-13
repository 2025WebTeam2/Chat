// server/emailAuth.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// 메모리에 인증코드 저장 (실제 서비스에선 Redis 추천)
let authCodes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kwonsam2004@gmail.com',
    pass: 'lxpp mxlu zedp xrvr' // Google 앱 비밀번호
  }
});

// 이메일로 인증코드 전송
router.post('/send-auth-code', async (req, res) => {
  const { email } = req.body;
  const authCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: 'kwonsam2004@gmail.com',
      to: email,
      subject: '회원가입 인증 코드',
      text: `인증코드: ${authCode}`,
    });

    authCodes[email] = authCode;
    res.json({ success: true, message: '인증 코드 전송 완료' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '이메일 전송 실패' });
  }
});

// 인증코드 확인
router.post('/verify-auth-code', (req, res) => {
  const { email, code } = req.body;

  if (authCodes[email] === code) {
    delete authCodes[email]; // 인증 완료 시 삭제
    res.json({ success: true, message: '이메일 인증 성공' });
  } else {
    res.status(400).json({ success: false, message: '인증 코드 불일치' });
  }
});

module.exports = router;

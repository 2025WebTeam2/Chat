const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// GET /api/products?title=검색어
router.get('/', async (req, res) => {
  const { title } = req.query;

  try {
    let rows;
    if (title) {
      // 🔍 검색어가 있을 때
      [rows] = await db.execute(
        `SELECT products_id, category_id, seller_id, title, price, created_at, product_states, image_url
         FROM products 
         WHERE title LIKE ?`,
        [`%${title}%`]
      );
    } else {
      // 🔍 검색어가 없을 때 전체 리스트
      [rows] = await db.execute(
        `SELECT products_id, category_id, seller_id, title, price, created_at, product_states, image_url
         FROM products`
      );
    }

    res.json(rows);
  } catch (error) {
    console.error('검색 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// multer 설정 (uploads 폴더에 저장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post('/add', upload.single('image'), async  (req, res) => {
  try {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  const { title, category, price } = req.body;
  const seller_id = req.session.user.userid;
  const image_url = `/uploads/${req.file.filename}`;
  const product_states = '판매중';
  const created_at = new Date();

  const sql = `
    INSERT INTO products
    (title, seller_id, category_id, image_url, price, product_states, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [title, seller_id, category, image_url, price, product_states, created_at]);

  console.log('상품 등록 성공, 응답 보냄');
  // 응답 바로 보내기
  return res.json({ message: '상품 등록 성공', productId: result.insertId });

  } catch (err) {
    console.error('서버 에러:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: '서버 오류 발생' });
    }
  }
});

router.get('/categories', async (req, res) => {
  const sql = 'SELECT category_id, name FROM category ORDER BY name ASC';
  try {
    const [results] = await db.execute(sql);
    res.json(results);
  } catch (err) {
    console.error('카테고리 불러오기 실패:', err);
    res.status(500).json({ message: '카테고리 불러오기 실패' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE products_id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.json(rows[0]); // 단일 객체 반환
  } catch (error) {
    console.error('상품 조회 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
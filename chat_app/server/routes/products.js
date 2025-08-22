const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // 유니크한 파일 이름 생성

// 상품 검색 API
// router.get('/', async (req, res) => {
//   const { title, category } = req.query;

//   try {
//     // let query = 'SELECT products_id, category_id, seller_id, title, price, created_at, product_states, image_url FROM products';
//     let query = `
//       SELECT p.products_id, p.category_id, p.seller_id, p.title, p.price, p.created_at, p.product_states, p.image_url, u.username AS seller_name
//       FROM products p
//       LEFT JOIN users u ON p.seller_id = u.id`; // products와 users 테이블을 LEFT JOIN

//     let params = [];

//     if (title) {
//       query += ' WHERE title LIKE ?';
//       params.push(`%${title}%`);
//     }

//     if (category) {
//       if (title) {
//         query += ' AND category_id = ?';
//       } else {
//         query += ' WHERE category_id = ?';
//       }
//       params.push(category);
//     }

//     const [rows] = await db.execute(query, params);
//     res.json(rows);
//   } catch (error) {
//     console.error('검색 오류:', error);
//     res.status(500).json({ message: '서버 오류' });
//   }
// });

router.get('/', async (req, res) => {
  const { title, category } = req.query;

  try {
    let query = `
      SELECT p.products_id, p.category_id, p.seller_id, p.title, p.price, p.created_at, p.product_states, p.image_url, 
             u.username AS seller_name, c.name AS category_name
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN category c ON p.category_id = c.category_id`; // products와 category 테이블을 LEFT JOIN

    let params = [];

    if (title) {
      query += ' WHERE p.title LIKE ?';
      params.push(`%${title}%`);
    }

    if (category) {
      if (title) {
        query += ' AND p.category_id = ?';
      } else {
        query += ' WHERE p.category_id = ?';
      }
      params.push(category);
    }

    const [rows] = await db.execute(query, params);
    res.json(rows); // 반환된 상품 목록에 판매자 이름과 카테고리 이름 포함
  } catch (error) {
    console.error('검색 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 상품 등록 API
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)), // 유니크한 파일 이름
});
const upload = multer({ storage });

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { title, category, price } = req.body;
    const seller_id = req.session.user.id;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const product_states = '판매중';
    const created_at = new Date();

    const sql = `
    INSERT INTO products
    (title, seller_id, category_id, image_url, price, product_states, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    const [result] = await db.execute(sql, [title, seller_id, category, image_url, price, product_states, created_at]);

    console.log('상품 등록 성공, 응답 보냄');
    return res.json({ message: '상품 등록 성공', productId: result.insertId });
  } catch (err) {
    console.error('서버 에러:', err);
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

// 카테고리 조회 API
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

// 상품 상세 조회 API
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE products_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('상품 조회 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;

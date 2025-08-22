// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../store/userSlice';

// function LoginPage() {
//   const [form, setForm] = useState({ userid: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:4000/api/login', form, { withCredentials: true });
//       dispatch(setUser({ userid: res.data.userid, username: res.data.username }));
//       navigate('/search');
//     } catch (err) {
//       setMessage(err.response?.data?.message || '로그인 실패');
//     }
//   };

//   return (
//     <div>
//       <h2>로그인</h2>
//       <form onSubmit={handleLogin}>
//         <input name='userid' placeholder='아이디' onChange={handleChange} required />
//         <br />
//         <input type='password' name='password' placeholder='비밀번호' onChange={handleChange} required />
//         <br />
//         <button type='submit'>로그인</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default LoginPage;
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [form, setForm] = useState({ userid: '', password: '' });
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', form, { withCredentials: true });
      // 서버에서 userid, username 받음 → Redux에 객체로 저장
      dispatch(setUser({ userid: res.data.userid, username: res.data.username }));
      navigate('/search');
    } catch (err) {
      setMessage(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input name='userid' placeholder='아이디' onChange={handleChange} required />
        <br />
        <input type='password' name='password' placeholder='비밀번호' onChange={handleChange} required />
        <br />
        <button type='submit'>로그인</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default LoginPage;

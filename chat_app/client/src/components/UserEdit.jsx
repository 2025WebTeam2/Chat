import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserEdit() {
  const [user, setUser] = useState({ username: '', password: '', email: '', phone: '' });

  useEffect(() => {
    axios.get('/api/me')
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/user', user);
      alert('회원정보가 수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('수정 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>회원정보 수정</h3>
      <input name="username" value={user.username} onChange={handleChange} placeholder="이름" />
      <input name="password" value={user.password} onChange={handleChange} placeholder="비밀번호" />
      <input name="email" value={user.email} onChange={handleChange} placeholder="이메일" />
      <input name="phone" value={user.phone} onChange={handleChange} placeholder="전화번호" />
      <button type="submit">수정하기</button>
    </form>
  );
}

export default UserEdit;

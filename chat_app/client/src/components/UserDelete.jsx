import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserDelete() {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까?')) return;

    try {
      await axios.delete('/api/user');
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/'); // 홈으로 이동
    } catch (err) {
      console.error(err);
      alert('탈퇴 실패');
    }
  };

  return (
    <div>
      <h3>회원 탈퇴</h3>
      <button onClick={handleDelete} style={{ color: 'red' }}>탈퇴하기</button>
    </div>
  );
}

export default UserDelete;

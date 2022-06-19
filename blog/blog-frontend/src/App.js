import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PostListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/write" element={<WritePage />} />
      <Route path="/@:username">
        <Route index element={<PostListPage />} />
        <Route path=":postId" element={<PostPage />} />
      </Route>
    </Routes>
  );
};

export default App;

// path에 '/@:username' 이라고 입력한 것은 http://localhost:3000/@velopert 같은 경로에서
// velopert를 username 파라미터로 읽을 수 있게 해준다. 계정명을 주소 경로 안에 넣을 때 주소 경로에 @을 넣는 방식을 사용한다.

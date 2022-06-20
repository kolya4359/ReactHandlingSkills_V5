// 포스트와 관련된 API를 요청하는 함수들

import client from './client';

export const writePost = ({ title, body, tags }) =>
  client.post('/api/posts', { title, body, tags });

export const readPost = (id) => client.get(`/api/posts/${id}`);

export const listPosts = ({ page, username, tag }) => {
  return client.get(`/api/posts`, {
    params: { page, username, tag },
  });
};

// lostPosts API를 호출할 때 파라미터로 값을 넣어 주면
// /api/posts?username=tester&page=2와 같이 주소를 만들어서 호출한다.

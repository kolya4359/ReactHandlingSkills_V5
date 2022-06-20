// 포스트와 관련된 API를 요청하는 함수들

import client from './client';

export const writePost = ({ title, body, tags }) =>
  client.post('/api/posts', { title, body, tags });

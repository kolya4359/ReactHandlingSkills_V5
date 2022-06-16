// 라우트 처리 함수들을 따로 분리해서 관리하는 파일.

import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  return next();
};

/*
  데이터 작성
  POST /api/posts
  {
    title: '제목',
    body: '내용',
    tags: ['태그1', '태그2']
  }
*/
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().item(Joi.string()).required(), // 문자열로 이루어진 배열
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  데이터 조회
  GET /api/posts
*/
export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
  // 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    // find() 함수를 호출한 후에 exec()를 붙여 주어야 서버에 쿼리를 요청한다.
    // sort() 함수의 key는 정렬할 필드를 설정하는 부분이고, 오른쪽 값을 1로 하면 오름차순, -1로 하면 내림차순으로 정렬한다.
    // limit() 함수는 보이는 개수를 제한한다. limit(10)은 10개로 제한한다는 뜻이다.
    // skip() 함수에 파라미터로 10을 넣어주면, 처음 열 개를 제외하고 그다음 데이터를 불러온다.
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    // Last-Page라는 커스텀 HTTP 헤더를 설정했다. 마지막 페이지의 번호를 HTTP 헤더를 통해 알 수 있게 했다.
    const postCount = await Post.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    // 포스트 본문의 내용의 길이를 200자로 제한한다.
    // find()를 통해 조회한 데이터는 mongoose 문서 인스턴스의 형태이므로 데이터를 바로 변형할 수 없다.
    // 그 대신 toJSON() 함수를 실행하여 JSON 형태로 변환한 뒤 필요한 변형을 일으켜 주어야 한다.
    ctx.body = posts
      .map((post) => post.toJSON())
      .map((post) => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      }));
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  특정 포스트 조회
  GET /api/posts/:id
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  데이터 삭제
  DELETE /api/posts/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  데이터 수정
  PATCH /api/posts/:id
  {
    title: '수정',
    body: '수정 내용',
    tags: ['수정', '태그']
  }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  // wirte에서 사용한 schema와 비슷한데, required()가 없다.
  const schema = Joi.object.keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환한다.
      // false일 때는 업데이트되기 전의 데이터를 반환한다.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
// findByIdAndUpdate() 함수는 세 가지 파라미터를 넣어 주어야 한다.
// 첫 번째는 id, 두 번째는 업데이트 내용, 세 번째는 업데이트의 옵션이다.

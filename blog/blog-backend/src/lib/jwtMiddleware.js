// 사용자의 토큰을 확인한 후 검증하는 작업을 해 주는 미들웨어.

import jwt from 'jsonwebtoken';
import User from '../models/user';

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next(); // 토큰이 없음
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };
    // 토큰의 남은 유효 기간이 3.5일 미만이면 재발급
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      const token = user.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
        httpOnly: true,
      });
    }
    return next();
  } catch (e) {
    // 토큰 검증 실패
    return next();
  }
};

export default jwtMiddleware;

/**
 * jwtMiddleware를 통해 토큰이 해석된 이후에 다음과 같은 결과물이 나온다.
 * { _id: '5cbdae1249429f5f3a6bc39a',
 *   username: 'velopert',
 *   iat: 1555938210,
 *   exp: 1556543010 }
 * 여기서 iat 값은 이 토큰이 언제 만들어졌는지 알려 주는 값이고, exp 값은 언제 만료되는지 알려주는 값이다.
 */

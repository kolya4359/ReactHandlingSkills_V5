import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// 인스턴스 메서드를 작성할 때는 화살표 함수가 아닌 function 키워드를 사용해서 구현해야 한다.
// 함수 내부에서 this에 접근해야 하기 때문이다. 여기서 this는 문서 인스턴스를 가리킨다.
// 화살표 함수를 사용하면 this는 문서 인스턴스를 가리키지 못한다.
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true / false
};

// findByUsername 이라는 스태틱 메서드를 작성했다. 이 메서드는 username으로 데이터를 찾을 수 있게 해준다.
// 스태틱 함수에서의 this는 모델을 가리킨다. 지금 여기서는 User를 가리킨다.
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

// hashedPassword 필드가 응답되지 않도록 데이터를 JSON으로 변환한 후 delete를 통해 해당 필드를 지운다.
// 비슷한 작업을 자주 하게 되므로 serialize라는 인스턴스 함수로 따로 만들어서 사용한다.
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

// 토큰 발급하기
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫 번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣는다.
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET, // 두 번째 파라미터에는 JWT 암호를 넣는다.
    {
      expiresIn: '7d', // 7일 동안 유효함
    },
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;

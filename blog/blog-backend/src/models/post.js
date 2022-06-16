// 데이터베이스에 포스트 스키마를 만드는 파일.
import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
});

const Post = mongoose.model('Post', PostSchema);
export default Post;

// model() 메서드에는 두 개의 파라미터가 필요하다. 첫 번째 파라미터는 스키마 이름이고,
// 두 번째 파라미터는 스키마 객체이다. 데이터베이스는 스키마 이름을 정해 주면 그 이름의 복수 형태로
// 데이터베이스에 컬렉션 이름을 만든다.
// 예를 들어 스키마 이름을 Post로 설정하면, 실제 데이터베이스에 만드는 컬렉션 이름은 posts이다.
// BookInfo로 입력하면 bookinfos를 만든다.
// 컬렉션 이름을 원하는 이름으로 하고 싶을 땐 세 번째 파라미터로 넣어주면 된다.
// mongoose.model('Post', PostSchema, 'custom_book_collection');

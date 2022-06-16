- --dev : 개발용 의존 모듈로 설치한다는 의미이다. 이렇게 설치하면 package.json에서 devDependencies 쪽에 모듈의 버전 정보가 입력된다.

- eslint : ESLint는 JavaScript, JSX의 정적 분석 도구로 오픈 소스 프로젝트이다. 코드를 분석해 문법적인 오류나 안티 패턴을 찾아주고 일관된 코드 스타일로 작성하도록 도와준다.

- eslint-config-prettier : Prettier에서 관리하는 코드 스타일은 ESLint에서 관리하지 않도록 해준다.

- nodemon: 코드를 변경할 때마다 서버를 자동으로 재시작해 준다.

- koa-router: Koa를 사용할 때 다른 주소로 요청이 들어올 경우 다른 작업을 처리할 수 있도록 해주는 라우터 라이브러리.

- koa-bodyparser: POST/PUT/PATCH 같은 메서드의 Request Body에 JSON 형식으로 데이터를 넣어 주면, 이를 파싱하여 서버에서 사용할 수 있게 한다.

- mongoose: Node.js와 MongoDB를 연결해주는 ODM이다. **ODM(Object Document Mapping)** : 객체와 문서를 1대1로 매칭하는 역할

- dotenv: 환경변수들을 파일에 넣고 사용할 수 있게 하는 개발 도구이다.

- esm: ECMAScript에서 지원하는 자바 스크립트 공식 모듈.
  (import와 export를 사용할 수 있게 해준다.)
  import와 export를 지원하지 않는 브라우저가 많으므로, 번들러를 함께 사용해야한다.
  \<script> 태그에 type="module"을 선언하면 자바스크립트 파일을 모듈로 사용할 수 있다. 이때, 모듈이라는 것을 정확히 표현하기 위해 mjs 확장자를 사용하도록 권장한다.

- joi: 유효성 검사를 도와주는 라이브러리.

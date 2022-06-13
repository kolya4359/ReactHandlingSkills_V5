// 루트 리듀서 만들기
// 스토어를 만들 때는 리듀서를 하나만 사용해야 하는데, 이번 프로젝트에선 리듀서를
// 여러 개 만들었다. 그러므로 combineReducers 유틸 함수를 사용해 하나로 합쳐준다.
import { combineReducers } from 'redux';
import counter from './counter';
import todos from './todos';

const rootReducer = combineReducers({
  counter,
  todos,
});

export default rootReducer;

// redux-saga를 통해 더 쉽게 API를 요청할 수 있도록 createRequestSaga 유틸 함수를 설정.

import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from '../modules/loading';

// 각 요청마다 액션 타입을 세 개 선언해야 하는데, 같은 작업이 반복된다. 이와 같은 경우
// 액션 타입을 한꺼번에 만드는 함수를 선언하는 방법을 사용한다.
export const createRequestActionTypes = (type) => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    yield put(startLoading(type)); // 로딩 시작
    try {
      const response = yield call(request, action.payload);
      yield put({
        type: SUCCESS,
        payload: response.data,
        meta: response, // 마지막 페이지 번호를 HTTP 헤더를 통해 클라이언트에 전달하기 위해
        // 액션 안에 meta 값을 response로 넣어 준다.
      });
    } catch (e) {
      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }
    yield put(finishLoading(type)); // 로딩 끝
  };
}

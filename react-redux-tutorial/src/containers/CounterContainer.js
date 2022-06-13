import React from 'react';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease } from '../modules/counter';

const CouterContainer = ({ number, increase, decrease }) => {
  return (
    <Counter number={number} onIncrease={increase} onDecrease={decrease} />
  );
};

// mapStateToProps는 리덕스 스토어 안의 상태를 컴포넌트의 props로 넘겨주기 위해 설정하는 함수.
// 파라미터로 받은 state는 현재 스토어가 지니고 있는 상태를 가리킨다.
const mapStateToProps = (state) => ({
  number: state.counter.number,
});

// mapDispatchToProps는 액션 생성 함수를 컴포넌트의 props로 넘겨주기 위해 사용하는 함수
const mapDispatchToProps = (dispatch) => ({
  // 임시 함수
  increase: () => {
    dispatch(increase());
  },
  decrease: () => {
    dispatch(decrease());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CouterContainer);

// mapStateToProps, mapDispatchToProps를
// connect 함수 내부에 익명 함수 형태로 선언해도 문제가 되지 않는다.
// const CounterContainer = ({ number, increase, decrease }) => {
//   return (
//     <Counter number={number} onIncrease={increase} onDecrease={decrease} />
//   )
// }
// export default connect(
//   state => ({
//     number: state.counter.number,
//   }),
//   dispatch => ({
//     increase: () => dispatch(increase()),
//     decrease: () => dispatch(decrease()),
//   }),
// )(CounterContainer);

// 컴포넌트에서 액션을 디스패치하기 위해 각 액션 생성 함수를 호출하고 dispatch로 감싸는 작업이 번거로울 경우
// 리덕스에서 제공하는 bindActionCreators 유틸 함수를 사용하면 간편해진다.
// import { bindActionCreators } from 'redux';
// ...
// export default connect(
//   state => ({
//     number: state.counter.number,
//   }),
//   dispatch =>
//   bindActionCreators(
//     {
//       increase,
//       decrease,
//     },
//     dispatch,
//   ),
// )(CounterContainer);

// 또다른 방법은 mapDispatchToProps에 해당하는 파라미터를 함수 형태가 아닌 액션 생성 함수로 이루어진 객체 형태로 넣어주는 것이다.
// export default RTCPeerConnectionErrorCallback(
//   state => ({
//     number: state.counter.number,
//   }),
//   {
//     increase,
//     decrease,
//   },
// )(CounterContainer);
// 위와 같이 두 번째 파라미터를 아예 객체 형태로 넣어 주면 connect 함수가 내부적으로 bindActionCreators 작업을 대신해 준다.

import { createStore } from "redux";

// 별도의 라이브러리를 사용하지 않기 때문에 DOM을 직접 수정해야 한다. 그래서 수정할 DOM 노드를 가리키는 값을 미리 선언해 준다.
const divToggle = document.querySelector(".toggle");
const counter = document.querySelector("h1");
const btnIncrease = document.querySelector("#increase");
const btnDecrease = document.querySelector("#decrease");

// 액션 이름을 정의한다.
const TOGGLE_SWITCH = "TOGGLE_SWITCH";
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";

// 액션 이름을 사용하여 액션 객체를 만드는 액션 생성 함수를 작성한다.
const toggleSwitch = () => ({ type: TOGGLE_SWITCH });
const increase = (difference) => ({ type: INCREASE, difference });
const decrease = () => ({ type: DECREASE });

// 초깃값을 설정한다.
const initialState = {
  toggle: false,
  counter: 0,
};

// 변화를 일으키는 리듀서 함수를 작성한다.
// state가 undefined일 때는 initialState를 기본값으로 사용
function reducer(state = initialState, action) {
  // action.type에 따라 다른 작업을 처리함
  switch (action.type) {
    case TOGGLE_SWITCH:
      return {
        ...state, // 불변성 유지를 해 주어야 한다.
        toggle: !state.toggle,
      };
    case INCREASE:
      return {
        ...state,
        counter: state.counter + action.difference,
      };
    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1,
      };
    default:
      return state;
  }
}

// 스토어를 만든다.
const store = createStore(reducer);

// render 함수를 작성한다. 이 함수는 상태가 업데이트될 때마다 호출되며, 리액트의 render 함수와는 다르게
// 이미 html을 사용하여 만들어진 UI의 속성을 상태에 따라 변경해 준다.
const render = () => {
  const state = store.getState(); // 현재 상태를 불러온다.
  // 토글 처리
  if (state.toggle) {
    divToggle.classList.add("active");
  } else {
    divToggle.classList.remove("active");
  }
  // 카운터 처리
  counter.innerText = state.counter;
};

render();
// 스토어의 상태가 바뀔 때마다 render 함수가 호출되도록 구독한다.
store.subscribe(render);

// 액션 발생시키기 - dispatch
divToggle.onclick = () => {
  store.dispatch(toggleSwitch());
};
btnIncrease.onclick = () => {
  store.dispatch(increase(1));
};
btnDecrease.onclick = () => {
  store.dispatch(decrease());
};

# 리덕스 더 편하게 사용하기

액션 생성 함수, 리듀서를 작성할 때 redux-actions라는 라이브러리와 이전에 배웠던 immer 라이브러리를 활용하면 리덕스를 훨씬 편하게 사용할 수 있다.

## redux-actions

redux-actions를 사용하면 액션 생성 함수를 더 짧은 코드로 작성할 수 있다. 그리고 리듀서를 작성할 때도 switch/case 문이 아닌 handleActions라는 함수를 사용하여 각 액션마다 업데이트 함수를 설정하는 형식으로 작성해 줄 수 있다.  
우선 라이브러리를 설치한다.

```js
// console
$ yarn add redux-actions
```

### counter 모듈에 적용하기

counter 모듈에 작성된 액션 생성 함수를 createAction이란 함수를 사용하여 만들어 보자.

```js
// modules/counter.js
import { createAction } from 'redux-actions';

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

...
```

createAction을 사용하면 매번 객체를 직접 만들어 줄 필요 없이 더욱 간단하게 액션 생성 함수를 선언할 수 있다.  
이번에는 리듀서 함수도 더 간단하고 가독성 높게 작성해 보자. handleActions라는 함수를 사용한다.

```js
// modules/counter.js
import { createAction, handleActions } from 'redux-actions';

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

const initialState = {
  number: 0,
};

const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({ number: state.number + 1 }),
    [DECREASE]: (state, action) => ({ number: state.number - 1 }),
  },
  initialState,
);

export default counter;
```

handelActions 함수의 첫 번째 파라미터에는 각 액션에 대한 업데이트 함수를 넣어 주고, 두 번째 파라미터에는 초기 상태를 넣어 준다.

### todos 모듈에 적용하기

똑같은 작업을 todos 모듈에도 적용해 보자. 먼저 액션 생성 함수를 교체해 줄 텐데, 조금 다른 점이 있다. 바로 각 액션 생성 함수에서 파라미터를 필요로 한다는 점이다.  
createAction으로 액션을 만들면 액션에 필요한 추가 데이터는 payload라는 이름을 사용한다. 예를 들면 다음과 같다.

```js
const MY_ACTION = 'sample/MY_ACTION';
const myAction = createAction(MY_ACTION);
const action = myAction('hello world');
/*
    결과:
    {type: MY_ACTION, payload: 'hello world' }
*/
```

액션 생성 함수에서 받아 온 파라미터를 그대로 payload에 넣는 것이 아니라 변형을 주어서 넣고 싶다면, createAction의 두 번째 함수에 payload를 정의하는 함수를 따로 선언해서 넣어 주면 된다.

```js
const MY_ACTION = 'sample/MY_ACTION';
const myAction = createAction(MY_ACTION, (text) => `${text}!`);
const action = myAction('hello world');
/*
    결과:
    {type: MY_ACTION, payload: 'hello world' }
*/
```

그럼 이제 todos 모듈의 액션 생성 함수를 다음과 같이 새로 작생해 보자.

```js
// modules/todos.js
import { createAction } from 'redux-actions';

const CHNAGE_INPUT = 'todos/CHANGE_INPUT'; // 인풋 값을 변경함
const INSERT = 'todos/INSERT'; // 새로운 todo를 등록함
const TOGGLE = 'todos/TOGGLE'; // todo를 체크/체크 해제함
const REMOVE = 'todos/REMOVE'; // todo를 제거함

export const changeInput = createAction(CHANGE_INPUT, (input) => input);

let id = 3; // insert가 호출될 때마다 1씩 더해진다.
export const insert = createAction(INSERT, (text) => ({
  id: id++,
  text,
  done: false,
}));

export const toggle = createAction(TOGGLE, (id) => id);
export const remove = createAction(REMOVE, (id) => id);
...
```

insert의 경우 todo 객체를 액션 객체 안에 넣어 주어야 하기 때문에 두 번째 파라미터에 text를 넣으면 todo 객체가 반환되는 함수를 넣어 주었다.  
나머지 함수에는 text => text 혹은 id => id와 같은 형태로 파라미터를 그대로 반환하는 함수를 넣었다. 이 작업이 필수는 아니다. 생략해도 똑같이 작동하지만, 여기서 이 함수를 넣어 줌으로써 코드를 보았을 때 이 액션 생성 함수의 파라미터로 어떤 값이 필요한지 쉽게 파악할 수 있다.  
액션 생성 함수를 다 작성했으면 handleActions로 리듀서를 재작성해 보자. createAction으로 만든 액션 생성 함수는 파라미터로 받아 온 값을 객체 안에 넣을 때 원하는 이름으로 넣는 것이 아니라 action.id, action.todo와 같이 action.payload라는 이름을 공통적으로 넣어 주게 된다. 그렇기 때문에, 기존의 업데이트 로직에서도 모두 action.payload 값을 조회하여 업데이트하도록 구현해 주어야 한다.  
액션 생성 함수는 액션에 필요한 추가 데이터를 모두 payload라는 이름으로 사용하기 때문에 action.id, action.todo를 조회하는 대신, 모두 공통적으로 action.payload 값을 조회하도록 리듀서를 구현해 주어야 한다.

```js
// modules/todos.js
import { createAction, handleActions } from 'redux-actions';

...

const todos = handleActions(
    {
        [CHANGE_INPUT]: (state, action) => ({ ...state, input: action.payload }),
        [INSERT]: (state, action) => ({
            ...state,
            todos: state.todos.concat(action.payload),
        }),
        [TOGGLE]: (state, action) => ({
            ...state,
            todos: state.todos.map(todo =>
            todo.id === action.payload ? { ...todo, done: !todo.done } : todo,
            ),
        }),
        [REMOVE]: (state, action) => ({
            ...state,
            todos: state.todos.filter(todo => todo.id !== action.payload),
        }),
    },
    initialState,
);

export default todos;
```

모둔 추가 데이터 값을 action.payload로 사용하기 때문에 나중에 리듀서 코드를 다시 볼 때 헷갈릴 수 있다. 객체 비구조화 할당 문법으로 action 값의 payload 이름을 새로 설정해 주면 action.payload가 정확히 어떤 값을 의미하는지 더 쉽게 파악할 수 있다.

```js
// modules/toods.js
...
const todos = handleActions(
    {
        [CHANGE_INPUT]: (state, {payload: input}) => ({ ...state, input }),
        [INSERT]: (state, { payload: todo}) => ({
            ...state,
            todos: state.todos.concat(todo),
        }),
        [TOGGLE]: (state, {payload: id}) => ({
            ...state,
            todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo,
            ),
        }),
        [REMOVE]: (state, {payload: id}) => ({
            ...state,
            todos: state.todos.filter(todo => todo.id !== id),
        }),
    },
    initialState,
);

export default todos;
```

## immer

리듀서에서 상태를 업데이트할 때는 불변성을 지켜야 하기 때문에 앞에서는 spread 연산자(...)와 배열의 내장 함수를 활용했다. 그러나 모듈의 상태가 복잡해질수록 불변성을 지키기가 까다로워진다.  
따라서 모듈의 상태를 설계할 때는 객체의 깊이가 너무 깊어지지 않도록 주의해야 한다. 깊은 객체와 깊지 않은 객체를 비교해 보자.

```js
const deepObject = {
  modal: {
    open: false,
    conente: {
      title: '알림',
      body: '성공적으로 처리했습니다.',
      buttons: {
        donfirm: '확인',
        cancel: '취소',
      },
    },
  },
  warning: false,
  settings: {
    theme: 'dark',
    zoomLevel: 5,
  },
};

const shallowObject = {
  modal: {
    open: false,
    title: '알림',
    body: '성공적으로 처리되었습니다.',
    confirm: '확인',
    cancel: '취소',
  },
  warning: fasel,
  theme: 'dark',
  zoomLevel: 5,
};
```

객체의 깊이가 깊지 않을수록 추후 불변성을 지켜 가면서 값을 업데이트할 때 수월하다. 하지만 상황에 따라 상태 값들을 하나의 객체 안에 묶어서 넣는 것이 코드의 가독성을 높이는 데 유리하며, 나중에 컴포넌트에 리덕스를 연동할 때도 더욱 편하다.  
객체의 구조가 복잡해지거나 객체로 이루어진 배열을 다룰 경우, immer를 사용하면 훨씬 편리하게 상태를 관리할 수 있다.  
우선 immer를 현재 프로젝트에 설치하자.

```js
// console
$ yarn add immer
```

counter 모듈처럼 간단한 리듀서에 immer를 사용하면 오히려 코드가 더 길어지기 때문에 todos 모듈에 적용해 보겠다.

```js
// moduels/todos.js
import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

...

const todos = handleActions(
    {
        [CHANGE_INPUT]: (state, { payload: input }) =>
        produce(state, draft => {
            draft.input = input;
        }),
        [INSERT]: (state, {payload: todo}) =>
        produce(state, draft => {
            draft.todos.push(todo);
        }),
        {TOGGLE}: (state, {payload: id}) =>
        produce(state, draft => {
            const todo = draft.todos.find(todo => todo.id === id);
            todo.done = !todo.done;
        }),
        [REMOVE]: (state, {payload: id}) =>
        produce(state, draft => {
            const index = draft.todos.findIndex(todo => todo.id === id);
            draft.todos.splice(index, 1);
        }),
    },
    initialState,
);

export default todos;
```

immer를 사용한다고 해서 모든 업데이트 함수에 immer를 적용할 필요는 없다. 일반 자바스크립트로 처리하는 것이 더 편할 때는 immer를 적용하지 않아도 된다. 예를 들어 위 코드에서 TOGGLE을 제외한 업데이트 함수들은 immer를 쓰지 않는 코드가 오히려 더 짧기 때문에 이전 형태를 유지하는 것도 무방하다.

## Hooks를 사용하여 컨테이너 컴포넌트 만들기

리덕스 스토어와 연동된 컨테이너 컴포넌트를 만들 때 connect 함수를 사용하는 대신 react-redux에서 제공하는 Hooks를 사용할 수도 있다.

### useSelector로 상태 조회하기

useSelector Hook을 사용하면 connect 함수를 사용하지 않고도 리덕스의 상태를 조회할 수 있다. useSelector의 사용법은 다음과 같다.

```js
const 결과 = useSelector(상태 선택 함수);
```

여기서 상태 선택 함수는 mapStateToProps와 형태가 똑같다. 이제 CounterContainer에서 connect 함수 대신 useSelector를 사용하여 counter.number 값을 조회함으로써 Counter에게 props를 넘겨 준다.

```js
// containers/CounterContainer.js
import React from 'react';
import { useSelector } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease } from '../modules/counter';

const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  return <Counter number={number} />;
};

export default CounterContainer;
```

### useDispatch를 사용하여 액션 디스패치하기

이번에는 useDispatch라는 Hook에 대해 알아보자. 이 Hook은 컴포넌트 내부에서 스토어의 내장 함수 dispatch를 사용할 수 있게 해 준다. 컨테이너 컴포넌트에서 액션을 디스패치해야 한다면 이 Hook을 사용하면 된다. 사용법은 다음과 같다.

```js
const dispatch = useDispatch();
dispatch({ type: 'SAMPLE_ACTION' });
```

이제 CounterContainer에서도 이 Hook을 사용하여 INCREASE와 DECREASE 액션을 발생시켜보자.

```js
// containers/CounterContainer.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease } from '../modules/counter';

const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  const dispatch = useDispatch();
  return (
    <Counter
      number={number}
      onIncrease={() => dispatch(increase())}
      onDecrease={() => dispatch(decrease())}
    />
  );
};

export default CounterContainer;
```

지금은 숫자가 바뀌어서 컴포넌트가 리렌더링될 때마다 onIncrease 함수와 onDecrease 함수가 새롭게 만들어지고 있다.  
만약 컴포넌트 성능을 최적화해야 하는 상황이 온다면 useCallback으로 액션을 디스패치하는 함수를 감싸 주는 것이 좋다.  
다음과 같이 코드를 수정해보자.

```js
// containers/CounterContainer.js
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease } from '../modules/counter';

const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  const dispatch = useDispatch();
  const onIncrease = useCallback(() => dispatch(increase()), [dispatch]);
  const onDecrease = useCallback(() => dispatch(decrease()), [dispatch]);
  return (
    <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />
  );
};

export default CounterContainer;
```

useDispatch를 사용할 때는 이렇게 useCallback과 함께 사용하는 습관을 들일 것을 권한다.

### useStore를 사용하여 리덕스 스토어 사용하기

useStore Hooks를 사용하면 컴포넌트 내부에서 리덕스 스토어 객체를 직접 사용할 수 있다. 사용법은 다음과 같다.

```js
const store = useStore();
store.dispatch({ type: 'SAMPLE_ACTION' });
store.getState();
```

useStore는 컴포넌트에서 정말 어쩌다가 스토어에 직접 접근해야 하는 상황에만 사용해야 한다. 이를 사용해야 하는 상황은 흔치 않을 것이다.

### TodosContainer를 Hooks로 전환하기

이제 TodosContainer를 connect 함수 대신에 useSelector와 useDispatch Hooks를 사용하는 형태로 전환해 보자.

```js
// containers/TodosContainer.js
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeInput, insert, toggle, remove } from '../modules/todos';
import Todos from '../components/Todos';

const TodosContainer = () => {
  const { input, todos } = useSelector(({ todos }) => ({
    input: todos.input,
    todos: todos.todos,
  }));
  const dispatch = useDispatch();
  const onChangeInput = useCallback(
    (input) => dispatch(insert(text)),
    [dispatch],
  );
  const onToggle = useCallback((id) => dispatch(toggle(id)), [dispatch]);
  const onRemove = useCallback((id) => dispatch(remove(id)), [dispatch]);

  return (
    <Todos
      input={input}
      todos={todos}
      onChangeInput={onChangeInput}
      onInsert={onInsert}
      onToggle={onToggle}
      onRemove={onRemove}
    />
  );
};

export default TodosContainer;
```

이번에는 useSelector를 사용할 때 비구조화 할당 문법을 활용했다.  
또한, useDispatch를 사용할 때 각 액션을 디스패치하는 함수를 만들었다. 위 코드의 경우 액션의 종류가 많은데 어떤 값이 액션 생성 함수의 파라미터로 사용되어야 하는지 일일이 명시해 주어야 하므로 조금 번거롭다. 이 부분은 우선 컴포넌트가 잘 작동하는 것을 확인하고 나서 개선해 보자. 코드를 저장하고 TodosContainer가 잘 작동하는지 확인해 보자.

### useActions 유틸 Hook을 만들어서 사용하기

useActions는 원래 react-redux에 내장된 상태로 릴리즈될 계획이었으나 리덕스 개발 팀에서 꼭 필요하지 않다고 판단하여 제외된 Hook이다. 그 대신 공식 문서에서 그대로 복사하여 사용할 수 있도록 제공하고 있다.

- 참고 링크: https://react-redux.js.org/next/api/hooks#recipe-useactions

이 Hook을 사용하면, 여러 개의 액션을 사용해야 하는 경우 코드를 훨씬 깔끔하게 정리하여 작성할 수 있다.  
src 디렉터리에 lib 디렉터리를 만들고, 그 안에 useActions.js 파일을 다음과 같이 작성해 보자.

```js
// lib/useActions.js
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

export default function useActions(actions, deps) {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map((a) => bindActionCreators(a, dispatch));
      }
      return bindActionCreators(action, dispatch);
    },
    deps ? [dispatch, ...deps] : deps,
  );
}
```

방금 작성한 useActions Hook은 액션 생성 함수를 액션을 디스패치하는 함수로 변환해 준다.  
액션 생성 함수를 사용하여 액션 객체를 만들고, 이를 스토어에 디스패치하는 작업을 해 주는 함수를 자동으로 만들어 주는 것이다.  
useActions는 두 가지 파라미터가 필요하다. 첫 번째 파라미터는 액션 생성 함수로 이루어진 배열이다. 두 번째 파라미터는 deps 배열이며, 이 배열 안에 들어 있는 원소가 바뀌면 액션을 디스패치하는 함수를 새로 만들게 된다.  
한 번 TodoContainer에서 useActions를 불러와 사용해 보자.

```js
// containers/TodoContainer.js
import React from 'react';
import { useSelector } from 'react-redux';
import { changeInput, insert, toggle, remove } from '../modules/todos';
import Todos from '../components/Todos';
import useActions from '../lib/useActions';

const TodosContainer = () => {
  const { input, todos } = useSelector(({ todos }) => ({
    input: todos.input,
    todos: todos.todos,
  }));

  const [onChangeInput, onInsert, onToggle, onRemove] = useActions(
    [changeInput, insert, toggle, remove],
    [],
  );
  return (
    <Todos
      input={input}
      todos={todos}
      onChangeInput={onChangeInput}
      onInsert={onInsert}
      onToggle={onToggle}
      onRemove={onRemove}
    />
  );
};

export default TodosContainer;
```

### connect 함수와의 주요 차이점

앞으로 컨테이너 컴포넌트를 만들 때 connect 함수를 사용해도 좋고, useSelector와 useDispatch를 사용해도 좋다. 리덕스 관련 Hook이 있다고 해서 기존 connect 함수가 사라지는 것은 아니므로, 더 편한 것을 사용하면 된다.  
하지만 Hooks를 사용하여 컨테이너 컴포넌트를 만들 때 잘 알아 두어야 할 차이점이 있다.  
connect 함수를 사용하여 컨테이너 컴포넌트를 만들었을 경우, 해당 컨테이너 컴포넌트의 부모 컴포넌트가 리렌더링될 때 해당 컨테이너 컴포넌트의 props가 바뀌지 않았다면 리렌더링이 자동으로 방지되어 성능이 최적화된다.  
반면 useSelector를 사용하여 리덕스 상태를 조회했을 때는 이 최적화 작업이 자동으로 이루어지지 않으므로, 성능 최적화를 위해서는 React.memo를 컨테이너 컴포넌트에 사용해 주어야 한다. 다음과 같이 말이다.

```js
// containers/TodosContainer.js
import React from 'react';
import { useSelector } from 'react-redux';
import { changeInput, insert, toggle, remove } from '../modules/todos';
import Todos from '../components/Todos';
import useActions from '../lib/useActions';

const TodosContainer = () => {
    ...
};

export default React.memo(TodosContainer);
```

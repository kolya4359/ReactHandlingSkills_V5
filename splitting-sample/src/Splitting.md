# 코드 스플리팅

파일을 분리하는 작업을 스플리팅이라고 한다.

## 코드 비동기 로딩 하는 법

```js
import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const onClick = () => {
    import("./notify").then((result) => result.default());
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
      </header>
    </div>
  );
}

export default App;
```

상단에 import로 페이지를 불러오면 처음 렌더링할 때 같이 불러와진다.
import() 함수를 사용하면 실제 함수가 필요한 지점에 파일을 불러와서 함수를 사용할 수 있다.
이렇게 컴포넌트를 처음에 불러오지 않고 필요한 시점에 불러와서 사용하는 것을 코드 비동기 로딩이라고 한다.

## state를 사용한 코드 스플리팅

```js
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    SplitMe: null,
  };
  handleClick = async () => {
    const loadedModule = await import("./SplitMe");
    this.setState({
      SplitMe: loadedModule.default,
    });
  };
  render() {
    const { SplitMe } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p onClick={this.handleClick}>Hello React!</p>
          {SplitMe && <SplitMe />}
        </header>
      </div>
    );
  }
}

export default App;
```

state를 사용하여 컴포넌트 스플리팅을 하는 것이 어렵지는 않지만, 매번 state를 선언해 주어야 한다는 점이 불편하다.

## React.lazy와 Suspense 사용하기

### React.lazy 사용법

```js
const SplitMe = React.lazy(() => import("./SplitMe"));
```

컴포넌트를 렌더링하는 시점에서 비동기적으로 로딩할 수 있게 해 주는 유틸 함수이다.

### Suspense 사용법

```js
import React, { Suspense } from 'react';

...
<Suspense fallback={<div>loading...</div>}>
    <SplitMe />
</Suspense>
```

React 내장 컴포넌트인 Suspense의 fallback props를 통해 로딩 중에 보여 줄 JSX를 지정할 수 있다.

```js
import React, { useState, Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
const SplitMe = React.lazy(() => import("./SplitMe"));

const App = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App=logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      </header>
    </div>
  );
};

export default App;
```

### Loadable Components를 통한 코드 스플리팅

Loadable Components는 코드 스플리팅을 편하게 하도록 도와주는 서드파티 라이브러리이다. 이 라이브러리의 이점은 서버 사이드 렌더링을 지원한다는 것이다.  
사용법은 React.lazy와 비슷하다. 단, Suspense를 사용할 필요가 없다.

```js
import React, { useState, Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
import loadable from "@loadable/component";
const SplitMe = loadable(() => import("./SplitMe"));

const App = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App=logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
        {visible && <SplitMe />}
      </header>
    </div>
  );
};

export default App;
```

로딩 중에 다른 UI를 보여 주고 싶다면 loadable을 사용하는 부분을 다음과 같이 수정한다.

```js
const SplitMe = loadable(() => import("./SplitMe"), {
  fallback: <div>loading...</div>,
});
```

이번에는 컴포넌트를 미리 불러오는(preload) 방법을 알아보자. 코드를 다음과 같이 수정해보자.

```js
import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import loadable from "@loadable/component";
const SplitMe = loadable(() => import("./SplitMe"), {
  fallback: <div>loading...</div>,
});

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  const onMouseOver = () => {
    SplitMe.preload();
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick} onMouseOver={onMouseOver}>
          Hello React!
        </p>
        {visible && <SplitMe />}
      </header>
    </div>
  );
}

export default App;
```

이렇게 수정하면 마우스 커서를 Hello React! 위에 올리기만 해도 로딩이 시작된다. 그리고 클릭했을 때 렌더링된다. 이런 기능을 구현하면 나중에 사용자에게 더 좋은 경험을 제공할 수 있다.

import React, { useEffect, useCallback } from 'react';
import Editor from '../../components/write/Editor';
import { useSelector, useDispatch } from 'react-redux';
import { changeField, initialize } from '../../modules/write';

const EditorContainer = () => {
  const dispatch = useDispatch();
  const { title, body } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
  }));
  const onChangeField = useCallback(
    (payload) => dispatch(changeField(payload)),
    [dispatch],
  );
  // 언마운트될 때 초기화
  // 이 작업을 하지 않으면 포스트 작성 후 다시 글쓰기 페이지에 들어왔을 때 이전에 작성한 내용이 남아 있게 된다.
  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);
  return <Editor onChangeField={onChangeField} title={title} body={body} />;
};

export default EditorContainer;

/*
title 값과 body 값을 리덕스 스토어에서 불러와 Editor 컴포넌트에 전달해 주었다.
참고로 Quill 에디터는 일반 input이나 textarea가 아니기 때문에 onChange와 value 값을 사용하여 상태를 관리할 수 없다.
따라서 에디터에서 값이 바뀔 때 리덕스 스토어에 값을 넣는 작업을 우선 만들고, 리덕스 스토어의 값이 바뀔 때 에디터 값이 바뀌게 하는 작업은
추후 만들어 준다.
*/

// 하단에 태그를 추가하는 컴포넌트

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

const TagBoxBlock = styled.div`
  width: 100%;
  border-top: 1px solid ${palette.gray[2]};
  padding-top: 2rem;

  h4 {
    color: ${palette.gray[8]};
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
`;

const TagForm = styled.form`
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  width: 256px;
  border: 1px solid ${palette.gray[9]}; /* 스타일 초기화 */
  input,
  button {
    outline: none;
    border: none;
    font-size: 1rem;
  }

  input {
    padding: 0.5rem;
    flex: 1;
    min-width: 9;
  }
  button {
    cursor: pointer;
    padding-right: 1rem;
    padding-left: 1rem;
    border: none;
    background: ${palette.gray[8]};
    color: white;
    font-weight: bold;
    &:hover {
      background: ${palette.gray[6]};
    }
  }
`;

const Tag = styled.div`
  margin-right: 0.5rem;
  color: ${palette.gray[6]};
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

const TagListBlock = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

// React.memo를 사용하여 tag 값이 바뀔 때만 리렌더링되도록 처리
const TagItem = React.memo(({ tag, onRemove }) => (
  <Tag onClick={() => onRemove(tag)}>#{tag}</Tag>
));

// React.memo를 사용하여 tags 값이 바뀔 때만 리렌더링되도록 처리
const TagList = React.memo(({ tags, onRemove }) => (
  <TagListBlock>
    {tags.map((tag) => (
      <TagItem key={tag} tag={tag} onRemove={onRemove} />
    ))}
  </TagListBlock>
));

const TagBox = ({ tags, onChangeTags }) => {
  const [input, setInput] = useState('');
  const [localTags, setLocalTags] = useState([]);

  const insertTag = useCallback(
    (tag) => {
      if (!tag) return; // 공백이라면 추가하지 않음
      if (localTags.includes(tag)) return; // 이미 존재한다면 추가하지 않음
      const nextTags = [...localTags, tag];
      setLocalTags(nextTags);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags],
  );

  const onRemove = useCallback(
    (tag) => {
      const nextTags = localTags.filter((t) => t !== tag);
      setLocalTags(nextTags);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags],
  );

  const onChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      insertTag(input.trim()); // 앞뒤 공백을 없앤 후 등록
      setInput(''); // input 초기화
    },
    [input, insertTag],
  );

  // tags 값이 바뀔 때
  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  return (
    <TagBoxBlock>
      <h4>태그</h4>
      <TagForm onSubmit={onSubmit}>
        <input
          placeholder="태그를 입력하세요"
          value={input}
          onChange={onChange}
        />
        <button type="submit">추가</button>
      </TagForm>
      <TagList tags={localTags} onRemove={onRemove} />
    </TagBoxBlock>
  );
};

export default TagBox;

/*
TagItem, TagList라는 두 컴포넌트로 분리시킨 이유는 렌더링을 최적화하기 위해서이다.
현재 TagBox는 두 가지 상황에서 렌더링을 한다. 첫번째는 input이 바뀔 때이고, 두 번째는 태그 목록이 바뀔 때이다.
만약 컴포넌트를 분리하지 않고 한 컴포넌트에서 전부 직접 렌더링한다면, input 값이 바뀔 때 태그 목록도 리렌더링될 것이다.
태그 목록이 리렌더링되면 또 태그 하나하나가 모두 리렌더링될 것이다.
컴포넌트를 분리하기만 하면 최적화가 되는 것은 아니다. 추가로 React.memo를 사용하여 컴포넌트들을 감싸 주면,
해당 컴포넌트가 받아 오는 props가 실제로 바뀌었을 때만 리렌더링해 준다.
*/

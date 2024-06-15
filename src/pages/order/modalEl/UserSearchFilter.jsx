//react
import { useEffect, useState, useRef } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
//components
import styled from 'styled-components';
import {
  Flexbox,
  Button,
  Input,
  Span,
  InputWrapper,
} from '@/components/common';
//utility
import customAxios from '@/utils/axios/customAxios';

const SearchFilterWrapper = styled(InputWrapper)`
  position: relative;
  z-index: 5;
  Input {
    text-indent: 5px;
  }
`;

const StyledList = styled.ul`
  display: ${p => (p.$showList ? 'block' : 'none')};
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  min-height: 100px;
  max-height: 100px;
  overflow-y: scroll;
  position: absolute;
  transform: translate(0%, 0%);
  top: 2.75rem;
  width: calc(100%);
  list-style-type: none;
  padding: 0;
  li {
    color: #333;
    font-size: 0.9rem;
    padding: 0 5px;
  }
  button {
    width: 100%;
    padding: 5px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    &:focus,
    &:hover {
      background-color: #e5f3fc;
    }
  }
`;

export const UserSearchFilter = ({
  promptMessage,
  initPromptMessage,
  submitClicked,
  setUser,
  defaultValue,
}) => {
  //Redux
  const orderState = useSelector(state => state.order);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //ref
  const listRef = useRef(null);
  //表單管理
  const [query, setQuery] = useState('');
  const [showList, setShowList] = useState(false);
  const [userInput, setUserInput] = useState(defaultValue || '');
  const [filteredUserData, setFilteredUserData] = useState([]);

  // 檢查是否有符合的筆數
  const keys = ['username', 'lastName', 'firstName'];

  //監聽顯示表單以及方向鍵移動選擇項目
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        // 獲取當前的焦點項目
        const focusedItem = document.activeElement;
        if (!focusedItem) return;
        // 獲取列表中的所有按鈕元素
        const buttons = listRef.current.querySelectorAll('button');
        // 找到當前焦點項目在列表中的索引
        const index = Array.from(buttons).indexOf(focusedItem);
        // 計算下一個焦點項目的索引
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = (index + 1) % buttons.length;
        } else {
          nextIndex = index > 0 ? index - 1 : buttons.length - 1;
        }
        // 將焦點設置到下一個元素
        buttons[nextIndex].focus();
      }
    };

    const handleClickOutside = event => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setShowList(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showList]);

  useEffect(() => {
    setShowList(query.length > 0);
    const fetchData = async () => {
      const res = await customAxios.get(
        `${import.meta.env.VITE_APIURL}/user/search?query=${query}`,
        { headers: { Authorization: `Bearer ${TOKEN}` } },
      );
      setFilteredUserData(res.data);
    };
    if (query) {
      fetchData();
    }
  }, [query]);

  return (
    <SearchFilterWrapper
      $height={'2.5rem'}
      $spanOffset={'-1.2rem'}
      $border={
        (promptMessage?.username || orderState.error?.errors.username) &&
        '2px solid #d15252'
      }
    >
      <Input
        name='username'
        type='text'
        value={userInput}
        autoComplete='off'
        onChange={e => {
          initPromptMessage();
          setUserInput(e.target.value.toLowerCase());
          setQuery(e.target.value.toLowerCase());
          setUser('');
        }}
        placeholder='請使用用戶名稱搜尋...'
        disabled={submitClicked && !orderState.error}
      />
      <StyledList ref={listRef} $showList={showList}>
        {filteredUserData.length === 0 ? (
          <li>查無與query相符的結果</li>
        ) : (
          filteredUserData.map(item => (
            <li key={item._id}>
              <button
                type='button'
                onClick={() => {
                  setUser(item);
                  setUserInput(
                    `${item.username} ${item.lastName}${item.firstName}`,
                  );
                  setShowList(false);
                }}
              >
                {`${item.username} ${item.lastName}${item.firstName}`}
              </button>
            </li>
          ))
        )}
      </StyledList>
      <Span $color={'#d15252'}>{promptMessage?.username}</Span>
      <Span $color={'#d15252'}>{orderState.error?.errors.username}</Span>
    </SearchFilterWrapper>
  );
};

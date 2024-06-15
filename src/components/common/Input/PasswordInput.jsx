import { useState } from 'react';
import styled from 'styled-components';
import { Input, InputWrapper } from './Input';

export const PasswordInputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid green; */
  height: ${p => (p.$height ? p.$height : '2rem')};
  border: ${p => (p.$border ? p.$border : '')};
`;

// 繼承了Input元件的樣式，並在此基礎上添加了指定的樣式。
const StyledPasswordInput = styled(Input).attrs(props => {
  return {
    type: props.$showPassword ? 'text' : 'password',
    placeholder: props.placeholder,
  };
})`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  height: 100%;
`;

export const ToggleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  min-width: 60px;
  border: 1px solid #ccc;
  border-left: 0;
  font-size: 0.9em;
  border-radius: 4px;
  background: #fff;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  color: black;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  height: 100%;
  outline: none;
`;

export const PasswordInput = props => {
  const [showPassword, setShowPassword] = useState(false);
  // console.log(props);
  return (
    <>
      <StyledPasswordInput {...props} $showPassword={showPassword} />
      <ToggleButton
        type='button'
        tabIndex='-1'
        onClick={e => {
          e.preventDefault();
          setShowPassword(p => !p);
        }}
      >
        {showPassword ? '隱藏' : '顯示'}
      </ToggleButton>
    </>
  );
};

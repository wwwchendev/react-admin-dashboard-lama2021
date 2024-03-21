import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '@/components/common';

const PasswordInputWrapper = styled.div`
  width:100%;
  display: flex;
`;

// 繼承了Input元件的樣式，並在此基礎上添加了指定的樣式。
const PasswordInputStyled = styled(Input).attrs((props) => {
  // console.log(props);
  return {
    type: props.$showPassword ? 'text' : 'password',
    placeholder: props.placeholder,
  }
})`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

const ToggleButton = styled.div`
  height: 40px;
  min-width: 60px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 0.9em;
  display: flex;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  color: black;
`;

export const PasswordInput = props => {
  const [showPassword, setShowPassword] = useState(false);
  // console.log(props);
  return (
    <>
      <PasswordInputWrapper>
        <PasswordInputStyled {...props} $showPassword={showPassword} />
        <ToggleButton
          onClick={() => {
            setShowPassword(p => !p);
          }}
        >
          {showPassword ? '隱藏' : '顯示'}
        </ToggleButton>
      </PasswordInputWrapper>
    </>
  );
};
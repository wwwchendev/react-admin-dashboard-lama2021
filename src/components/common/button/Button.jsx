import styled, { keyframes, css } from 'styled-components';
const buttonHoverAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.2);
  }
  40% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

export const Button = styled.button`
  border: ${p => (p.$border ? p.$border : 'none')};
  border-radius: ${p => (p.$borderRadius ? p.$borderRadius : '5px')};
  padding: ${p => (p.$padding ? p.$padding : '5px 10px')};
  background-color: ${p => (p.$bg ? p.$bg : '#999')};
  color: ${p => (p.$color ? p.$color : '#fff')};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${p => (p.$width ? p.$width : ' 80px')};
  /* border: 1px solid red; */
  &:disabled {
    background-color: ${p => (p.$bg ? p.$bg : '#cccccc')};
    color: #8d8d8d;
    cursor: not-allowed;
  }
  &:active {
    transform: scale(0.98);
  }
  &[type='submit'] {
    background-color: ${p => (p.$bg ? p.$bg : '#5cc55f')};
    &:disabled {
      background-color: #cccccc;
      color: #8d8d8d;
      cursor: not-allowed;
    }
  }
  //動畫
  ${p =>
    p.$animation &&
    css`
      &:hover {
        animation: ${buttonHoverAnimation} 1s ease-in-out;
      }
    `}
`;
export default Button;

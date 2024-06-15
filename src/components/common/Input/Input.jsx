import styled from 'styled-components';

export const InputWrapper = styled.div`
  position: relative;
  flex: ${p => (p.$flex ? p.$flex : '')};
  margin: ${p => (p.$margin ? p.$margin : '')};
  /* border: 1px solid red; */
  height: ${p => (p.$height ? p.$height : '2rem')};
  width: ${p => (p.$width ? p.$width : '100%')};
  input {
    border: ${p => (p.$border ? p.$border : '')};
  }
  button {
    border: ${p => (p.$border ? p.$border : '')};
    border-left: none;
  }
  span {
    position: absolute;
    left: 0;
    bottom: ${p => (p.$spanOffset ? p.$spanOffset : '-1.5rem')};
    /* margin:20px 0 0 0; */
  }
`;

export const Input = styled.input`
  color: ${p => (p.$color ? p.$color : '')};
  padding: ${p => (p.$padding ? p.$padding : '2.5px 5px')};
  border: ${p => (p.$border ? p.$border : '1px solid #ccc')};
  border-radius: 4px;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  /* border: 1px solid red;  */
  &::placeholder {
    font-size: 0.9em;
  }
  &[type='date'] {
    /* width: 100%; */
  }
`;

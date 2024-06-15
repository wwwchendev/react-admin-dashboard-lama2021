import styled from 'styled-components';

export const Textarea = styled.textarea`
  /* border: 1px solid red;  */
  padding: ${p => (p.$padding ? p.$padding : '2.5px 5px')};
  border: ${p => (p.$border ? p.$border : '1px solid #ccc')};
  background-color: ${p => (p.$bg ? p.$bg : '')};
  border-radius: 4px;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  &::placeholder {
    font-size: 0.9em;
  }
  &[type='date'] {
    /* width: 100%; */
  }
`;

import styled from 'styled-components';

export const Select = styled.select`
  display: flex;
  padding: ${p => (p.$padding ? p.$padding : '2.5px 5px')};
  border: ${p => (p.$border ? p.$border : '1px solid #ccc')};
  border-radius: 4px;
  font-size: 15px;
  width: ${p => (p.$width ? p.$width : '100%')};
  box-sizing: border-box;
  height: 100%;
  &::placeholder {
    font-size: 0.8em;
  }
  option {
    font-size: 0.8em;
  }
`;

export const SelectWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: ${p => (p.$flex ? p.$flex : '')};
  height: ${p => (p.$height ? p.$height : '2rem')};
  input {
    border: ${p => (p.$border ? p.$border : '')};
  }
  button {
    border: ${p => (p.$border ? p.$border : '')};
    border-left: none;
  }

  span {
    position: absolute;
    bottom: 0;
    bottom: ${p => (p.$spanOffset ? p.$spanOffset : '-1.5rem')};
    /* margin:20px 0 0 0; */
  }
`;

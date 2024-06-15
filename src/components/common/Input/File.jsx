import styled from 'styled-components';
import { Span } from '../Span/Span';
export const ProgressWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  ${Span} {
    font-size: 12px;
    color: #3488f5;
  }
`;
export const FileWrapper = styled.div`
  position: relative;
  flex: ${p => (p.$flex ? '' : '')};
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  border: ${p => (p.$border ? p.$border : '2px dotted #ccc')};
  border-radius: 4px;
  min-height: ${p => (p.$height ? p.$height : '6.5rem')};
  height: ${p => (p.$height ? p.$height : '6.5rem')};
  min-width: ${p => (p.$width ? p.$width : '6.5rem')};
  width: ${p => (p.$width ? p.$width : '6.5rem')};
  color: #3488f5;
  input {
    border: ${p => (p.$border ? p.$border : '')};
  }
  button {
    border: ${p => (p.$border ? p.$border : '')};
    border-left: none;
  }
  cursor: ${p => (p.$cursor ? p.$cursor : '')};

  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  span {
    user-select: none;
  }
  &:hover {
    border: 2px dotted #3488f5;
    background-color: #f8fcff;
  }
  ${ProgressWrapper} {
    /*height: 1rem; */
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }
`;

export const File = styled.input.attrs({ type: 'file' })`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`;

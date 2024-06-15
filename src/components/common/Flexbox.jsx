import styled from 'styled-components';
export const Flexbox = styled.div`
  /* border: 1px solid red; */
  border: ${p => (p.$border ? '1px solid purple' : '')};
  display: flex;
  flex-direction: ${p => (p.$direction ? p.$direction : '')};
  align-items: ${p => (p.$alignItems ? p.$alignItems : 'center')};
  justify-content: ${p => (p.$justifyContent ? p.$justifyContent : 'center')};
  gap: ${p => (p.$gap ? p.$gap : '')};
  width: ${p => (p.$width ? p.$width : '100%')};
  margin: ${p => (p.$margin ? p.$margin : '')};
  padding: ${p => (p.$padding ? p.$padding : '')};
  flex: ${p => (p.$flex ? p.$flex : '')};
  height: ${p => (p.$height ? p.$height : '')};
`;

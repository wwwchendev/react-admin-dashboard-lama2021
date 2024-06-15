import styled from 'styled-components';
import { Button } from '.';
export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${p => (p.$margin ? p.$margin : '0 0 1rem 0')};
  gap: ${p => (p.$gap ? p.$gap : '')};
  h1 {
    font-size: 1.5rem;
    width: ${p => (p.$width ? p.$width : '100%')};
  }
  ${Button} {
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    justify-content: center;
  }
`;

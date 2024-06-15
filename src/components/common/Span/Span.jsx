import styled from 'styled-components';

export const Span = styled.span`
  color: ${p => (p.$color ? p.$color : '#949494')};
  cursor: auto;
  font-size: 0.8rem;
`;

import styled from 'styled-components';
export const Text = styled.p`
  color: ${p => (p.$color ? p.$color : '')};
`;

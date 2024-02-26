import styled from 'styled-components';
import { tablet } from '@/responsive';

const Content = styled.main`
  margin-top: 40px;
`;

export const PageLayout = ({ children }) => {
  return (
    <>
      <Content>{children}</Content>
    </>
  );
};

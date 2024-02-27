import styled from 'styled-components';
import { tablet } from '@/responsive';

const Content = styled.main`
  margin-top: 10px;
  padding: 10px 20px;
`;

export const PageLayout = ({ children }) => {
  return (
    <>
      <Content>{children}</Content>
    </>
  );
};

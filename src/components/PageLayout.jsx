import styled from 'styled-components';
import { tablet } from '@/responsive';

const Content = styled.main`
  margin-top: 20px;
  padding: 10px 20px;
  width: 100%;
`;

export const PageLayout = ({ children }) => {
  return (
    <>
      <Content>{children}</Content>
    </>
  );
};

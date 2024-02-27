import styled from 'styled-components';
import { tablet } from '@/responsive';

const Content = styled.main`
  margin-top: 20px;
  padding: 10px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PageLayout = ({ children }) => {
  return (
    <>
      <Content>{children}</Content>
    </>
  );
};

import styled from 'styled-components';
import { mobile } from '@/utils/responsive';

const baseUrl =
  import.meta.env.VITE_BASENAME === '/' ? '' : import.meta.env.VITE_BASENAME;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #eee;
  padding: 20px;
`;

export const Footer = () => {
  return <Container>頁尾</Container>;
};

import styled from 'styled-components';
import { tablet } from '@/utils/responsive';

export const Icon = styled.span`
  font-size: 16px !important;
  display: flex;
  justify-content: center;
  ${tablet({ margin: 0 })};
`;

/*------------------------------------*\
斷點 (Breakpoints)
$breakpoint-xxl: 1400px;
$breakpoint-xl: 1200px; // 大桌機 1200px以上
$breakpoint-lg: 992px; // 小桌機 992-1199px
$breakpoint-md: 768px; // 平板 768-991px  tablet
$breakpoint-sm: 576px; // 手機 小於等於 576px
$breakpoint-xs: 0px;
\*------------------------------------*/

import { css } from 'styled-components';

export const mobile = props => {
  return css`
    @media only screen and (max-width: 767px) {
      ${props}
    }
  `;
};

export const tablet = props => {
  return css`
    @media only screen and (max-width: 991px) {
      ${props}
    }
  `;
};

import styled from 'styled-components';
import { tablet } from '@/utils/responsive';
import { useConfigs } from '../../context/ConfigsContext';
import { ScrollToTop } from './ScrollToTop';
import { useRef } from 'react';

const Content = styled.main`
  /* border: 1px solid red; */
  padding: 20px;
  height: calc(100vh - 100px);
  width: ${p =>
    p.$isSidebarOpen
      ? `calc(100vw - ${p.$size.sidebar.width} - 40px)`
      : '100vw'};
  margin-top: ${p => p.$size.navbar.height};
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: auto;
  overflow-y: auto;
  a {
    color: darkblue;
  }
  ${tablet({
    width: p =>
      p.$isSidebarOpen
        ? `calc(100vw - ${p.$size.sidebar.widthSm} - 40px)`
        : '100vw',
  })};
`;

export const PageLayout = ({ children }) => {
  const { CSSVariables } = useConfigs();
  const contentRef = useRef(null);

  return (
    <>
      <Content
        $isSidebarOpen={CSSVariables.sidebar.actived}
        $size={CSSVariables}
        ref={contentRef}
      >
        {children}
        <ScrollToTop $contentRef={contentRef} />
      </Content>
    </>
  );
};

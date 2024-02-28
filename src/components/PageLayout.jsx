import styled from 'styled-components';
import { tablet } from '@/responsive';
import { useLayout } from '../context/LayoutContext';
import { ScrollToTop } from '@/components';
import { useRef } from 'react';

const Content = styled.main`
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
  ${tablet({
    width: p =>
      p.$isSidebarOpen
        ? `calc(100vw - ${p.$size.sidebar.widthSm} - 40px)`
        : '100vw',
  })};
`;

export const PageLayout = ({ children }) => {
  const { elState } = useLayout();
  const contentRef = useRef(null);

  return (
    <>
      <Content
        $isSidebarOpen={elState.sidebar.actived}
        $size={elState}
        ref={contentRef}
      >
        {children}
        <ScrollToTop $contentRef={contentRef} />
      </Content>
    </>
  );
};

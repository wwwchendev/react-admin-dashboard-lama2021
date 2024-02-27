import { Outlet } from 'react-router-dom';
import { Navbar, Footer, ScrollToTop, Sidebar } from '@/components';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  padding-top: 50px;
`;

function App() {
  return (
    <>
      <Navbar />
      <Container>
        <Sidebar />
        <Outlet />
      </Container>
      <ScrollToTop />
    </>
  );
}

export default App;

import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import * as Layout from '@/components/layout';

const Container = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
`;

function App() {
  return (
    <>
      <Layout.Navbar />
      <Container>
        <Layout.Sidebar />
        <Outlet />
      </Container>
    </>
  );
}

export default App;

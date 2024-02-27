import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '@/components';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  position: relative;
`;

function App() {
  return (
    <>
      <Navbar />
      <Container>
        <Sidebar />
        <Outlet />
      </Container>
    </>
  );
}

export default App;

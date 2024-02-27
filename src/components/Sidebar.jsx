import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  LineStyle,
  Timeline,
  People,
  Storefront,
  AttachMoney,
  MailOutline,
  WorkOutline,
  ReceiptOutlined,
  KeyboardArrowDown,
  FirstPage,
  LastPage,
} from '@material-ui/icons';
import { tablet } from '@/responsive';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const sidebarOpenWidth = {
  pc: '20%',
  mobile: '40%',
};

const Container = styled.div`
  /* transition: all 0.1s ease; */
  min-width: ${p => (p.$isActice ? sidebarOpenWidth.pc : '0%')};
  position: relative;
  ${tablet({
  minWidth: p => (p.$isActice ? sidebarOpenWidth.mobile : '0%'),
})};
`;
const Wrapper = styled.div`
  color: #555;
  flex: 1;
  padding: 20px;
  height: calc(100vh - 80px);
  background-color: hsl(240, 100%, 99.2156862745098%);
  position: sticky;
  /* border: 3px solid red; */
  overflow-y: auto;
  overflow-x: hidden;
  top: 50px;
  ${tablet({
  minWidth: '25%',
})};
`;

const SidebarList = styled.div`
  margin-bottom: 10px;
`;
const Title = styled.h3`
  font-size: 13px;
  margin-bottom: 10px;
  color: rgb(187, 186, 186);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
const Group = styled.ul`
  list-style: none;
  padding: 5px;
  height: ${props => (props.$isActice ? '' : '0px')};
  display: flex;
  justify-content: center;
  flex-direction: column;
  opacity: ${props => (props.$isActice ? '1' : '1')};
  transform: ${props => (props.$isActice ? '' : 'translateX(-100%)')};
  & > li {
    height: ${props => (props.$isActice ? '1.8rem' : '0px')};
  }
`;
const Item = styled.li`
  transition: height 1s ease;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 10px;
  white-space: nowrap;
  background-color: ${props => props.$path === props.$activePage ? 'rgb(240, 240, 255)' : ''};
  &:hover {
    background-color: rgb(240, 240, 255);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
const IconWrapper = styled.div`
  margin-right: 5px;
  font-size: 20px !important;
`;
const ToggleShowBtn = styled.button`
  border-radius: 50%;
  width: 35px;
  height: 35px;
  position: fixed;
  margin: 0 1%;
  left: ${p => (p.$sidebarOpen ? sidebarOpenWidth.pc : '')};
  bottom: 15px;
  z-index: 9;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  ${tablet({
  left: p => (p.$sidebarOpen ? sidebarOpenWidth.mobile : ''),
})};
`;
export const Sidebar = () => {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const [activePage, setActivePage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);
  const [serviceOpen, setServiceOpen] = useState(true);
  const [frontendOpen, setFrontendOpen] = useState(true);
  const [securityOpen, setSecurityOpen] = useState(false);

  useEffect(() => {
    setActivePage(pathname)
  }, [pathname])
  return (
    <>
      <Container $isActice={sidebarOpen}>
        <ToggleShowBtn
          $sidebarOpen={sidebarOpen}
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        >
          {sidebarOpen ? (
            <FirstPage style={{ fontSize: '14px' }} />
          ) : (
            <LastPage style={{ fontSize: '14px' }} />
          )}
        </ToggleShowBtn>
        {sidebarOpen && (
          <Wrapper>
            <SidebarList>
              <Item
                $activePage={activePage}
                $path={'/'}
                onClick={() => {
                  navigator('/');
                }}
              >
                <IconWrapper>
                  <LineStyle />
                </IconWrapper>
                總覽
              </Item>
            </SidebarList>
            <SidebarList>
              <Title onClick={() => setSalesOpen(!salesOpen)}>
                銷售管理
                <KeyboardArrowDown />
              </Title>

              <Group $isActice={salesOpen}>
                <Item $activePage={activePage} $path={null}>
                  <IconWrapper>
                    <AttachMoney />
                  </IconWrapper>
                  訂單管理
                </Item>

                <Item $activePage={activePage} $path={null}>
                  <IconWrapper>
                    <ReceiptOutlined />
                  </IconWrapper>
                  發票管理
                </Item>
              </Group>
            </SidebarList>

            <SidebarList>
              <Title onClick={() => setServiceOpen(!serviceOpen)}>
                客服管理
                <KeyboardArrowDown />
              </Title>

              <Group $isActice={serviceOpen}>
                <Item $activePage={activePage} $path={null}>
                  <IconWrapper>
                    <People />
                  </IconWrapper>
                  會員資料維護
                </Item>
                <Item $activePage={activePage} $path={null}>
                  <IconWrapper>
                    <MailOutline />
                  </IconWrapper>
                  客服信箱
                </Item>
              </Group>
            </SidebarList>

            <SidebarList>
              <Title onClick={() => setFrontendOpen(!frontendOpen)}>
                前台管理
                <KeyboardArrowDown />
              </Title>

              <Group $isActice={frontendOpen}>
                <Item $activePage={activePage} $path={null}>
                  <IconWrapper>
                    <Storefront />
                  </IconWrapper>
                  商品維護
                </Item>
              </Group>
            </SidebarList>

            <SidebarList>
              <Title onClick={() => setSecurityOpen(!securityOpen)}>
                安控管理
                <KeyboardArrowDown />
              </Title>

              <Group $isActice={securityOpen}>
                <Item
                  $activePage={activePage}
                  $path={'/employee'}
                  onClick={() => {
                    navigator('/employee');
                  }}
                >
                  <IconWrapper>
                    <WorkOutline />
                  </IconWrapper>
                  員工帳號管理
                </Item>
                <Item $activePage={activePage} $path={null}>
                  <IconWrapper>
                    <Timeline />
                  </IconWrapper>
                  登入記錄查詢
                </Item>
              </Group>
            </SidebarList>
          </Wrapper>
        )}
      </Container>
    </>
  );
};

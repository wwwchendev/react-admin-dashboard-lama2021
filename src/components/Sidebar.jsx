import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
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
  FiberPinOutlined,
  SmsOutlined
} from '@material-ui/icons';
import { tablet } from '@/responsive';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../context/LayoutContext';
import { useCurrentPage } from '../context/CurrentPageContext';
import { useSelector } from 'react-redux';

const Container = styled.div`
  /* transition: all 0.1s ease; */
  position: absolute;
  background-color: #fbfbff;
  min-width: ${p => {
    /* console.log(p.$layout.sidebar) */
    return p.$layout.sidebar.actived ? p.$layout.sidebar.width : '0%';
  }};
  padding-top: ${p => p.$layout.navbar.height};
  overflow: hidden;
  z-index: 5;
  ${tablet({
    minWidth: p =>
      p.$layout.sidebar.actived ? p.$layout.sidebar.widthSm : '0%',
  })};
`;
const Wrapper = styled.div`
  color: #555;
  flex: 1;
  padding: 30px 15px 0px 15px;
  position: relative;
  height: calc(100vh - 90px);
  overflow-y: auto;
  overflow-x: hidden;
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
  height: ${props => (props.$isActived ? '' : '0px')};
  display: flex;
  justify-content: center;
  flex-direction: column;
  transform: ${props => (props.$isActived ? '' : 'translateX(-120%)')};
  & > li {
    height: ${props => (props.$isActived ? '1.8rem' : '0px')};
  }
`;
const Item = styled.li`
  transition: height 1s ease;
  padding: 5px;
  cursor: pointer;
  display: ${props => (props.$show ? 'flex' : 'none')};
  align-items: center;
  border-radius: 10px;
  white-space: nowrap;
  background-color: ${props => {
    /* console.log(props.$path, props.$activePage) */
    return props.$path === props.$activePage ? 'rgb(240, 240, 255)' : ''
  }
  };
  &:hover {
    background-color: rgb(240, 240, 255);
  }
`;
const IconWrapper = styled.div`
  margin-right: 5px;
  font-size: 20px !important;
`;
const bounceAnimation = keyframes`
   20%, 50%, 80% {
    transform: translateX(-1px);
  }
  40% {
    transform: translateX(3px) scaleX(1.2);
  }
  60% {
    transform: translateX(3px) scaleX(1.2);
  }
  0%,100% {
    transform: translateX(0);
  }
`;
const ToggleShowBtn = styled.button`
  border-radius: 0 10% 10% 0;
  width: 30px;
  height: 35px;
  position: fixed;
  margin: 0%;
  left: ${p => (p.$layout.sidebar.actived ? p.$layout.sidebar.width : '0')};
  bottom: 30px;
  z-index: 9;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(223, 223, 255);
  &:hover > svg {
    animation: ${bounceAnimation} 1s ease infinite;
  }
  ${tablet({
  left: p => (p.$layout.sidebar.actived ? p.$layout.sidebar.widthSm : '0'),
})};
`;
export const Sidebar = () => {
  const navigator = useNavigate();
  const { elState, toggleSidebar } = useLayout();
  const { currentPage } = useCurrentPage();
  const authEmployee = useSelector(state => state.authEmployee);
  //分類是否打開
  const [salesOpen, setSalesOpen] = useState(true);
  const [serviceOpen, setServiceOpen] = useState(true);
  const [frontendOpen, setFrontendOpen] = useState(true);
  const [securityOpen, setSecurityOpen] = useState(true);

  return (
    <>
      <Container $layout={elState}>
        <ToggleShowBtn $layout={elState} onClick={toggleSidebar}>
          {elState.sidebar.actived ? (
            <FirstPage style={{ fontSize: '18px' }} />
          ) : (
            <LastPage style={{ fontSize: '18px' }} />
          )}
        </ToggleShowBtn>
        {elState.sidebar.actived && (
          <Wrapper>
            <SidebarList>
              <Item
                $activePage={currentPage}
                $path={'/'}
                onClick={() => {
                  navigator('/');
                }}
                $show={true}
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

              <Group $isActived={salesOpen}>
                <Item
                  $activePage={currentPage}
                  $path={null}
                  $show={true}>
                  <IconWrapper>
                    <AttachMoney />
                  </IconWrapper>
                  訂單管理
                </Item>

                <Item
                  $activePage={currentPage}
                  $path={null}
                  $show={true}>
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

              <Group $isActived={serviceOpen}>
                <Item
                  $activePage={currentPage}
                  $path={'/users'}
                  onClick={() => {
                    navigator('/users');
                  }}
                  $show={true}
                >
                  <IconWrapper>
                    <People />
                  </IconWrapper>
                  會員資料維護
                </Item>
                <Item
                  $activePage={currentPage}
                  $path={'/contactRecords'}
                  $show={true}
                  onClick={() => {
                    navigator('/contactRecords');
                  }}
                >
                  <IconWrapper>
                    <SmsOutlined />
                  </IconWrapper>
                  客服紀錄
                </Item>
              </Group>
            </SidebarList>

            <SidebarList>
              <Title onClick={() => setFrontendOpen(!frontendOpen)}>
                前台管理
                <KeyboardArrowDown />
              </Title>

              <Group $isActived={frontendOpen}>
                <Item
                  $activePage={currentPage}
                  $path={'/products'}
                  onClick={() => {
                    navigator('/products');
                  }}
                  $show={true}
                >
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

              <Group $isActived={securityOpen}>

                <Item
                  $activePage={currentPage}
                  $path={'/employee/changePassword'}
                  onClick={() => {
                    navigator('/employee/changePassword');
                  }}
                  $show={true}
                >
                  <IconWrapper>
                    <FiberPinOutlined />
                  </IconWrapper>
                  變更密碼
                </Item>

                <Item
                  $activePage={currentPage}
                  $path={'/employee'}
                  onClick={() => {
                    navigator('/employee');
                  }}
                  $show={authEmployee.data.role === '主管'}
                >
                  <IconWrapper>
                    <WorkOutline />
                  </IconWrapper>
                  員工帳號管理
                </Item>

                <Item
                  $activePage={currentPage}
                  $path={'/security'}
                  onClick={() => {
                    navigator('/security');
                  }}
                  $show={true}
                >
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

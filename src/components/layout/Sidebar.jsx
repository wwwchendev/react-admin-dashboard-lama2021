import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Assessment,
  LineStyle,
  Timeline,
  People,
  Storefront,
  AttachMoney,
  KeyboardArrowUp,
  WorkOutline,
  ReceiptOutlined,
  KeyboardArrowDown,
  FirstPage,
  LastPage,
  FiberPinOutlined,
  Dashboard,
  CollectionsBookmarkOutlined,
  Comment,
  LocalShippingOutlined,
  Apps,
  Today as ICON,
} from '@material-ui/icons';
import { tablet } from '@/utils/responsive';
import { useNavigate } from 'react-router-dom';
import { useConfigs } from '../../context/ConfigsContext';
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
  gap: 2px;
  transform: ${props => (props.$isActived ? '' : 'translateX(-120%)')};
  & > li {
    height: ${props => (props.$isActived ? '1.8rem' : '0px')};
  }
`;
const Item = styled.li`
  transition: height 1s ease;
  padding: 2px 5px;
  cursor: pointer;
  display: ${props => (props.$show ? 'flex' : 'none')};
  align-items: center;
  border-radius: 10px;
  white-space: nowrap;
  background-color: ${props => {
    /* console.log(props.$path, props.$activePage) */
    return props.$path === props.$activePage ? '#e5f3fc' : '';
  }};
  &:hover {
    background-color: #e5f3fc;
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
  background-color: #c9ebff;
  &:hover > svg {
    animation: ${bounceAnimation} 1s ease infinite;
  }
  ${tablet({
  left: p => (p.$layout.sidebar.actived ? p.$layout.sidebar.widthSm : '0'),
})};
`;
export const Sidebar = () => {
  const navigator = useNavigate();
  const { currentPage, CSSVariables, showSidebarElement } = useConfigs();

  const authEmployee = useSelector(state => state.authEmployee);
  //分類是否打開
  const [salesOpen, setSalesOpen] = useState(true);
  const [serviceOpen, setServiceOpen] = useState(true);
  const [frontendOpen, setFrontendOpen] = useState(true);
  const [loginHistoryOpen, setLoginHistoryOpen] = useState(true);

  return (
    <>
      <Container $layout={CSSVariables}>
        <ToggleShowBtn
          $layout={CSSVariables}
          onClick={() => {
            showSidebarElement('toggle');
          }}
        >
          {CSSVariables.sidebar.actived ? (
            <FirstPage style={{ fontSize: '18px' }} />
          ) : (
            <LastPage style={{ fontSize: '18px' }} />
          )}
        </ToggleShowBtn>
        {CSSVariables.sidebar.actived && (
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
                  <Apps />
                </IconWrapper>
                首頁
              </Item>
            </SidebarList>
            {/* <SidebarList>
              <Item
                $activePage={currentPage}
                $path={'/bulletinBoard'}
                onClick={() => {
                  navigator('/bulletinBoard');
                }}
                $show={true}
              >
                <IconWrapper>
                  <LineStyle />
                </IconWrapper>
                內部公告
              </Item>
            </SidebarList> */}
            <SidebarList>
              <Title onClick={() => setSalesOpen(!salesOpen)}>
                銷售管理
                {salesOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
              </Title>

              <Group $isActived={salesOpen}>
                <Item
                  $activePage={currentPage}
                  $path={'/order'}
                  $show={true}
                  onClick={() => {
                    navigator('/order');
                  }}
                >
                  <IconWrapper>
                    <AttachMoney />
                  </IconWrapper>
                  訂單管理
                </Item>

                {/* <Item $activePage={currentPage}
                  $path={'/invoice'}
                  $show={true}
                  onClick={() => {
                    navigator('/invoice');
                  }}>
                  <IconWrapper>
                    <ReceiptOutlined />
                  </IconWrapper>
                  發票管理
                </Item> */}
                <Item
                  $activePage={currentPage}
                  $path={'/logistic'}
                  $show={true}
                  onClick={() => {
                    navigator('/logistic');
                  }}
                >
                  <IconWrapper>
                    <LocalShippingOutlined />
                  </IconWrapper>
                  出貨紀錄
                </Item>
              </Group>
            </SidebarList>

            <SidebarList>
              <Title onClick={() => setServiceOpen(!serviceOpen)}>
                客服管理
                {serviceOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
              </Title>

              <Group $isActived={serviceOpen}>
                <Item
                  $activePage={currentPage}
                  $path={'/contactHistory'}
                  $show={true}
                  onClick={() => {
                    navigator('/contactHistory');
                  }}
                >
                  <IconWrapper>
                    <Comment />
                  </IconWrapper>
                  客服紀錄
                </Item>
                <Item
                  $activePage={currentPage}
                  $path={'/user'}
                  onClick={() => {
                    navigator('/user');
                  }}
                  $show={true}
                >
                  <IconWrapper>
                    <People />
                  </IconWrapper>
                  會員資料維護
                </Item>
              </Group>
            </SidebarList>

            <SidebarList>
              <Title onClick={() => setFrontendOpen(!frontendOpen)}>
                前台管理
                {frontendOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
              </Title>

              <Group $isActived={frontendOpen}>
                <Item
                  $activePage={currentPage}
                  $path={'/product'}
                  onClick={() => {
                    navigator('/product');
                  }}
                  $show={true}
                >
                  <IconWrapper>
                    <Storefront />
                  </IconWrapper>
                  商品維護
                </Item>
                <Item
                  $activePage={currentPage}
                  $path={'/productCategory'}
                  onClick={() => {
                    navigator('/productCategory');
                  }}
                  $show={true}
                >
                  <IconWrapper>
                    <Dashboard />
                  </IconWrapper>
                  賣場分類
                </Item>
                <Item
                  $activePage={currentPage}
                  $path={'/news'}
                  onClick={() => {
                    navigator('/news');
                  }}
                  $show={true}
                >
                  <IconWrapper>
                    <CollectionsBookmarkOutlined />
                  </IconWrapper>
                  最新消息
                </Item>
                {/* <Item
                  $activePage={currentPage}
                  $path={'/products'}
                  onClick={() => {
                    navigator('/products');
                  }}
                  $show={true}
                >
                  <IconWrapper>
                    <ICON />
                  </IconWrapper>
                  優惠設定
                </Item> */}
              </Group>
            </SidebarList>

            <SidebarList>
              <Title onClick={() => setLoginHistoryOpen(!loginHistoryOpen)}>
                安控管理
                {loginHistoryOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
              </Title>

              <Group $isActived={loginHistoryOpen}>
                <Item
                  $activePage={currentPage}
                  $path={'/employee/updatePassword'}
                  onClick={() => {
                    navigator('/employee/updatePassword');
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
                  $path={'/jobstructure'}
                  onClick={() => {
                    navigator('/jobstructure');
                  }}
                  $show={authEmployee.data?.role === '主管'}
                >
                  <IconWrapper>
                    <WorkOutline />
                  </IconWrapper>
                  部門單位維護
                </Item>

                <Item
                  $activePage={currentPage}
                  $path={'/employee'}
                  onClick={() => {
                    navigator('/employee');
                  }}
                  $show={authEmployee.data?.role === '主管'}
                >
                  <IconWrapper>
                    <WorkOutline />
                  </IconWrapper>
                  員工帳號管理
                </Item>

                <Item
                  $activePage={currentPage}
                  $path={'/loginHistory'}
                  onClick={() => {
                    navigator('/loginHistory');
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

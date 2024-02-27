import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { NotificationsNone, Language, Settings } from '@material-ui/icons';
import { tablet } from '@/responsive';
import { useLayout } from '../context/LayoutContext';
const baseUrl =
  import.meta.env.VITE_BASENAME === '/' ? '' : import.meta.env.VITE_BASENAME;

/* 版型 */
const Container = styled.div`
  position: fixed;
  z-index: 99;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 5px 30px rgba(204, 204, 204, 0.25);
  height: ${p => p.$layout.navbar.height};
`;
const Wrapper = styled.div`
  padding: 0px 0px;
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
`;
const Badge = styled.span`
  background-color: #f82828;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 10px;
`;
const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  ${tablet({ fontSize: '12px' })};
  display: flex;
  align-items: center;
  cursor: pointer;
  & > ${Badge} {
    position: absolute;
    top: -5px;
    right: -6px;
  }
  & > p {
    margin-left: 5px;
  }
`;
/* 左方 */
const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 20px;
`;
const Logo = styled.h1`
  color: darkblue;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
  ${tablet({ fontSize: '24px' })};
  cursor: pointer;
`;
/* 右邊 */
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  padding-right: 20px;
`;
const AvatarWrapper = styled.div`
  width: 26px;
  height: 26px;
  overflow: hidden;
  border-radius: 50%;
  background-image: url('${baseUrl}/images/icons/common/account.svg');
  background-size: 100%;
  /* background: #000; */
  & > img {
    width: 100%;
    object-fit: cover;
  }
`;

export const Navbar = () => {
  const navigate = useNavigate();
  const { elState } = useLayout();
  return (
    <Container $layout={elState}>
      <Wrapper>
        <Left>
          <Logo
            onClick={() => {
              navigate('/');
            }}
          >
            後台管理
          </Logo>
        </Left>
        <Right>
          <MenuItem
            onClick={() => {
              navigate('/#notifications');
            }}
          >
            <NotificationsNone style={{ color: '#555' }} />
            <Badge>99</Badge>
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/#language');
            }}
          >
            <Language style={{ color: '#555' }} />
            <Badge>2</Badge>
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/#setting');
            }}
          >
            <Settings style={{ color: '#555' }} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/#account');
            }}
          >
            <AvatarWrapper>
              <img
                src='https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
                alt=''
                className='topAvatar'
              />
            </AvatarWrapper>
            <p>CHEN</p>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

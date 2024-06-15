import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { NotificationsNone, Language, Settings } from '@material-ui/icons';
import { tablet } from '@/utils/responsive';
import { useConfigs } from '../../context/ConfigsContext';
import { useDispatch, useSelector } from 'react-redux';
import { AuthRequests } from '@/store/authEmployee';
import store from '@/store/configureStore'

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
  color: rgb(70, 130, 209);
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
  font-size: 28px;
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

export const Navbar = () => {
  const navigate = useNavigate();
  const { CSSVariables } = useConfigs();
  const employee = useSelector(state => state.authEmployee.data);
  const dispatch = useDispatch();

  const handleLogout = e => {
    e.preventDefault();
    dispatch(AuthRequests.logout(employee.refreshToken));
    store.dispatch({ type: 'RESET' }); //清除持久persist
    navigate('/login');
  };

  return (
    <Container $layout={CSSVariables}>
      <Wrapper>
        <Left>
          <Logo
            onClick={() => {
              navigate('/');
            }}
          >
            漾活有限公司
          </Logo>
        </Left>
        <Right>
          {employee && employee.accessToken && (
            <>
              <MenuItem>
                <p>
                  {`${employee.position.departmentName}
                  ${employee.position.sectionName} ${employee.name} (${employee.employeeId})`}
                </p>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <p>登出</p>
              </MenuItem>
            </>
          )}
          {/* <MenuItem
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
          </MenuItem> */}
        </Right>
      </Wrapper>
    </Container>
  );
};

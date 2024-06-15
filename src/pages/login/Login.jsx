//react
import { useState } from 'react';
import { useConfigs } from '../../context/ConfigsContext';
//redux
import { useDispatch, useSelector } from 'react-redux';
import { AuthRequests, reset } from '@/store/authEmployee';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Flexbox,
  Button,
  Input,
  InputWrapper,
  PasswordInput,
  StyledLink,
  PasswordInputWrapper,
} from '@/components/common';
//utility
import cryptoJS from '@/utils/cryptoJS.js';
import { mobile, tablet } from '../../utils/responsive';
import { useEffect } from 'react';

const Container = styled.div`
  /* border: 10px solid red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('/images/background/login-right.png');
  background-size: cover;
  background-position: bottom;
  color: #333;
  span {
    font-size: 0.8rem;
    color: #d15252;
    white-space: wrap;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 30%;
  ${tablet({ width: '60%' })};
  ${mobile({ width: '80%' })};
  h1 {
    margin-bottom: 1.5rem;
  }
  ${Input} {
    padding: 10px 5px;
  }
  ${Button} {
    padding: 10px 20px;
    width: 100%;
    font-size: 1rem;
    margin: 20px 0 20px 0;
  }

  ${StyledLink} {
    margin-top: 40px;
    color: #999999;
  }
`;

export const Login = () => {
  const { CSSVariables } = useConfigs();
  //Redux
  const dispatch = useDispatch();
  const employeeState = useSelector(state => state.authEmployee);
  //表單管理
  const [formInput, setformInput] = useState({
    employeeId: '',
    password: '',
  });
  const initPromptMessage = {
    employeeId: '',
    password: '',
    afterSubmit: '',
  };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);

  // 顯示登入請求錯誤訊息的方法
  // 當發送登入請求時，我設定 localStorage.getItem('btnClicked').loginRequest 為 true。在組件初始化時，我們會檢查 localStorage 是否存在發送過登入請求的標誌。如果有，我們會將該標誌保存在當前組件的狀態中，以便根據該狀態來顯示錯誤消息。同時，我們也會清除 localStorage.getItem('btnClicked').btnClicked。
  // 這樣做的好處是，在組件重新載入或刷新後，我們仍然可以根據先前的登入狀態來顯示相應的錯誤信息，從而提升用戶體驗和系統的可靠性。

  const [loginClicked, setLoginClicked] = useState(false);
  useEffect(() => {
    const storedLoginState = localStorage.getItem('btnClicked')?.loginRequest;
    if (storedLoginState) {
      setLoginClicked(JSON.parse(storedLoginState));
      localStorage.setItem(
        'btnClicked',
        JSON.stringify({ loginRequest: false }),
      );
    }
  }, []);

  const handleLoginFormChange = e => {
    setPromptMessage(initPromptMessage);
    if (employeeState.error) {
      dispatch(reset());
    }
    const { name, value } = e.target;
    setformInput(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleLoginFormSubmit = async e => {
    e.preventDefault();
    const { employeeId, password } = formInput;
    if (employeeId && password) {
      setLoginClicked(true);
      localStorage.setItem(
        'btnClicked',
        JSON.stringify({ loginRequest: true }),
      );

      await dispatch(
        AuthRequests.login({
          employeeId: employeeId,
          passwordHash: cryptoJS.encrypt(password),
        }),
      );
    } else {
      const requireField = ['employeeId', 'password'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'employeeId':
            emptyField = '員工編號';
            break;
          case 'password':
            emptyField = '密碼';
            break;
          default:
            return;
        }

        if (formInput[f] === '') {
          setPromptMessage(prev => {
            return {
              ...prev,
              [f]: `${emptyField}不得為空`,
            };
          });
        }
      });
    }
  };

  return (
    <>
      <Layout.Navbar />
      <SEO title='登入 | 漾活管理後台' description={null} url={null} />
      <Container $layout={CSSVariables}>
        <Form>
          <h1>管理後台</h1>
          <Flexbox $direction={'column'} $gap={'1.5rem'}>
            <InputWrapper
              $border={promptMessage.employeeId && '2px solid #d15252'}
              $height={'3rem'}
            >
              <Input
                name='employeeId'
                type='text'
                placeholder='員工編號'
                autoComplete='username'
                onChange={handleLoginFormChange}
              />
              {<span>{promptMessage.employeeId}</span>}
            </InputWrapper>
            <PasswordInputWrapper
              $border={promptMessage.password && '2px solid #d15252'}
              $height={'3rem'}
            >
              <PasswordInput
                type='password'
                name='password'
                placeholder='密碼'
                onChange={handleLoginFormChange}
                autoComplete='current-password'
                $border={promptMessage.password && '2px solid #d15252'}
              />
            </PasswordInputWrapper>
            {<span>{promptMessage.password}</span>}
          </Flexbox>
          <Button
            disabled={employeeState.loading}
            onClick={handleLoginFormSubmit}
            $bg={'#276f8b'}
          >
            登入
          </Button>
          {loginClicked && employeeState.error && !employeeState.loading && (
            <span>{employeeState?.error.login}</span>
          )}
          <StyledLink to='/forgetPassword'>忘記密碼</StyledLink>
        </Form>

        {/* <span>{JSON.stringify(loginClicked, null, 2)}</span>*/}
        {/* <span>{JSON.stringify(employeeState, null, 2)}</span> */}

        <Layout.Loading
          type={'spinningBubbles'}
          active={employeeState.loading}
          color={'#00719F'}
          height={100}
        />
      </Container>
    </>
  );
};

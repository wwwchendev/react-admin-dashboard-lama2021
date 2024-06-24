//react
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  InputWrapper,
  PasswordInput,
  StyledLink,
  Span,
} from '@/components/common';
//utility
import cryptoJS from '@/utils/cryptoJS.js';
import { mobile, tablet } from '../../utils/responsive';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url('/images/background/login-right.png');
  background-size: cover;
  background-position: bottom;
  color: #333;
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
  ${Button} {
    padding: 10px 20px;
    width: 100%;
    font-size: 1rem;
    margin-top: 60px;
  }
  ${StyledLink} {
    margin-top: 40px;
    &:active {
      color: #227766;
    }
  }
  ${Span} {
    font-size: 0.8rem;
    white-space: wrap;
  }
`;

export const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resetPasswordToken = queryParams.get('token');
  //Redux
  const dispatch = useDispatch();
  const employeeState = useSelector(state => state.authEmployee);
  //表單管理
  const [formInput, setformInput] = useState({
    newPassword: '',
    checkedPassword: '',
  });
  const initPromptMessage = { newPassword: '', checkedPassword: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    dispatch(reset());
    //確認是否按過重設密碼
    const storedState =
      localStorage.getItem('btnClicked')?.resetPasswordRequest;
    if (storedState) {
      setSubmitClicked(JSON.parse(storedState));
      localStorage.setItem(
        'btnClicked',
        JSON.stringify({ resetPasswordRequest: false }),
      );
    }
  }, []);

  const handleResetPasswordFormChange = async e => {
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
  const handleResetPasswordFormSubmit = async e => {
    e.preventDefault();
    const { newPassword, checkedPassword } = formInput;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;

    if (newPassword !== '' && checkedPassword !== '') {
      setSubmitClicked(true);
      if (!passwordRegex.test(newPassword)) {
        setPromptMessage(prev => {
          return {
            ...prev,
            newPassword: '密碼必須包含英數組成，且長度在6-12之間',
          };
        });
      } else if (newPassword !== checkedPassword) {
        setPromptMessage(prev => {
          return { ...prev, checkedPassword: '兩次輸入密碼不一致' };
        });
      } else {
        // 密碼符合格式要求，發送請求
        const passwordHash = cryptoJS.encrypt(checkedPassword);
        await dispatch(
          AuthRequests.resetPassword(resetPasswordToken, { passwordHash }),
        );
      }
      localStorage.setItem(
        'btnClicked',
        JSON.stringify({ resetPasswordRequest: true }),
      );
    } else {
      const requireField = ['newPassword', 'checkedPassword'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'newPassword':
            emptyField = '新密碼欄位';
            break;
          case 'checkedPassword':
            emptyField = '再次確認密碼欄位';
            break;
          default:
            return;
        }
        if (formInput[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };

  return (
    <>
      <Layout.Navbar />
      <SEO title='重設密碼 | 漾活管理後台' description={null} url={null} />
      <Container>
        <Form>
          <h1>重設密碼</h1>
          <Flexbox $direction={'column'} $gap={'1.5rem'}>
            <InputWrapper
              $height={'3rem'}
              $display={'flex'}
              $border={
                (promptMessage.newPassword ||
                  promptMessage.checkedPassword === '兩次輸入密碼不一致') &&
                '2px solid #d15252'
              }
            >
              <PasswordInput
                type='password'
                name='newPassword'
                placeholder='輸入新的密碼'
                onChange={handleResetPasswordFormChange}
                disabled={employeeState?.data?.message}
                autoComplete='current-password'
              />
              {<Span $color={'#d15252'}>{promptMessage.newPassword}</Span>}
            </InputWrapper>
            <InputWrapper
              $height={'3rem'}
              $display={'flex'}
              $border={promptMessage.checkedPassword && '2px solid #d15252'}
            >
              <PasswordInput
                type='password'
                name='checkedPassword'
                placeholder='再次確認密碼'
                onChange={handleResetPasswordFormChange}
                disabled={employeeState?.data?.message}
                autoComplete='current-password'
              />
              {/* ❌錯誤訊息 */}
              {<Span $color={'#d15252'}>{promptMessage.checkedPassword}</Span>}
              {submitClicked &&
                employeeState.error &&
                !employeeState.loading && (
                  <Span $color={'#d15252'}>
                    {employeeState?.error.resetPassword}
                  </Span>
                )}
              {/* ⭕成功訊息 */}
              {submitClicked &&
                employeeState?.data?.message &&
                !employeeState.error &&
                !employeeState.loading && (
                  <Span $color={'#5cc55f'}>
                    ✅{employeeState?.data?.message}
                  </Span>
                )}
            </InputWrapper>
          </Flexbox>
          <Button
            disabled={employeeState.loading || employeeState?.data?.message}
            $bg={'#276f8b'}
            onClick={handleResetPasswordFormSubmit}
          >
            送出
          </Button>
          <StyledLink
            to='/login'
            $color={employeeState?.data ? '#276f8' : '#999999'}
          >
            返回登入頁面
          </StyledLink>
        </Form>
        {/* <span>{JSON.stringify(formInput, null, 2)}</span>
        <span>{JSON.stringify(employeeState, null, 2)}</span>
        <span>{JSON.stringify(resetPasswordToken, null, 2)}</span> */}
      </Container>

      <Layout.Loading
        type={'spinningBubbles'}
        active={employeeState.loading}
        color={'#00719F'}
        height={100}
      />
    </>
  );
};

//react
import { useState } from 'react';
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
  StyledLink,
  Span,
} from '@/components/common';
//utility
import { mobile, tablet } from '../../utils/responsive';
import { useEffect } from 'react';

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
    color: #999999;
  }
  ${Span} {
    font-size: 0.8rem;
    white-space: wrap;
  }
`;

export const ForgetPassword = () => {
  //Redux
  const dispatch = useDispatch();
  const employeeState = useSelector(state => state.authEmployee);
  //表單管理
  const [formInput, setformInput] = useState({ email: '' });
  const initPromptMessage = { email: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);

  const [submitClicked, setSubmitClicked] = useState(false);
  useEffect(() => {
    dispatch(reset());
    const storedState =
      localStorage.getItem('btnClicked')?.forgetPasswordRequest;
    if (storedState) {
      setSubmitClicked(JSON.parse(storedState));
      localStorage.setItem(
        'btnClicked',
        JSON.stringify({ forgetPasswordRequest: false }),
      );
    }
  }, []);

  const handleForgetPasswordFormChange = async e => {
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
  const handleForgetPasswordFormSubmit = async e => {
    e.preventDefault();
    const { email } = formInput;
    if (email !== '') {
      setSubmitClicked(true);
      localStorage.setItem(
        'btnClicked',
        JSON.stringify({ forgetPasswordRequest: true }),
      );
      await dispatch(AuthRequests.forgetPassword({ email }));
    } else {
      const requireField = ['email'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'email':
            emptyField = '電子信箱';
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
      <SEO title='忘記密碼 | 漾活管理後台' description={null} url={null} />
      <Container>
        <Form>
          <h1>忘記密碼</h1>
          <Flexbox $direction={'column'} $gap={'2.5rem'}>
            <InputWrapper
              $border={promptMessage.email && '2px solid #d15252'}
              $height={'3rem'}
            >
              <Input
                name='email'
                type='email'
                placeholder='輸入信箱'
                autoComplete='email'
                disabled={employeeState?.data?.message}
                onChange={handleForgetPasswordFormChange}
              />
              {/* ❌錯誤訊息 */}
              {<Span $color={'#d15252'}>{promptMessage.email}</Span>}
              {submitClicked &&
                employeeState.error &&
                !employeeState.loading && (
                  <Span $color={'#d15252'}>
                    {employeeState?.error.forgetPassword}
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
            onClick={handleForgetPasswordFormSubmit}
            $bg={'#276f8b'}
          >
            寄送重設密碼函
          </Button>
          <StyledLink to='/login'>返回登入頁面</StyledLink>
        </Form>
        {/* <span>{JSON.stringify(employeeState, null, 2)}</span> */}
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

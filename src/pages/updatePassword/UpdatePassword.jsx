//react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { AuthRequests, reset } from '@/store/authEmployee';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Flexbox,
  TitleContainer,
  PasswordInput,
  Button,
  StyledLink,
  Input,
  Span,
  InputWrapper,
  PasswordInputWrapper,
} from '@/components/common';
//utility
import cryptoJS from '@/utils/cryptoJS.js';
import { mobile, tablet } from '../../utils/responsive';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  color: #333;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 40%;
  ${tablet({ width: '80%' })};
  ${mobile({ width: '100%' })};
  h1 {
    margin-bottom: 1.5rem;
  }
  ${Button} {
    width: 100%;
    font-size: 1rem;
    height: 100%;
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
  ${Flexbox} {
    position: relative;
    label {
      min-width: 5rem;
    }
    ${Span} {
      position: absolute;
      bottom: -1.1rem;
    }
  }
`;

export const UpdatePassword = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const [formInput, setformInput] = useState({
    originPassword: '',
    newPassword: '',
    checkedPassword: '',
  });
  const initPromptMessage = {
    originPassword: '',
    newPassword: '',
    checkedPassword: '',
  };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [submitClicked, setSubmitClicked] = useState(false);

  //檢查變更密碼的狀態，確認密碼變更後轉到首頁
  useEffect(() => {
    setCurrentPage('/employee/updatePassword');
    if (submitClicked & !authEmployeeState.data?.accessToken) {
      alert('密碼已更新，請重新登入');
      navigator('/login');
      // dispatch(reset())
    }
  }, [authEmployeeState.data]);

  useEffect(() => {
    const storedBtnClickedState = JSON.parse(
      localStorage.getItem('btnClicked'),
    );
    const storedState = storedBtnClickedState.updatePasswordRequest;

    if (storedState) {
      setSubmitClicked(storedState);
      localStorage.setItem(
        'btnClicked',
        JSON.stringify({ updatePasswordRequest: false }),
      );
    }
  }, []);

  //監聽修改
  const handleUpdatePasswordFormChange = e => {
    if (authEmployeeState.error) {
      dispatch(reset());
    }
    const { name, value } = e.target;
    setPromptMessage(initPromptMessage)
    setformInput(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  //提交
  const handleUpdatePasswordFormSubmit = async e => {
    e.preventDefault();
    setPromptMessage(initPromptMessage);

    const { originPassword, newPassword, checkedPassword } = formInput;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
    if (originPassword !== '' && newPassword !== '' && checkedPassword !== '') {
      setSubmitClicked(true);

      const originPasswordHash = cryptoJS.encrypt(originPassword);
      const newPasswordHash = cryptoJS.encrypt(newPassword);
      const checkedPasswordHash = cryptoJS.encrypt(checkedPassword);
      if (!passwordRegex.test(newPassword)) {
        setPromptMessage(prev => {
          return {
            ...prev,
            newPassword: '密碼必須包含英數組成，且長度在6-12之間',
          };
        });
      } else if (originPasswordHash !== authEmployeeState.data.passwordHash) {
        console.log(originPasswordHash)
        console.log(authEmployeeState.data.passwordHash)
        console.log(authEmployeeState.data)
        setPromptMessage(prev => {
          return {
            ...prev,
            originPassword: '舊密碼輸入錯誤',
          };
        });
      } else if (newPassword !== checkedPassword) {
        setPromptMessage(prev => {
          return { ...prev, checkedPassword: '兩次輸入密碼不一致' };
        });
      } else {
        // 密碼符合格式要求，發送請求
        const data = {
          'employeeId': authEmployeeState.data.employeeId,
          'oldPasswordHash': originPasswordHash,
          'newPasswordHash': newPasswordHash,
          'checkedPasswordHash': checkedPasswordHash,
        };
        await dispatch(AuthRequests.updatePassword(TOKEN, data));
      }
      localStorage.setItem(
        'btnClicked',
        JSON.stringify({ updatePasswordRequest: true }),
      );
    } else {
      const requireField = ['originPassword', 'newPassword', 'checkedPassword'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'originPassword':
            emptyField = '舊密碼欄位';
            break;
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
    <Layout.PageLayout>
      <SEO title='變更密碼 | 漾活管理後台' description={null} url={null} />
      <Container>
        <Form onSubmit={handleUpdatePasswordFormSubmit}>
          <TitleContainer>
            <h1>變更密碼</h1>
          </TitleContainer>

          <Flexbox $direction={'column'} $gap={'1.5rem'} $margin={'0 0 40px 0'}>
            <Flexbox>
              <label>姓名員編</label>
              <InputWrapper $height={'2.5rem'}>
                <Input
                  name='employeeId'
                  type='text'
                  placeholder='員工編號'
                  autoComplete='username'
                  value={`${authEmployeeState?.data?.name} / ${authEmployeeState?.data?.employeeId}`}
                  disabled
                />
              </InputWrapper>
            </Flexbox>
            <Flexbox>
              <label>舊密碼</label>
              <PasswordInputWrapper $height={'2.5rem'}>
                <PasswordInput
                  name='originPassword'
                  placeholder='輸入原本的密碼'
                  autoComplete='current-password'
                  value={formInput.originPassword}
                  onChange={handleUpdatePasswordFormChange}
                  disabled={
                    authEmployeeState.loading ||
                    !authEmployeeState.data?.accessToken
                  }
                />
              </PasswordInputWrapper>
              {<Span $color={'#d15252'}>{promptMessage.originPassword}</Span>}
            </Flexbox>
            <Flexbox>
              <label>新密碼</label>
              <PasswordInputWrapper $height={'2.5rem'}>
                <PasswordInput
                  name='newPassword'
                  placeholder='輸入新的密碼'
                  autoComplete='current-password'
                  value={formInput.newPassword}
                  onChange={handleUpdatePasswordFormChange}
                  disabled={
                    authEmployeeState.loading ||
                    !authEmployeeState.data?.accessToken
                  }
                />
              </PasswordInputWrapper>
              {<Span $color={'#d15252'}>{promptMessage.newPassword}</Span>}
            </Flexbox>
            <Flexbox>
              <label>確認密碼</label>
              <PasswordInputWrapper $height={'2.5rem'}>
                <PasswordInput
                  name='checkedPassword'
                  placeholder='再次輸入密碼'
                  autoComplete='current-password'
                  value={formInput.checkedPassword}
                  onChange={handleUpdatePasswordFormChange}
                  disabled={
                    authEmployeeState.loading ||
                    !authEmployeeState.data?.accessToken
                  }
                />
              </PasswordInputWrapper>
              {<Span $color={'#d15252'}>{promptMessage.checkedPassword}</Span>}
            </Flexbox>
          </Flexbox>

          {!authEmployeeState.data?.accessToken &&
            !authEmployeeState.error &&
            !authEmployeeState.loading ? (
            <>
              <Span $color={'#5cc55f'}>✅密碼已更新，請重新登入</Span>
              <InputWrapper $height={'2.5rem'}>
                <Button
                  type='button'
                  onClick={() => {
                    navigator('/login');
                  }}
                  $bg={'#00719F'}
                >
                  回首頁
                </Button>
              </InputWrapper>
            </>
          ) : (
            <InputWrapper $height={'2.5rem'}>
              <Button
                type='submit'
                disabled={
                  authEmployeeState.loading ||
                  !authEmployeeState.data?.accessToken
                }
              >
                提交
              </Button>
            </InputWrapper>
          )}
        </Form>
        {/* <Span >{JSON.stringify(authEmployeeState.data, null, 2)}</Span> */}
      </Container>
      <Layout.Loading
        type={'spinningBubbles'}
        active={authEmployeeState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

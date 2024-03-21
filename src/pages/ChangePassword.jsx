import { PageLayout, } from '@/components';
import { useCurrentPage } from '../context/CurrentPageContext';
import styled from 'styled-components';
import { PasswordInput } from '@/components/common';
//取得資料+請求方法
import { useSelector, useDispatch } from 'react-redux';
import { AuthRequests, clearError } from '@/store/authEmployee';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 標題
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
    /* border: 1px solid red; */
    white-space: nowrap;
    min-width: 500px;
    margin: 0 auto;
  h2{
    text-align: center;
    margin-bottom:24px;
  }
  hr{
    margin:16px 0;
    width: 100%;
  }
  & div{
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
label{
  width: 20%;
}
  select,input {
    width: 100%;
    border: 1px solid #949494;
    padding: 5px;
    border-radius: 5px;
  }
  span{
    color: #949494;
    cursor: pointer;
    font-size: 0.8rem;
  }
`;
//表單
const FormField = styled.div`
display: flex;
justify-content: center;
width: ${props => (props.$width ? props.$width : '100')}%;
`
//按鈕
const Button = styled.button`
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  background-color: ${p => p.$bg ? p.$bg : '#5cc55f'};
  color: ${p => p.$color ? p.$color : '#fff'};
  cursor: pointer;
  &:disabled{
  background-color: #cccccc;
  color: #8d8d8d;
  }
`;
export const ChangePassword = () => {
  const navigator = useNavigate();
  const { setCurrentPage } = useCurrentPage();
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken
  //REDUX
  const dispatch = useDispatch();
  //當前對象

  //表單
  const [formInput, setformInput] = useState({
    originPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setCurrentPage('/employee/changePassword');
  }, []);

  useEffect(() => {
    if (authEmployeeState?.data?.message === "密碼已更新，請重新登入") {
      alert('密碼已更新，請重新登入');
      navigator('/login');
    }
  }, [authEmployeeState.data])

  //監聽修改
  const handleChange = e => {
    if (authEmployeeState.error) {
      dispatch(clearError());
    }
    const { name, value } = e.target;
    setformInput(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  //提交
  const handleSubmit = e => {
    e.preventDefault();
    dispatch(
      AuthRequests.updatePassword(
        TOKEN,
        authEmployeeState.data.employeeId,
        formInput,
      ),
    );
  };


  return (
    <PageLayout>
      <TitleContainer>
        {/* <h1>變更密碼</h1> */}
      </TitleContainer>
      <Form
        onSubmit={handleSubmit}
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2>變更密碼</h2>
        <FormField>
          <label>姓名員編</label>
          <input
            style={{ padding: 10, marginBottom: 20 }}
            name='employeeId'
            type='text'
            placeholder='員工編號'
            autoComplete='username'
            value={`${authEmployeeState.data.name} / ${authEmployeeState.data.employeeId}`}
            disabled
          />
        </FormField>
        <FormField>
          <label>舊密碼</label>
          <PasswordInput
            name='originPassword'
            placeholder='輸入原本的密碼'
            autoComplete='current-password'
            value={formInput.originPassword}
            onChange={handleChange}
          />
        </FormField>
        <FormField>
          <label>新密碼</label>

          <PasswordInput
            name='newPassword'
            placeholder='輸入新的密碼'
            autoComplete='current-password'
            value={formInput.newPassword}
            onChange={handleChange}
          />
        </FormField>
        <FormField>
          <label>確認密碼</label>
          <PasswordInput
            name='confirmPassword'
            placeholder='再次輸入密碼'
            autoComplete='current-password'
            value={formInput.confirmPassword}
            onChange={handleChange}
          />
        </FormField>
        {<span>{authEmployeeState.error?.message}</span>}
        <Button
          type='submit'
          disabled={authEmployeeState.loading}
          style={{ padding: 10, width: 100 }}
        >
          提交
        </Button>
      </Form>

    </PageLayout>

  );
};
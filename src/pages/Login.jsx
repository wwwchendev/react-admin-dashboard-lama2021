import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { AuthRequests, clearError } from '@/store/employee';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Login = () => {
  const [formInput, setformInput] = useState({
    employeeId: '',
    password: '',
  });
  const dispatch = useDispatch();
  const employeeState = useSelector(state => state.employee);

  const handleChange = e => {
    if (employeeState.error) {
      dispatch(clearError());
    }
    const { name, value } = e.target;
    setformInput(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleLogin = e => {
    e.preventDefault();
    dispatch(AuthRequests.login(formInput));
  };


  return (
    <>
      <Navbar />
      <Form
        onSubmit={handleLogin}
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1>後台管理系統</h1><br />
        <input
          style={{ padding: 10, marginBottom: 20 }}
          name='employeeId'
          type='text'
          placeholder='員工編號'
          onChange={handleChange}
        />
        <input
          style={{ padding: 10, marginBottom: 20 }}
          name='password'
          type='password'
          placeholder='密碼'
          onChange={handleChange}
        />
        {
          <span>{employeeState?.error?.message}</span>
        }
        <button
          type='submit'
          disabled={employeeState.loading}
          style={{ padding: 10, width: 100 }}
        >
          Login
        </button>
      </Form>
    </>
  );
};

export default Login;

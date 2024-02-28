import { PageLayout } from '@/components';
import styled from 'styled-components';
import { tablet } from '../responsive';
import { useNavigate } from 'react-router-dom';

// 布局
const Container = styled.div`
padding: 0 20px;
${tablet({ padding: '0px' })};
`;
// 標題
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  h1{
    font-size: 1.5rem;
  }
`;
const UserUpdateButton = styled.button`
  width: 80px;
  border: none;
  padding: 5px;
  background-color: teal;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: center;
  ${tablet({
  display: 'none'
})};
`;
const SaveWrapper = styled.div`
display: none;
  ${tablet({
  display: 'flex'
})};
${UserUpdateButton}{
  margin-top: 20px ;
  width: 100%;
  ${tablet({
  display: 'flex'
})};
}
`;

//表單
const formGap = '20px';
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: ${formGap};
`;
const Item = styled.div`
  width: calc(50% - ${formGap});
  display: flex;
  flex-direction: column;
  ${tablet({ width: '100%' })};
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(151, 150, 150);
`;
const Input = styled.input`
  height: 20px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
`;
const GenderLabel = styled.label`
  margin: 10px;
  font-size: 18px;
  color: #555;
`;
const Select = styled.select`
  height: 40px;
  border-radius: 5px;
`;

export const NewUser = () => {
  const navigate = useNavigate()
  return (
    <PageLayout>
      <Container>
        {/*標題*/}
        <TitleContainer>
          <h1>新增會員</h1>
          <UserUpdateButton
            onClick={() => {
              navigate('/user/1');
            }}>
            新增
          </UserUpdateButton>
        </TitleContainer>

        {/*表單*/}
        <Form>
          <Item>
            <Label>帳號</Label>
            <Input type="text" placeholder="john" />
          </Item>
          <Item>
            <Label>姓名</Label>
            <Input type="text" placeholder="John Smith" />
          </Item>
          <Item>
            <Label>Email</Label>
            <Input type="email" placeholder="john@gmail.com" />
          </Item>
          <Item>
            <Label>密碼</Label>
            <Input type="password" placeholder="password" />
          </Item>
          <Item>
            <Label>手機號碼</Label>
            <Input type="text" placeholder="+1 123 456 78" />
          </Item>
          <Item>
            <Label>地址</Label>
            <Input type="text" placeholder="New York | USA" />
          </Item>
          <Item>
            <Label>性別</Label>
            <div>
              <Input type="radio" name="gender" id="male" value="male" />
              <GenderLabel htmlFor="male">男性</GenderLabel>
              <Input type="radio" name="gender" id="female" value="female" />
              <GenderLabel htmlFor="female">女性</GenderLabel>
              <Input type="radio" name="gender" id="other" value="other" />
              <GenderLabel htmlFor="other">保留</GenderLabel>
            </div>
          </Item>
          <Item>
            <Label>是否願意收到電子信通知</Label>
            <Select name="mailNotification" id="mailNotification">
              <option value="yes">願意</option>
              <option value="no">不願意</option>
            </Select>
          </Item>
        </Form>

        {/*保存*/}
        <SaveWrapper >
          <UserUpdateButton
            onClick={() => {
              navigate('/user/1');
            }}
          >
            新增
          </UserUpdateButton>
        </SaveWrapper >
      </Container>
    </PageLayout>
  );
}
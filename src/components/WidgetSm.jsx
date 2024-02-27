import styled from 'styled-components';
import { Visibility } from '@material-ui/icons';
import { tablet } from '../responsive';

// 排版
const Container = styled.div`
  flex: 1;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  padding: 20px;
`;
const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  ${tablet({ gap: '15px' })}; 
`;
const Title = styled.span`
  font-size: 22px;
  font-weight: 600;
`;
const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
// 資料
const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0px;
`;
// 同仁照片
const Img = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
// 名字職稱
const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Username = styled.span`
  font-weight: 600;
`;
const UserTitle = styled.span`
  font-weight: 300;
`;
// 檢視按鈕
const Button = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 10px;
  padding: 7px 10px;
  background-color: #eeeef7;
  color: #555;
  cursor: pointer;
  & > span {
  ${tablet({ display: 'none' })};
  
  }
`;
const Icon = styled.span`
  font-size: 16px !important;
  margin-right: 5px;
  ${tablet({ margin: 0 })};  
`;


export const WidgetSm = () => {
  return (
    <Container>
      <Title>新進同仁</Title>
      <List>
        <ListItem>
          <Group>
            <Img
              src='https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=2&w=500'
              alt=''
            />
            <UserWrapper>
              <Username>安娜 李</Username>
              <UserTitle>資訊部 前端工程師</UserTitle>
            </UserWrapper>
          </Group>
          <Button>
            <Icon as={Visibility} />
            <span>顯示</span>
          </Button>
        </ListItem>
      </List>
    </Container>
  );
};

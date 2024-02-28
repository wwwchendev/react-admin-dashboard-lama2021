import styled from 'styled-components';
import { PageLayout } from '@/components';
import {
  CalendarToday,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from '@material-ui/icons';
import { tablet } from '../responsive';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCurrentPage } from '../context/CurrentPageContext';

// 布局
const Container = styled.div`
  padding: 0 20px;
  ${tablet({ padding: '0px' })};
`;
const FlexColumnGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;
const Icon = styled.span``;
// 標題
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  h1 {
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
    display: 'none',
  })};
`;
const InnerContainer = styled.div`
  display: flex;
  gap: 20px;
  ${tablet({ flexDirection: 'column' })};
`;

//左區塊
const UserInfo = styled.div`
  flex: 1;
  padding: 20px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;
const UserImgRound = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
// 李 安娜 - 於 2024/2/28 加入
const UserInfoBasic = styled.div`
  display: flex;
  align-items: center;
`;
const UserInfoName = styled.span`
  font-weight: 600;
`;
const UserInfoJoinDate = styled.span`
  font-size: 14px;
  margin-top: 5px;
  font-weight: 300;
`;
//帳戶資訊+聯絡方式
const UserInfoMore = styled.div`
  margin-top: 20px;
`;
const UserInfoTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;
const UserInfoDataWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  color: #444;
`;
const UserInfoDataText = styled.span`
  margin-left: 10px;
`;

//右區塊
const UserUpdate = styled.div`
  display: flex;
  flex: 3;
  padding: 20px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  gap: 20px;
  ${tablet({
    flexDirection: 'column-reverse',
  })};
`;

const UserUpdateForm = styled.form`
  flex: 2;
`;
const UserUpdateDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  width: 100%;
`;
const UserUpdateInput = styled.input`
  border: none;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid gray;
`;

const UserUpdatePhoto = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const UploadedUserImg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
`;

const UserUpdateIcon = styled(Publish)`
  cursor: pointer;
`;

const SaveWrapper = styled.div`
  display: none;
  ${tablet({
    display: 'flex',
  })};
  ${UserUpdateButton} {
    margin-top: 20px;
    width: 100%;
    ${tablet({
      display: 'flex',
    })};
  }
`;
export default function User() {
  const navigate = useNavigate();
  const { setCurrentPage } = useCurrentPage();
  useEffect(() => {
    setCurrentPage('/users');
  }, []);
  return (
    <PageLayout>
      <Container>
        {/*標題*/}
        <TitleContainer>
          <h1>編輯會員資料</h1>
          <UserUpdateButton
            onClick={() => {
              navigate('/users');
            }}
          >
            更新
          </UserUpdateButton>
        </TitleContainer>

        <InnerContainer>
          {/*左區塊*/}
          <UserInfo>
            <UserInfoBasic>
              <UserImgRound
                src='https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
                alt=''
              />
              <FlexColumnGroup>
                <UserInfoName>李 安娜</UserInfoName>
                <UserInfoJoinDate>於 2024/2/28 加入</UserInfoJoinDate>
              </FlexColumnGroup>
            </UserInfoBasic>

            <UserInfoMore>
              <UserInfoTitle>帳戶資訊</UserInfoTitle>
              <UserInfoDataWrapper>
                <Icon as={PermIdentity} />
                <UserInfoDataText>annabeck99</UserInfoDataText>
              </UserInfoDataWrapper>
              <UserInfoDataWrapper>
                <Icon as={CalendarToday} />
                <UserInfoDataText>1999/10/12</UserInfoDataText>
              </UserInfoDataWrapper>

              <UserInfoTitle>聯絡方式</UserInfoTitle>
              <UserInfoDataWrapper>
                <Icon as={PhoneAndroid} />
                <UserInfoDataText>+886 901 456 647</UserInfoDataText>
              </UserInfoDataWrapper>
              <UserInfoDataWrapper>
                <Icon as={MailOutline} />
                <UserInfoDataText>annabeck99@gmail.com</UserInfoDataText>
              </UserInfoDataWrapper>
            </UserInfoMore>
          </UserInfo>

          {/*右區塊*/}
          <UserUpdate>
            <UserUpdateForm>
              <UserUpdateDataWrapper>
                <label>帳號</label>
                <UserUpdateInput
                  type='text'
                  placeholder='annabeck99'
                  disabled
                />
              </UserUpdateDataWrapper>
              <UserUpdateDataWrapper>
                <label>姓名</label>
                <UserUpdateInput type='text' placeholder='李 安娜' />
              </UserUpdateDataWrapper>
              <UserUpdateDataWrapper>
                <label>Email</label>
                <UserUpdateInput
                  type='text'
                  placeholder='annabeck99@gmail.com'
                />
              </UserUpdateDataWrapper>
              <UserUpdateDataWrapper>
                <label>手機</label>
                <UserUpdateInput type='text' placeholder='+886 901 456 647' />
              </UserUpdateDataWrapper>
              <UserUpdateDataWrapper>
                <label>住址</label>
                <UserUpdateInput
                  type='text'
                  placeholder='10491 台北市中山區玉門街1號'
                />
              </UserUpdateDataWrapper>
            </UserUpdateForm>

            <UserUpdatePhoto>
              <UploadWrapper>
                <UploadedUserImg
                  src='https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
                  alt=''
                />
                <label htmlFor='file'>
                  <Icon as={UserUpdateIcon} /> 上傳照片
                </label>
                <input type='file' id='file' style={{ display: 'none' }} />
              </UploadWrapper>
            </UserUpdatePhoto>
          </UserUpdate>
        </InnerContainer>

        <SaveWrapper>
          <UserUpdateButton
            onClick={() => {
              navigate('/users');
            }}
          >
            更新
          </UserUpdateButton>
        </SaveWrapper>
      </Container>
    </PageLayout>
  );
}

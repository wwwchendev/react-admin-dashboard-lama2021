import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
import { PageLayout } from '@/components';
import { DeleteOutline } from '@material-ui/icons';
import { userRows } from '../dummyData';
import { tablet } from '../responsive';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCurrentPage } from '../context/CurrentPageContext';


const UserListContainer = styled.div`
  height: 100%;
`;

const UserListUser = styled.div`
  display: flex;
  align-items: center;
`;

const UserListImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const UserListEdit = styled.button`
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  background-color: #3bb077;
  color: white;
  cursor: pointer;
  margin-right: 20px;
`;

const UserListDelete = styled(DeleteOutline)`
  color: red;
  cursor: pointer;
`;
// 標題
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
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
  margin-left: auto;
`;

export default function Users() {
  const [data, setData] = useState(userRows);
  const navigate = useNavigate();
  const { setCurrentPage } = useCurrentPage();
  useEffect(() => {
    setCurrentPage('/users');
  }, [])

  const handleDelete = id => {
    setData(data.filter(item => item.id !== id));
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'user',
      headerName: '會員名稱',
      width: 200,
      renderCell: params => {
        return (
          <UserListUser>
            <UserListImg src={params.row.avatar} alt='' />
            {params.row.username}
          </UserListUser>
        );
      },
    },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'status',
      headerName: '狀態',
      width: 120,
    },
    {
      field: 'transaction',
      headerName: '累計消費',
      width: 160,
    },
    {
      field: 'action',
      headerName: '操作',
      width: 150,
      renderCell: params => {
        return (
          <>
            <Link to={'/user/' + params.row.id}>
              <UserListEdit>編輯</UserListEdit>
            </Link>
            <UserListDelete onClick={() => handleDelete(params.row.id)} />
          </>
        );
      },
    },
  ];

  return (
    <PageLayout>

      {/*標題*/}
      <TitleContainer>
        <h1>會員資料維護作業</h1>
        <UserUpdateButton
          onClick={() => {
            navigate('/newUser');
          }}>
          新增
        </UserUpdateButton>
      </TitleContainer>
      <UserListContainer>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
        />
      </UserListContainer>
    </PageLayout>
  );
}

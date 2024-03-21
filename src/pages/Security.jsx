import { PageLayout, } from '@/components';
import { useCurrentPage } from '../context/CurrentPageContext';
import { useEffect } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
//取得資料+請求方法
import { useSelector, useDispatch } from 'react-redux';
import { EmployeeRequests } from '@/store/employee';

// 標題
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 1.5rem;
  }
`;

const Button = styled.div`
  color: ${props => (props.$success ? '#5cc55f' : '#d15252')};
  padding: 5px 10px;
  border-radius: 5px;
`;

export const Security = () => {
  const { setCurrentPage } = useCurrentPage();
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken
  //REDUX
  const dispatch = useDispatch();
  const employeeState = useSelector(state => state.employee);

  useEffect(() => {
    setCurrentPage('/security');
    dispatch(EmployeeRequests.getRecords(TOKEN))
  }, []);

  const columns = [
    {
      field: 'no',
      headerName: '序號',
      width: 105,
    },
    {
      field: 'time',
      headerName: '日期時間',
      width: 200,
    },
    {
      field: 'isSuccess',
      headerName: '登入請求',
      width: 150,
      renderCell: params => {
        const isSuccess = params.row.isSuccess === '成功'
        return (
          <Button $success={isSuccess}>
            {isSuccess ? '完成' : '⛔拒絕'}
          </Button>
        );
      },
    },
    {
      field: 'name',
      headerName: '姓名',
      width: 130,
    },
    {
      field: 'employeeId',
      headerName: '員編',
      width: 120,
    },
    {
      field: 'department',
      headerName: '部門',
      width: 120,
    },
    {
      field: 'section',
      headerName: '單位',
      width: 120,
    },
    {
      field: 'permission',
      headerName: '權限',
      width: 130,
    }
  ];

  const rowsSrc = employeeState.loginRecords.data || []
  const rows = rowsSrc.map((record, index) => {
    const { _id, employeeId, position, name, role, success, loginTime } = record;
    return {
      no: index + 1,
      time: new Date(loginTime).toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
      }),
      name: name || 'N/A',
      employeeId: employeeId || 'N/A',
      department: position ? position.department : 'N/A',
      section: position ? position.section : 'N/A',
      permission: role || 'N/A',
      isSuccess: success ? '成功' : '失敗',
    };
  });

  return (
    <PageLayout>
      <TitleContainer>
        <h1>近期登入紀錄</h1>
      </TitleContainer>
      {/* {JSON.stringify(TOKEN)} */}
      {/* {JSON.stringify(employeeState.loginRecords.data)} */}
      {/* {JSON.stringify(authEmployeeState.data)} */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={row => row.no}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </PageLayout>

  );
};
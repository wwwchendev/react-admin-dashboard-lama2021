//react
import { useEffect } from 'react';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { employeeRequests } from '@/store/employee';
//components
import { DataGrid } from '@material-ui/data-grid';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import { TitleContainer, Button } from '@/components/common';

export const LoginHistory = () => {
  //Redux
  const dispatch = useDispatch();
  const employeeState = useSelector(state => state.employee);
  const { setCurrentPage } = useConfigs();
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;

  useEffect(() => {
    setCurrentPage('/loginHistory');
    dispatch(employeeRequests.getRecords(TOKEN));
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
        const isSuccess = params.row.isSuccess === '成功';
        return (
          <Button
            $bg={'transparent'}
            $color={isSuccess ? '#5cc55f' : '#d15252'}
          >
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
    },
  ];

  const rowsSrc = employeeState.loginRecords.data || [];
  const rows = rowsSrc.map((record, index) => {
    const { _id, employeeId, position, name, role, success, loginTime } =
      record;
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
    <Layout.PageLayout>
      <SEO title='近期登入紀錄 | 漾活管理後台' description={null} url={null} />
      <TitleContainer>
        <h1>近期登入紀錄</h1>
      </TitleContainer>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={row => row.no}
        checkboxSelection={false}
        disableSelectionOnClick
      />
      <Layout.Loading
        type={'spinningBubbles'}
        active={employeeState.loginRecords.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

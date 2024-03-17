import { PageLayout, } from '@/components';
import { useCurrentPage } from '../context/CurrentPageContext';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
//取得資料+請求方法
import { useSelector, useDispatch } from 'react-redux';
import { loginRecordRequests } from '@/store/loginRecord';

// 標題
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 1.5rem;
  }
`;

const Home = () => {
  const { setCurrentPage } = useCurrentPage();
  const dispatch = useDispatch();
  const employeeState = useSelector(state => state.employee);
  const loginRecordState = useSelector(state => state.loginRecord);

  useEffect(() => {
    setCurrentPage('/security');
    fetchData()
  }, []);

  const fetchData = async () => {
    await dispatch(loginRecordRequests.getAll())
  }

  const columns = [
    {
      field: 'no',
      headerName: '序號',
      width: 120,
    },
    {
      field: 'time',
      headerName: '日期時間',
      width: 200,
    },
    {
      field: 'name',
      headerName: '姓名',
      width: 150,
    },
    {
      field: 'position',
      headerName: '單位',
      width: 200,
    },
    {
      field: 'permission',
      headerName: '權限',
      width: 150,
    },
    {
      field: 'isSuccess',
      headerName: '成功失敗',
      width: 150,
    }
  ];


  const rows = loginRecordState.data.map((record, index) => {
    const { _id, employeeId, position, name, role, success, loginTime } = record;
    return {
      no: index + 1,
      time: new Date(loginTime).toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
      }),
      name: name ? `${name} (${employeeId || ''})` : 'N/A',
      position: position
        ? `${position.department} ${position.section || ''}`
        : 'N/A',
      permission: role || 'N/A',
      isSuccess: success ? '成功' : '失敗',
    };
  });

  return (
    <PageLayout>
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
    </PageLayout>
  );
};

export default Home;

import styled from 'styled-components';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Visibility } from '@material-ui/icons';
import { tablet } from '@/utils/responsive';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
//utility
import { convertIsoToTaipeiTime, numberWithCommas } from '@/utils/format';
import customAxios from '@/utils/axios/customAxios';
// 排版
const Container = styled.div`
  flex: 3;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  padding: 20px;
  white-space: nowrap;
  ${tablet({ maxWidth: '100%' })};
`;
const Title = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;
// 表格
const TableWrapper = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
th{
  &:first-child{    
    text-align: left;
    text-indent:0.75rem
  }
  text-align: center;
}
  td{
    padding:0.5rem 0.8rem;      
    text-align: center;
    &:first-child{
      text-align: left;
    }
  }
`;
const StatTr = styled.tr`
border-top: 1px solid #999;
`

const WidgetLogistic = () => {
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //狀態
  const [stats, setStats] = useState({
    currentMonth: {
      "待出貨": 0,
      "已出貨": 0,
      "待取貨": 0,
      "已取貨": 0,
      "已完成": 0,
      "已取消": 0,
      "申請退貨": 0,
      "待退貨": 0,
      "已退貨": 0,
      "退貨異常": 0,
      "總計": 0
    },
    lastMonth: {
      "待出貨": 0,
      "已出貨": 0,
      "待取貨": 0,
      "已取貨": 0,
      "已完成": 0,
      "已取消": 0,
      "申請退貨": 0,
      "待退貨": 0,
      "已退貨": 0,
      "退貨異常": 0,
      "總計": 0
    },
  });

  //useEffect
  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await customAxios.get(
          `${import.meta.env.VITE_APIURL}/logistic/status`,
          { headers: { Authorization: `Bearer ${TOKEN}` } },
        );
        setStats(res.data.data);
      } catch (error) {
        // console.log(error.response);
      }
    };
    getStats();
  }, []);

  const thisMonth = `${new Date().getMonth() + 1}月`;
  const lastMonth = `${new Date().getMonth()}月`;

  return (
    <Container>
      <Title>
        <Link to={`/logistic`} style={{ textDecoration: 'none' }}>
          出貨紀錄
        </Link>
      </Title>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>處理狀態</th>
              <th>{lastMonth}</th>
              <th>{thisMonth}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>🕥待出貨</td>
              <td>{stats.lastMonth['待出貨']}</td>
              <td>{stats.currentMonth['待出貨']}</td>
            </tr>
            <tr>
              <td>已出貨待取貨 </td>
              <td>{stats.lastMonth['已出貨'] + stats.lastMonth['待取貨']}</td>
              <td>{stats.currentMonth['已出貨'] + stats.currentMonth['待取貨']}</td>
            </tr>
            <tr>
              <td>已取貨</td>
              <td>{stats.lastMonth['已取貨']}</td>
              <td>{stats.currentMonth['已取貨']}</td>
            </tr>
            <tr>
              <td>已完成</td>
              <td>{stats.lastMonth['已完成']}</td>
              <td>{stats.currentMonth['已完成']}</td>
            </tr>
            <tr>
              <td>已取消+已退貨</td>
              <td>{stats.lastMonth['已取消'] + stats.lastMonth['已退貨']}</td>
              <td>{stats.currentMonth['已取消'] + stats.currentMonth['已退貨']}</td>
            </tr>
            <tr>
              <td>退貨處理中</td>
              <td>{stats.lastMonth['申請退貨'] + stats.lastMonth['待退貨']}</td>
              <td>{stats.currentMonth['申請退貨'] + stats.currentMonth['待退貨']}</td>
            </tr>
            <tr>
              <td>退貨異常</td>
              <td>{stats.lastMonth['退貨異常']}</td>
              <td>{stats.currentMonth['退貨異常']}</td>
            </tr>
            <StatTr>
              <td>當月統計</td>
              <td>{stats.lastMonth['總計']}</td>
              <td>{stats.currentMonth['總計']}</td>
            </StatTr>
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};
export default WidgetLogistic;

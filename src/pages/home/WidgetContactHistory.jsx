import styled from 'styled-components';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Visibility } from '@material-ui/icons';
import { tablet } from '@/utils/responsive';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
//utility
import customAxios from '@/utils/axios/customAxios';
import { Comment } from '@material-ui/icons';

// 排版
const Container = styled.div`
  max-width: 65%;
  position: relative;
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
  border-collapse: collapse;
  width: 100%;
  th{
  &:first-child{    
    text-align: left;
    text-indent:0.75rem
  }
  text-align: center;
}
  td {
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

const IconWrapper = styled.div`
  margin-right: 5px;
  color: rgba(134, 192, 226, 0.2);
  z-index: -1;
  position: absolute;
  right: 1rem;
  bottom: 0.75rem;
 width: 150px;
  svg{
width: 100%;
height: 100%;
  }

`;
const WidgetContactHistory = () => {
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //狀態
  const [stats, setStats] = useState({
    currentMonth: {
      '總計': 0,
      '待處理': 0,
      '處理中': 0,
      '已結案': 0,
      '已註銷': 0,
    },
    lastMonth: {
      '總計': 0,
      '待處理': 0,
      '處理中': 0,
      '已結案': 0,
      '已註銷': 0,
    },
  });

  //useEffect
  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await customAxios.get(
          `${import.meta.env.VITE_APIURL}/contactHistory/status`,
          { headers: { Authorization: `Bearer ${TOKEN}` } },
        );
        setStats(res.data.data);
      } catch (error) {
        // console.log(error);
      }
    };
    getStats();
  }, []);

  const thisMonth = `${new Date().getMonth() + 1}月`;
  const lastMonth = `${new Date().getMonth()}月`;
  return (
    <Container>
      <Title>
        <Link to={`/contactHistory`} style={{ textDecoration: 'none' }}>
          客服紀錄
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
              <td>🕥待處理</td>
              <td>{stats.lastMonth['待處理']}</td>
              <td>{stats.currentMonth['待處理']}</td>
            </tr>
            <tr>
              <td>處理中</td>
              <td>{stats.lastMonth['處理中']}</td>
              <td>{stats.currentMonth['處理中']}</td>
            </tr>
            <tr>
              <td>已結案</td>
              <td>{stats.lastMonth['已結案']}</td>
              <td>{stats.currentMonth['已結案']}</td>
            </tr>
            <tr>
              <td>已註銷</td>
              <td>{stats.lastMonth['已註銷']}</td>
              <td>{stats.currentMonth['已註銷']}</td>
            </tr>
            <StatTr>
              <td>當月統計</td>
              <td>{stats.lastMonth['總計']}</td>
              <td>{stats.currentMonth['總計']}</td>
            </StatTr>
          </tbody>
        </Table>
      </TableWrapper>
      <IconWrapper>
        <Comment />
      </IconWrapper>
    </Container>
  );
};
export default WidgetContactHistory;

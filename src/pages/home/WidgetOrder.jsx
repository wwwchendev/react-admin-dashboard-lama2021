//react
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//redux
import { useSelector, useDispatch } from 'react-redux';
//components
import styled from 'styled-components';
//utility
import { tablet } from '@/utils/responsive';
import { convertIsoToTaipeiTime, numberWithCommas } from '@/utils/format';
import customAxios from '@/utils/axios/customAxios';
// 排版
const Container = styled.div`
  max-width: 65%;
  flex: 3;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  padding: 20px;
  white-space: nowrap;
  ${tablet({ maxWidth: '100%' })};
`;
const Title = styled.h3`
  font-size: 22px;
  font-weight: 600;
`;
// 表格
const TableWrapper = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;
const Table = styled.table`
  border-spacing: 0.5rem 0.8rem;
  width: 100%;
  tr {
    text-align: center;
  }
  td {
    text-align: left;
  }
`;
const UserTd = styled.td`
  display: flex;
  align-items: center;
  justify-content: start;
  height: 100%;
  width: 100%;
  font-weight: 600;
`;
const Price = styled.td`
  display: flex;
  align-items: center;
  justify-content: center;
text-align: center;
`;


const WidgetOrder = () => {
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  //表單提示
  //狀態管理
  const [orders, setOrders] = useState([]);

  //effect
  useEffect(() => {
    const fetchData = async () => {
      const res = await customAxios.get(
        `${import.meta.env.VITE_APIURL}/order/all?limit=8`,
        { headers: { Authorization: `Bearer ${TOKEN}` } },
      );
      setOrders(res.data.data);
    };
    fetchData();


  }, []);

  return (
    <Container>
      <Title>
        <Link to={`/order`} style={{ textDecoration: 'none' }}>
          最新訂單
        </Link>
      </Title>
      <TableWrapper>
        <Table>
          <tbody>
            <tr>
              <th>訂單狀態</th>
              <th>訂單編號</th>
              <th>顧客名稱</th>
              <th>訂購時間</th>
              <th>訂單金額</th>
            </tr>
            {orders &&
              orders?.map(order => {
                // console.log(order);
                return (
                  <tr key={order._id}>
                    <td>{order.status}</td>
                    <td>
                      <Link to={`/order/${order.orderNumber}`}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <UserTd>
                      <p>
                        {order.userInfo.lastName}
                        {order.userInfo.firstName}
                      </p>
                    </UserTd>
                    <td>{convertIsoToTaipeiTime(new Date(order.createdAt))}</td>
                    <Price>{numberWithCommas(order.total)}</Price>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default WidgetOrder;

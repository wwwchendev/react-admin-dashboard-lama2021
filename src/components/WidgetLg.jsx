import styled, { css } from 'styled-components';
import { tablet } from '../responsive';

// 排版
const Container = styled.div`
max-width: 65%;
  flex: 2;
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
  border-spacing:0.5rem 0.8rem;
  width: 100%;
  tr, td{
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
const Img = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  ${tablet({ display: 'none' })};
`;

//按鈕-根據傳入參數改變樣式
const ORDER_STATES = {
  ORDER_PLACED: '訂單成立',
  ORDER_CANCELLED: '訂單取消',
  PROCESSING: '處理中',
};
const stateStyles = ({ $state }) => {
  switch ($state) {
    case ORDER_STATES.ORDER_PLACED:
      return css`
        background-color: #e5faf2;
        color: #3bb077;
      `;
    case ORDER_STATES.ORDER_CANCELLED:
      return css`
        background-color: #fff0f1;
        color: #d95087;
      `;
    case ORDER_STATES.PROCESSING:
      return css`
        background-color: #ebf1fe;
        color: #2a7ade;
      `;
    default:
      return null;
  }
};
const Button = styled.button`
  padding: 5px 7px;
  border: none;
  border-radius: 10px;
  ${stateStyles}
`;

export const WidgetLg = () => {
  return (
    <Container>
      <Title>最新訂單</Title>
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
            <tr>
              <td>
                <Button $state={ORDER_STATES.ORDER_PLACED}>訂單成立</Button>
              </td>
              <td>202402270448</td>
              <UserTd>
                <Img
                  src='https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
                  alt=''
                />
                <p>卡蘿 蘇</p>
              </UserTd>
              <td>2021/1/5 10:35:11</td>
              <td>$122</td>
            </tr>
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

/* eslint-disable react/prop-types */
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ChartContainer = styled.div`
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  padding: 20px;
`;
const Title = styled.div`
display: flex;
align-items: flex-end;
margin: 10px 0;
gap: 0.5rem;

h3{
  font-size: 22px;
  font-weight: 600;
  color: #00008b;
}
  p{
    color: #9b9b9b;    
  }
`;
export const Chart = ({ title, data, dataKey, grid }) => {
  return (
    <ChartContainer>
      <Title>
        <h3>{title}</h3>
        <p>歷月已完成訂單業績統計</p>
      </Title>
      <ResponsiveContainer width='100%' aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey='name' stroke='#5550bd' />
          <Line type='monotone' dataKey={dataKey} stroke='#5550bd' />
          <Tooltip />
          {grid && <CartesianGrid stroke='#e0dfdf' strokeDasharray='5 5' />}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default Chart;

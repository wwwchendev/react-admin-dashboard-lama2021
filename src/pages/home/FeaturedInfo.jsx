import styled from 'styled-components';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
// import axios from '@/utils/axios';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Item = styled.div`
  flex: 1;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const Title = styled.span`
  font-size: 20px;
`;

const Group = styled.div`
  margin: 10px 0px;
  display: flex;
  align-items: center;
`;

const Money = styled.span`
  font-size: 30px;
  font-weight: 600;
`;

const MoneyRate = styled.span`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const Icon = styled.div`
  font-size: 14px;
  margin-left: 5px;
  color: ${props => (props.$negative ? 'red' : 'green')};
`;

const SubText = styled.span`
  font-size: 15px;
  color: gray;
`;

const FeaturedInfo = () => {
  const [income, setIncome] = useState([]);
  const [perc, setPerc] = useState(0);

  //TOKEN
  const dispatch = useDispatch();
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;

  useEffect(() => {

    const getIncome = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APIURL}/orders/income`,
          { headers: { Authorization: `Bearer ${TOKEN}` } },
        );

        const data = res.data.result.sort((a, b) => a._id - b._id);
        setIncome(data);
        setPerc(((data[1].total - data[0].total) / data[0].total) * 100);
      } catch (error) {
        console.log(error);
      }
    };
    getIncome();
  }, []);

  return (
    <>
      <Container>
        <Item>
          <Title>收入</Title>
          <Group>
            <Money>${income[1]?.total}</Money>
            <MoneyRate>
              {perc.toFixed(1)} %
              {perc < 0 ? (
                <Icon $negative={true}>
                  <ArrowDownward />
                </Icon>
              ) : (
                <Icon $negative={false}>
                  <ArrowUpward />
                </Icon>
              )}
            </MoneyRate>
          </Group>
          <SubText>與上月相比</SubText>
        </Item>
        <Item>
          <Title>銷售量</Title>
          <Group>
            <Money>$4,415</Money>
            <MoneyRate>
              {perc.toFixed(1)} %
              <Icon $negative={true}>
                <ArrowDownward />
              </Icon>
            </MoneyRate>
          </Group>
          <SubText>與上月相比</SubText>
        </Item>
        <Item>
          <Title>成本</Title>
          <Group>
            <Money>$2,225</Money>
            <MoneyRate>
              +2.4
              <Icon $negative={false}>
                <ArrowUpward />
              </Icon>
            </MoneyRate>
          </Group>
          <SubText>與上月相比</SubText>
        </Item>
      </Container>
      {/* <pre>{JSON.stringify(income, null, 2)}</pre>
      <pre>{JSON.stringify(perc, null, 2)}</pre> */}
    </>
  );
};
export default FeaturedInfo;

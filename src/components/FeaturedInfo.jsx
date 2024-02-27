import styled from 'styled-components';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { tablet } from '../responsive';

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

export const FeaturedInfo = () => {
  return (
    <Container>
      <Item>
        <Title>收入</Title>
        <Group>
          <Money>$2,415</Money>
          <MoneyRate>
            -11.4
            <Icon $negative={true}>
              <ArrowDownward />
            </Icon>
          </MoneyRate>
        </Group>
        <SubText>與上月相比</SubText>
      </Item>
      <Item>
        <Title>銷售量</Title>
        <Group>
          <Money>$4,415</Money>
          <MoneyRate>
            -1.4
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
  );
};

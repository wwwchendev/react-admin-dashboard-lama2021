import {
  PageLayout,
  FeaturedInfo,
  Chart,
  WidgetSm,
  WidgetLg,
} from '@/components';
import { userData } from '../dummyData';
import styled from 'styled-components';
import { tablet } from '../responsive';
import { useCurrentPage } from '../context/CurrentPageContext';
import { useEffect } from 'react';

const Wrapper = styled.div`
  gap: inherit;
  display: flex;
  ${tablet({ flexDirection: 'column' })};
`;
const ChartContainer = styled.div`
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;
const Home = () => {
  const { setCurrentPage } = useCurrentPage();
  useEffect(() => {
    setCurrentPage('/');
  }, []);
  return (
    <PageLayout>
      <FeaturedInfo />
      <ChartContainer>
        <Chart data={userData} title='用戶分析' grid dataKey='活躍用戶' />
      </ChartContainer>
      <Wrapper>
        <WidgetSm />
        <WidgetLg />
      </Wrapper>
    </PageLayout>
  );
};

export default Home;

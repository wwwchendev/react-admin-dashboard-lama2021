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
const Home = () => {
  const { setCurrentPage } = useCurrentPage();
  useEffect(() => {
    setCurrentPage('/');
  }, [])
  return (
    <PageLayout>
      <FeaturedInfo />
      <Chart data={userData} title='用戶分析' grid dataKey='活躍用戶' />
      <Wrapper>
        <WidgetSm />
        <WidgetLg />
      </Wrapper>
    </PageLayout>
  );
};

export default Home;

import { PageLayout, FeaturedInfo, Chart } from '@/components';
import { userData } from '../dummyData';

const Home = () => {
  return (
    <PageLayout>
      <FeaturedInfo />
      <Chart data={userData} title='用戶分析' grid dataKey='活躍用戶' />
    </PageLayout>
  );
};

export default Home;

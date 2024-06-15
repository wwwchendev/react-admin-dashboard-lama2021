//react
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { AuthRequests } from '@/store/authEmployee';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import { ArrowRight } from '@material-ui/icons';
import Chart from './Chart';
import FeaturedInfo from './FeaturedInfo';
import WidgetContactHistory from './WidgetContactHistory';
import WidgetOrder from './WidgetOrder';
import WidgetLogistic from './WidgetLogistic';
//utility
import { tablet } from '@/utils/responsive';
import customAxios from '@/utils/axios/customAxios';

const Wrapper = styled.div`
  gap: inherit;
  display: flex;
  ${tablet({ flexDirection: 'column' })};
`;

export const Home = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const contactHistoryState = useSelector(state => state.contactHistory);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;

  //useEffect
  useEffect(() => {
    setCurrentPage('/contactHistory');
  }, []);

  //chart
  const [orderStats, setOrderStats] = useState([]);
  const MONTHS = useMemo(
    () => [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月',
    ],
    [],
  );

  //effect
  useEffect(() => {
    setCurrentPage('/');
    const getStats = async () => {
      try {
        const res = await customAxios.get(
          `${import.meta.env.VITE_APIURL}/order/status`,
          { headers: { Authorization: `Bearer ${TOKEN}` } },
        );

        res.data.data.map(item =>
          setOrderStats(prev => [
            ...prev,
            { name: MONTHS[item._id - 1], '銷售額': item.totalAmount },
          ]),
        );
      } catch (error) {
        // console.log(error);
      }
    };
    getStats();
  }, [MONTHS]);

  return (
    <Layout.PageLayout>
      <SEO title='首頁 | 漾活管理後台' description={null} url={null} />
      {/* <FeaturedInfo /> */}
      <Chart data={orderStats} title='業績分析' grid dataKey='銷售額' />
      <Wrapper>
        <WidgetOrder />
        <WidgetLogistic />
        <WidgetContactHistory />
      </Wrapper>

      <Layout.Loading
        type={'spinningBubbles'}
        active={contactHistoryState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

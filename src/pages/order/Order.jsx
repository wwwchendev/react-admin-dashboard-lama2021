//react
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { orderRequests, clearOrderError } from '@/store/order';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Form,
  TitleContainer,
  Button,
  Flexbox,
  Span,
  Text,
} from '@/components/common';
import { DataGrid } from '@material-ui/data-grid';

//utils
import { numberWithCommas } from '../../utils/format';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const Order = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const orderState = useSelector(state => state.order);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  //表單提示
  //狀態管理

  //effect
  useEffect(() => {
    setCurrentPage('/order');
    dispatch(orderRequests.getAll(TOKEN));
  }, []);

  //data-grid
  const columns = [
    {
      field: 'orderNumber',
      headerName: '序號',
      width: 130,
      renderCell: params => {
        return (
          <Link
            onClick={e => {
              e.preventDefault();
              navigator(`/order/${params.row.orderNumber}`);
            }}
          >
            {params.row.orderNumber}
          </Link>
        );
      },
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 130,
      renderCell: params => {
        const getStatus = () => {
          if (params.row.status === '已成立') {
            return {
              text: '⏰已成立',
              color: '#d15252',
            };
          } else if (params.row.status === '已出貨') {
            return {
              text: '已出貨',
              color: '#000',
            };
          } else if (params.row.status === '已送達') {
            return {
              text: '已送達',
              color: '#000',
            };
          } else if (params.row.status === '已完成') {
            return {
              text: '✅已完成',
              color: '#5cc55f',
            };
          } else if (params.row.status === '已取消') {
            return {
              text: '已取消',
              color: '#a5a5a5',
            };
          } else {
            return {
              text: params.row.status,
              color: '#050505',
            };
          }
        };
        const _status = getStatus();
        return <Text $color={_status?.color}>{_status?.text}</Text>;
      },
    },
    {
      field: 'paymentType',
      headerName: '付款方式',
      width: 130,
      renderCell: params => {
        return params.row.payment?.type;
      },
    },
    {
      field: 'paymentStatus',
      headerName: '付款狀態',
      width: 130,
      renderCell: params => {
        return params.row.payment?.status;
      },
    },
    {
      field: 'createdInfo',
      headerName: '下單日期',
      width: 150,
    },
    {
      field: 'user',
      headerName: '買家',
      width: 150,
      renderCell: params => {
        return (
          <>
            {`${params.row.username} ${params.row.userInfo?.lastName}${params.row.userInfo?.firstName}`}
          </>
        );
      },
    },
    {
      field: 'totalCount',
      headerName: '數量',
      width: 105,
    },
    {
      field: 'totalAmount',
      headerName: '合計',
      width: 105,
      renderCell: params => {
        return numberWithCommas(params.row.totalAmount);
      },
    },
    {
      field: 'shippingFee',
      headerName: '運費',
      width: 105,
      renderCell: params => {
        const fee = params.row.logistic.fee - params.row.shippingDiscount;
        return numberWithCommas(fee);
      },
    },
    {
      field: 'total',
      headerName: '總計',
      width: 105,
      renderCell: params => {
        return numberWithCommas(params.row.total);
      },
    },
  ];
  let globalIndex = 1;
  const rowsSrc = orderState?.data || [];
  const rows = rowsSrc.map(item => {
    const getLocaleTime = _time =>
      new Date(_time).toLocaleString(
        {},
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      );
    const totalAmount = item.products?.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const totalCount = item.products?.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ); //計算件數總和

    return {
      ...item,
      no: globalIndex++,
      createdInfo: `${getLocaleTime(item.createdAt)} `,
      totalCount,
      totalAmount,
    };
  });

  return (
    <Layout.PageLayout>
      <SEO title='訂單管理 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>訂單管理</h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                navigator('/order/create');
              }}
              $bg={'#3488f5'}
              $color={'#fff'}
              $animation
            >
              新增
            </Button>
          </Flexbox>
        </TitleContainer>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={row => row._id}
          checkboxSelection={false}
          disableSelectionOnClick
        />
        {/* <Span>
          <pre>{JSON.stringify(orderState?.data[0], null, 2)}</pre>
        </Span> */}
      </Container>

      <Layout.Loading
        type={'spinningBubbles'}
        active={orderState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

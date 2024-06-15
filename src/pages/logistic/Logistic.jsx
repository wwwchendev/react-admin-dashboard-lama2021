//react
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { logisticRequests, clearLogisticError } from '@/store/logistic';
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
import { Edit, Delete } from '@material-ui/icons';
//utility
import {
  getDateString,
  getTimeString,
  convertIsoToTaipeiTime,
  convertIsoToTaipei,
} from '@/utils/format';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const Logistic = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const logisticState = useSelector(state => state.logistic);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialAddForm = {};
  const [addFormData, setAddFormData] = useState(initialAddForm);
  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [submitClicked, setSubmitClicked] = useState(false);

  //effect
  useEffect(() => {
    setCurrentPage('/logistic');
    dispatch(logisticRequests.getAll(TOKEN));
  }, []);

  //data-grid
  const columns = [
    {
      field: 'logisticNumber',
      headerName: '出貨編號',
      width: 140,
      renderCell: params => {
        return (
          <Link
            onClick={() => {
              navigator(`/logistic/${params.row.logisticNumber}`);
            }}
          >
            {params.row.logisticNumber}
          </Link>
        );
      },
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 120,
      renderCell: params => {
        const getStatus = () => {
          if (params.row.status === '待出貨') {
            return {
              text: '⏰待出貨',
              color: '#d15252',
            };
          } else if (params.row.status === '已完成') {
            return {
              text: '✅已完成',
              color: '#5cc55f',
            };
          } else if (
            params.row.status === '已取消' ||
            params.row.status === '已退貨'
          ) {
            return {
              text: params.row.status,
              color: '#a5a5a5',
            };
          } else if (
            params.row.status === '已出貨' ||
            params.row.status === '待取貨' ||
            params.row.status === '待退貨' ||
            params.row.status === '申請退貨'
          ) {
            return {
              text: `🕥${params.row.status}`,
              color: '#000000',
            };
          } else if (params.row.status === '退貨異常') {
            return {
              text: params.row.status,
              color: '#d15252',
            };
          } else {
            return {
              text: params.row.status,
              color: '#000000',
            };
          }
        };
        const _status = getStatus();
        return <Text $color={_status?.color}>{_status?.text}</Text>;
      },
    },
    {
      field: 'option',
      headerName: '物流選項',
      width: 140,
    },
    {
      field: 'username',
      headerName: '用戶',
      width: 140,
      renderCell: params => params.row.order.username,
    },
    {
      field: 'counts ',
      headerName: '件數',
      width: 105,
      renderCell: params => {
        const products = params.row.order.products;
        const counts = products?.reduce((sum, item) => sum + item.quantity, 0);
        return `${counts}`;
      },
    },
    {
      field: 'memo',
      headerName: '備註',
      width: 155,
    },
    {
      field: 'creating',
      headerName: '訂單已確認',
      width: 170,
      renderCell: params => {
        const event = params.row.logisticHistory.find(
          item => item.actionType === '揀貨',
        );
        if (!event) {
          return;
        }
        // console.log(event);
        return convertIsoToTaipeiTime(new Date(event?.time));
      },
    },
    {
      field: 'logisticsInfo',
      headerName: '物流廠商',
      width: 195,
      renderCell: params => {
        if (!params.row.deliveryCompany?.receiptNumber) {
          return params.row.deliveryCompany?.companyName;
        }
        return `${params.row.deliveryCompany?.companyName} (${params.row.deliveryCompany?.receiptNumber})`;
      },
    },

  ];
  let globalIndex = 1;
  const rowsSrc = logisticState?.data || [];
  const rows = rowsSrc.map(item => {
    return {
      ...item,
      no: globalIndex++,
    };
  });

  return (
    <Layout.PageLayout>
      <SEO title='出貨紀錄 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>出貨紀錄</h1>
        </TitleContainer>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={row => row.no}
          checkboxSelection={false}
          disableSelectionOnClick
        />

        {/* <pre><Span>{JSON.stringify(logisticState?.data[0], null, 2)}</Span></pre> */}
      </Container>
      <Layout.Loading
        type={'spinningBubbles'}
        active={logisticState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

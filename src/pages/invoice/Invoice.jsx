//react
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { newsRequests, clearNewsError } from '@/store/news';
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const Invoice = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const newsState = useSelector(state => state.news);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  //表單提示
  //狀態管理

  //effect
  useEffect(() => {
    setCurrentPage('/invoice');
    dispatch(newsRequests.getAll());
  }, []);

  //data-grid
  const columns = [
    {
      field: 'no',
      headerName: '序號',
      width: 105,
    },
    {
      field: 'title',
      headerName: '標題',
      width: 200,
    },
    {
      field: 'description',
      headerName: '描述',
      width: 240,
    },
    {
      field: 'createdInfo',
      headerName: '建立資訊',
      width: 200,
    },
    {
      field: 'lastEditedInfo',
      headerName: '最後更新',
      width: 200,
    },
    {
      field: 'display',
      headerName: '顯示',
      width: 105,
      renderCell: params => {
        return params.row.display === true ? '顯示' : '隱藏';
      },
    },
    {
      field: 'action',
      headerName: ' ',
      width: 100,
      renderCell: params => {
        return (
          <Button
            type={'button'}
            $width={'2rem'}
            $color={'#333'}
            $bg={'transparent'}
            onClick={() => {
              navigator(`/news/edit/${params.row.newsNumber}`);
            }}
          >
            <Edit /> 編輯
          </Button>
        );
      },
    },
  ];
  let globalIndex = 1;
  const rowsSrc = newsState.data || [];
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
    return {
      ...item,
      no: globalIndex++,
      createdInfo: `${getLocaleTime(item.createdAt)} ${item.createrName}`,
      lastEditedInfo: `${getLocaleTime(item.updatedAt)} ${item.lastEditerName}`,
    };
  });

  return (
    <Layout.PageLayout>
      <SEO title='發票管理 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>發票管理</h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                // showAddJobSectionModalElement(true)
                navigator('/news/create');
              }}
              $bg={'#3488f5'}
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
          getRowId={row => row.no}
          checkboxSelection={false}
          disableSelectionOnClick
        />
        {/* <pre>{JSON.stringify(newsState.data, null, 2)}</pre> */}
      </Container>
    </Layout.PageLayout>
  );
};

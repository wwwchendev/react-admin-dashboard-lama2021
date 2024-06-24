//react
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { productRequests } from '@/store/product';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Flexbox,
  TitleContainer,
  Button,
} from '@/components/common';

import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline, Edit, Delete } from '@material-ui/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const Product = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const productState = useSelector(state => state.product);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  //表單提示
  //狀態管理

  //effect
  useEffect(() => {
    setCurrentPage('/product');
    // 請求保存產品資料
    dispatch(productRequests.getAll(TOKEN));
  }, []);

  //data-grid
  const columns = [
    {
      field: 'productNumber',
      headerName: '商品編號',
      width: 120,
    },
    {
      field: 'productName',
      headerName: '商品名稱',
      width: 400,
      renderCell: params => {
        return (
          <>
            <Flexbox $justifyContent={'space-between'} $gap={'1rem'}>
              {params.row.productName} {params.row.specificationName}
              <img
                src={`${import.meta.env.VITE_APIURL}/file${params.row.specificationImage}`}
                alt=''
                style={{ width: '45px', height: '45px', objectFit: 'cover' }}
              />
            </Flexbox>
          </>
        );
      },
    },
    {
      field: 'productCategory',
      headerName: '商品分類',
      width: 140,
      renderCell: params => {
        return (
          <>
            {params.row.productCategories.categoryName} \{' '}
            {params.row.productCategories.subCategoryName}
          </>
        );
      },
    },
    {
      field: 'price',
      headerName: '價格',
      width: 110,
    },
    {
      field: 'specificationSize',
      headerName: '尺寸庫存',
      width: 240,
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
              navigator(`/product/edit/${params.row.productNumber}`);
            }}
          >
            <Edit /> 編輯
          </Button>
        );
      },
    },
  ];
  let globalIndex = 1;
  const rowsSrc = productState.data || [];
  const rows = rowsSrc.flatMap(item => {
    const productCategory = item.productCategories.find(
      category => category.categoryType === '依類別',
    );
    const { variants, ...productInfo } = item;
    const structurRows = variants.map(variant => {
      return {
        ...productInfo,
        productCategories: productCategory,
        price: variant.price,
        specificationName: variant.item,
        specificationImage: variant.image,
        specificationSize: variant.specification.map(
          item => ` ${item.name}(${item.stock}) `,
        ),
        no: globalIndex++,
      };
    });
    // console.log(structurRows);
    return structurRows;
  });

  return (
    <Layout.PageLayout>
      <SEO title='商品維護 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>商品維護</h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                // showAddJobSectionModalElement(true)
                navigator('/product/create');
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
          disableSelectionOnClick
        />

        {/* <Span><pre>{JSON.stringify(rows[0].variants, null, 2)}</pre></Span> */}
        {/* <Span><pre>{JSON.stringify(rows, null, 2)}</pre></Span> */}
        {/* <Span><pre>{JSON.stringify(productState.data, null, 2)}</pre></Span> */}
      </Container>
      <Layout.Loading
        type={'spinningBubbles'}
        active={productState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

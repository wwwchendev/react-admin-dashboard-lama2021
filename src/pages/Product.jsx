import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCurrentPage } from '@/context/CurrentPageContext';
import { PageLayout, Chart } from '@/components';
import { Publish } from '@material-ui/icons';
import { tablet } from '../responsive';
import { productData } from '@/dummyData';
import { useNavigate } from 'react-router-dom';

// 布局
const Container = styled.div`
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${tablet({ padding: '0px' })};
`;
const FlexGroup = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  max-width: 100%;
  flex-direction: ${p => (p.$direction === 'column' ? 'column' : 'row')};
  align-items: ${p => (p.$alignItems ? p.$alignItems : 'center')};
  justify-content: ${p => (p.$justifyContent ? p.$justifyContent : '')};
  padding: ${p => (p.$padding ? p.$padding : '')};
  gap: ${p => (p.$gap ? p.$gap : '')};
  border: ${p => (p.$showborder ? '2px solid red' : '')};
  flex: ${p => (p.$flex ? p.$flex : '')};
  flex-wrap: ${p => (p.$wrap ? p.$wrap : '')};
  ${tablet({
    flexDirection: p => (p.$directionMobile ? p.$directionMobile : ''),
    gap: p => (p.$gapMobile ? p.$gapMobile : ''),
    justifyContent: p =>
      p.$justifyContentMobile ? p.$justifyContentMobile : '',
  })};
`;

const Icon = styled.span`
  cursor: ${p => (p.$cursor ? 'pointer' : 'auto')};
`;
// 標題
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 1.5rem;
  }
`;
const Button = styled.button`
  width: 80px;
  border: none;
  padding: 5px;
  background-color: ${p => p.$bg};
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: center;
  ${tablet({
    display: 'none',
  })};
`;

// 詳情
const ProductDetails = styled.div`
  display: flex;
  gap: 20px;
  ${tablet({ flexDirection: 'column' })}
`;
const ProductDetailContainer = styled.div`
  flex: ${p => (p.$flex ? p.$flex : 1)};
  padding: 20px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

// 右方 Sales Data
const ProductSalesDataImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;
const ProductSalesDataName = styled.span`
  font-weight: 600;
`;

const ProductSalesDataItem = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
`;

const ProductForm = styled.form`
  display: flex;
  max-width: 70%;
  margin: 0 auto;
  ${tablet({ flexDirection: 'column', gap: '20px', maxWidth: '100%' })}
`;

const ProductUploadImg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 20px;
  ${tablet({ width: '150px', height: '150px' })}
`;
const Input = styled.input`
  height: 20px;
  width: 100%;
  padding: 10px 0;
  border: 1px solid gray;
  border-radius: 5px;
  text-indent: 10px;
`;
const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const Product = () => {
  const navigate = useNavigate();
  const { setCurrentPage } = useCurrentPage();
  useEffect(() => {
    setCurrentPage('/products');
  }, []);

  const SaveWrapper = styled.div`
    display: none;
    ${tablet({
      display: 'flex',
    })};
    ${Button} {
      margin-top: 20px;
      width: 100%;
      ${tablet({
        display: 'flex',
      })};
    }
  `;
  return (
    <PageLayout>
      <Container>
        {/*標題*/}
        <TitleContainer>
          <h1>商品詳情</h1>
          <Button
            $bg={'teal'}
            onClick={() => {
              navigate('/products');
            }}
          >
            更新
          </Button>
        </TitleContainer>

        {/*詳情*/}
        <ProductDetails>
          <ProductDetailContainer $flex={3}>
            <Chart data={productData} dataKey='銷售量' title='銷售表現' />
          </ProductDetailContainer>
          <ProductDetailContainer $flex={2}>
            <FlexGroup
              $alignItems={'center'}
              $justifyContent={'center'}
              $directionMobile={'column'}
              $gap={'30px'}
              $gapMobile={'10px'}
              $showborder={false}
            >
              <FlexGroup $showborder={false} $justifyContentMobile={'center'}>
                <ProductSalesDataImg
                  src='https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
                  alt=''
                />
                <ProductSalesDataName>Apple Airpods</ProductSalesDataName>
              </FlexGroup>
              <div>
                <ProductSalesDataItem>
                  <span>ID</span>
                  <span>123</span>
                </ProductSalesDataItem>
                <ProductSalesDataItem>
                  <span>銷售量</span>
                  <span>5123</span>
                </ProductSalesDataItem>
                <ProductSalesDataItem>
                  <span>是否上架</span>
                  <span>yes</span>
                </ProductSalesDataItem>
                <ProductSalesDataItem>
                  <span>庫存數量</span>
                  <span>123</span>
                </ProductSalesDataItem>
              </div>
            </FlexGroup>
          </ProductDetailContainer>
        </ProductDetails>

        {/* 表單 */}
        <ProductDetailContainer>
          <ProductForm>
            {/*編輯*/}
            <FlexGroup $direction={'column'} $alignItems $gap={'10px'}>
              <FlexGroup
                $gap={'5px'}
                $wrap
                $direction={'column'}
                $alignItems={'flex-start'}
              >
                <label>商品名稱</label>
                <Input placeholder='Apple AirPod' />
              </FlexGroup>
              <FlexGroup
                $gap={'5px'}
                $wrap
                $direction={'column'}
                $alignItems={'flex-start'}
              >
                <label>商品庫存</label>
                <Input type='number' name='' id='' defaultValue={66} />
              </FlexGroup>
              <FlexGroup
                $gap={'5px'}
                $wrap
                $direction={'column'}
                $alignItems={'flex-start'}
              >
                <label>是否上架</label>
                <Select name='active' id='active'>
                  <option value='yes'>是</option>
                  <option value='no'>否</option>
                </Select>
              </FlexGroup>
            </FlexGroup>
            {/* 上傳照片 */}
            <FlexGroup>
              <FlexGroup $direction={'column'}>
                <ProductUploadImg
                  src='https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
                  alt=''
                />
                <label htmlFor='file'>
                  <Icon as={Publish} $cursor={true} /> 上傳圖片
                </label>
                <input type='file' id='file' style={{ display: 'none' }} />
              </FlexGroup>
            </FlexGroup>
          </ProductForm>
        </ProductDetailContainer>
        <SaveWrapper>
          <Button
            $bg={'teal'}
            onClick={() => {
              navigate('/products');
            }}
          >
            更新
          </Button>
        </SaveWrapper>
      </Container>
    </PageLayout>
  );
};

export default Product;

import { useCurrentPage } from '../context/CurrentPageContext';
import { useEffect } from 'react';
import { PageLayout } from '@/components';
import styled from 'styled-components';
import { tablet } from '../responsive';
import { useNavigate } from 'react-router-dom';

// 布局
const Container = styled.div`
  padding: 0 20px;
  ${tablet({ padding: '0px' })};
`;
// 共通元件
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

// 表單元素
const Form = styled.form`
  margin-top: 10px;
  max-width: 800px;
`;
const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
const Label = styled.label`
  color: gray;
  font-weight: 600;
  margin-bottom: 10px;
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
  height: 40px;
  width: 100%;
  padding: 10px 0;
  border: 1px solid gray;
  border-radius: 5px;
  text-indent: 10px;
`;
const SaveWrapper = styled.div`
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

const NewProduct = () => {
  const navigate = useNavigate();
  const { setCurrentPage } = useCurrentPage();
  useEffect(() => {
    setCurrentPage('/products');
  }, []);

  return (
    <PageLayout>
      <Container>
        <TitleContainer>
          <h1>新增商品</h1>
        </TitleContainer>
        <Form>
          <Item>
            <Label>商品圖片</Label>
            <input type='file' id='file' />
          </Item>
          <Item>
            <Label>商品名稱</Label>
            <Input type='text' placeholder='Apple Airpods' />
          </Item>
          <Item>
            <Label>庫存數量</Label>
            <Input type='number' placeholder='123' />
          </Item>
          <Item>
            <Label>是否上架</Label>
            <Select name='active' id='active'>
              <option value='yes'>是</option>
              <option value='no'>否</option>
            </Select>
          </Item>
          <SaveWrapper>
            <Button
              $bg={'teal'}
              onClick={() => {
                navigate('/products');
              }}
            >
              新增
            </Button>
          </SaveWrapper>
        </Form>
      </Container>
    </PageLayout>
  );
};

export default NewProduct;

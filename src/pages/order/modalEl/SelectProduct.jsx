//react
import { useEffect, useState, useRef } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { productCategoryRequests } from '@/store/productCategory';
//components
import styled from 'styled-components';
import {
  Form,
  InputWrapper,
  Input,
  Select,
  Span,
  SelectWrapper,
} from '@/components/common';
const { FormWrapper, FormBody, FormRow, FormCol, FormTitle, FormSide } = Form;
//utils
import customAxios from '@/utils/axios/customAxios';

const StyledList = styled.ul`
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  max-height: 100%;
  height: 200px;
  overflow-y: scroll;
  transform: translate(0%, 0%);
  top: 2.75rem;
  width: calc(100%);
  list-style-type: none;
  padding: 0;
  li {
    color: #333;
    font-size: 0.9rem;
    padding: 0 5px;
  }
  button {
    width: 100%;
    padding: 5px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    &:focus,
    &:hover {
      background-color: #e5f3fc;
    }
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const SelectProduct = props => {
  const { setShowModalElement, setRowsSrc, setProduct } = props;
  //Redux
  const dispatch = useDispatch();
  const categoryState = useSelector(state => state.productCategory);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //ref
  const listRef = useRef(null);
  //表單管理
  const initialFormData = {
    categoryId: '',
    subCategoryId: '',
    query: '',
  };
  const [form, setForm] = useState(initialFormData);
  const [filteredProductData, setFilteredProductData] = useState([]);

  //useEffect
  useEffect(() => {
    dispatch(productCategoryRequests.getAll());
    const fetchData = async () => {
      const category = categoryState?.data.find(item => {
        return item._id.toString() === form?.categoryId;
      });
      const subCategory = category?.subCategory.find(item => {
        return item._id.toString() === form?.subCategoryId;
      });

      const data = {
        ...form,
        categoryName: category?.categoryName,
        subCategoryName: subCategory?.subCategoryName,
      };
      const res = await customAxios.post(
        `${import.meta.env.VITE_APIURL}/product/searchByCategory`,
        data,
        { headers: { Authorization: `Bearer ${TOKEN}` } },
      );
      setFilteredProductData(res.data.data);
    };
    fetchData();
  }, [form]);

  useEffect(() => {
    if (!form.categoryId) {
      setForm(prev => ({ ...prev, subCategoryId: '' }));
    }
  }, [form.categoryId]);

  return (
    <FormWrapper>
      <FormTitle $margin={'0 0 1rem 0'}>增加訂單商品</FormTitle>
      <FormBody $padding={'0'}>
        <FormSide $gap={'1.2rem'}>
          <FormRow>
            <FormCol $minWidth={'4rem'}>
              <label>商品分類</label>
              <SelectWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                <Select
                  name='categoryId'
                  onChange={e => {
                    setForm(prev => ({ ...prev, categoryId: e.target.value }));
                  }}
                  value={form.categoryId}
                >
                  <option value={''}>選擇主分類</option>
                  {categoryState.data.map(item => {
                    if (item.type === '依類別') {
                      return (
                        <option value={item._id} key={item._id}>
                          {item.type} \ {item.categoryName}
                        </option>
                      );
                    }
                  })}
                </Select>
              </SelectWrapper>
              <SelectWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                <Select
                  name='subCategoryId'
                  onChange={e => {
                    setForm(prev => ({
                      ...prev,
                      subCategoryId: e.target.value,
                    }));
                  }}
                  value={form.subCategoryId}
                >
                  <option value={''}>選擇次要分類</option>
                  {categoryState.data.map(item => {
                    if (item._id === form.categoryId) {
                      return item.subCategory.map(subItem => (
                        <option value={subItem._id} key={subItem._id}>
                          {subItem.subCategoryName}
                        </option>
                      ));
                    } else {
                      return null;
                    }
                  })}
                </Select>
              </SelectWrapper>
            </FormCol>
          </FormRow>

          <FormRow>
            <FormCol $minWidth={'4rem'}>
              <label>商品編號</label>
              <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                <Input
                  name='description'
                  type='text'
                  placeholder='使用商品編號縮小搜尋範圍'
                  onChange={e => {
                    setForm(prev => ({ ...prev, query: e.target.value }));
                  }}
                  value={form.query}
                  autoComplete='off'
                />
              </InputWrapper>
            </FormCol>
          </FormRow>
          <FormRow>
            <FormCol $minWidth={'4rem'}>
              <StyledList ref={listRef}>
                {filteredProductData.map((item, idx) => {
                  return (
                    <li key={idx}>
                      <button
                        type='button'
                        onClick={e => {
                          e.preventDefault();
                          setProduct(item);
                          setShowModalElement(false);
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_APIURL}/file${item.productPromotionImage}`}
                          alt=''
                          style={{ maxWidth: '40px', maxHeight: '40px' }}
                        />
                        <Span>{item.productNumber}</Span>
                        {`${item.productName}`}
                      </button>
                    </li>
                  );
                })}
              </StyledList>
            </FormCol>
          </FormRow>
          {/* <pre><Span>{JSON.stringify(form, null, 2)}</Span></pre>*/}
          {/* <pre><Span>{JSON.stringify(filteredProductData, null, 2)}</Span></pre> */}
        </FormSide>
      </FormBody>
    </FormWrapper>
  );
};

//react
import { useEffect, useState, useRef } from 'react';
//redux
import { useSelector } from 'react-redux';
//components
import styled from 'styled-components';
import {
  Form,
  InputWrapper,
  Input,
  Button,
  Flexbox,
  Span,
} from '@/components/common';
const { FormWrapper, FormBody, FormRow, FormCol, FormTitle, FormSide } = Form;

export const AddShippedContent = props => {
  const { setContent } = props;
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialFormData = {
    'item': '',
    'quantity': 1,
    'unit': '',
    'memo': '',
  };
  const [form, setForm] = useState(initialFormData);
  const [filteredProductData, setFilteredProductData] = useState([]);

  return (
    <FormWrapper>
      <FormTitle $margin={'0 0 1rem 0'}>增加出貨物品</FormTitle>
      <FormBody $padding={'0'}>
        <FormSide $gap={'1.2rem'}>
          <FormRow>
            <FormCol $minWidth={'4rem'}>
              <label>內容物</label>
              <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                <Input
                  name='item'
                  type='text'
                  placeholder=''
                  onChange={e => {
                    setForm(prev => ({ ...prev, item: e.target.value }));
                  }}
                  value={form.item}
                  autoComplete='off'
                />
              </InputWrapper>
            </FormCol>
          </FormRow>
          <FormRow>
            <FormCol $minWidth={'4rem'}>
              <label>數量</label>
              <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                <Input
                  name='quantity'
                  type='number'
                  placeholder=''
                  onChange={e => {
                    setForm(prev => ({ ...prev, quantity: e.target.value }));
                  }}
                  value={form.quantity}
                  autoComplete='off'
                />
              </InputWrapper>
            </FormCol>
          </FormRow>

          <FormRow>
            <FormCol $minWidth={'4rem'}>
              <label>單位</label>
              <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                <Input
                  name='unit'
                  type='text'
                  placeholder=''
                  onChange={e => {
                    setForm(prev => ({ ...prev, unit: e.target.value }));
                  }}
                  value={form.unit}
                  autoComplete='off'
                />
              </InputWrapper>
            </FormCol>
          </FormRow>
          <FormRow>
            <FormCol $minWidth={'4rem'}>
              <label>備註</label>
              <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                <Input
                  name='memo'
                  type='text'
                  placeholder=''
                  onChange={e => {
                    setForm(prev => ({ ...prev, memo: e.target.value }));
                  }}
                  value={form.memo}
                  autoComplete='off'
                />
              </InputWrapper>
            </FormCol>
          </FormRow>
          <FormRow>
            <Flexbox>
              <Button
                type='button'
                $bg={'#5cc55f'}
                onClick={() => {
                  setContent(form);
                }}
              >
                提交
              </Button>
            </Flexbox>
          </FormRow>

          {/* <pre><Span>{JSON.stringify(form, null, 2)}</Span></pre> */}
          {/* <pre><Span>{JSON.stringify(filteredProductData, null, 2)}</Span></pre> */}
        </FormSide>
      </FormBody>
    </FormWrapper>
  );
};

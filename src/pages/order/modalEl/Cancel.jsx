//react
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { orderRequests, clearOrderError } from '@/store/order';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
import {
  Form,
  Button,
  Flexbox,
  InputWrapper,
  Input,
  Span,
} from '@/components/common';
const { FormWrapper, FormBody, FormRow, FormCol, FormTitle, FormSide } = Form;
//utils

const Description = styled.p`
text-align: center;
line-height: 2;
letter-spacing: 1px;
margin: 0 0 0.75rem 0;
`

const Cancel = props => {
  const { setShowModalElement, setForm } = props;
  const { id } = useParams();
  //Redux
  const dispatch = useDispatch();
  const orderState = useSelector(state => state.order);
  const currentData = orderState.data.find(item => item?.orderNumber === id);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialModalFormData = {
    processingEmployeeId: authEmployeeState.data.employeeId,
    processingEmployeeName: authEmployeeState.data.name,
    memo: '',
  };
  const [modalFormData, setModalFormData] = useState(initialModalFormData);
  //表單提示
  //狀態管理
  const [operateType, setOperateType] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    if (operateType === 'cancel') {
      if (submitClicked && orderState.error === null) {
        alert('已更新');

        setForm(prevState => ({
          ...prevState,
          status: currentData?.status,
          lastEditedBy: currentData?.lastEditedBy,
          lastEditerName: currentData?.lastEditerName,
          memo: currentData?.memo,
          updatedAt: currentData?.updatedAt,
        }));
        setShowModalElement(false);
      }
    }
  }, [orderState.data]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setSubmitClicked(false);
    setModalFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    const { processingEmployeeId, memo } = modalFormData;
    if (memo !== '') {
      setSubmitClicked(true);
      setOperateType('cancel');
      const newData = {
        username: currentData.username,
        status: '已取消',
        canceledAt: new Date().toISOString(),
        reason: memo,
        processingEmployeeId: processingEmployeeId,
        lastEditedBy: processingEmployeeId,
      };

      await dispatch(
        orderRequests.delete(TOKEN, currentData.orderNumber, newData),
      );
    } else {
      alert('取消事由 欄位不得為空');
    }
  };

  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0'}>取消訂單</FormTitle>
        <Description>取消訂單將同步取消物流作業</Description>
        <FormBody $padding={'0'} $direction={'column'}>
          <FormSide>
            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>訂單編號</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='orderNumber'
                    value={currentData.orderNumber}
                    disabled={true}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>取消經辦</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='processingEmployee'
                    value={`${modalFormData.processingEmployeeId} ${modalFormData.processingEmployeeName}`}
                    disabled={true}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>取消事由</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='memo'
                    value={modalFormData.memo}
                    onChange={handleFormChange}
                    disabled={submitClicked && !orderState.error}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
          </FormSide>
        </FormBody>
        {/* <Span $color={'#d15252'}>
          <pre>{JSON.stringify(modalFormData, null, 2)}</pre>
        </Span> */}
        {/* <Span $color={'#d15252'}>
          <pre>{JSON.stringify(currentData, null, 2)}</pre>
        </Span> */}
        <Flexbox $gap={'8px'} $margin={'1rem 0 0 0'}>
          {submitClicked && !orderState.error ? (
            <Button
              type='button'
              $bg={'#7e7e7e'}
              onClick={() => {
                setShowModalElement(false);
              }}
              $animation={!orderState.loading}
              disabled={orderState.loading}
            >
              關閉視窗
            </Button>
          ) : (
            <>
              <Flexbox $margin={'auto 0 0 0'}>
                <Button
                  type='button'
                  $bg={'transparent'}
                  $color={'#333'}
                  onClick={() => {
                    setShowModalElement(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  type='submit'
                  disabled={orderState.loading}
                  onClick={handleFormSubmit}
                  $animation={!orderState.loading}
                >
                  保存
                </Button>
              </Flexbox>
            </>
          )}
        </Flexbox>
      </FormWrapper>
      <Layout.Loading
        type={'spinningBubbles'}
        active={orderState.loading}
        color={'#00719F'}
        width={100}
      />
    </>
  );
};

export default Cancel;

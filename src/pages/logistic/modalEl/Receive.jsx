//react
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { logisticRequests, clearLogisticError } from '@/store/logistic';
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
import { convertIsoToTaipei } from '@/utils/format';

const Description = styled.p`
text-align: center;
line-height: 2;
letter-spacing: 1px;
margin: 0 0 0.75rem 0;
color:#d15252;
`

const Receive = props => {
  const { setShowModalElement, setForm } = props;
  const { id } = useParams();
  //Redux
  const dispatch = useDispatch();
  const logisticState = useSelector(state => state.logistic);
  const currentData = logisticState.data.find(
    item => item?.logisticNumber === id,
  );
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialModalFormData = {
    deliveryCompany: {
      companyName: currentData?.deliveryCompany?.companyName,
      receiptNumber: currentData?.deliveryCompany?.receiptNumber,
    },
    receivedDate: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(), //出貨日
    receivedTime: (() => {
      const today = new Date();
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    })(),
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
    if (operateType === 'receive') {
      if (submitClicked && logisticState.error === null) {
        alert('已更新');
        setForm(prevState => ({
          ...prevState,
          status: currentData?.status,
          logisticHistory: currentData?.logisticHistory,
          lastEditedBy: currentData?.lastEditedBy,
          updatedAt: currentData?.updatedAt,
        }));
        setShowModalElement(false);
      }
    }
  }, [logisticState.data]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setSubmitClicked(false);
    setModalFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    const {
      receivedDate,
      receivedTime,
      processingEmployeeId,
      memo,
    } = modalFormData;
    if (receivedDate !== '' && receivedTime !== '') {
      setSubmitClicked(true);
      setOperateType('receive');

      const newData = {
        status: '已取貨',
        logisticHistory: [
          ...currentData.logisticHistory,
          {
            time: convertIsoToTaipei(
              new Date(`${receivedDate}T${receivedTime}:00.000Z`),
            ),
            actionType: '取貨',
            processingEmployeeId: processingEmployeeId,
            memo: memo,
          },
        ],
        lastEditedBy: authEmployeeState.data.employeeId,
      };
      await dispatch(
        logisticRequests.update(TOKEN, currentData.logisticNumber, newData),
      );

      //更新訂單狀態為已取貨 //貨到付款的訂單要更改付款狀態

      if (currentData.order.payment.type === "貨到付款") {
        const updatedOrderData = {
          username: currentData.order.username,
          status: '已取貨',
          lastEditedBy: authEmployeeState.data.employeeId,
          payment: {
            ...currentData.order.payment,
            status: "已付款",
            paidAt: new Date().toISOString()
          }
        };
        await dispatch(
          orderRequests.update(TOKEN, currentData.order.orderNumber, updatedOrderData),
        );
      } else {
        const updatedOrderData = {
          username: currentData.order.username,
          status: '已取貨',
          lastEditedBy: authEmployeeState.data.employeeId,
        };

        await dispatch(
          orderRequests.update(TOKEN, currentData.order.orderNumber, updatedOrderData),
        );
      }

    } else {
      alert('取貨日期,取貨時間等欄位不得為空');
    }
  };
  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0'}>取貨處理</FormTitle>

        {currentData.order.payment.type === "貨到付款" && <Description>本訂單為貨到付款，取貨後將更新付款狀態</Description>}
        <FormBody $padding={'0'} $direction={'column'}>
          <FormSide>
            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>出貨編號</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='logisticNumber'
                    value={currentData.logisticNumber}
                    disabled={true}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>物流廠商</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='deliveryCompany.companyName'
                    placeholder='物流公司'
                    value={modalFormData.deliveryCompany.companyName}
                    onChange={handleFormChange}
                    disabled={true}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type='text'
                    name='deliveryCompany.receiptNumber'
                    placeholder='物流單號'
                    value={modalFormData.deliveryCompany.receiptNumber}
                    onChange={handleFormChange}
                    disabled={true}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>取貨日期</label>
                <InputWrapper>
                  <Input
                    type='date'
                    name='receivedDate'
                    value={modalFormData.receivedDate}
                    onChange={handleFormChange}
                    disabled={submitClicked && !logisticState.error}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type='time'
                    name='receivedTime'
                    value={modalFormData?.receivedTime}
                    onChange={handleFormChange}
                    disabled={submitClicked && !logisticState.error}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>取貨經辦</label>
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
                <label>備註</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='memo'
                    value={modalFormData.memo}
                    onChange={handleFormChange}
                    disabled={submitClicked && !logisticState.error}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
          </FormSide>
        </FormBody>

        {/* <Span $color={'#d15252'}>
          <pre>{JSON.stringify(currentData.order.payment.type, null, 2)}</pre>
        </Span> */}
        {/* <Span $color={'#d15252'}>
          <pre>{JSON.stringify(modalFormData, null, 2)}</pre>
        </Span> */}
        <Flexbox $gap={'8px'} $margin={'1rem 0 0 0'}>
          {submitClicked && !logisticState.error ? (
            <Button
              type='button'
              $bg={'#7e7e7e'}
              onClick={() => {
                setShowModalElement(false);
              }}
              $animation={!logisticState.loading}
              disabled={logisticState.loading}
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
                  disabled={logisticState.loading}
                  onClick={handleFormSubmit}
                  $animation={!logisticState.loading}
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
        active={logisticState.loading}
        color={'#00719F'}
        width={100}
      />
    </>
  );
};

export default Receive;

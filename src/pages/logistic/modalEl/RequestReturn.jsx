//react
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { logisticRequests, clearLogisticError } from '@/store/logistic';
//components
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
import customAxios from '@/utils/axios/customAxios';

const RequestReturn = props => {
  const { setShowModalElement, fetchLogisticData, orderNumber } = props;
  const { id } = useParams();
  //Redux
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialModalFormData = {
    requestReturnedDate: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(), //出貨日
    requestReturnedTime: (() => {
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


  const handleFormChange = e => {
    const { name, value } = e.target;
    setSubmitClicked(false);
    setModalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const {
      requestReturnedDate,
      requestReturnedTime,
      processingEmployeeId,
      memo,
    } = modalFormData;
    if (
      requestReturnedDate !== '' &&
      requestReturnedTime !== '' &&
      memo !== ''
    ) {
      setSubmitClicked(true);
      setOperateType('requestReturned');
      try {
        setLoading(true)
        const data = {
          reason: memo,
          requestReturnAt: convertIsoToTaipei(
            new Date(`${requestReturnedDate}T${requestReturnedTime}:00.000Z`),
          ),
          lastEditedBy: processingEmployeeId,
          processingEmployeeId: processingEmployeeId,
        };

        const response = await customAxios.put(`${import.meta.env.VITE_APIURL}/order/returnProcessing/${orderNumber}`, data, { headers: { Authorization: `Bearer ${TOKEN}` } });
        if (response.status === 200) {
          fetchLogisticData()
          alert('已更新')
          setShowModalElement(false)
        }
      } catch (error) {
        console.error(error);
        setError(error)
      }
      setLoading(false)
    } else {
      alert('申請日期,申請時間,申請事由等欄位不得為空');
    }
  };

  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0 0 0.75rem 0'}>退貨申請</FormTitle>
        <FormBody $padding={'0'} $direction={'column'}>
          <FormSide>
            <FormRow>
              <FormCol $minWidth={'4.5rem'}>
                <label>出貨編號</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='logisticNumber'
                    value={id}
                    disabled={true}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4.5rem'}>
                <label>申請日期</label>
                <InputWrapper>
                  <Input
                    type='date'
                    name='requestReturnedDate'
                    value={modalFormData.requestReturnedDate}
                    onChange={handleFormChange}
                    disabled={submitClicked}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type='time'
                    name='requestReturnedTime'
                    value={modalFormData?.requestReturnedTime}
                    onChange={handleFormChange}
                    disabled={submitClicked}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4.5rem'}>
                <label>申請經辦</label>
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
              <FormCol $minWidth={'4.5rem'}>
                <label>事由/備註</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='memo'
                    value={modalFormData.memo}
                    onChange={handleFormChange}
                    disabled={submitClicked}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
          </FormSide>
        </FormBody>
        {/* <Span $color={'#d15252'}>
          <pre>{JSON.stringify(modalFormData, null, 2)}</pre>
        </Span> */}
        <Flexbox $gap={'8px'} $margin={'1rem 0 0 0'}>
          {submitClicked ? (
            <Button
              type='button'
              $bg={'#7e7e7e'}
              onClick={() => {
                setShowModalElement(false);
              }}
              $animation={!loading}
              disabled={loading}
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
                  disabled={loading}
                  onClick={handleFormSubmit}
                  $animation={!loading}
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
        active={loading}
        color={'#00719F'}
        width={100}
      />
    </>
  );
};

export default RequestReturn;

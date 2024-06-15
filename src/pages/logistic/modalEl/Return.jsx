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
const {
  FormWrapper,
  FormTitle,
  FormRadioWrapper,
  FormBody,
  FormRow,
  FormCol,
  FormSide,
} = Form;
//utils
import { convertIsoToTaipei } from '@/utils/format';

const Return = props => {
  const { setShowModalElement, form, fetchLogisticData } = props;
  const { id } = useParams();
  //Redux
  const dispatch = useDispatch();
  const logisticState = useSelector(state => state.logistic);
  // const currentData = logisticState.data.find(
  //   item => item?.logisticNumber === id,
  // );
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理

  const event = form?.logisticHistory.find(
    event => event?.actionType === '申請退貨',
  );
  const initialModalFormData = {
    requestReturnedDate: (() => {
      const today = new Date(event?.time);
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(),
    requestReturnedTime: (() => {
      const today = new Date(event?.time);
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    })(),
    requestReturnedMemo: event?.memo,
    checkedDate: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(), //出貨日
    checkedTime: (() => {
      const today = new Date();
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    })(),
    checkedResult: '',
    memo: '',
    processingEmployeeId: authEmployeeState.data.employeeId,
    processingEmployeeName: authEmployeeState.data.name,
  };
  const [modalFormData, setModalFormData] = useState(initialModalFormData);
  //表單提示
  //狀態管理
  const [operateType, setOperateType] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    if (operateType === 'return') {
      if (submitClicked && logisticState.error === null) {
        alert('已更新');
        fetchLogisticData()
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
      checkedResult,
      checkedDate,
      checkedTime,
      processingEmployeeId,
      memo,
    } = modalFormData;
    if (
      checkedResult !== '' &&
      checkedDate !== '' &&
      checkedTime !== '' &&
      processingEmployeeId !== ''
    ) {
      setSubmitClicked(true);
      setOperateType('return');
      const newData = {
        status: checkedResult === '同意退貨申請' ? '待退貨' : '已取貨',
        logisticHistory: [
          ...form.logisticHistory,
          {
            time: convertIsoToTaipei(
              new Date(`${checkedDate}T${checkedTime}:00.000Z`),
            ),
            actionType: checkedResult,
            processingEmployeeId: processingEmployeeId,
            memo: memo,
          },
        ],
        lastEditedBy: authEmployeeState.data.employeeId,
      };

      // console.log(newData);
      await dispatch(
        logisticRequests.update(TOKEN, form.logisticNumber, newData),
      );
    } else {
      alert('處理日期,處理時間,處理結果等欄位不得為空');
    }
  };
  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0 0 0.75rem 0'}>退貨處理</FormTitle>
        <FormBody $padding={'0'} $direction={'column'}>
          <FormSide>
            <FormRow>
              <FormCol $minWidth={'4.5rem'}>
                <label>出貨編號</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='logisticNumber'
                    value={form.logisticNumber}
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
                    disabled={true}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type='time'
                    name='requestReturnedTime'
                    value={modalFormData?.requestReturnedTime}
                    disabled={true}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'4.5rem'}>
                <label>申請原因</label>
                <InputWrapper>
                  <Input
                    type='text'
                    name='requestReturnedMemo'
                    value={modalFormData.requestReturnedMemo}
                    disabled={true}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4.5rem'}>
                <label>處理日期</label>
                <InputWrapper>
                  <Input
                    type='date'
                    name='checkedDate'
                    value={modalFormData.checkedDate}
                    onChange={handleFormChange}
                    disabled={submitClicked && !logisticState.error}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type='time'
                    name='checkedTime'
                    value={modalFormData?.checkedTime}
                    onChange={handleFormChange}
                    disabled={submitClicked && !logisticState.error}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'7rem'}>
                <label>處理結果</label>
                <Flexbox $justifyContent={'space-evenly'} $gap={'5rem'}>
                  <FormRadioWrapper>
                    <Input
                      type='radio'
                      id='同意退貨申請'
                      name='checkedResult'
                      value='同意退貨申請'
                      onChange={handleFormChange}
                      checked={modalFormData.checkedResult === '同意退貨申請'}
                      disabled={submitClicked && !logisticState.error}
                    />
                    <label htmlFor='同意退貨申請'>同意退貨申請</label>
                  </FormRadioWrapper>
                  <FormRadioWrapper>
                    <Input
                      type='radio'
                      id='駁回退貨申請'
                      name='checkedResult'
                      value='駁回退貨申請'
                      onChange={handleFormChange}
                      checked={modalFormData.checkedResult === '駁回退貨申請'}
                      disabled={submitClicked && !logisticState.error}
                    />
                    <label htmlFor='駁回退貨申請'>駁回退貨申請</label>
                  </FormRadioWrapper>
                </Flexbox>
              </FormCol>
              <FormCol $minWidth={'4.5rem'}></FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'4.5rem'}>
                <label>處理經辦</label>
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

          {/* <Span $color={'#d15252'}>
            <pre>{JSON.stringify(modalFormData, null, 2)}</pre>
          </Span> */}
        </FormBody>
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

export default Return;

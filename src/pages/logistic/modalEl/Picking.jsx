//react
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { logisticRequests } from '@/store/logistic';
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
`

const Picking = props => {
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
    pickingDate: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(), //出貨日
    pickingTime: (() => {
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
    if (operateType === 'picking') {
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
      pickingDate,
      pickingTime,
      processingEmployeeId,
      memo,
    } = modalFormData;

    if (pickingDate !== '' && pickingTime !== '') {
      setSubmitClicked(true);
      setOperateType('picking');
      const newData = {
        status: '待出貨',
        logisticHistory: [
          ...currentData.logisticHistory,
          {
            time: convertIsoToTaipei(
              new Date(`${pickingDate}T${pickingTime}:00.000Z`),
            ),
            actionType: '揀貨',
            processingEmployeeId: processingEmployeeId,
            memo: memo,
          },
        ],
        lastEditedBy: authEmployeeState.data.employeeId,
      };
      await dispatch(
        logisticRequests.update(TOKEN, currentData.logisticNumber, newData),
      );
    } else {
      alert('揀貨日期,揀貨時間等欄位不得為空');
    }
  };
  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0'}>揀貨</FormTitle>
        <Description>確認訂單並進行揀貨，將更新狀態為待出貨</Description>
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
                <label>揀貨日期</label>
                <InputWrapper>
                  <Input
                    type='date'
                    name='pickingDate'
                    value={modalFormData.pickingDate}
                    onChange={handleFormChange}
                    disabled={submitClicked && !logisticState.error}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type='time'
                    name='pickingTime'
                    value={modalFormData?.pickingTime}
                    onChange={handleFormChange}
                    disabled={submitClicked && !logisticState.error}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>揀貨經辦</label>
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

export default Picking;

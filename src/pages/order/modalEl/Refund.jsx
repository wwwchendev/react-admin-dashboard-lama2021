//react
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { orderRequests, clearOrderError } from '@/store/order';
//components
import * as Layout from '@/components/layout';
import {
  Form,
  Button,
  Flexbox,
  InputWrapper,
  Input,
  Span,
  Select,
  SelectWrapper,
} from '@/components/common';
const { FormWrapper, FormBody, FormRow, FormCol, FormTitle, FormSide } = Form;
//utils

const Refund = props => {
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
    paymentType: currentData.payment.type,
    paymentOption: currentData.payment.option,
    total: currentData.total,
  };
  const [modalFormData, setModalFormData] = useState(initialModalFormData);
  //表單提示
  //狀態管理
  const [operateType, setOperateType] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    if (operateType === 'refund') {
      if (submitClicked && orderState.error === null) {
        alert('已更新');

        setForm(prevState => ({
          ...prevState,
          status: currentData?.status,
          payment: currentData?.payment,
          lastEditedBy: currentData?.lastEditedBy,
          lastEditerName: currentData?.lastEditerName,
          updatedAt: currentData?.updatedAt,
        }));
        setShowModalElement(false);
      }
    }
  }, [orderState.data]);


  const handleFormSubmit = async e => {
    e.preventDefault();
    const { processingEmployeeId } = modalFormData;

    setSubmitClicked(true);
    setOperateType('refund');
    const newData = {
      username: currentData.username,
      payment: {
        ...currentData?.payment,
        status: '已退款',
        refundAt: new Date().toISOString()
      },
      lastEditedBy: processingEmployeeId,
    };
    await dispatch(
      orderRequests.update(TOKEN, currentData.orderNumber, newData),
    );

  };
  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0 0 0.75rem 0'}>退款處理</FormTitle>
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
                <label>付款方式</label>
                <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                  <Select
                    name='paymentType'
                    value={modalFormData.paymentType}
                    disabled={true}
                  >
                    <option value='' disabled>
                      請選擇付款方式
                    </option>
                    <option value='線上付款'>線上付款</option>
                    <option value='貨到付款'>貨到付款</option>
                  </Select>
                </SelectWrapper>
                {modalFormData.paymentType === "線上付款" &&
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='paymentOption'
                      value={modalFormData.paymentOption}
                      disabled={true}
                    >
                      <option value='' disabled>
                        請選擇付款選項
                      </option>
                      <option value='信用卡'>信用卡</option>
                      <option value='LINE PAY'>LINE PAY</option>
                    </Select>
                  </SelectWrapper>
                }
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>總金額</label>
                <Flexbox>
                  <InputWrapper>
                    <Input
                      type='number'
                      name='total'
                      value={modalFormData.total}
                      disabled={true}
                    />
                  </InputWrapper>
                  元
                </Flexbox>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'4rem'}>
                <label>退款經辦</label>
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
          </FormSide>
        </FormBody>
        {/* <Span $color={'#d15252'}>
          <pre>{JSON.stringify(modalFormData, null, 2)}</pre>
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

export default Refund;

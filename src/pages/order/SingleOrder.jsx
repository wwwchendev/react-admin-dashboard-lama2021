//react
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { orderRequests, clearOrderError } from '@/store/order';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Modal,
  Flexbox,
  TitleContainer,
  Button,
  Input,
  Span,
  InputWrapper,
  Form,
  Select,
  SelectWrapper,
  Textarea,
} from '@/components/common';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Edit, Delete, ArrowRight, Launch } from '@material-ui/icons';
const { FormWrapper, FormBody, FormRow, FormCol, FormSide } = Form;
import Cancel from './modalEl/Cancel';
import Receiving from './modalEl/Receiving';
import Refund from './modalEl/Refund';
import { SelectProduct } from './modalEl/SelectProduct';

//utils
import { numberWithCommas } from '../../utils/format';
import customAxios from '@/utils/axios/customAxios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const SingleOrder = () => {
  const navigator = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isEditing = location.pathname.includes('edit');
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const productState = useSelector(state => state.product);
  const orderState = useSelector(state => state.order);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${import.meta.env.VITE_APIURL}/order/${id}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
      const order = response.data.data;
      setForm(order);
    } catch (error) {
      console.error(error);
      setError(error.message || '物流資料獲取失敗。');
    }
    setLoading(false);
  };


  //表單管理
  const initialFormData = {
    orderNumber: '',
    username: '',
    status: '',
    products: [],
    productSubtotal: 0,
    logistic: {
      status: '',
      option: '',
      fee: 0,
      address: {
        zipcode: '',
        county: '',
        district: '',
        address: '',
        convenienceStore: {
          storeName: '',
          storeId: '',
        },
      },
      receiver: {
        receiverName: '',
        receiverMobileNumber: '',
      },
    },
    shippingDiscount: 0,
    total: 0,
    payment: {
      status: '',
      type: '',
      option: '',
      invoice: {
        type: '',
        carrierNumber: '',
      },
    },
    memo: '',
    createdAt: '',
    createdBy: '',
    createrName: '',
    updatedAt: '',
    lastEditedBy: '',
    lastEditerName: '',
    cancelReason: '',
    requestReturnReason: ''
  };
  const [form, setForm] = useState(initialFormData);
  useEffect(() => {
    fetchOrderData();
    setRowsSrc(form.products)
  }, [TOKEN, id, form.orderNumber]);
  //表單提示
  const initialPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initialPromptMessage);
  //狀態管理
  const [operateType, setOperateType] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const uneditable = (submitClicked && !error) || !isEditing;
  const [showModalElement, setShowModalElement] = useState(false);
  const orderStatusList = ['已成立', '已出貨', '已送達', '已完成', '已取消', "退貨作業中", "退貨退款"];
  const [satusIsActive, setStatusIsActive] = useState({
    '收款': false,
    '退款': false,
    '取消': false,
  });
  //useEffect
  useEffect(() => {
    setCurrentPage('/order');
  }, []);

  useEffect(() => {
    if (form?.status === '已成立') {
      setStatusIsActive({
        '收款': form?.payment?.status !== '已付款' ? true : false,
        '退款':
          form?.payment?.status === '尚未付款' ||
            form?.payment?.status === '已退款' ||
            (form?.logistic?.status !== '已取消' &&
              form?.logistic?.status !== '待確認')
            ? false
            : true,
        '取消':
          form?.payment?.status === '尚未付款' || form?.payment?.status === '已退款'
            ? true
            : false,
      });
    }
    if (form?.status === '已出貨') {
      setStatusIsActive({
        '收款': false,
        '退款':
          form?.logistic?.status === '已退貨' &&
            form?.payment?.status === '已付款'
            ? true
            : false,
        '取消': false,
      });
    }
    if (form?.status === '已完成' || form?.status === '已取消') {
      setStatusIsActive({
        '收款': false,
        '退款': false,
        '取消': false,
      });
    }

    if (form?.status === '退貨退款') {
      setStatusIsActive({
        '收款': false,
        '退款': form?.payment?.status === '退款處理中' ? true : false,
        '取消': false,
      });
    }

  }, [form]);

  useEffect(() => {
    if (operateType === 'editOrder' && submitClicked && orderState.error === null) {
      alert('已更新訂單');
      navigator(`/order/${id}`);
    }
  }, [orderState.data]);

  useEffect(() => {
    //計算總金額
    setForm(prev => {
      return {
        ...prev,
        total: form.productSubtotal + form.shippingFee - form.shippingDiscount,
      };
    });
  }, [form.productSubtotal, form.shippingFee, form.shippingDiscount]);

  //data-grid
  const columns = [
    {
      field: 'no',
      headerName: 'no',
      width: 75,
    },
    {
      field: 'productName',
      headerName: '品名',
      width: 200,
    },
    {
      field: 'variantName',
      headerName: '規格',
      width: 170,
      renderCell: params => {
        return rowsSrc.map((row, idx) => {
          if (idx + 1 !== params.row?.no) {
            return;
          }
          const product = productState.data?.find(p => {
            return p.productId === params.row.productId;
          });
          const image = product?.variants.find(
            v => v.variantId === rowsSrc[idx]?.variantId,
          )?.image;
          // console.log(product?.variants, rowsSrc[idx]?.variantId);
          return (
            <Flexbox $justifyContent={'space-between'} $gap={'1rem'} key={idx}>
              <select
                value={rowsSrc[idx]?.variantId || ''}
                disabled={uneditable}
                onChange={e => {
                  const updatedArray = rowsSrc.map((item, index) => {
                    if (index !== idx) {
                      return item;
                    } else {
                      const variant = product?.variants.find(
                        v => v.variantId === e.target.value,
                      );
                      return {
                        ...item,
                        variantId: variant?.variantId,
                        variantName: variant?.item,
                        variantImage: variant?.image,
                        specificationId: '',
                        specificationName: '',
                        discountedPrice: null,
                        quantity: 1,
                        amount: null,
                      };
                    }
                  });
                  setRowsSrc(updatedArray);
                }}
              >
                <option value={''}> 請選擇規格 </option>
                {product?.variants.map((item, idx) => {
                  return (
                    <option value={item.variantId} key={idx}>
                      {item.item}
                    </option>
                  );
                })}
              </select>
              {image && (
                <img
                  src={`${import.meta.env.VITE_APIURL}/file${image}`}
                  style={{
                    maxWidth: '45px',
                    maxHeight: '45px',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Flexbox>
          );
        });
      },
    },
    {
      field: 'specificationName',
      headerName: '尺寸',
      width: 120,
      renderCell: params => {
        return rowsSrc.map((row, idx) => {
          if (idx + 1 === params.row?.no) {
            const product = productState.data?.find(p => {
              return p.productId === params.row.productId;
            });
            const variants = product?.variants.find(
              v => v.variantId === rowsSrc[idx].variantId,
            );
            return (
              <select
                key={idx}
                value={rowsSrc[idx]?.specificationId || ''}
                disabled={uneditable}
                onChange={e => {
                  const updatedArray = rowsSrc.map((item, index) => {
                    if (index === idx) {
                      const specification = variants.specification.find(
                        s => s._id === e.target.value,
                      );
                      return {
                        ...item,
                        specificationId: specification?._id,
                        specificationName: specification?.name,
                        discountedPrice: variants?.price,
                        quantity: 1,
                        amount: variants?.price * 1,
                      };
                    } else {
                      return item;
                    }
                  });
                  setRowsSrc(updatedArray);
                }}
              >
                <option value={''}> 請選擇尺寸 </option>
                {variants?.specification.map((item, index) => {
                  return (
                    <option
                      value={item._id}
                      key={index}
                      disabled={item.stock < 10}
                    >
                      {item.name} (剩餘{item.stock})
                    </option>
                  );
                })}
              </select>
            );
          }
        });
      },
    },
    {
      field: 'discountedPrice',
      headerName: '價格',
      width: 110,
      renderCell: params => {
        return (
          <input
            type='number'
            disabled={true}
            value={params.row.discountedPrice || ''}
          />
        );
      },
    },
    {
      field: 'quantity',
      headerName: '數量',
      width: 110,
      renderCell: params => {
        return rowsSrc.map((row, idx) => {
          if (idx + 1 === params.row?.no) {
            const product = productState.data?.find(p => {
              return p.productId === params.row.productId;
            });
            const variant = product?.variants.find(
              v => v.variantId === params.row.variantId,
            );
            const specification = variant?.specification.find(
              s => s._id === params.row.specificationId,
            );

            return (
              <input
                key={idx}
                type='number'
                value={params.row.quantity || ''}
                min={1}
                max={specification?.stock - 5 || 0}
                disabled={uneditable}
                onChange={e => {
                  const updatedArray = rowsSrc.map((item, index) => {
                    if (index === idx) {
                      // console.log(item);
                      return {
                        ...item,
                        quantity: e.target.value,
                        amount: item.discountedPrice * e.target.value,
                      };
                    } else {
                      return item;
                    }
                  });
                  setRowsSrc(updatedArray);
                }}
              />
            );
          }
        });
      },
    },
    {
      field: 'amount',
      headerName: '小計',
      width: 110,
      renderCell: params => {
        return (
          <input
            type='number'
            disabled={true}
            value={params.row.amount || ''}
          />
        );
      },
    },
  ];
  let globalIndex = 1;
  const [rowsSrc, setRowsSrc] = useState(form?.products || []);
  const rows = rowsSrc.map(item => {
    return {
      ...item,
      no: globalIndex++,
    };
  });
  useEffect(() => {
    setForm(prev => {
      return {
        ...prev,
        products: rowsSrc,
        productSubtotal: rowsSrc.reduce((acc, product) => {
          return acc + product.amount;
        }, 0),
      };
    });
  }, [rowsSrc]);


  const handleFormChange = e => {
    const { name, value, type } = e.target;
    if (orderState.error) {
      setSubmitClicked(false);
      dispatch(clearOrderError());
    }
    setPromptMessage(initialPromptMessage);
    if (name === 'shippingMethod') {
      let shippingFee;
      switch (value) {
        case '宅配到府':
          shippingFee = 150;
          break;
        case '超商取貨-711':
          shippingFee = 45;
          break;
        case '超商取貨-全家':
          shippingFee = 45;
          break;
        default:
          return;
      }
      setForm(prevState => ({
        ...prevState,
        [name]: value,
        shippingFee,
      }));
      return;
    }
    if (name === 'paymentStatus') {
      setForm(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          status: value,
        },
      }));
      return;
    }
    if (
      name === 'zipcode' ||
      name === 'county' ||
      name === 'district' ||
      name === 'address'
    ) {
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
      return;
    }
    if (name === 'invoiceType') {
      setForm(prevState => ({
        ...prevState,
        payment: {
          ...prevState.payment,
          invoice: {
            type: value,
            carrierNumber: '',
          },
        },
      }));
      return;
    }
    if (name === 'carrierNumber') {
      setForm(prevState => ({
        ...prevState,
        payment: {
          ...prevState.payment,
          invoice: {
            ...prevState.payment.invoice,
            carrierNumber: value,
          },
        },
      }));
      return;
    }
    let updatedForm = {
      ...form,
      [name]: type === 'number' ? parseInt(value) || parseInt(0) : value,
    };
    setForm(updatedForm);
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setOperateType('editOrder');
    const {
      orderNumber,
      username,
      status,
      products,
      productSubtotal,
      logistic,
      shippingDiscount,
      total,
      payment,
      memo,
      createdAt,
      createdBy,
      createrName,
      updatedAt,
      lastEditedBy,
      lastEditerName,
    } = form;
    if (
      username !== '' &&
      status !== '' &&
      logistic?.status !== '' &&
      logistic?.option !== '' &&
      logistic?.address?.zipcode !== '' &&
      logistic?.address?.county !== '' &&
      logistic?.address?.district !== '' &&
      logistic?.address?.address !== '' &&
      logistic?.receiver?.receiverMobileNumber !== '' &&
      logistic?.receiver?.receiverName &&
      payment.status !== '' &&
      payment.type !== '' &&
      payment.invoice.type !== ''
    ) {
      setSubmitClicked(true);
      const newData = {
        username: username,
        status,
        payment: {
          ...payment,
          status: payment?.status,
          type: payment?.type,
          option: payment?.option,
          invoice: {
            type: payment?.invoice?.type,
            carrierNumber: payment?.invoice?.carrierNumber,
          },
        },
        products,
        shippingDiscount,
        total: form.productSubtotal + form.logistic.fee - form.shippingDiscount,
        memo,
        lastEditedBy: authEmployeeState.data.employeeId,
      };
      // console.log(newData);

      await dispatch(orderRequests.update(TOKEN, orderNumber, newData));
    } else {
      alert('欄位填寫不完整');

      const requireField = [
        'username',
        'payment',
        'products',
        'shippingMethod',
        'address',
      ];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'username':
            emptyField = '用戶名稱欄位';
            break;
          default:
            return;
        }
        if (form[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };


  if (loading) {
    return <Layout.PageLayout>
      <SEO title='檢視訂單 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer $width={'auto'}>
          <Flexbox $gap={'1rem'} $justifyContent={'flex-start'}>
            <h1>
              訂單管理
              <ArrowRight />
              檢視
            </h1>
            <Button
              $width={'1rem'}
              $bg={'#fff'}
              $color={'#3b3b3b'}
              $padding={'3px 1px'}
              $animation
              onClick={() => {
                navigator(`/order/edit/${id}`);
              }}
            >
              <Edit />
            </Button>
          </Flexbox>
          {form?.logistic?.status === "待確認" && (
            <Button
              type='button'
              onClick={() => {
                if (satusIsActive['取消']) {
                  setOperateType('取消');
                  setShowModalElement(true);
                }
              }}
              $width={'4rem'}
              $color={satusIsActive['取消'] ? '#fff' : '#8d8d8d'}
              $bg={satusIsActive['取消'] ? '#d15252' : '#cccccc'}
              $animation={satusIsActive['取消'] ? true : false}
            >
              取消
            </Button>
          )}

        </TitleContainer>
        <Layout.Loading
          type={'spinningBubbles'}
          active={true}
          color={'#00719F'}
          width={100}
        />
      </Container>
    </Layout.PageLayout>
  }
  return (
    <Layout.PageLayout>
      <SEO title={`${!isEditing ? '檢視' : '編輯'}訂單 | 漾活管理後台`} description={null} url={null} />
      <Container>
        <TitleContainer $width={'auto'}>
          <Flexbox $gap={'1rem'} $justifyContent={'flex-start'}>
            <h1>
              訂單管理
              <ArrowRight />
              {!isEditing ? "檢視" : "編輯"}
            </h1>
            {!isEditing && <Button
              $width={'1rem'}
              $bg={'#fff'}
              $color={'#3b3b3b'}
              $padding={'3px 1px'}
              $animation
              onClick={() => {
                navigator(`/order/edit/${id}`);
              }}
            >
              <Edit />
            </Button>}
          </Flexbox>
          {
            !isEditing
              ? <>{form?.logistic?.status === "待確認" && (
                <Button
                  type='button'
                  onClick={() => {
                    if (satusIsActive['取消']) {
                      setOperateType('取消');
                      setShowModalElement(true);
                    }
                  }}
                  $width={'4rem'}
                  $color={satusIsActive['取消'] ? '#fff' : '#8d8d8d'}
                  $bg={satusIsActive['取消'] ? '#d15252' : '#cccccc'}
                  $animation={satusIsActive['取消'] ? true : false}
                >
                  取消
                </Button>
              )}</>
              : <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
                <Button
                  type='button'
                  onClick={() => {
                    const confirmed = confirm('確定要返回嗎? 請確保當前內容已保存');
                    if (confirmed) {
                      navigator(`/order/${id}`);
                    }
                  }}
                  $bg={'#a5a5a5'}
                  $animation
                >
                  返回
                </Button>
                <Button
                  type='button'
                  onClick={handleFormSubmit}
                  $bg={submitClicked && !orderState.error ? '' : '#5cc55f'}
                  $animation={submitClicked && !orderState.error ? false : true}
                >
                  提交
                </Button>
              </Flexbox>

          }


        </TitleContainer>
        <FormWrapper>
          <FormBody $padding={'0 1rem 0 0'}>
            <FormSide $gap={'24px'}>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>訂單編號</label>
                  <InputWrapper $height={'2.5rem'}>
                    <Input
                      name='orderNumber'
                      type='text'
                      onChange={handleFormChange}
                      value={form?.orderNumber}
                      disabled={true}
                    />
                  </InputWrapper>
                </FormCol>

                <FormCol $minWidth={'5rem'}>
                  <label>訂單狀態</label>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='status'
                      onChange={handleFormChange}
                      $border={
                        (promptMessage?.status ||
                          orderState.error?.errors.status) &&
                        '2px solid #d15252'
                      }
                      value={form.status}
                      disabled={uneditable}
                    >
                      {orderStatusList.map(status => {
                        const disabledArray = [];
                        return (
                          <option
                            key={status}
                            value={status}
                            disabled={disabledArray.includes(status)}
                          >
                            {status}
                          </option>
                        );
                      })}
                    </Select>
                    <Span $color={'#d15252'}>{promptMessage?.status}</Span>
                  </SelectWrapper>
                </FormCol>
              </FormRow>

              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>下單時間</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='createdAt'
                      type='text'
                      onChange={handleFormChange}
                      value={
                        form?.createdAt
                          ? new Date(form?.createdAt).toLocaleString(
                            {},
                            {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )
                          : ''
                      } disabled={true}
                    />
                  </InputWrapper>
                </FormCol>

                <FormCol $minWidth={'5rem'}>
                  <label>用戶名稱</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      type='text'
                      value={`${form?.username} ${form?.userInfo.lastName}${form?.userInfo.firstName}`}
                      disabled={true}
                    />
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>付款方式</label>

                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='payment'
                      value={form?.payment.type}
                      disabled={uneditable}
                    >
                      <option value='' disabled>
                        請選擇付款方式
                      </option>
                      <option value='線上付款'>線上付款</option>
                      <option value='貨到付款'>貨到付款</option>
                    </Select>
                  </SelectWrapper>
                  {
                    form?.payment.type === "線上付款" && <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                      <Select
                        name='payment'
                        value={form?.payment.option}
                        disabled={uneditable}
                      >
                        <option value='' disabled>
                          請選擇付款方式
                        </option>
                        <option value='信用卡'>信用卡</option>
                        <option value='LINE PAY'>LINE PAY</option>
                      </Select>
                    </SelectWrapper>
                  }

                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>付款狀態</label>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='paymentStatus'
                      onChange={handleFormChange}
                      $border={
                        (promptMessage?.paymentStatus ||
                          orderState.error?.errors.paymentStatus) &&
                        '2px solid #d15252'
                      }
                      value={form.payment.status}
                      disabled={uneditable}
                    >
                      <option value='' disabled>
                        請選擇付款狀態
                      </option>
                      <option value='尚未付款'>尚未付款</option>
                      <option value='已付款'>已付款</option>
                      <option value='已退款'>已退款</option>
                      <option value='退款處理中'>退款處理中</option>
                    </Select>
                    <Span $color={'#d15252'}>
                      {promptMessage?.paymentStatus}
                    </Span>
                  </SelectWrapper>
                  <Button
                    type='button'
                    $width={'4rem'}
                    $padding={'0.5rem'}
                    onClick={() => {
                      if (satusIsActive['收款']) {
                        setOperateType('收款');
                        setShowModalElement(true);
                      } else {
                        alert('當前狀態無法進行【收款】操作');
                      }
                    }}
                    $color={satusIsActive['收款'] ? '#fff' : '#8d8d8d'}
                    $bg={satusIsActive['收款'] ? '#5cc55f' : '#cccccc'}
                    $animation={satusIsActive['收款'] ? true : false}
                  >
                    收款
                  </Button>
                  <Button
                    type='button'
                    $width={'4rem'}
                    $padding={'0.5rem'}
                    onClick={() => {
                      if (satusIsActive['退款']) {
                        setOperateType('退款');
                        setShowModalElement(true);
                      } else {
                        alert('當前狀態無法進行【退款】操作');
                      }
                    }}
                    $color={satusIsActive['退款'] ? '#fff' : '#8d8d8d'}
                    $bg={satusIsActive['退款'] ? '#d15252' : '#cccccc'}
                    $animation={satusIsActive['退款'] ? true : false}
                  >
                    退款
                  </Button>
                </FormCol>
              </FormRow>

              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>發票開立</label>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='invoiceType'
                      value={form.payment?.invoice?.type}
                      disabled={uneditable}
                      onChange={handleFormChange}
                    >
                      <option value='' disabled>
                        請選擇付款類型
                      </option>
                      <option value='紙本發票'>紙本發票</option>
                      <option value='發票載具'>發票載具</option>
                    </Select>
                  </SelectWrapper>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='carrierNumber'
                      type='text'
                      onChange={handleFormChange}
                      value={form?.payment?.invoice?.carrierNumber}
                      disabled={
                        (submitClicked && !orderState.error) ||
                        form.payment?.invoice?.type !== '發票載具'
                      }
                    />
                  </InputWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}></FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>出貨編號</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='logisticNumber'
                      type='text'
                      value={form?.logistic?.logisticNumber}
                      disabled={true}
                    />
                  </InputWrapper>
                  {form?.logistic?.logisticNumber && (
                    <Link
                      to={`/logistic/${form?.logistic?.logisticNumber}`}
                      target='_blank'
                      style={{ textDecoration: 'none' }}
                    >
                      <Launch />
                    </Link>
                  )}
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>出貨狀態</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='logisticStatus'
                      type='text'
                      value={form?.logistic?.status}
                      disabled={true}
                    />
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow>
                <FormCol $minWidth={'5rem'} $minHeight={'260px'}>
                  <Flexbox
                    $direction={'column'}
                    $width={'5rem'}
                    $gap={'1rem'}
                    $alignItems={'flex-start'}
                  >
                    <label>訂單商品</label>
                    {isEditing &&
                      <Button
                        type='button'
                        $width={'3rem'}
                        $color={'#999'}
                        $bg={'transparent'}
                        onClick={() => {
                          setOperateType('增加商品')
                          setShowModalElement(true);
                        }}
                        $animation
                      >
                        <Add />
                        增加
                      </Button>}
                  </Flexbox>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={row => row.no}
                    checkboxSelection={false}
                    disableSelectionOnClick
                  />
                </FormCol>
              </FormRow>
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>商品合計</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='productSubtotal'
                      type='text'
                      onChange={handleFormChange}
                      value={numberWithCommas(form.productSubtotal || 0)}
                      disabled={true}
                    />
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>運送方式</label>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='shippingMethod'
                      onChange={handleFormChange}
                      $border={
                        (promptMessage?.shippingMethod ||
                          orderState.error?.errors.shippingMethod) &&
                        '2px solid #d15252'
                      }
                      value={form.shippingMethod}
                      disabled={uneditable}
                    >
                      <option value='' disabled>
                        請選擇運送方式
                      </option>
                      <option value='宅配到府'>宅配到府 / 150元</option>
                      <option value='超商取貨-711'>超商取貨-711 / 45元</option>
                      <option value='超商取貨-全家'>
                        超商取貨-全家 / 45元
                      </option>
                    </Select>
                    <Span $color={'#d15252'}>
                      {promptMessage?.shippingMethod}
                    </Span>
                  </SelectWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>運送折扣</label>
                  <Flexbox>
                    -
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.shippingDiscount ||
                          orderState.error?.errors.shippingDiscount) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='shippingDiscount'
                        type='number'
                        min={0}
                        max={form?.shippingFee}
                        onChange={handleFormChange}
                        value={form.shippingDiscount || 0}
                        disabled={uneditable}
                        $color={'#d15252'}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.shippingDiscount}
                      </Span>
                      <Span $color={'#d15252'}>
                        {orderState.error?.errors.shippingDiscount}
                      </Span>
                    </InputWrapper>
                  </Flexbox>
                </FormCol>
              </FormRow>

              {(form.logistic.option === '超商取貨-711' ||
                form.logistic.option === '超商取貨-全家') && (
                  <>
                    {' '}
                    <FormRow $gap={'24px'}>
                      <FormCol $minWidth={'5rem'}>
                        <label>選擇門市</label>
                        <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                          <Select
                            name='county'
                            value={form.logistic.address.county}
                            disabled={uneditable}
                          >
                            <option value='' disabled={true}>
                              選擇縣市
                            </option>
                            <option value='台北市'>台北市</option>
                          </Select>
                          <Span $color={'#d15252'}>{promptMessage?.county}</Span>
                        </SelectWrapper>

                        <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                          <Select
                            name='district'
                            value={form.logistic.address.district}
                            disabled={uneditable}
                          >
                            <option value='' disabled={true}>
                              選擇區域
                            </option>
                            <option value='士林區'>士林區</option>
                          </Select>
                          <Span $color={'#d15252'}>
                            {promptMessage?.district}
                          </Span>
                        </SelectWrapper>
                      </FormCol>
                      <FormCol $minWidth={'5rem'}>
                        <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                          <Select
                            name='storeName'
                            value={form.logistic.address.convenienceStore.storeId}
                            disabled={uneditable}
                          >
                            <option value='' disabled={uneditable}>
                              選擇門市
                            </option>
                            <option value='240950'>240950 文林門市</option>
                          </Select>
                          <Span $color={'#d15252'}>
                            {promptMessage?.storeName}
                          </Span>
                        </SelectWrapper>
                      </FormCol>
                    </FormRow>
                    <FormRow $gap={'24px'}>
                      <FormCol $minWidth={'5rem'}>
                        <label></label>
                        <InputWrapper
                          $height={'2.5rem'}
                          $spanOffset={'-1.2rem'}
                          $border={
                            (promptMessage?.address?.district ||
                              orderState.error?.errors.district) &&
                            '2px solid #d15252'
                          }
                        >
                          <Input
                            type='text'
                            placeholder='門市詳細地址'
                            value={`${form?.logistic?.address?.zipcode} ${form?.logistic?.address?.county}${form?.logistic?.address?.district} ${form?.logistic?.address?.address}`}
                            disabled={uneditable}
                          />
                        </InputWrapper>
                      </FormCol>
                    </FormRow>
                  </>
                )}

              {form.logistic.option === '宅配到府' && (
                <FormRow $gap={'24px'}>
                  <FormCol $minWidth={'5rem'}>
                    <label>收貨地址</label>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.address?.zipcode ||
                          orderState.error?.errors.address?.zipcode) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='zipcode'
                        type='text'
                        placeholder='郵遞區號'
                        value={form?.logistic?.address?.zipcode}
                        disabled={uneditable}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.address?.zipcode}
                      </Span>
                      <Span $color={'#d15252'}>
                        {orderState.error?.errors.address?.zipcode}
                      </Span>
                    </InputWrapper>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.address?.county ||
                          orderState.error?.errors.county) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='county'
                        type='text'
                        placeholder='縣市'
                        value={form?.logistic?.address?.county}
                        disabled={uneditable}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.address?.county}
                      </Span>
                      <Span $color={'#d15252'}>
                        {orderState.error?.errors.address?.county}
                      </Span>
                    </InputWrapper>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.address?.district ||
                          orderState.error?.errors.district) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='district'
                        type='text'
                        placeholder='鄉鎮市區'
                        value={form?.logistic?.address?.district}
                        disabled={uneditable}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.address?.district}
                      </Span>
                      <Span $color={'#d15252'}>
                        {' '}
                        {orderState.error?.errors.district}
                      </Span>
                    </InputWrapper>
                  </FormCol>
                  <FormCol $minWidth={'5rem'}>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.address?.address ||
                          orderState.error?.errors.address) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='address'
                        type='text'
                        placeholder='詳細地址'
                        value={form?.logistic?.address?.address}
                        disabled={uneditable}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.address?.address}
                      </Span>
                      <Span $color={'#d15252'}>
                        {orderState.error?.errors.address}
                      </Span>
                    </InputWrapper>
                  </FormCol>
                </FormRow>
              )}
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>收件人</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='receiverName'
                      type='text'
                      value={form?.logistic?.receiver?.receiverName}
                      disabled={uneditable}
                    />
                  </InputWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>電話</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='receiverMobileNumber'
                      type='text'
                      value={form?.logistic?.receiver?.receiverMobileNumber}
                      disabled={uneditable}
                    />
                  </InputWrapper>
                </FormCol>
              </FormRow>

              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>運費小計</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      type='number'
                      value={form.logistic.fee - form.shippingDiscount}
                      disabled={true}
                    />
                  </InputWrapper>
                </FormCol>
              </FormRow>

              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>總金額</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.total ||
                        orderState.error?.errors.total) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='total'
                      type='text'
                      value={numberWithCommas(
                        form.productSubtotal +
                        form.logistic.fee -
                        form.shippingDiscount,
                      )}
                      onChange={handleFormChange}
                      disabled={true}
                    />
                    <Span $color={'#d15252'}>{promptMessage?.total}</Span>
                    <Span $color={'#d15252'}>
                      {orderState.error?.errors.total}
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>備註事項</label>
                  <InputWrapper $height='4rem'>
                    <Textarea
                      name='memo'
                      value={form?.memo}
                      onChange={handleFormChange}
                      disabled={uneditable}
                      placeholder='備註內容'
                    />
                  </InputWrapper>
                </FormCol>
              </FormRow>
              {form?.cancelReason &&
                <FormRow>
                  <FormCol $minWidth={'5rem'}>
                    <label></label>
                    <InputWrapper $height='4rem'>
                      <Textarea
                        name='cancelReason'
                        value={form?.cancelReason}
                        disabled={uneditable || !isEditing}
                        placeholder='取消原因'
                      />
                    </InputWrapper>
                  </FormCol>
                </FormRow>}
              {form?.requestReturnReason &&
                <FormRow>
                  <FormCol $minWidth={'5rem'}>
                    <label></label>
                    <InputWrapper $height='4rem'>
                      <Textarea
                        name='requestReturnReason'
                        value={form?.requestReturnReason}
                        disabled={uneditable || !isEditing}
                        placeholder='申請退貨原因'
                      />
                    </InputWrapper>
                  </FormCol>
                </FormRow>}


              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>最後更新</label>
                  {form?.updatedAt && (
                    <Span>
                      {`${new Date(form?.updatedAt).toLocaleString(
                        {},
                        {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )} 
                      ${form.lastEditerName}(${form.lastEditedBy})`}
                    </Span>
                  )}
                </FormCol>
              </FormRow>
            </FormSide>

            {/* <Span><pre>form {JSON.stringify(form, null, 2)}</pre></Span> */}
          </FormBody>
        </FormWrapper>
        {
          operateType === '增加商品' && (<Modal
            open={showModalElement}
            onClose={() => setShowModalElement(false)}
          >
            <SelectProduct
              setShowModalElement={setShowModalElement}
              setRowsSrc={setRowsSrc}
              setProduct={item => {
                setRowsSrc(prevRows => [
                  ...prevRows,
                  {
                    'productId': item._id,
                    'productName': item.productName,
                    'variantId': '',
                    'variantName': '',
                    'specificationId': '',
                    'specificationName': '',
                    'discountedPrice': 0,
                    'quantity': 1,
                    'amount': 0,
                  },
                ]);
              }}
            />
          </Modal>)
        }


        {operateType === '收款' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Receiving
              setForm={setForm}
              setShowModalElement={setShowModalElement}
            />
          </Modal>
        )}
        {operateType === '退款' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Refund
              setForm={setForm}
              setShowModalElement={setShowModalElement}
            />
          </Modal>
        )}
        {operateType === '取消' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Cancel
              setForm={setForm}
              setShowModalElement={setShowModalElement}
            />
          </Modal>
        )}


      </Container>
    </Layout.PageLayout>
  );
};

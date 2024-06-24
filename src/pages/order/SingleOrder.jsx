//react
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { productRequests } from '@/store/product';
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
    dispatch(productRequests.getAll(TOKEN));
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
          return (
            <Flexbox $justifyContent={'space-between'} $gap={'1rem'} key={idx}>
              <select
                value={rowsSrc[idx]?.variantId || ''}
                disabled={true}
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
                disabled={true}
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
                      disabled={true}
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
                disabled={true}
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
    if (name === 'paymentType') {
      setForm(prevState => ({
        ...prevState,
        payment: {
          status: '尚未付款',
          type: value,
          option: '',
          invoice: {
            type: prevState.payment?.invoice?.type,
            carrierNumber: prevState.payment?.invoice?.carrierNumber,
          },
        },
      }));
      return;
    }
    if (name === 'paymentOption') {
      setForm(prevState => ({
        ...prevState,
        payment: {
          ...prevState.payment,
          option: value,
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
            ...prevState.payment.invoice,
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
    if (name === 'logisticOption') {
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
        logistic: {
          ...prevState.logistic,
          option: value,
          fee: shippingFee,
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
        logistic: {
          ...prev.logistic,
          address: {
            ...prev.logistic?.address,
            [name]: value,
          },
        },
      }));
      return;
    }

    if (name === 'storeName') {
      setForm(prev => ({
        ...prev,
        logistic: {
          ...prev.logistic,
          address: {
            ...prev.logistic?.address,
            zipcode: '111',
            address: '大北路14號16號1樓',
            convenienceStore: {
              storeName: '文林門市',
              storeId: value,
            },
          },
        },
      }));
      return;
    }
    if (name === 'receiverName' || name === 'receiverMobileNumber') {
      setForm(prevState => ({
        ...prevState,
        logistic: {
          ...prevState.logistic,
          receiver: {
            ...prevState.logistic.receiver,
            [name]: value,
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
      payment, _id, orderNumber, username, status, products, productSubtotal, shippingDiscount, total, memo, cancelReason, requestReturnReason, lastEditedBy, createdAt, updatedAt, logistic, userInfo, lastEditerName
    } = form;
    if (
      payment.type !== '' &&
      (payment?.type === '貨到付款' || (payment?.type === '線上付款' &&
        payment.option !== '')) &&
      (payment?.invoice?.type === '紙本發票' || (payment?.invoice?.type === '發票載具' && form['payment']?.invoice?.carrierNumber !== '')) &&
      products.length !== 0 &&
      logistic.option !== '' &&
      logistic?.address.zipcode !== '' &&
      logistic?.address.county !== '' &&
      logistic?.address.district !== '' &&
      logistic?.address.address !== '' &&
      (logistic?.option === '宅配到府' || logistic?.option !== '宅配到府' && form['logistic']?.address?.convenienceStore?.storeName !== '') &&
      logistic.receiver.receiverName !== '' &&
      logistic.receiver.receiverMobileNumber !== ''
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

      if (form['payment']?.type === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            payment: { ...prev.payment, type: `郵遞區號欄位不得為空` },
          };
        });
      }
      if (form['payment']?.option === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            payment: { ...prev.payment, option: `付款方式欄位不得為空` },
          };
        });
      }
      if (form['payment']?.invoice?.type === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            payment: {
              ...prev.payment,
              invoice: {
                ...prev?.payment?.invoice,
                type: `發票開立方式欄位不得為空`
              }
            },
          };
        });
      }
      if (form['payment']?.invoice?.type === '發票載具' && form['payment']?.invoice?.carrierNumber === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            payment: {
              ...prev?.payment,
              invoice: {
                ...prev?.payment?.invoice,
                carrierNumber: `載具號碼欄位不得為空`
              }
            },
          };
        });
      }
      if (form['products'].length === 0) {
        setPromptMessage(prev => {
          return {
            ...prev,
            products: `訂單商品欄位不得為空`,
          };
        });
      }
      if (form['logistic']?.option === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            logistic: {
              ...prev.logistic,
              option: `運送方式欄位不得為空`,
            }
          };
        });
      }
      if (form['logistic']?.address.zipcode === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            logistic: {
              ...prev.logistic,
              address: {
                ...prev?.logistic?.address,
                zipcode: `郵遞區號不得為空`,
              }
            }
          };
        });
      }
      if (form['logistic']?.address.county === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            logistic: {
              ...prev.logistic,
              address: {
                ...prev?.logistic?.address,
                county: `縣市不得為空`,
              }
            }
          };
        });
      }
      if (form['logistic']?.address.district === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            logistic: {
              ...prev.logistic,
              address: {
                ...prev?.logistic?.address,
                district: `鄉鎮市區不得為空`,
              }
            }
          };
        });
      }
      if (form['logistic']?.address.address === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            logistic: {
              ...prev.logistic,
              address: {
                ...prev?.logistic?.address,
                address: `詳細地址欄位不得為空`,
              }
            }
          };
        });
      }
      if (form['logistic']?.option !== '宅配到府' && form['logistic']?.address?.convenienceStore?.storeName === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            logistic: {
              ...prev.logistic,
              address: {
                ...prev?.logistic?.address,
                convenienceStore: {
                  ...prev?.logistic?.address?.convenienceStore,
                  storeName: `選擇門市欄位不得為空`,
                }
              }
            }
          };
        });
      }
      if (form['logistic']?.receiver?.receiverName === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            logistic: {
              ...prev.logistic,
              receiver: {
                ...prev.logistic.receiver,
                receiverName: `收件人名稱不得為空`
              }
            }
          };
        });
      }
      if (form['logistic']?.receiver?.receiverMobileNumber === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            logistic: {
              ...prev.logistic,
              receiver: {
                ...prev.logistic.receiver,
                receiverMobileNumber: `收件人電話不得為空`
              }
            }
          };
        });
      }
      const requireField = ['username'];
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
                setSubmitClicked(false)
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
                      value={`${form?.username} ${form?.userInfo?.lastName}${form?.userInfo?.firstName}`}
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
                      onChange={handleFormChange}
                      disabled={uneditable || form.payment.status !== '尚未付款' || form.payment.status !== '已退款'}
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
                        onChange={handleFormChange}
                        disabled={uneditable || form.payment.status !== '尚未付款' || form.payment.status !== '已退款'}
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
                      disabled={uneditable || (form.payment.status !== '已退款' || form.payment.status !== '退款處理中')}
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
                      $border={
                        (promptMessage?.payment?.invoice?.type ||
                          orderState.error?.errors?.payment?.invoice?.type) &&
                        '2px solid #d15252'
                      }
                    >
                      <option value='' disabled>
                        請選擇付款類型
                      </option>
                      <option value='紙本發票'>紙本發票</option>
                      <option value='發票載具'>發票載具</option>
                    </Select>
                    <Span $color={'#d15252'}>
                      {promptMessage?.payment?.invoice?.type}
                    </Span>
                  </SelectWrapper>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    {
                      form['payment']?.invoice?.type === '發票載具' && <>
                        <Input
                          name='carrierNumber'
                          type='text'
                          onChange={handleFormChange}
                          value={form?.payment?.invoice?.carrierNumber}
                          placeholder={'載具號碼'}
                          disabled={uneditable ||
                            form.payment?.invoice?.type !== '發票載具'
                          }
                          $border={
                            (promptMessage?.payment?.invoice?.carrierNumber ||
                              orderState.error?.errors?.payment?.invoice?.carrierNumber) &&
                            '2px solid #d15252'
                          }
                        />

                        <Span $color={'#d15252'}>
                          {promptMessage?.payment?.invoice?.carrierNumber}
                        </Span>
                      </>}
                  </InputWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'} />
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>出貨編號</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='logisticNumber'
                      type='text'
                      value={form?.logistic?.logisticNumber}
                      onChange={handleFormChange}
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
                      onChange={handleFormChange}
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
                        disabled={true}
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
                      name='logisticOption'
                      onChange={handleFormChange}
                      $border={
                        (promptMessage?.logistic?.option ||
                          orderState.error?.errors?.logistic?.option) &&
                        '2px solid #d15252'
                      }
                      disabled={true}
                      value={form.logistic.option}
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
                      {promptMessage?.logistic?.option}
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
              {form.logistic.option === '宅配到府' && (
                <FormRow $gap={'24px'}>
                  <FormCol $minWidth={'5rem'}>
                    <label>收貨地址</label>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.logistic?.address?.zipcode ||
                          orderState.error?.errors.logistic?.address?.zipcode) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='zipcode'
                        type='text'
                        placeholder='郵遞區號'
                        onChange={handleFormChange}
                        value={form?.logistic?.address?.zipcode}
                        disabled={true}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.logistic?.address?.zipcode}
                      </Span>
                      <Span $color={'#d15252'}>
                        {orderState.error?.errors.address?.zipcode}
                      </Span>
                    </InputWrapper>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.logistic?.address?.county ||
                          orderState.error?.errors.logistic?.address?.county) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='county'
                        type='text'
                        placeholder='縣市'
                        onChange={handleFormChange}
                        value={form?.logistic?.address?.county}
                        disabled={true}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.logistic?.address?.county}
                      </Span>
                      <Span $color={'#d15252'}>
                        {orderState.error?.errors?.logistic?.address?.county}
                      </Span>
                    </InputWrapper>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.logistic?.address?.district ||
                          orderState.error?.errors?.logistic?.address?.district) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='district'
                        type='text'
                        placeholder='鄉鎮市區'
                        onChange={handleFormChange}
                        value={form?.logistic?.address?.district}
                        disabled={true}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.logistic?.address?.district}
                      </Span>
                      <Span $color={'#d15252'}>
                        {' '}
                        {orderState.error?.errors?.logistic?.address?.district}
                      </Span>
                    </InputWrapper>
                  </FormCol>
                  <FormCol $minWidth={'5rem'}>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (promptMessage?.logistic?.address?.address ||
                          orderState.error?.errors?.logistic?.address?.address) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        name='address'
                        type='text'
                        placeholder='詳細地址'
                        onChange={handleFormChange}
                        value={form?.logistic?.address?.address}
                        disabled={true}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.logistic?.address?.address}
                      </Span>
                      <Span $color={'#d15252'}>
                        {orderState.error?.errors?.logistic?.address?.address}
                      </Span>
                    </InputWrapper>
                  </FormCol>
                </FormRow>
              )}
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
                            onChange={handleFormChange}
                            $border={
                              (promptMessage?.logistic?.address?.county ||
                                orderState.error?.errors.logistic?.address?.county) &&
                              '2px solid #d15252'
                            }
                            value={form?.logistic?.address?.county || uneditable}
                            disabled={true}
                          >
                            <option value='' >
                              選擇縣市
                            </option>
                            <option value='台北市'>台北市</option>
                          </Select>
                          <Span $color={'#d15252'}>
                            {promptMessage?.logistic?.address?.county}
                          </Span>
                          <Span $color={'#d15252'}>
                            {orderState.error?.errors?.logistic?.address?.county}
                          </Span>
                        </SelectWrapper>

                        <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                          <Select
                            name='district'
                            onChange={handleFormChange}
                            $border={
                              (promptMessage?.logistic?.address?.district ||
                                orderState.error?.errors?.logistic?.address?.district) &&
                              '2px solid #d15252'
                            }
                            value={form?.logistic?.address?.district}
                            disabled={true}
                          >
                            <option value='' disabled={true}>
                              選擇區域
                            </option>
                            <option value='士林區'>士林區</option>
                          </Select>

                          <Span $color={'#d15252'}>
                            {promptMessage?.logistic?.address?.district}
                          </Span>
                          <Span $color={'#d15252'}>
                            {' '}
                            {orderState.error?.errors?.logistic?.address?.district}
                          </Span>
                        </SelectWrapper>
                      </FormCol>
                      <FormCol $minWidth={'5rem'}>
                        <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                          <Select
                            name='storeName'
                            onChange={handleFormChange}
                            $border={
                              (promptMessage?.logistic?.address?.convenienceStore?.storeName ||
                                orderState.error?.errors?.logistic?.address?.convenienceStore?.storeName) &&
                              '2px solid #d15252'
                            }
                            value={form?.logistic?.address.convenienceStore?.storeId}
                            disabled={true}
                          >
                            <option value='' disabled={true}>
                              選擇門市
                            </option>
                            <option value='240950'>240950 文林門市</option>
                          </Select>

                          <Span $color={'#d15252'}>
                            {promptMessage?.logistic?.address?.convenienceStore?.storeName}
                          </Span>
                          <Span $color={'#d15252'}>
                            {' '}
                            {orderState.error?.errors?.logistic?.address?.convenienceStore?.storeName}
                          </Span>
                        </SelectWrapper>
                      </FormCol>
                    </FormRow>
                    <FormRow $gap={'24px'}>
                      <FormCol $minWidth={'5rem'}>
                        <label />
                        <InputWrapper
                          $height={'2.5rem'}
                          $spanOffset={'-1.2rem'}
                        >
                          <Input
                            type='text'
                            placeholder='門市詳細地址'
                            value={(form?.logistic?.address?.address)
                              ? (`${form?.logistic?.address?.zipcode} ${form?.logistic?.address?.county}${form?.logistic?.address?.district} ${form?.logistic?.address?.address}`)
                              : ``}
                            disabled={true}
                          />
                        </InputWrapper>
                      </FormCol>
                    </FormRow>
                  </>
                )}


              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>收件人</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.logistic?.receiver?.receiverName ||
                        orderState.error?.errors?.logistic?.receiver?.receiverName) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='receiverName'
                      type='text'
                      onChange={handleFormChange}
                      value={form?.logistic?.receiver?.receiverName}
                      disabled={true}
                    />
                    <Span $color={'#d15252'}>
                      {promptMessage?.logistic?.receiver?.receiverName}
                    </Span>
                    <Span $color={'#d15252'}>
                      {orderState.error?.errors?.logistic?.receiver?.receiverName}
                    </Span>
                  </InputWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>電話</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.logistic?.receiver?.receiverMobileNumber ||
                        orderState.error?.errors?.logistic?.receiver?.receiverMobileNumber) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='receiverMobileNumber'
                      type='text'
                      onChange={handleFormChange}
                      value={form?.logistic?.receiver?.receiverMobileNumber}
                      disabled={true}
                    />
                    <Span $color={'#d15252'}>
                      {promptMessage?.logistic?.receiver?.receiverMobileNumber}
                    </Span>
                    <Span $color={'#d15252'}>
                      {orderState.error?.errors?.logistic?.receiver?.receiverMobileNumber}
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>運費小計</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      type='number'
                      value={form?.logistic?.fee - form?.shippingDiscount}
                      disabled={true}
                    />
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
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
                      disabled={submitClicked && !orderState.error}
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
                        onChange={handleFormChange}
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
                        onChange={handleFormChange}
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
              {/* <Span><pre>{JSON.stringify(promptMessage, null, 2)}</pre></Span> */}
              {/* <Span><pre>{JSON.stringify(productState.data, null, 2)}</pre></Span> */}
            </FormSide>
            {/* <Span><pre>{JSON.stringify(form, null, 2)}</pre></Span> */}
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

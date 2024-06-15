//react
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { orderRequests, clearOrderError } from '@/store/order';
import { productRequests } from '@/store/product';
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
import { Add, Edit, Delete, ArrowRight } from '@material-ui/icons';
const { FormWrapper, FormBody, FormRow, FormCol, FormSide } = Form;
import { UserSearchFilter } from './modalEl/UserSearchFilter';
import { SelectProduct } from './modalEl/SelectProduct';
//utils
import { numberWithCommas } from '../../utils/format';
import { object } from 'prop-types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
`;

export const AddOrder = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const productState = useSelector(state => state.product);
  const orderState = useSelector(state => state.order);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialFormData = {
    orderNumber: '',
    username: '',
    status: '未成立',
    products: [],
    productSubtotal: 0,
    logistic: {
      status: '待確認',
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
      status: '尚未付款',
      type: '',
      option: '',
      invoice: {
        type: '',
        carrierNumber: '',
      },
    },
    memo: '',
    createdAt: null,
    createdBy: authEmployeeState.data.employeeId,
    createrName: authEmployeeState.data.name,
    updatedAt: null,
    lastEditedBy: authEmployeeState.data.employeeId,
    lastEditerName: authEmployeeState.data.name,
  };
  const [form, setForm] = useState(initialFormData);
  //表單提示
  const initialPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initialPromptMessage);
  //狀態管理
  const [operateType, setOperateType] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [showModalElement, setShowModalElement] = useState(false);

  //useEffect
  useEffect(() => {
    setCurrentPage('/order');
    dispatch(productRequests.getAll(TOKEN));
  }, []);

  //⚠️
  useEffect(() => {
    if (operateType === 'addOrder') {
      if (submitClicked & (orderState.error === null)) {
        const order = orderState.data[0];
        setForm(prevState => ({
          ...prevState,
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
          createdBy: order.createdBy,
          createrName: order.createrName,
          updatedAt: order.updatedAt,
          lastEditedBy: order.lastEditedBy,
          lastEditerName: order.lastEditerName,
        }));
        const confirmed = confirm('已新增訂單');
        if (confirmed) {
          navigator('/order');
        } else {
          navigator(`/order/${order.orderNumber}`);
        }
      }
    }
  }, [orderState.data]);

  useEffect(() => {
    //計算總金額
    setForm(prev => {
      return {
        ...prev,
        total: form.productSubtotal + form.logistic.fee - form.shippingDiscount,
      };
    });
  }, [form.productSubtotal, form.logistic.fee, form.shippingDiscount]);

  const handleFormChange = e => {
    const { name, value, type } = e.target;
    if (orderState.error) {
      setSubmitClicked(false);
      dispatch(clearOrderError());
    }
    setPromptMessage(initialPromptMessage);

    if (name === 'paymentType') {
      setForm(prevState => ({
        ...prevState,
        payment: {
          status: '尚未付款',
          type: value,
          option: '',
          invoice: {
            type: prevState.payment.invoice.type,
            carrierNumber: prevState.payment.invoice.carrierNumber,
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
            ...prev.logistic.address,
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
            ...prev.logistic.address,
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
    setOperateType('addOrder');
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
      payment.type !== '' &&
      payment.invoice.type !== '' &&
      products.length !== 0 &&
      logistic.address.zipcode !== '' &&
      logistic.address.county !== '' &&
      logistic.address.district !== '' &&
      logistic.address.address !== '' &&
      logistic.receiver.receiverName !== '' &&
      logistic.receiver.receiverMobileNumber !== ''
    ) {
      setSubmitClicked(true);

      const structuredProducts = products.map((item, index) => {
        return {
          productId: item.productId,
          productNumber: item.productNumber, //🔥
          productName: item.productName,
          variantId: item.variantId,
          variantName: item.variantName,
          specificationId: item.specificationId,
          specificationName: item.specificationName,
          discountedPrice: item.discountedPrice, //🔥
          quantity: item.quantity,
        };
      });

      const newData = {
        username: username,
        status: '已成立',
        products: structuredProducts,
        productSubtotal: productSubtotal,
        logistic: {
          option: logistic.option,
          fee: logistic.fee,
          address: {
            zipcode: logistic.address?.zipcode,
            county: logistic.address?.county,
            district: logistic.address?.district,
            address: logistic.address?.address,
            convenienceStore: {
              storeName: logistic.address?.convenienceStore?.storeName,
              storeId: logistic.address?.convenienceStore?.storeId,
            },
          },
          receiver: {
            receiverName: logistic.receiver.receiverName,
            receiverMobileNumber: logistic.receiver.receiverMobileNumber,
          },
        },
        shippingDiscount: shippingDiscount,
        total: total,
        payment: {
          status: payment.status,
          type: payment?.type,
          option: payment?.option,
          invoice: {
            type: payment.invoice.type,
            carrierNumber: payment.invoice.carrierNumber,
          },
        },
        memo: memo,
        lastEditedBy: authEmployeeState.data.employeeId,
      };
      console.log(newData);

      await dispatch(orderRequests.add(TOKEN, newData));
    } else {
      if (form['address']?.zipcode === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: { ...prev.address, zipcode: `郵遞區號欄位不得為空` },
          };
        });
      }
      if (form['address']?.county === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: { ...prev.address, county: `縣市欄位不得為空` },
          };
        });
      }
      if (form['address']?.district === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: { ...prev.address, district: `鄉鎮市區欄位不得為空` },
          };
        });
      }
      if (form['address']?.address === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: { ...prev.address, address: `詳細地址欄位不得為空` },
          };
        });
      }
      const requireField = [
        'username',
        'payment',
        'products',
        'logisticOption',
        'address',
      ];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'username':
            emptyField = '用戶名稱欄位';
            break;
          case 'payment':
            emptyField = '付款方式欄位';
            break;
          case 'logisticOption':
            emptyField = '運送方式欄位';
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
          const product = productState.data.find(p => {
            return p.productId === params.row.productId;
          });
          return (
            <Flexbox $justifyContent={'space-between'} $gap={'1rem'} key={idx}>
              <select
                value={rowsSrc[idx]?.variantId || ''}
                disabled={submitClicked && !orderState.error}
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
              {rowsSrc[idx]?.variantId && (
                <img
                  src={`${import.meta.env.VITE_APIURL}/file${rowsSrc[idx].variantImage}`}
                  alt=''
                  style={{ maxWidth: '45px', maxHeight: '45px' }}
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
            const product = productState.data.find(p => {
              return p.productId === params.row.productId;
            });
            const variants = product?.variants.find(
              v => v.variantId === rowsSrc[idx].variantId,
            );
            return (
              <select
                key={idx}
                value={rowsSrc[idx]?.specificationId || ''}
                disabled={submitClicked && !orderState.error}
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
            onChange={e => { }}
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
            const product = productState.data.find(p => {
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
                disabled={submitClicked && !orderState.error}
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
    {
      field: 'actions',
      headerName: ' ',
      width: 140,
      renderCell: params => {
        return (
          <>
            <Button
              type='button'
              $width={'3rem'}
              $color={'#999'}
              $bg={'transparent'}
              onClick={() => {
                const confirmed = confirm(
                  `確定要【移除】${params.row.productName}-${params.row.variantName} 嗎`,
                );
                if (confirmed) {
                  const array = rows.filter(item => item.no !== params.row.no);
                  array.forEach((item, idx) => {
                    item.no = idx + 1;
                  });
                  setRowsSrc(array);
                }
              }}
              disabled={submitClicked && !orderState.error}
              $animation={!(submitClicked && !orderState.error)}
            >
              <Delete />
              移除
            </Button>
          </>
        );
      },
    },
  ];
  let globalIndex = 1;
  const [rowsSrc, setRowsSrc] = useState([]);
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

  const orderStatusList = ['已成立', '已出貨', '已送達', '已完成', '已取消', "退貨作業中", "退貨退款"];

  return (
    <Layout.PageLayout>
      <SEO title='新增訂單 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>
            訂單管理
            <ArrowRight />
            新增
          </h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                const confirmed = confirm('確定要返回嗎? 請確保當前內容已保存');
                if (confirmed) {
                  navigator('/order');
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
                      value={form.orderNumber}
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
                      disabled={true}
                    >
                      <option value=''>未成立</option>
                      {orderStatusList.map(status => {
                        return (
                          <option key={status} value={status}>
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
                      }
                      disabled={true}
                    />
                  </InputWrapper>
                </FormCol>

                <FormCol $minWidth={'5rem'}>
                  <label>用戶名稱</label>
                  <UserSearchFilter
                    promptMessage={promptMessage}
                    initPromptMessage={() => {
                      setPromptMessage(initialPromptMessage);
                    }}
                    submitClicked={submitClicked}
                    setUser={user => {
                      setForm(prev => ({
                        ...prev,
                        username: user ? user.username : '',
                      }));
                    }}
                  />
                </FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>付款方式</label>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='paymentType'
                      onChange={handleFormChange}
                      $border={
                        (promptMessage?.payment?.type ||
                          orderState.error?.errors.payment) &&
                        '2px solid #d15252'
                      }
                      value={form.payment?.type}
                      disabled={submitClicked && !orderState.error}
                    >
                      <option value='' disabled>
                        請選擇付款類型
                      </option>
                      <option value='線上付款'>線上付款</option>
                      <option value='貨到付款'>貨到付款</option>
                    </Select>
                    <Span $color={'#d15252'}>
                      {promptMessage?.payment?.type}
                    </Span>
                  </SelectWrapper>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='paymentOption'
                      onChange={handleFormChange}
                      $border={
                        (promptMessage?.payment?.option ||
                          orderState.error?.errors.payment?.option) &&
                        '2px solid #d15252'
                      }
                      value={form.payment?.option}
                      disabled={
                        form.payment.type !== '線上付款' ||
                        (submitClicked && !orderState.error)
                      }
                    >
                      <option value='' disabled>
                        請選擇付款方式
                      </option>
                      <option value='信用卡'>信用卡</option>
                      <option value='LINE PAY'>LINE PAY</option>
                    </Select>
                    <Span $color={'#d15252'}>{promptMessage?.payment}</Span>
                  </SelectWrapper>
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
                      value={form.paymentStatus}
                      disabled={true}
                    >
                      <option value='' disabled>
                        請選擇付款狀態
                      </option>
                      <option value='尚未付款'>尚未付款</option>
                      <option value='已付款'>已付款</option>
                    </Select>
                    <Span $color={'#d15252'}>
                      {promptMessage?.paymentStatus}
                    </Span>
                  </SelectWrapper>
                </FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>發票開立</label>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='invoiceType'
                      onChange={handleFormChange}
                      $border={
                        (promptMessage?.payment?.invoice?.type ||
                          orderState.error?.errors.payment?.invoice?.type) &&
                        '2px solid #d15252'
                      }
                      value={form.payment?.invoice?.type}
                      disabled={submitClicked && !orderState.error}
                    >
                      <option value='' disabled>
                        請選擇付款類型
                      </option>
                      <option value='紙本發票'>紙本發票</option>
                      <option value='發票載具'>發票載具</option>
                    </Select>
                    <Span $color={'#d15252'}>
                      {promptMessage?.payment?.type}
                    </Span>
                  </SelectWrapper>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='carrierNumber'
                      type='text'
                      onChange={handleFormChange}
                      value={form?.payment?.invoice?.carrierNumber}
                      disabled={
                        form?.payment?.invoice?.type !== '發票載具' ||
                        (submitClicked && !orderState.error)
                      }
                    />
                  </InputWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}></FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'} $minHeight={'260px'}>
                  <Flexbox
                    $direction={'column'}
                    $width={'5rem'}
                    $gap={'1rem'}
                    $alignItems={'flex-start'}
                  >
                    <label>訂單商品</label>
                    <Button
                      type='button'
                      $width={'3rem'}
                      $color={'#999'}
                      $bg={'transparent'}
                      onClick={() => {
                        setShowModalElement(true);
                      }}
                      $animation
                    >
                      <Add />
                      增加
                    </Button>
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
              {/* <pre><Span>{JSON.stringify(rowsSrc, null, 2)}</Span></pre> */}
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>商品合計</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='productSubtotal'
                      type='text'
                      onChange={handleFormChange}
                      value={numberWithCommas(form.productSubtotal)}
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
                        (promptMessage?.logisticOption ||
                          orderState.error?.errors.logisticOption) &&
                        '2px solid #d15252'
                      }
                      value={form.logistic.option}
                      disabled={submitClicked && !orderState.error}
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
                      {promptMessage?.logisticOption}
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
                        disabled={submitClicked && !orderState.error}
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
                            onChange={handleFormChange}
                            $border={
                              (promptMessage?.county ||
                                orderState.error?.errors.county) &&
                              '2px solid #d15252'
                            }
                            value={form.logistic.address.county}
                            disabled={submitClicked && !orderState.error}
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
                            onChange={handleFormChange}
                            $border={
                              (promptMessage?.district ||
                                orderState.error?.errors.district) &&
                              '2px solid #d15252'
                            }
                            value={form.logistic.address.district}
                            disabled={!form.logistic.address.county || submitClicked && !orderState.error}
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
                            onChange={handleFormChange}
                            $border={
                              (promptMessage?.storeName ||
                                orderState.error?.errors.storeName) &&
                              '2px solid #d15252'
                            }
                            value={form.logistic.address.convenienceStore.storeId}
                            disabled={!form.logistic.address.district || submitClicked && !orderState.error}
                          >
                            <option value='' disabled={true}>
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
                        onChange={handleFormChange}
                        value={form?.logistic?.address?.zipcode}
                        disabled={submitClicked && !orderState.error}
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
                        onChange={handleFormChange}
                        value={form?.logistic?.address?.county}
                        disabled={submitClicked && !orderState.error}
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
                        onChange={handleFormChange}
                        value={form?.logistic?.address?.district}
                        disabled={submitClicked && !orderState.error}
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
                        onChange={handleFormChange}
                        value={form?.logistic?.address?.address}
                        disabled={submitClicked && !orderState.error}
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
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.receiverName ||
                        orderState.error?.errors.receiverName) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='receiverName'
                      type='text'
                      onChange={handleFormChange}
                      value={form?.logistic?.receiver?.receiverName}
                      disabled={submitClicked && !orderState.error}
                    />
                    <Span $color={'#d15252'}>
                      {promptMessage?.receiverName}
                    </Span>
                    <Span $color={'#d15252'}>
                      {orderState.error?.errors.receiverName}
                    </Span>
                  </InputWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>電話</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.receiverMobileNumber ||
                        orderState.error?.errors.receiverMobileNumber) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='receiverMobileNumber'
                      type='text'
                      onChange={handleFormChange}
                      value={form?.logistic?.receiver?.receiverMobileNumber}
                      disabled={submitClicked && !orderState.error}
                    />
                    <Span $color={'#d15252'}>
                      {promptMessage?.receiverMobileNumber}
                    </Span>
                    <Span $color={'#d15252'}>
                      {orderState.error?.errors.receiverMobileNumber}
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
              {/*<Span><pre>{JSON.stringify(promptMessage, null, 2)}</pre></Span> */}
              {/* <Span><pre>{JSON.stringify(productState.data, null, 2)}</pre></Span> */}
              {/* <Span><pre>{JSON.stringify(productState.data, null, 2)}</pre></Span> */}
            </FormSide>
            {/* <Span><pre>{JSON.stringify(form, null, 2)}</pre></Span> */}
          </FormBody>
        </FormWrapper>
        <Modal
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
                  'productNumber': item.productNumber,
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
        </Modal>
        <Layout.Loading
          type={'spinningBubbles'}
          active={orderState.loading}
          color={'#00719F'}
          width={100}
        />
      </Container>
    </Layout.PageLayout>
  );
};

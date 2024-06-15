//react
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { logisticRequests, clearLogisticError } from '@/store/logistic';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Flexbox,
  TitleContainer,
  Button,
  Input,
  Span,
  InputWrapper,
  Form,
  SelectWrapper,
  Select,
  Modal,
} from '@/components/common';
import { DataGrid } from '@material-ui/data-grid';
import { Add, ArrowRight, Launch, Edit, Delete } from '@material-ui/icons';
const { FormWrapper, FormRadioWrapper, FormBody, FormRow, FormCol, FormSide } =
  Form;
import Picking from './modalEl/Picking';
import Shipping from './modalEl/Shipping';
import Delivering from './modalEl/Delivering';
import Receive from './modalEl/Receive';
import Complete from './modalEl/Complete';
import RequestReturn from './modalEl/RequestReturn';
import ReceiveReturn from './modalEl/ReceiveReturn';
import Return from './modalEl/Return';
import Cancel from './modalEl/Cancel';
//utility
import { convertIsoToTaipeiTime, convertIsoToTaipei } from '@/utils/format';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import customAxios from '@/utils/axios/customAxios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const SingleLogistic = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isEditing = location.pathname.includes('edit');
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const logisticState = useSelector(state => state.logistic);

  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;

  const promptField = fieldName => {
    if (
      promptMessage?.[fieldName] ||
      logisticState.error?.errors?.[fieldName]
    ) {
      return '2px solid #d15252';
    }
  };


  //表單管理
  const initialFormData = {
    logisticNumber: '',
    status: '',
    option: '',
    deliveryCompany: {
      companyName: '',
      receiptNumber: '',
    },
    fee: 0,
    logisticHistory: [],
    receiver: {
      receiverName: '',
      receiverMobileNumber: '',
    },
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
    memo: '',
    order: '',
    lastEditedBy: '',
    lastEditerName: '',
    updatedAt: '',
  };
  const [form, setForm] = useState(initialFormData);

  const fetchLogisticData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${import.meta.env.VITE_APIURL}/logistic/${id}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
      const logistic = response.data.data;
      setForm(logistic);
    } catch (error) {
      console.error(error);
      setError(error.message || '物流資料獲取失敗。');
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchLogisticData();
    setProductsRowsSrc(form?.order?.products)
  }, [TOKEN, id, form.logisticNumber]);

  const handleFormChange = async e => {
    const { name, value, type } = e.target;
    if (logisticState.error) {
      setSubmitClicked(false);
      dispatch(clearLogisticError());
    }
    setPromptMessage(initPromptMessage);
    if (name === 'option') {
      if (value === "宅配到府") {
        setForm(prev => ({
          ...prev,
          option: value,
          fee: 150,
          address: {
            zipcode: "",
            county: "",
            district: "",
            address: "",
            convenienceStore: {
              storeId: '',
              storeName: ''
            }
          }
        }));
        return;

      } else {
        setForm(prev => ({
          ...prev,
          option: value,
          fee: 45,
          address: {
            zipcode: "",
            county: "",
            district: "",
            address: "",
            convenienceStore: {
              storeId: '',
              storeName: ''
            }
          }
        }));
        return;

      }
    }
    if (name === 'companyName' || name === 'receiptNumber') {
      setForm(prev => ({
        ...prev,
        deliveryCompany: {
          ...prev.deliveryCompany,
          [name]: value,
        },
      }));
      return;
    }
    if (name === 'zipcode' || name === 'county' || name === 'district' || name === 'address') {
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
      return;
    }
    if (name === 'convenienceStore') {
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
          zipcode: '111',
          address: '大北路14號16號1樓',
          convenienceStore: {
            "storeId": value,
            "storeName": "文林門市"
          }
        },
      }));
      return;
    }
    if (name === 'receiverName' || name === 'receiverMobileNumber') {
      setForm(prev => ({
        ...prev,
        receiver: {
          ...prev.receiver,
          [name]: value,
        },
      }));
      return;
    }

    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    setOperateType('editLogistic');
    const { logisticNumber, status, option, deliveryCompany, fee, logisticHistory, receiver, address, memo, order, lastEditedBy, lastEditerName, updatedAt, logisticReceiver, phoneNumber } = form;
    if (
      receiver?.receiverName !== '' &&
      receiver?.receiverMobileNumber !== '' &&
      address?.zipcode !== '' &&
      address?.county !== '' &&
      address?.district !== '' &&
      address?.address !== '' &&
      order?.products?.length !== 0
    ) {
      setSubmitClicked(true);
      const newData = {
        status: status,
        option: option,
        deliveryCompany: {
          companyName: deliveryCompany?.companyName,
          receiptNumber: deliveryCompany?.receiptNumber,
        },
        fee: fee,
        receiver: {
          receiverName: receiver?.receiverName,
          receiverMobileNumber: receiver?.receiverMobileNumber,
        },
        address: {
          zipcode: address?.zipcode,
          county: address?.county,
          district: address?.district,
          address: address?.address,
          convenienceStore: {
            storeName: address?.convenienceStore?.storeName,
            storeId: address?.convenienceStore?.storeId,
          },
        },
        memo: memo,
        lastEditedBy: authEmployeeState.data.employeeId,
      };
      await dispatch(logisticRequests.update(TOKEN, logisticNumber, newData));
    } else {
      alert('欄位填寫不完整')
    }
  };

  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [operateType, setOperateType] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [showModalElement, setShowModalElement] = useState(false);
  const uneditable = (submitClicked && !logisticState.error) || !isEditing;

  const logisticStatusList = [
    '待確認',
    '待出貨',
    '已出貨',
    '待取貨',
    '已取貨',
    '已完成',
    '已取消',
    '申請退貨',
    '待退貨',
    '已退貨',
    '退貨異常',
  ];
  const [satusIsActive, setStatusIsActive] = useState({
    '出貨': false,
    '送達': false,
    '退貨': false,
    '取消': false,
  });
  //useEffect
  useEffect(() => {
    setCurrentPage('/logistic');
    setLogisticHistoryRowsSrc(form?.logisticHistory);
    if (form?.status === '待確認') {

      const isAble = (form.order.payment.type === "貨到付款" ||
        (form.order.payment.type === "線上付款" && form.order.payment.status === "已付款"))

      setStatusIsActive({
        '揀貨': isAble ? true : false,
        '出貨': false,
        '送達': false,
        '取貨': false,
        '完成': false,
        '退貨': false,
        '取消': true,
      });
    }
    if (form?.status === '待出貨') {
      setStatusIsActive({
        '揀貨': false,
        '出貨': true,
        '送達': false,
        '取貨': false,
        '完成': false,
        '退貨': false,
        '取消': true,
      });
    }
    if (form?.status === '已出貨') {
      setStatusIsActive({
        '揀貨': false,
        '出貨': false,
        '送達': true,
        '取貨': false,
        '完成': false,
        '退貨': false,
        '取消': false,
      });
    }
    if (form?.status === '待取貨') {
      setStatusIsActive({
        '揀貨': false,
        '出貨': false,
        '送達': false,
        '取貨': true,
        '完成': false,
        '退貨': true,
        '取消': false,
      });
    }
    if (form?.status === '已取貨') {
      setStatusIsActive({
        '揀貨': false,
        '出貨': false,
        '送達': false,
        '取貨': false,
        '完成': true,
        '退貨': form.order.status === "退貨作業中" ? false : true,
        '取消': false,
      });
    }
    if (
      form?.status === '已完成' ||
      form?.status === '已退貨' ||
      form?.status === '已取消' ||
      form?.status === '退貨異常'
    ) {
      setStatusIsActive({
        '揀貨': false,
        '出貨': false,
        '送達': false,
        '取貨': false,
        '完成': false,
        '退貨': false,
        '取消': false,
      });
    }
    if (
      form?.status === '申請退貨' ||
      form?.status === '待退貨'
    ) {
      setStatusIsActive({
        '揀貨': false,
        '出貨': false,
        '送達': false,
        '取貨': false,
        '完成': false,
        '退貨': true,
        '取消': false,
      });
    }
  }, [form]);

  useEffect(() => {
    if (operateType === 'editLogistic' && submitClicked && (logisticState.error === null)) {
      setForm(prevState => ({
        ...prevState,
        logisticNumber: form?.logisticNumber,
        status: form?.status,
        option: form?.option,
        deliveryCompany: {
          companyName: form?.deliveryCompany?.companyName,
          receiptNumber: form?.deliveryCompany?.receiptNumber,
        },
        fee: form?.fee,
        logisticHistory: form?.logisticHistory || [],
        receiver: {
          receiverName: form?.receiver?.receiverName,
          receiverMobileNumber: form?.receiver?.receiverMobileNumber,
        },
        address: {
          zipcode: form?.address?.zipcode,
          county: form?.address?.county,
          district: form?.address?.district,
          address: form?.address?.address,
          convenienceStore: {
            storeName: form?.convenienceStore?.storeName,
            storeId: form?.convenienceStore?.storeId,
          },
        },
        memo: form?.memo,
        order: form?.order,
        lastEditedBy: form?.lastEditedBy,
        lastEditerName: form?.lastEditerName,
        updatedAt: form?.updatedAt,
      }));
      alert('已更新出貨紀錄');
      setSubmitClicked(false)
      navigator(`/logistic/${form.logisticNumber}`);
    }
  }, [logisticState.data])

  //data-grid
  //logisticHistory
  const logisticHistoryColumns = [
    {
      field: 'no',
      headerName: ' ',
      width: 75,
    },
    {
      field: 'actionType',
      headerName: '事件',
      width: 220,
      renderCell: params => {
        if (
          params.row.actionType === '送達' ||
          params.row.actionType === '取貨' ||
          params.row.actionType === '已退貨'
        ) {
          return `${params.row.actionType}✔️`;
        }
        return params.row.actionType;
      },
    },
    {
      field: 'time',
      headerName: '時間',
      width: 240,
      renderCell: params => convertIsoToTaipeiTime(new Date(params.row.time)),
    },
    {
      field: 'processingEmployee',
      headerName: '經辦',
      width: 200,
      renderCell: params => {
        return (
          <>{`${params.row.processingEmployeeId} ${params.row.processingEmployeeName}`}</>
        );
      },
    },
    {
      field: 'memo',
      headerName: '備註',
      width: 200,
    },
  ];
  let logisticHistoryRowsIndex = 1;
  const [logisticHistoryRowsSrc, setLogisticHistoryRowsSrc] = useState(
    form.logisticHistory,
  );
  const logisticHistoryRows = logisticHistoryRowsSrc
    ? logisticHistoryRowsSrc.map(item => {
      return {
        ...item,
        no: logisticHistoryRowsIndex++,
      };
    })
    : [];

  //products
  const productsColumns = [
    {
      field: 'no',
      headerName: 'no',
      width: 75,
    },
    {
      field: 'productName',
      headerName: '品名',
      width: 240,
      renderCell: params => {
        return `${params.row.productNumber} ${params.row.productName}`;
      },
    },
    {
      field: 'variantName',
      headerName: '規格',
      width: 140,
      renderCell: params => {
        return (
          <Flexbox $justifyContent={'space-between'} $gap={'1rem'}>
            <p>{params.row.variantName}</p>
            <img
              src={`${import.meta.env.VITE_APIURL}/file${params.row.variantImage}`}
              style={{
                maxWidth: '45px',
                maxHeight: '45px',
                width: '100%',
                objectFit: 'cover',
              }}
              alt=''
            />
          </Flexbox>
        );
      },
    },
    {
      field: 'specificationName',
      headerName: '尺寸',
      width: 120,
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
  let productsRowsIndex = 1;
  const [productsRowsSrc, setProductsRowsSrc] = useState(
    form?.order?.products || [],
  );
  const productsRows = productsRowsSrc?.map(item => {
    return {
      ...item,
      no: productsRowsIndex++,
    };
  });

  return (
    <Layout.PageLayout>
      <SEO
        title={`${!isEditing ? '檢視' : '編輯'}出貨紀錄 | 漾活管理後台`}
        description={null}
        url={null}
      />
      <Container>
        <TitleContainer $width={'auto'}>
          <Flexbox $gap={'1rem'} $justifyContent={'flex-start'}>
            <h1>
              出貨紀錄
              <ArrowRight />
              {!isEditing ? '檢視' : '編輯'}
            </h1>
            {!isEditing && (
              <Button
                $width={'1rem'}
                $bg={'#fff'}
                $color={'#3b3b3b'}
                $padding={'3px 1px'}
                $animation
                onClick={() => {
                  navigator(`/logistic/edit/${id}`);
                }}
              >
                <Edit />
              </Button>
            )}
          </Flexbox>

          {!isEditing ? (
            <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
              <Button
                type='button'
                $width={'4rem'}
                onClick={() => {
                  if (satusIsActive['揀貨']) {
                    setOperateType('揀貨');
                    setShowModalElement(true);
                  } else {
                    alert('非貨到付款訂單須完成付款，當前狀態無法進行【揀貨】操作');
                  }
                }}
                $color={satusIsActive['揀貨'] ? '#fff' : '#8d8d8d'}
                $bg={satusIsActive['揀貨'] ? '#cfae3f' : '#cccccc'}
                $animation={satusIsActive['揀貨'] ? true : false}
              >
                揀貨
              </Button>
              <Button
                type='button'
                $width={'4rem'}
                onClick={() => {
                  if (satusIsActive['出貨']) {
                    setOperateType('出貨');
                    setShowModalElement(true);
                  } else {
                    alert('當前狀態無法進行【出貨】操作');
                  }
                }}
                $color={satusIsActive['出貨'] ? '#fff' : '#8d8d8d'}
                $bg={satusIsActive['出貨'] ? '#cfae3f' : '#cccccc'}
                $animation={satusIsActive['出貨'] ? true : false}
              >
                出貨
              </Button>
              <Button
                type='button'
                $width={'4rem'}
                onClick={() => {
                  if (satusIsActive['送達']) {
                    setOperateType('送達');
                    setShowModalElement(true);
                  } else {
                    alert('當前狀態無法進行【送達】操作');
                  }
                }}
                $color={satusIsActive['送達'] ? '#fff' : '#8d8d8d'}
                $bg={satusIsActive['送達'] ? '#5cc55f' : '#cccccc'}
                $animation={satusIsActive['送達'] ? true : false}
              >
                送達
              </Button>
              <Button
                type='button'
                $width={'4rem'}
                onClick={() => {
                  if (satusIsActive['取貨']) {
                    setOperateType('取貨');
                    setShowModalElement(true);
                  } else {
                    alert('當前狀態無法進行【取貨】操作');
                  }
                }}
                $color={satusIsActive['取貨'] ? '#fff' : '#8d8d8d'}
                $bg={satusIsActive['取貨'] ? '#5cc55f' : '#cccccc'}
                $animation={satusIsActive['取貨'] ? true : false}
              >
                取貨
              </Button>

              <Button
                type='button'
                $width={'4rem'}
                onClick={() => {
                  if (satusIsActive['完成']) {
                    setOperateType('完成');
                    setShowModalElement(true);
                  } else {
                    alert('當前狀態無法進行【完成】操作');
                  }
                }}
                $color={satusIsActive['完成'] ? '#fff' : '#8d8d8d'}
                $bg={satusIsActive['完成'] ? '#5cc55f' : '#cccccc'}
                $animation={satusIsActive['完成'] ? true : false}
              >
                完成
              </Button>
              {(form?.status !== '申請退貨' && form?.status !== '待退貨') ? (
                <Button
                  type='button'
                  $width={'6rem'}
                  onClick={() => {
                    if (satusIsActive['退貨']) {
                      setOperateType('退貨申請');
                      setShowModalElement(true);
                    } else {
                      alert('當前狀態無法進行【退貨申請】操作');
                    }
                  }}
                  $color={satusIsActive['退貨'] ? '#fff' : '#8d8d8d'}
                  $bg={satusIsActive['退貨'] ? '#d15252' : '#cccccc'}
                  $animation={satusIsActive['退貨'] ? true : false}
                >
                  退貨申請
                </Button>
              ) : form?.status === '申請退貨' ? (
                <Button
                  type='button'
                  $width={'6rem'}
                  onClick={() => {
                    if (satusIsActive['退貨']) {
                      setOperateType('退貨處理');
                      setShowModalElement(true);
                    } else {
                      alert('當前狀態無法進行【退貨處理】操作');
                    }
                  }}
                  $color={satusIsActive['退貨'] ? '#fff' : '#8d8d8d'}
                  $bg={satusIsActive['退貨'] ? '#d15252' : '#cccccc'}
                  $animation={satusIsActive['退貨'] ? true : false}
                >
                  退貨處理
                </Button>
              ) : (
                <Button
                  type='button'
                  $width={'6rem'}
                  onClick={() => {
                    if (satusIsActive['退貨']) {
                      setOperateType('收到退貨');
                      setShowModalElement(true);
                    } else {
                      alert('當前狀態無法進行【收到退貨】操作');
                    }
                  }}
                  $color={satusIsActive['退貨'] ? '#fff' : '#8d8d8d'}
                  $bg={satusIsActive['退貨'] ? '#d15252' : '#cccccc'}
                  $animation={satusIsActive['退貨'] ? true : false}
                >
                  收到退貨
                </Button>
              )}
              <Button
                type='button'
                $width={'4rem'}
                onClick={() => {
                  if (satusIsActive['取消']) {
                    setOperateType('取消');
                    setShowModalElement(true);
                  } else {
                    alert('當前狀態無法進行【取消】操作');
                  }
                }}
                $color={satusIsActive['取消'] ? '#fff' : '#8d8d8d'}
                $bg={satusIsActive['取消'] ? '#d15252' : '#cccccc'}
                $animation={satusIsActive['取消'] ? true : false}
              >
                取消
              </Button>
            </Flexbox>
          ) : (
            <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
              <Button
                type='button'
                onClick={() => {
                  const confirmed = confirm(
                    '確定要【返回】嗎? 請確保當前內容已保存',
                  );
                  if (confirmed) {
                    navigator(`/logistic/${id}`);
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
                $bg={submitClicked && !logisticState.error ? '' : '#5cc55f'}
                $animation={
                  submitClicked && !logisticState.error ? false : true
                }
                disabled={submitClicked && !logisticState.error}
              >
                提交
              </Button>
            </Flexbox>
          )}
        </TitleContainer>
        <FormWrapper>
          <FormBody $padding={'0 1rem 0 0'}>
            <FormSide $gap={'24px'}>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>出貨編號</label>
                  <InputWrapper $height={'2.5rem'} $spanOffset={'-1.2rem'}>
                    <Input
                      name='logisticNumber'
                      type='text'
                      value={form.logisticNumber}
                      disabled={true}
                    />
                  </InputWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>出貨狀態</label>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='status'
                      $border={promptField('status')}
                      onChange={handleFormChange}
                      value={form.status}
                      disabled={uneditable}
                    >
                      {logisticStatusList.map(status => {
                        return (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        );
                      })}
                    </Select>
                    <Span $color={'#d15252'}>
                      {promptMessage?.status}
                    </Span>
                    <Span $color={'#d15252'}>
                      {logisticState.error?.errors.status}
                    </Span>
                  </SelectWrapper>
                </FormCol>
              </FormRow>

              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>物流選項</label>
                  <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                    <Select
                      name='option'
                      value={form.option}
                      $border={promptField('option')}
                      onChange={handleFormChange}
                      disabled={uneditable}
                    >
                      <option value={''} disabled={true}>請選擇物流選項</option>
                      <option value={'宅配到府'}>宅配到府 / $150</option>
                      <option value={'超商取貨-711'}>超商取貨-711 / $45</option>
                      <option value={'超商取貨-全家'}>
                        超商取貨-全家 / $45
                      </option>
                    </Select>
                    <Span $color={'#d15252'}>
                      {promptMessage?.option}
                    </Span>
                    <Span $color={'#d15252'}>
                      {logisticState.error?.errors.option}
                    </Span>
                  </SelectWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>物流廠商</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={promptField('companyName')}
                  >
                    <Input
                      name='companyName'
                      type='text'
                      placeholder='物流公司'
                      value={form?.deliveryCompany?.companyName}
                      onChange={handleFormChange}
                      disabled={uneditable}
                    />
                    <Span $color={'#d15252'}>
                      {promptMessage?.deliveryCompany?.companyName}
                    </Span>
                    <Span $color={'#d15252'}>
                      {logisticState.error?.errors.deliveryCompany?.companyName}
                    </Span>
                  </InputWrapper>

                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={promptField('receiptNumber')}
                  >
                    <Input
                      name='receiptNumber'
                      type='text'
                      placeholder='物流單號'
                      value={form?.deliveryCompany?.receiptNumber}
                      onChange={handleFormChange}
                      disabled={uneditable}
                    />
                    <Span $color={'#d15252'}>
                      {promptMessage?.deliveryCompany?.receiptNumber}
                    </Span>
                    <Span $color={'#d15252'}>
                      {
                        logisticState.error?.errors?.deliveryCompany
                          ?.receiptNumber
                      }
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>
              {(form.option === '超商取貨-711' ||
                form.option === '超商取貨-全家') && (
                  <FormRow $gap={'24px'}>
                    <FormCol $minWidth={'5rem'}>
                      <label>收件地址</label>
                      <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                        <Select
                          name="county"
                          value={form.address?.county}
                          $border={promptField('county')}
                          disabled={uneditable}
                          onChange={handleFormChange}
                        >
                          <option value="" disabled={true}>選擇縣市</option>
                          <option value="台北市">台北市</option>
                        </Select>
                      </SelectWrapper>

                      <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                        <Select
                          name="district"
                          value={form.address?.district}
                          $border={promptField('district')}
                          disabled={uneditable}
                          onChange={handleFormChange}
                        >
                          <option value="" disabled={true}>選擇區域</option>
                          <option value="士林區">士林區</option>
                        </Select>
                      </SelectWrapper>
                      <SelectWrapper $spanOffset={'-1.2rem'} $height={'2.5rem'}>
                        <Select
                          name="convenienceStore"
                          value={form.address?.convenienceStore.storeId}
                          $border={promptField('convenienceStore')}
                          disabled={uneditable}
                          onChange={handleFormChange}
                        >
                          <option value="" disabled={true}>選擇門市</option>
                          <option value="240950">240950 文林門市</option>
                        </Select>
                      </SelectWrapper>
                    </FormCol>
                    <FormCol>
                      <InputWrapper
                        $height={'2.5rem'}
                        $spanOffset={'-1.2rem'}
                        disabled={true}
                      >
                        <Input
                          name='address'
                          type='text'
                          placeholder='路段號碼'
                          onChange={handleFormChange}
                          value={form?.address?.address}
                          disabled={true}
                        />
                      </InputWrapper>
                    </FormCol>
                  </FormRow>
                )}
              {form.option === '宅配到府' && (
                <FormRow $gap={'24px'}>
                  <FormCol $minWidth={'5rem'}>
                    <label>收件地址</label>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={promptField('zipcode')}
                    >
                      <Input
                        name='zipcode'
                        type='text'
                        placeholder='郵遞區號'
                        value={form?.address?.zipcode}
                        disabled={uneditable}
                        onChange={handleFormChange}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.address?.zipcode}
                      </Span>
                      <Span $color={'#d15252'}>
                        {
                          logisticState.error?.errors?.address
                            ?.zipcode
                        }
                      </Span>
                    </InputWrapper>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={promptField('county')}
                    >
                      <Input
                        name='county'
                        type='text'
                        placeholder='縣市'
                        value={form?.address?.county}
                        disabled={uneditable}
                        onChange={handleFormChange}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.address?.county}
                      </Span>
                      <Span $color={'#d15252'}>
                        {
                          logisticState.error?.errors.address
                            ?.county
                        }
                      </Span>
                    </InputWrapper>

                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={promptField('district')}
                    >
                      <Input
                        name='district'
                        type='text'
                        placeholder='鄉鎮市區'
                        value={form?.address?.district}
                        disabled={uneditable}
                        onChange={handleFormChange}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.address?.district}
                      </Span>
                      <Span $color={'#d15252'}>
                        {' '}
                        {
                          logisticState.error?.errors?.address
                            ?.district
                        }
                      </Span>
                    </InputWrapper>
                  </FormCol>
                  <FormCol>
                    <InputWrapper
                      $height={'2.5rem'}
                      $spanOffset={'-1.2rem'}
                      $border={promptField('address')}
                    >
                      <Input
                        name='address'
                        type='text'
                        placeholder='路段號碼'
                        value={form?.address?.address}
                        disabled={uneditable}
                        onChange={handleFormChange}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.address?.address}
                      </Span>
                      <Span $color={'#d15252'}>
                        {' '}
                        {
                          logisticState.error?.errors?.address
                            ?.address
                        }
                      </Span>
                    </InputWrapper>
                  </FormCol>
                </FormRow>
              )}

              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>收件者</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={promptField('receiverName')}
                  >
                    <Input
                      name='receiverName'
                      type='text'
                      value={form?.receiver?.receiverName}
                      disabled={uneditable}
                      onChange={handleFormChange}
                    />
                    <Span $color={'#d15252'}>
                      {promptMessage?.receiverName}
                    </Span>
                    <Span $color={'#d15252'}>
                      {logisticState.error?.errors?.receiverName}
                    </Span>
                  </InputWrapper>
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>聯絡電話</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={promptField('receiverMobileNumber')}
                  >
                    <Input
                      name='receiverMobileNumber'
                      type='text'
                      value={form?.receiver?.receiverMobileNumber}
                      disabled={uneditable}
                      onChange={handleFormChange}
                    />
                    <Span $color={'#d15252'}>
                      {promptMessage?.receiverMobileNumber}
                    </Span>
                    <Span $color={'#d15252'}>
                      {
                        logisticState.error?.errors?.logisticReceiver
                          ?.receiverMobileNumber
                      }
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>

              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>訂單編號</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={promptField('orderNumber')}
                  >
                    <Input
                      name='orderNumber'
                      type='text'
                      placeholder='(可選)'
                      value={form?.order?.orderNumber}
                      disabled={true}
                    />
                    <Span $color={'#d15252'}>{promptMessage?.orderNumber}</Span>
                    <Span $color={'#d15252'}>
                      {logisticState.error?.errors.orderNumber}
                    </Span>
                  </InputWrapper>
                  <Link
                    to={`/order/${form?.order?.orderNumber}`}
                    target='_blank'
                    style={{ textDecoration: 'none' }}
                  >
                    <Launch />
                  </Link>
                </FormCol>
                <FormCol $minWidth={'5rem'}>
                  <label>用戶名稱</label>

                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={promptField('username')}
                  >
                    <Input
                      name='username'
                      type='text'
                      placeholder='(可選)'
                      value={form?.order?.username}
                      disabled={true}
                    />
                    <Span $color={'#d15252'}>{promptMessage?.username}</Span>
                    <Span $color={'#d15252'}>
                      {logisticState.error?.errors.username}
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol
                  $minWidth={'5rem'}
                  $minHeight={`${100 + form?.logisticHistory?.length * 62.5 < 300
                    ? 100 + form?.logisticHistory?.length * 62.5
                    : 300
                    }px`}
                >
                  <Flexbox
                    $direction={'column'}
                    $width={'5rem'}
                    $gap={'1rem'}
                    $alignItems={'flex-start'}
                  >
                    <label>物流紀錄</label>
                    {/* <Button
                      type='button'
                      $width={'3rem'}
                      $color={'#999'}
                      $bg={'transparent'}
                      onClick={() => {
                        setShowModalElement(true)
                      }}
                      $animation
                    >
                      <Add />增加
                    </Button> */}
                  </Flexbox>
                  <DataGrid
                    rows={logisticHistoryRows}
                    columns={logisticHistoryColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={row => row.no}
                    checkboxSelection={false}
                    disableSelectionOnClick
                  />
                </FormCol>
              </FormRow>
              <FormRow>
                <FormCol
                  $minWidth={'5rem'}
                  $minHeight={`${100 + form?.logisticHistory?.length * 62.5 < 300
                    ? 100 + form?.logisticHistory?.length * 62.5
                    : 300
                    }px`}
                >
                  <Flexbox
                    $direction={'column'}
                    $width={'5rem'}
                    $gap={'1rem'}
                    $alignItems={'flex-start'}
                  >
                    <label>出貨內容</label>
                    {isEditing && <Button
                      type='button'
                      $width={'3rem'}
                      $color={'#999'}
                      $bg={'transparent'}
                      onClick={() => {
                        setShowModalElement(true)
                      }}
                      disabled={!isEditing || logisticState.loading}
                      $animation
                    >
                      <Add />增加
                    </Button>}

                  </Flexbox>

                  <DataGrid
                    rows={productsRows || []}
                    columns={productsColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={row => row.no}
                    checkboxSelection={false}
                    disableSelectionOnClick
                  />
                </FormCol>
              </FormRow>
              <Span $color={'#d15252'}>{promptMessage?.products}</Span>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>備註事項</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={promptField('memo')}
                  >
                    <Input
                      name='memo'
                      type='text'
                      value={form.memo}
                      disabled={uneditable}
                      onChange={handleFormChange}
                    />
                    <Span $color={'#d15252'}>{promptMessage?.memo}</Span>
                    <Span $color={'#d15252'}>
                      {logisticState.error?.errors.memo}
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow $gap={'24px'}>
                <FormCol $minWidth={'5rem'}>
                  <label>最後更新</label>
                  <Span>
                    {form.updatedAt &&
                      `${convertIsoToTaipeiTime(new Date(form.updatedAt))} , ${form.lastEditerName} (${form.lastEditedBy})`}
                  </Span>
                </FormCol>
              </FormRow>
              {/* <Span>  <pre>{JSON.stringify(promptMessage, null, 2)}</pre>    </Span>*/}
            </FormSide>
            {/* <Span>
              <pre>{JSON.stringify(form, null, 2)}</pre>{' '}
            </Span> */}
          </FormBody>
        </FormWrapper>


        {operateType === '揀貨' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Picking
              setForm={setForm}
              setShowModalElement={setShowModalElement}
            />
          </Modal>
        )}


        {operateType === '出貨' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Shipping
              setForm={setForm}
              setShowModalElement={setShowModalElement}
            />
          </Modal>
        )}

        {operateType === '送達' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Delivering
              setForm={setForm}
              setShowModalElement={setShowModalElement}
            />
          </Modal>
        )}

        {operateType === '取貨' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Receive
              setForm={setForm}
              setShowModalElement={setShowModalElement}
            />
          </Modal>
        )}
        {operateType === '完成' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Complete
              setForm={setForm}
              setShowModalElement={setShowModalElement}
            />
          </Modal>
        )}


        {operateType === '退貨申請' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <RequestReturn
              fetchLogisticData={fetchLogisticData}
              setShowModalElement={setShowModalElement}
              orderNumber={form?.order?.orderNumber}
            />
          </Modal>
        )}

        {operateType === '退貨處理' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <Return
              setForm={setForm}
              setShowModalElement={setShowModalElement}
              form={form}
              fetchLogisticData={fetchLogisticData}
            />
          </Modal>
        )}
        {operateType === '收到退貨' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => setShowModalElement(false)}
          >
            <ReceiveReturn
              setForm={setForm}
              setShowModalElement={setShowModalElement}
              fetchLogisticData={fetchLogisticData}
              form={form}
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

        <Layout.Loading
          type={'spinningBubbles'}
          active={logisticState.loading}
          color={'#00719F'}
          width={100}
        />
      </Container>
    </Layout.PageLayout>
  );
};

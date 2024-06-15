//react
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import {
  contactHistoryRequests,
  clearContactHistoryError,
} from '@/store/contactHistory';
import { jobStructureRequests } from '@/store/jobStructure';
import { employeeRequests, clearEmployeeError } from '@/store/employee';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Flexbox,
  Modal,
  Button,
  TitleContainer,
  Text,
} from '@/components/common';
import { DataGrid } from '@material-ui/data-grid';
import AddContactHistory from './AddContactHistory';
import SingleContactHistory from './SingleContactHistory';
//utils
import {
  convertIsoToTaipei,
  getDateString,
  getTimeString,
} from '@/utils/format';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const ContactHistory = () => {
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const employeeState = useSelector(state => state.employee.employees);
  const contactHistoryState = useSelector(state => state.contactHistory);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialAddContactHistoryForm = {
    'caseNumber': '',
    'status': '待處理',
    'from': '',
    'callDate': (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(),
    'callTime': (() => {
      const today = new Date();
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    })(),
    'callerName': '',
    'callerGender': '',
    'callSubject': '',
    'callContent': '',
    'phoneNumber': '',
    'receiveDepartment': {
      'department': '',
      'section': '',
    },
    'receiverId': '',
    'receiverName': '',
    'handlingDepartment': {
      'department': '',
      'section': '',
    },
  };
  const [addContactHistoryFormData, setAddContactHistoryFormData] = useState(
    initialAddContactHistoryForm,
  );
  const initialEditContactHistoryForm = {
    'caseNumber': '',
    'status': '待處理',
    'from': '',
    'callDate': '',
    'callTime': '',
    'callerName': '',
    'callerGender': '',
    'callSubject': '',
    'callContent': '',
    'phoneNumber': '',
    'receiveDepartment': {
      'department': '',
      'section': '',
    },
    'receiverId': '',
    'handlingDepartment': {
      'department': '',
      'section': '',
    },
    'processingHistory': [],
    'handlerId': '',
    'lastEditedBy': '',
  };
  const [editContactHistoryFormData, setEditContactHistoryFormData] = useState(
    initialEditContactHistoryForm,
  );
  const initialNewProcessingHistoryForm = { content: '' };
  const [newProcessingHistoryFormData, setNewProcessingHistoryFormData] =
    useState(initialNewProcessingHistoryForm);

  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);

  //狀態管理
  const [submitClicked, setSubmitClicked] = useState(false);
  const [showModalElement, setShowModalElement] = useState(false);
  const [
    showAddContactHistoryInputElement,
    setShowAddContactHistoryInputElement,
  ] = useState(false);
  const [editingContactHistoryIndex, setEditingContactHistoryIndex] =
    useState(0);
  //useEffect
  useEffect(() => {
    setCurrentPage('/contactHistory');
    dispatch(contactHistoryRequests.getAll(TOKEN));
    dispatch(employeeRequests.getAll(TOKEN));
    dispatch(jobStructureRequests.getAll(TOKEN));
  }, []);
  useEffect(() => {
    if (operateType === 'addContactHistory') {
      if (submitClicked & (contactHistoryState.error === null)) {
        if (!addContactHistoryFormData.caseNumber) {
          const index = contactHistoryState.data.length - 1;
          const contactHistory = contactHistoryState.data[index];
          setAddContactHistoryFormData(prev => {
            return {
              ...prev,
              caseNumber: contactHistory.caseNumber,
              updatedAt: contactHistory.updatedAt,
            };
          });
        } else if (addContactHistoryFormData.caseNumber !== '') {
          setPromptMessage(prevState => ({
            ...prevState,
            default: `✔️已新增`,
          }));
        }
      }
    }
    if (operateType === 'editContactHistory') {
      if (!submitClicked & (contactHistoryState.error === null)) {
        //增加聯繫紀錄
        const caseNumber = editContactHistoryFormData.caseNumber;
        const data = contactHistoryState.data.find(
          item => item.caseNumber === caseNumber,
        );
        const newProcessingHistory = data?.processingHistory;
        setEditContactHistoryFormData(prev => {
          return {
            ...prev,
            processingHistory: newProcessingHistory,
          };
        });
        setNewProcessingHistoryFormData(initialNewProcessingHistoryForm);
        setPromptMessage(prevState => ({
          ...prevState,
          default: `✔️已新增`,
        }));
        setOperateType('view');
        setShowAddContactHistoryInputElement(false);
      } else if (submitClicked & (contactHistoryState.error === null)) {
        //更新內容
        setPromptMessage(prevState => ({
          ...prevState,
          default: `✔️已更新`,
        }));
        setOperateType('view');
        setShowAddContactHistoryInputElement(false);
      }
    }
  }, [contactHistoryState.data, addContactHistoryFormData]);

  //modal
  const [operateType, setOperateType] = useState('view');

  //Add
  const showAddContactHistoryModalElement = boolean => {
    setShowModalElement(boolean);
    setOperateType('addContactHistory');
    setAddContactHistoryFormData(initialAddContactHistoryForm);
    setPromptMessage(initPromptMessage);
    setSubmitClicked(false);
    dispatch(clearContactHistoryError());
  };
  const handleAddContactHistoryFormChange = async e => {
    const { name, value } = e.target;
    setSubmitClicked(false);
    if (name === 'handlingDepartment') {
      setAddContactHistoryFormData(prevState => ({
        ...prevState,
        handlingDepartment: {
          ...prevState.handlingDepartment,
          department: value,
        },
      }));
    } else if (name === 'handlingSection') {
      setAddContactHistoryFormData(prevState => ({
        ...prevState,
        handlingDepartment: {
          ...prevState.handlingDepartment,
          section: value,
        },
      }));
    } else {
      setAddContactHistoryFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }

    await dispatch(clearContactHistoryError());
    setPromptMessage({ default: '⛔變更尚未保存' });
  };
  const handleAddContactHistoryCreate = async e => {
    e.preventDefault();
    const {
      caseNumber,
      status,
      from,
      callDate,
      callTime,
      callerName,
      callerGender,
      callSubject,
      callContent,
      phoneNumber,
      handlingDepartment,
      receiverId,
    } = addContactHistoryFormData;

    if (
      status !== '' &&
      from !== '' &&
      callerName !== '' &&
      callerGender !== '' &&
      callSubject !== '' &&
      callContent !== '' &&
      phoneNumber !== '' &&
      handlingDepartment.department !== '' &&
      handlingDepartment.section !== ''
    ) {
      setSubmitClicked(true);
      const newData = {
        'status': status,
        'from': from,
        'callTime': new Date().toISOString(),
        'callerName': callerName,
        'phoneNumber': phoneNumber,
        'callerGender': callerGender,
        'callSubject': callSubject,
        'callContent': callContent,
        'receiveDepartment': {
          'department': authEmployeeState.data.position.department,
          'section': authEmployeeState.data.position.section,
        },
        'receiverId': authEmployeeState.data.employeeId,
        'handlingDepartment': {
          'department': handlingDepartment.department,
          'section': handlingDepartment.section,
        },
        'handlerId': '',
        'processingHistory': [],
        'lastEditedBy': authEmployeeState.data.employeeId,
      };
      await dispatch(contactHistoryRequests.add(TOKEN, newData));
    } else {
      if (handlingDepartment.department === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            handlingDepartment: {
              ...prev.handlingDepartment,
              department: `窗口部門不得為空`,
            },
          };
        });
      }
      if (handlingDepartment.section === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            handlingDepartment: {
              ...prev.handlingDepartment,
              section: `窗口組別不得為空`,
            },
          };
        });
      }

      const requireField = [
        'status',
        'from',
        'callerName',
        'callerGender',
        'callSubject',
        'callContent',
        'phoneNumber',
      ];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'status':
            emptyField = '到職日期欄位';
            break;
          case 'from':
            emptyField = '來電來源欄位';
            break;
          case 'callerName':
            emptyField = '來電者姓名欄位';
            break;
          case 'callerGender':
            emptyField = '來電者稱呼';
            break;
          case 'callSubject':
            emptyField = '來電主旨欄位';
            break;
          case 'callContent':
            emptyField = '來電內容欄位';
            break;
          case 'phoneNumber':
            emptyField = '手機號碼欄位';
            break;
          default:
            return;
        }

        if (addContactHistoryFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };

  //single
  const showSingleContactHistoryModalElement = (boolean, caseNumber) => {
    setShowModalElement(boolean);
    setOperateType('view');
    setEditingContactHistoryIndex(-1);
    const data = contactHistoryState.data.find(
      data => data.caseNumber === caseNumber,
    );
    setEditContactHistoryFormData(p => ({
      ...p,
      caseNumber: data?.caseNumber,
      status: data?.status,
      from: data?.from,
      callerName: data?.callerName,
      callerGender: data?.callerGender,
      callDate: getDateString(new Date(data?.callTime)),
      callTime: getTimeString(new Date(data?.callTime)),
      callSubject: data?.callSubject,
      callContent: data?.callContent,
      phoneNumber: data?.phoneNumber || '',
      receiveDepartment: data?.receiveDepartment,
      handlingDepartment: data?.handlingDepartment,
      processingHistory: data ? [...data.processingHistory] : [],
      handlerId: data?.handlerId,
      lastEditedBy: data?.lastEditedBy,
      receiverId: data?.receiverId,
      receiverName: data?.receiverName,
    }));
    const hasProcessingHistory = data?.processingHistory?.length === 0;
    setShowAddContactHistoryInputElement(hasProcessingHistory);
    setPromptMessage(initPromptMessage);
    setSubmitClicked(false);
    dispatch(clearContactHistoryError());
  };
  const handleSingleContactHistoryFormChange = async e => {
    const { name, value } = e.target;
    setSubmitClicked(false);
    if (name === 'handlingDepartment') {
      setEditContactHistoryFormData(prevState => ({
        ...prevState,
        handlingDepartment: {
          ...prevState.handlingDepartment,
          department: value,
        },
      }));
    } else if (name === 'handlingSection') {
      setEditContactHistoryFormData(prevState => ({
        ...prevState,
        handlingDepartment: {
          ...prevState.handlingDepartment,
          section: value,
        },
      }));
    } else if (name === 'processingHistory') {
      setEditContactHistoryFormData(prevState => {
        const updatedProcessingHistory = prevState?.processingHistory.map(
          (item, index) => {
            if (index === editingContactHistoryIndex) {
              return {
                ...item,
                content: value,
              };
            }
            return item;
          },
        );

        return {
          ...prevState,
          processingHistory: updatedProcessingHistory,
        };
      });
    } else {
      setEditContactHistoryFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
    await dispatch(clearContactHistoryError());

    setPromptMessage({ default: '⛔變更尚未保存' });
  };
  const handleSingleContactHistoryUpdate = async e => {
    e.preventDefault();
    const {
      caseNumber,
      status,
      from,
      callDate,
      callTime,
      callerName,
      callerGender,
      callSubject,
      callContent,
      phoneNumber,
      handlingDepartment,
      receiverId,
      processingHistory,
      lastEditedBy,
    } = editContactHistoryFormData;

    // 檢查必填字段是否為空
    const requiredFields = [
      'status',
      'from',
      'callerName',
      'callerGender',
      'callSubject',
      'callContent',
      'phoneNumber',
      'handlingDepartment',
    ];

    for (const field of requiredFields) {
      if (!editContactHistoryFormData[field]) {
        setPromptMessage(prev => ({
          ...prev,
          [field]: `${field}不得為空`,
        }));
        return;
      }
    }

    // 檢查 processingHistory 中的 content 是否為空
    const emptyArray = [];
    for (let idx = 0; idx < processingHistory.length; idx++) {
      if (!processingHistory[idx].content) {
        console.log(idx);
        emptyArray.push(idx);
      }
      setPromptMessage(prev => ({
        ...prev,
        processingHistory: emptyArray,
      }));
    }
    if (emptyArray.length > 0) {
      return;
    }

    setSubmitClicked(true);
    setEditingContactHistoryIndex(-1);

    const data = {
      status: status,
      callTime: convertIsoToTaipei(new Date(`${callDate}T${callTime}:00.000Z`)),
      callerName: callerName,
      callSubject: callSubject,
      callContent: callContent,
      callerGender: callerGender,
      phoneNumber: phoneNumber,
      from: from,
      handlingDepartment: handlingDepartment,
      lastEditedBy: lastEditedBy,
      processingHistory: processingHistory,
    };

    await dispatch(
      contactHistoryRequests.update(
        TOKEN,
        editContactHistoryFormData.caseNumber,
        data,
      ),
    );
  };
  const handleSingleContactHistoryModalDelete = async caseNumber => {
    const confirmed = confirm(`確定要刪除聯絡紀錄${caseNumber}嗎`);
    if (confirmed) {
      await dispatch(contactHistoryRequests.delete(TOKEN, caseNumber));
    }
  };

  //newCotact
  const handleNewProcessingHistoryFormChange = async e => {
    const { name, value } = e.target;
    setNewProcessingHistoryFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setPromptMessage({ default: '⛔變更尚未保存' });
  };
  const handleNewProcessingHistoryCreate = async e => {
    e.preventDefault();
    const { content } = newProcessingHistoryFormData;
    const { caseNumber, processingHistory } = editContactHistoryFormData;
    if (content !== '') {
      const updatedData = [...processingHistory];
      const employee = authEmployeeState.data;
      const newData = {
        'processingDepartment': {
          'department': employee.position.department,
          'section': employee.position.section,
        },
        'handlerId': employee.employeeId,
        'content': content,
        'lastEditedBy': employee.employeeId,
      };
      updatedData.push(newData);
      await dispatch(
        contactHistoryRequests.update(TOKEN, caseNumber, {
          handlerId: authEmployeeState.data.employeeId,
          processingHistory: updatedData,
        }),
      );
    } else {
      const requireField = ['content'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'content':
            emptyField = '聯繫過程記錄欄位';
            break;
          default:
            return;
        }

        if (newProcessingHistoryFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };

  //data-grid
  const muteColor = '#a5a5a5';
  const columns = [
    {
      field: 'caseNumber',
      headerName: '案號',
      width: 120,
      renderCell: params => {
        const isMute = params.row?.status === '已註銷' ? muteColor : '';
        return (
          <Link
            onClick={e => {
              e.preventDefault();
              showSingleContactHistoryModalElement(true, params.row.caseNumber);
            }}
          >
            <Text $color={isMute}>{params.row.caseNumber}</Text>
          </Link>
        );
      },
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 110,
      renderCell: params => {
        const getStatus = () => {
          if (params.row.status === '待處理') {
            return {
              text: '⏰待處理',
              color: '#d15252',
            };
          } else if (params.row.status === '處理中') {
            return {
              text: '處理中…',
              color: '#b3932c',
            };
          } else if (params.row.status === '已結案') {
            return {
              text: '已結案',
              color: '#5cc55f',
            };
          } else if (params.row.status === '已註銷') {
            return {
              text: '已註銷',
              color: '#a5a5a5',
            };
          }
        };
        return <Text $color={getStatus()?.color}>{getStatus().text}</Text>;
      },
    },
    {
      field: 'callTime',
      headerName: '時間',
      width: 165,
      renderCell: params => {
        const isMute = params.row?.status === '已註銷' ? muteColor : '';
        return <Text $color={isMute}>{params.row.callTime}</Text>;
      },
    },
    {
      field: 'callerName',
      headerName: '來電姓名',
      width: 120,
      renderCell: params => {
        const isMute = params.row?.status === '已註銷' ? muteColor : '';
        return <Text $color={isMute}>{params.row.callerName}</Text>;
      },
    },
    {
      field: 'callContent',
      headerName: '內容',
      width: 240,
      renderCell: params => {
        const isMute = params.row?.status === '已註銷' ? muteColor : '';
        return <Text $color={isMute}>{params.row.callContent}</Text>;
      },
    },
    {
      field: 'handlingDepartment',
      headerName: '單位',
      width: 150,
      renderCell: params => {
        const isMute = params.row?.status === '已註銷' ? muteColor : '';
        return <Text $color={isMute}>{params.row.handlingDepartment}</Text>;
      },
    },
    {
      field: 'handlerId',
      headerName: '回覆人員',
      width: 150,
      renderCell: params => {
        const isMute = params.row?.status === '已註銷' ? muteColor : '';
        return <Text $color={isMute}>{params.row.handlerId}</Text>;
      },
    },

    {
      field: 'receiverId',
      headerName: '接聽人員',
      width: 150,
      renderCell: params => {
        const isMute = params.row?.status === '已註銷' ? muteColor : '';
        return <Text $color={isMute}>{params.row.receiverId}</Text>;
      },
    },
    {
      field: 'action',
      headerName: ' ',
      width: 150,
      renderCell: params => {
        return (
          <>
            {authEmployeeState.data.role === '主管' && (
              <Button
                type='button'
                $animation
                $width={'3rem'}
                onClick={() => {
                  handleSingleContactHistoryModalDelete(params.row.caseNumber);
                }}
              >
                刪除
              </Button>
            )}
          </>
        );
      },
    },
  ];
  const rowsSrc = contactHistoryState.data || [];
  const rows = rowsSrc.map((record, index) => {
    const {
      _id,
      caseNumber,
      status,
      callTime,
      callerName,
      callerGender,
      callSubject,
      callContent,
      receiverId,
      lastEditedBy,
      processingHistory,
      createdAt,
      updatedAt,
      receiveDepartment,
      handlingDepartment,
      handlerId,
    } = record;
    return {
      no: index + 1,
      caseNumber,
      status,
      callTime: new Date(callTime).toLocaleString(
        {},
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      ),
      callerName: `${callerName} ${callerGender}`,
      callSubject,
      callContent,
      receiveDepartment: `${receiveDepartment?.departmentName} / ${receiveDepartment?.sectionName}`,
      receiverId: (() => {
        const employee = employeeState.data.find(
          e => e.employeeId === receiverId,
        );
        return `${employee?.name} (${employee?.employeeId})`;
      })(),
      handlingDepartment: `${handlingDepartment?.departmentName} / ${handlingDepartment?.sectionName}`,
      handlerId: (() => {
        if (!handlerId) {
          return;
        }
        const employee = employeeState.data.find(
          e => e.employeeId === handlerId,
        );
        return `${employee?.name} (${employee?.employeeId})`;
      })(),
      processingHistory,
    };
  });

  return (
    <Layout.PageLayout>
      <SEO title='客服紀錄 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>客服紀錄</h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                showAddContactHistoryModalElement(true);
              }}
              $bg={'#3488f5'}
              $color={'#fff'}
              $animation
            >
              新增
            </Button>
          </Flexbox>
        </TitleContainer>
        {/* <pre><Span>{JSON.stringify(contactHistoryState.data, null, 2)}</Span></pre> */}
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={row => row.caseNumber}
          checkboxSelection={false}
          disableSelectionOnClick
        />
        {operateType === 'addContactHistory' && (
          <Modal
            open={showModalElement}
            $height={'520px'}
            onClose={() => setShowModalElement(false)}
          >
            <AddContactHistory
              showAddContactHistoryModalElement={
                showAddContactHistoryModalElement
              }
              handleAddContactHistoryFormChange={
                handleAddContactHistoryFormChange
              }
              handleAddContactHistoryCreate={handleAddContactHistoryCreate}
              addContactHistoryFormData={addContactHistoryFormData}
              submitClicked={submitClicked}
              promptMessage={promptMessage}
            />
          </Modal>
        )}

        {(operateType === 'view' || operateType === 'editContactHistory') && (
          <Modal
            open={showModalElement}
            $maxWidth={'45%'}
            onClose={() => setShowModalElement(false)}
          >
            <SingleContactHistory
              showSingleContactHistoryModalElement={
                showSingleContactHistoryModalElement
              }
              handleSingleContactHistoryFormChange={
                handleSingleContactHistoryFormChange
              }
              handleSingleContactHistoryUpdate={
                handleSingleContactHistoryUpdate
              }
              editContactHistoryFormData={editContactHistoryFormData}
              submitClicked={submitClicked}
              setSubmitClicked={setSubmitClicked}
              promptMessage={promptMessage}
              newProcessingHistoryFormData={newProcessingHistoryFormData}
              handleNewProcessingHistoryFormChange={
                handleNewProcessingHistoryFormChange
              }
              handleNewProcessingHistoryCreate={
                handleNewProcessingHistoryCreate
              }
              operateType={operateType}
              setOperateType={setOperateType}
              showAddContactHistoryInputElement={
                showAddContactHistoryInputElement
              }
              setShowAddContactHistoryInputElement={
                setShowAddContactHistoryInputElement
              }
              editingContactHistoryIndex={editingContactHistoryIndex}
              setEditingContactHistoryIndex={setEditingContactHistoryIndex}
            />
          </Modal>
        )}
      </Container>

      <Layout.Loading
        type={'spinningBubbles'}
        active={contactHistoryState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

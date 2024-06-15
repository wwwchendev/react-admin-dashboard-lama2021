//react
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { userRequests, clearUserError } from '@/store/user';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Form,
  Modal,
  Button,
  TitleContainer,
  Icon,
  Span,
  Text,
  Flexbox,
} from '@/components/common';
import { DataGrid } from '@material-ui/data-grid';
import AddUser from './AddUser';
import EditUser from './EditUser';
//utility
import cryptoJS from '@/utils/cryptoJS.js';
import { getDateString, getTimeString } from '@/utils/format';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const User = () => {
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const userState = useSelector(state => state.user);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialAddUserFormData = {
    username: '',
    lastName: '',
    firstName: '',
    gender: '',
    birthdate: '',
    mobile: '',
    phone: '',
    email: '',
    address: {
      zipcode: '',
      county: '',
      district: '',
      address: '',
    },
    enabled: {
      isActive: true,
      reason: '',
    },
    lastEditedBy: '',
    lastEditerName: '',
    updatedAt: '',
  };
  const [addUserFormData, setAddUserFormData] = useState(
    initialAddUserFormData,
  );
  const [editUserFormData, setEditUserFormData] = useState(
    initialAddUserFormData,
  );

  const [userIsActiveRadioChecked, setUserIsActiveRadioChecked] = useState(
    addUserFormData.enabled.isActive,
  );
  const [userGenderRadioChecked, setUserGenderRadioChecked] = useState(
    addUserFormData.gender,
  );
  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);

  //狀態管理
  const [submitClicked, setSubmitClicked] = useState(false);
  const [showModalElement, setShowModalElement] = useState(false);

  //useEffect
  useEffect(() => {
    setCurrentPage('/user');
    dispatch(userRequests.getAll(TOKEN));
  }, []);

  useEffect(() => {
    if (operateType === 'addUser') {
      if (submitClicked & (userState.error === null)) {
        if (!addUserFormData.lastEditerName) {
          const user = userState.data[0];
          setAddUserFormData(prev => {
            return {
              ...prev,
              updatedAt: user.updatedAt,
              lastEditedBy: user.lastEditedBy,
              lastEditerName: user.lastEditerName,
            };
          });
        } else if (addUserFormData.updatedAt !== '') {
          setPromptMessage(prevState => ({
            ...prevState,
            default: `✔️已新增用戶，請使用預設密碼: ${addUserFormData.initPassword} 登入`,
          }));
        }
      }
    } else if (operateType === 'editUser') {
      if (submitClicked & (userState.error === null)) {
        if (!editUserFormData.lastEditerName) {
          const index = userState.data.findIndex(
            user => user.username === editUserFormData.username,
          );
          const user = userState.data[index];
          setEditUserFormData(prev => {
            return {
              ...prev,
              updatedAt: user.updatedAt,
              lastEditedBy: user.lastEditedBy,
              lastEditerName: user.lastEditerName,
            };
          });
        } else {
          setPromptMessage(prevState => ({
            ...prevState,
            default: `✔️已更新用戶資料 ${editUserFormData.username}/${editUserFormData.lastName} ${editUserFormData.firstName}`,
          }));
        }
      }
    }
  }, [
    userState.data,
    addUserFormData.lastEditerName,
    editUserFormData.lastEditerName,
  ]);

  //modal
  const [operateType, setOperateType] = useState('');
  useEffect(() => {
    if (operateType === 'addUser') {
      setUserIsActiveRadioChecked(addUserFormData.enabled?.isActive);
      setUserGenderRadioChecked(addUserFormData.gender);
    } else if (operateType === 'editUser') {
      setUserIsActiveRadioChecked(editUserFormData?.enabled?.isActive);
      setUserGenderRadioChecked(editUserFormData.gender);
    }
  }, [
    addUserFormData.gender,
    editUserFormData.gender,
    addUserFormData.enabled?.isActive,
    editUserFormData.enabled?.isActive,
  ]);

  //add
  const showAddUserModalElement = boolean => {
    setShowModalElement(boolean);
    setOperateType('addUser');
    setAddUserFormData(initialAddUserFormData);
    setUserIsActiveRadioChecked('true');
    setPromptMessage(initPromptMessage);
    setSubmitClicked(false);
    dispatch(clearUserError());
  };
  const handleAddUserFormChange = async e => {
    const { name, value } = e.target;
    if (userState.error !== null) {
      setSubmitClicked(false);
      dispatch(clearUserError());
    }
    setPromptMessage(initPromptMessage);

    if (name === 'isActive' || name === 'reason') {
      setAddUserFormData(prevState => ({
        ...prevState,
        'enabled': {
          ...prevState.enabled,
          [name]: value,
        },
      }));
    } else if (
      name === 'zipcode' ||
      name === 'county' ||
      name === 'district' ||
      name === 'address'
    ) {
      setAddUserFormData(prevState => ({
        ...prevState,
        'address': {
          ...prevState.address,
          [name]: value,
        },
      }));
    } else {
      setAddUserFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleAddUserCreate = async e => {
    e.preventDefault();
    const generateDefaultPassword = () => {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // 英文大寫、小寫和數字
      let defaultPassword = '';
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        defaultPassword += characters[randomIndex];
      }
      return defaultPassword;
    };
    const {
      username,
      lastName,
      firstName,
      gender,
      birthdate,
      mobile,
      phone,
      email,
      address,
      enabled,
      lastEditedBy,
      updatedAt,
    } = addUserFormData;

    if (
      username !== '' &&
      lastName !== '' &&
      firstName !== '' &&
      gender !== '' &&
      birthdate !== '' &&
      mobile !== '' &&
      email !== '' &&
      address !== '' &&
      enabled !== ''
    ) {
      setSubmitClicked(true);
      const initPassword = generateDefaultPassword();

      const addedData = {
        username: username,
        birthdate: birthdate,
        lastName: lastName,
        firstName: firstName,
        gender: gender,
        mobile: mobile,
        phone: phone,
        email: email,
        address: {
          zipcode: address?.zipcode,
          county: address?.county,
          district: address?.district,
          address: address?.address,
        },
        enabled: {
          isActive: enabled?.isActive,
          reason: enabled?.reason,
        },
        lastEditedBy: authEmployeeState.data.employeeId,
        passwordHash: cryptoJS.encrypt(initPassword),
      };
      await dispatch(userRequests.add(TOKEN, addedData));
      setAddUserFormData(prev => {
        return { ...prev, initPassword };
      });
    } else {
      //地址
      if (addUserFormData['address'].zipcode === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: {
              ...prev.address,
              zipcode: `郵遞區號欄位不得為空`,
            },
          };
        });
      }
      if (addUserFormData['address'].county === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: {
              ...prev.address,
              county: `縣市欄位不得為空`,
            },
          };
        });
      }
      if (addUserFormData['address'].district === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: {
              ...prev.address,
              district: `鄉鎮市區欄位不得為空`,
            },
          };
        });
      }
      if (addUserFormData['address'].address === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: {
              ...prev.address,
              address: `路段號碼樓層欄位不得為空`,
            },
          };
        });
      }
      //啟用
      if (addUserFormData['enabled'].isActive === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            enabled: {
              ...prev.enabled,
              isActive: `啟用狀態欄位不得為空`,
            },
          };
        });
      }
      if (addUserFormData['enabled'].reason === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            enabled: {
              ...prev.enabled,
              reason: `異動原因欄位不得為空`,
            },
          };
        });
      }
      const requireField = [
        'username',
        'lastName',
        'firstName',
        'gender',
        'birthdate',
        'mobile',
        'email',
      ];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'username':
            emptyField = '用戶名稱欄位';
            break;
          case 'lastName':
            emptyField = '用戶姓氏欄位';
            break;
          case 'firstName':
            emptyField = '用戶名字欄位';
            break;
          case 'gender':
            emptyField = '用戶性別欄位';
            break;
          case 'birthdate':
            emptyField = '生日日期欄位';
            break;
          case 'mobile':
            emptyField = '手機號碼欄位';
            break;
          case 'email':
            emptyField = '電子信箱欄位';
            break;
          default:
            return;
        }

        if (addUserFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };

  //edit
  const showEditUserModalElement = (boolean, username) => {
    setShowModalElement(boolean);
    if (boolean === true) {
      setOperateType('editUser');
      const user = userState.data.find(user => user.username === username);
      setEditUserFormData(p => ({
        ...p,
        username: user?.username,
        lastName: user?.lastName,
        firstName: user?.firstName,
        gender: user?.gender,
        birthdate: getDateString(new Date(user?.birthdate)),
        mobile: user?.mobile,
        phone: user?.phone,
        email: user?.email,
        address: {
          zipcode: user?.address?.zipcode,
          county: user?.address?.county,
          district: user?.address?.district,
          address: user?.address?.address,
        },
        enabled: {
          isActive: user?.enabled?.isActive ? 'true' : 'false',
          reason: user?.enabled?.reason,
        },
        updatedAt: user?.updatedAt,
        lastEditedBy: user?.lastEditedBy,
        lastEditerName: user?.lastEditerName,
      }));
      setPromptMessage(initPromptMessage);
      setSubmitClicked(false);
      dispatch(clearUserError());
    }
  };
  const handleEditUserFormChange = async e => {
    const { name, value } = e.target;
    setSubmitClicked(false);
    if (
      name === 'zipcode' ||
      name === 'county' ||
      name === 'district' ||
      name === 'address'
    ) {
      setEditUserFormData(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name]: value,
        },
      }));
    } else if (name === 'isActive' || name === 'reason') {
      setEditUserFormData(prevState => ({
        ...prevState,
        enabled: {
          ...prevState.enabled,
          [name]: value,
        },
      }));
    } else {
      setEditUserFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
    await dispatch(clearUserError());
    setPromptMessage({ default: '⛔變更尚未保存' });
  };
  const handleUserUpdate = async e => {
    e.preventDefault();
    const {
      username,
      lastName,
      firstName,
      gender,
      birthdate,
      mobile,
      phone,
      email,
      address,
      enabled,
      lastEditedBy,
      updatedAt,
    } = editUserFormData;

    if (
      username !== '' &&
      lastName !== '' &&
      firstName !== '' &&
      gender !== '' &&
      birthdate !== '' &&
      mobile !== '' &&
      email !== '' &&
      address.zipcode !== '' &&
      address.county !== '' &&
      address.district !== '' &&
      address.address !== '' &&
      enabled !== ''
    ) {
      setSubmitClicked(true);

      const updatedData = {
        lastName: lastName,
        firstName: firstName,
        gender: gender,
        mobile: mobile,
        phone: phone,
        email: email,
        address: {
          zipcode: address?.zipcode,
          county: address?.county,
          district: address?.district,
          address: address?.address,
        },
        enabled: {
          isActive: enabled?.isActive,
          reason: enabled?.reason,
        },
        lastEditedBy: authEmployeeState.data.employeeId,
      };
      await dispatch(userRequests.update(TOKEN, username, updatedData));
    } else {
      //地址
      if (editUserFormData['address'].zipcode === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: {
              ...prev.address,
              zipcode: `郵遞區號欄位不得為空`,
            },
          };
        });
      }
      if (editUserFormData['address'].county === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: {
              ...prev.address,
              county: `縣市欄位不得為空`,
            },
          };
        });
      }
      if (editUserFormData['address'].district === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: {
              ...prev.address,
              district: `鄉鎮市區欄位不得為空`,
            },
          };
        });
      }
      if (editUserFormData['address'].address === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            address: {
              ...prev.address,
              address: `路段號碼樓層欄位不得為空`,
            },
          };
        });
      }
      //啟用
      if (editUserFormData['enabled'].isActive === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            enabled: {
              ...prev.enabled,
              isActive: `啟用狀態欄位不得為空`,
            },
          };
        });
      }
      if (editUserFormData['enabled'].reason === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            enabled: {
              ...prev.enabled,
              reason: `異動原因欄位不得為空`,
            },
          };
        });
      }

      const requireField = [
        'username',
        'lastName',
        'firstName',
        'gender',
        'birthdate',
        'mobile',
        'email',
      ];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'username':
            emptyField = '用戶名稱欄位';
            break;
          case 'lastName':
            emptyField = '用戶姓氏欄位';
            break;
          case 'firstName':
            emptyField = '用戶名字欄位';
            break;
          case 'gender':
            emptyField = '用戶性別欄位';
            break;
          case 'birthdate':
            emptyField = '生日日期欄位';
            break;
          case 'mobile':
            emptyField = '手機號碼欄位';
            break;
          case 'email':
            emptyField = '電子信箱欄位';
            break;
          default:
            return;
        }

        if (editUserFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };

  //內容-DataGrid列表
  const muteColor = '#a5a5a5';
  const columns = [
    {
      field: 'username',
      headerName: '用戶名稱',
      width: 150,
      renderCell: params => {
        const isMute = params.row?.status === '停用' ? muteColor : '';
        return (
          <Link
            onClick={e => {
              e.preventDefault();
              showEditUserModalElement(true, params.row.username);
            }}
          >
            <Text $color={isMute}>{params.row.username}</Text>
          </Link>
        );
      },
    },
    {
      field: 'name',
      headerName: '姓名',
      width: 120,
      renderCell: params => {
        const isMute = params.row?.status === '停用' ? muteColor : '';
        return (
          <Text
            $color={isMute}
          >{`${params.row.name}  ${params.row.gender}`}</Text>
        );
      },
    },
    {
      field: 'birthdate',
      headerName: '生日',
      width: 120,
      renderCell: params => {
        const isMute = params.row?.status === '停用' ? muteColor : '';
        return <Text $color={isMute}>{params.row.birthdate}</Text>;
      },
    },
    {
      field: 'county',
      headerName: '通訊地',
      width: 120,
      renderCell: params => {
        const isMute = params.row?.status === '停用' ? muteColor : '';
        return <Text $color={isMute}>{params.row.county}</Text>;
      },
    },
    {
      field: 'mobile',
      headerName: '手機',
      width: 120,
      renderCell: params => {
        const isMute = params.row?.status === '停用' ? muteColor : '';
        return <Text $color={isMute}>{params.row.mobile}</Text>;
      },
    },
    {
      field: 'email',
      headerName: '信箱',
      width: 180,
      renderCell: params => {
        const isMute = params.row?.status === '停用' ? muteColor : '';
        return <Text $color={isMute}>{params.row.email}</Text>;
      },
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 120,
      renderCell: params => {
        const isMute = params.row?.status === '停用' ? muteColor : '';
        return <Text $color={isMute}>{params.row.status}</Text>;
      },
    },
    {
      field: 'reason',
      headerName: '備註',
      width: 180,
      renderCell: params => {
        const isMute = params.row?.status === '停用' ? muteColor : '';
        return <Text $color={isMute}>{params.row.reason}</Text>;
      },
    },
  ];
  const rowsSrc = userState.data || [];
  const rows = rowsSrc.map((user, index) => {
    const {
      username,
      lastName,
      gender,
      birthdate,
      mobile,
      email,
      firstName,
      enabled,
      address,
    } = user;
    return {
      username: username,
      status: enabled?.isActive ? '啟用' : '停用',
      name: `${lastName} ${firstName}`,
      gender,
      birthdate: new Date(birthdate).toLocaleString(
        {},
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        },
      ),
      mobile: mobile,
      email: email,
      county: address?.county,
      reason: enabled?.reason,
    };
  });

  return (
    <Layout.PageLayout>
      <SEO title='會員資料維護 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>會員資料維護</h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                showAddUserModalElement(true);
              }}
              $bg={'#3488f5'}
              $animation
            >
              新增
            </Button>
          </Flexbox>
        </TitleContainer>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={row => row.username}
          checkboxSelection={false}
          disableSelectionOnClick
        />
        {operateType === 'addUser' && (
          <Modal
            open={showModalElement}
            onClose={() => showAddUserModalElement(false)}
          >
            <AddUser
              showAddUserModalElement={showAddUserModalElement}
              addUserFormData={addUserFormData}
              handleAddUserFormChange={handleAddUserFormChange}
              handleAddUserCreate={handleAddUserCreate}
              submitClicked={submitClicked}
              promptMessage={promptMessage}
              userIsActiveRadioChecked={userIsActiveRadioChecked}
              userGenderRadioChecked={userGenderRadioChecked}
            />
          </Modal>
        )}
        {operateType === 'editUser' && (
          <Modal
            open={showModalElement}
            onClose={() => showAddUserModalElement(false)}
          >
            <EditUser
              showEditUserModalElement={showEditUserModalElement}
              editUserFormData={editUserFormData}
              handleEditUserFormChange={handleEditUserFormChange}
              handleUserUpdate={handleUserUpdate}
              submitClicked={submitClicked}
              promptMessage={promptMessage}
              userIsActiveRadioChecked={userIsActiveRadioChecked}
              userGenderRadioChecked={userGenderRadioChecked}
            />
          </Modal>
        )}
        {/* {JSON.stringify(userState.data, null, 2)} */}
      </Container>
      <Layout.Loading
        type={'spinningBubbles'}
        active={userState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

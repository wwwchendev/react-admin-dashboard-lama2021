//react
import { useEffect, useState } from 'react';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { employeeRequests, clearEmployeeError } from '@/store/employee';
import { jobStructureRequests } from '@/store/jobStructure';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import { TitleContainer, Modal, Button, Text } from '@/components/common';
import { DataGrid } from '@material-ui/data-grid';
import { Edit } from '@material-ui/icons';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
//utility
import { getDateString } from '@/utils/format';
import cryptoJS from '@/utils/cryptoJS.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const Employee = () => {
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const employeeState = useSelector(state => state.employee.employees);
  const jobStructureState = useSelector(state => state.jobStructure);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialFormData = {
    employeeId: '',
    hireDate: getDateString(new Date()),
    name: '',
    role: '檢視',
    position: {
      department: '',
      section: '',
    },
    email: '',
    enabled: {
      isActive: 'true',
      reason: '到職',
    },
    updatedAt: '',
    lastEditedBy: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [employeeRoleRadioChecked, setEmployeeRoleRadioChecked] = useState(
    formData.role,
  );
  const [employeeIsActiveRadioChecked, setEmployeeIsActiveRadioChecked] =
    useState(true);
  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [submitClicked, setSubmitClicked] = useState(false);
  const [showModalElement, setShowModalElement] = useState(false);

  //useEffect
  useEffect(() => {
    setCurrentPage('/employee');
    dispatch(employeeRequests.getAll(TOKEN));
    dispatch(jobStructureRequests.getAll(TOKEN));
  }, []);

  useEffect(() => {
    if (operateType === 'add') {
      if (submitClicked & (employeeState.error === null)) {
        if (!formData.employeeId) {
          const index = employeeState.data.length - 1;
          const employee = employeeState.data[index];
          setFormData(prev => {
            return {
              ...prev,
              employeeId: employee.employeeId,
              updatedAt: employee.updatedAt,
              lastEditedBy: employee.lastEditedBy,
            };
          });
        } else if (formData.employeeId !== '') {
          setPromptMessage(prevState => ({
            ...prevState,
            default: `✔️已新增，請使用預設密碼: ${formData.initPassword} 登入`,
          }));
        }
      }
    } else if (operateType === 'edit') {
      if (submitClicked & (employeeState.error === null)) {
        setPromptMessage(prevState => ({
          ...prevState,
          default: `✔️已更新員工資料 ${formData.employeeId}/${formData.name}`,
        }));
      }
    }
  }, [employeeState.data, formData.employeeId]);

  useEffect(() => {
    setEmployeeRoleRadioChecked(formData?.role);
    setEmployeeIsActiveRadioChecked(formData?.enabled?.isActive);
  }, [formData?.role, formData?.enabled?.isActive]);

  //modal
  const [operateType, setOperateType] = useState('');

  //add
  const showAddEmployeeModalElement = boolean => {
    setShowModalElement(boolean);
    setOperateType('add');
    setFormData(initialFormData);
    setEmployeeRoleRadioChecked('檢視');
    setEmployeeIsActiveRadioChecked('true');
    setPromptMessage(initPromptMessage);
    setSubmitClicked(false);
    dispatch(clearEmployeeError());
  };
  const handleAddEmployeeFormChange = async e => {
    e.preventDefault();
    const { name, value } = e.target;
    if (employeeState.error !== null) {
      setSubmitClicked(false);
      dispatch(clearEmployeeError());
    }
    setPromptMessage(initPromptMessage);
    if (name === 'isActive' || name === 'reason') {
      setFormData(prevState => ({
        ...prevState,
        enabled: {
          ...prevState.enabled,
          [name]: value,
        },
      }));
    } else if (name === 'role') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    } else if (name === 'department') {
      // 根據所選部門更改部門的分區（section）內容
      setFormData(prevState => ({
        ...prevState,
        position: {
          ...prevState.position,
          department: value,
          section: '',
        },
      }));
    } else if (name === 'section') {
      setFormData(prevState => ({
        ...prevState,
        position: {
          ...prevState.position,
          section: value,
        },
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleAddEmployeeFormSubmit = async e => {
    e.preventDefault();
    const {
      employeeId,
      hireDate,
      name,
      role,
      position,
      email,
      enabled,
      updatedAt,
      lastEditedBy,
    } = formData;
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
    if (
      hireDate !== '' &&
      name !== '' &&
      role !== '' &&
      position.department !== '' &&
      position.section !== '' &&
      email !== ''
    ) {
      //更新資料庫
      setSubmitClicked(true);
      const initPassword = generateDefaultPassword();
      const addedData = {
        'employeeId': '',
        'passwordHash': cryptoJS.encrypt(initPassword),
        'hireDate': new Date(formData.hireDate).toISOString(),
        'name': formData.name,
        'role': formData.role,
        'position': {
          'department': formData.position.department,
          'section': formData.position.section,
        },
        'email': formData.email,
        'enabled': {
          'isActive': formData.enabled.isActive,
          'reason': formData.enabled.reason,
        },
        'updatedAt': '',
        'lastEditedBy': authEmployeeState.data?.employeeId,
        initPassword,
      };
      await dispatch(employeeRequests.add(TOKEN, addedData));
      setFormData(prev => {
        return { ...prev, initPassword };
      });
    } else {
      const requireField = ['hireDate', 'name', 'role', 'email', 'reason'];
      if (formData['enabled'].reason === '') {
        setPromptMessage(prev => {
          return { ...prev, reason: `異動原因欄位不得為空` };
        });
      }
      if (formData['position'].department === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            position: {
              ...prev.position,
              department: `隸屬部門不得為空`,
            },
          };
        });
      }
      if (formData['position'].section === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            position: {
              ...prev.position,
              section: `隸屬組別不得為空`,
            },
          };
        });
      }
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'hireDate':
            emptyField = '到職日期欄位';
            break;
          case 'name':
            emptyField = '員工姓名欄位';
            break;
          case 'email':
            emptyField = '電子信箱欄位';
            break;
          case 'reason':
            emptyField = '異動原因欄位';
            break;
          default:
            return;
        }

        if (formData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };

  //edit
  const showEditEmployeeModalElement = (boolean, employeeId) => {
    setShowModalElement(boolean);
    setOperateType('edit');
    if (boolean === true) {
      const employee = employeeState.data.find((employee, idx) => {
        return employee.employeeId === employeeId;
      });
      const department = jobStructureState.data.find((department, idx) => {
        return department.departmentName === employee?.position?.department;
      });
      const section = jobStructureState.data
        .flatMap(department => department.sections)
        .find(section => section.sectionName === employee?.position?.section);

      const hireDate = getDateString(new Date(employee?.hireDate));
      setFormData({
        employeeId: employee?.employeeId,
        hireDate: hireDate,
        name: employee?.name,
        role: employee?.role,
        position: {
          department: department?._id,
          section: section?._id,
        },
        email: employee?.email,
        enabled: {
          isActive: employee?.enabled?.isActive ? 'true' : 'false',
          reason: employee?.enabled.reason,
        },
        updatedAt: employee?.updatedAt,
        lastEditedBy: employee?.lastEditedBy,
      });
      setEmployeeRoleRadioChecked(employee?.role);
      setPromptMessage(initPromptMessage);
      setSubmitClicked(false);
      dispatch(clearEmployeeError());
    }
  };
  const handleEditEmployeeFormChange = async e => {
    const { name, value } = e.target;
    if (employeeState.error !== null) {
      setSubmitClicked(false);
      dispatch(clearEmployeeError());
    }
    setPromptMessage(initPromptMessage);
    if (name === 'isActive' || name === 'reason') {
      setFormData(prevState => ({
        ...prevState,
        'enabled': {
          ...prevState.enabled,
          [name]: value,
        },
      }));
    } else if (name === 'role') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
      // setEmployeeRoleRadioChecked(value)
    } else if (name === 'department') {
      // 根據所選部門更改部門的分區（section）內容
      setFormData(prevState => ({
        ...prevState,
        position: {
          ...prevState.position,
          department: value,
          section: '',
        },
      }));
    } else if (name === 'section') {
      setFormData(prevState => ({
        ...prevState,
        position: {
          ...prevState.position,
          section: value,
        },
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleEditEmployeeFormSubmit = async e => {
    e.preventDefault();
    const {
      employeeId,
      hireDate,
      name,
      role,
      position,
      email,
      enabled,
      updatedAt,
      lastEditedBy,
    } = formData;
    if (
      name !== '' &&
      role !== '' &&
      position !== '' &&
      email !== '' &&
      enabled.reason !== ''
    ) {
      setSubmitClicked(true);
      const updatedData = {
        name,
        role,
        position: {
          department: position.department,
          section: position.section,
        },
        email,
        enabled: {
          isActive: enabled.isActive,
          reason: enabled.reason,
        },
        lastEditedBy: authEmployeeState.data.employeeId,
      };
      await dispatch(employeeRequests.update(TOKEN, employeeId, updatedData));
    } else {
      if (formData['enabled'].reason === '') {
        setPromptMessage(prev => {
          return { ...prev, reason: `異動原因欄位不得為空` };
        });
      }
      if (formData['position'].department === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            position: {
              ...prev.position,
              department: `隸屬部門不得為空`,
            },
          };
        });
      }
      if (formData['position'].section === '') {
        setPromptMessage(prev => {
          return {
            ...prev,
            position: {
              ...prev.position,
              section: `隸屬組別不得為空`,
            },
          };
        });
      }
      const requireField = ['position', 'name', 'role', 'email'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'hireDate':
            emptyField = '到職日期欄位';
            break;
          case 'name':
            emptyField = '員工姓名欄位';
            break;
          case 'email':
            emptyField = '電子信箱欄位';
            break;
          default:
            return;
        }

        if (formData[f] === '') {
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
      field: 'no',
      headerName: '序號',
      width: 105,
      renderCell: params => {
        const isMute = params.row?.enabled === '啟用' ? '' : muteColor;
        return <Text $color={isMute}>{params.row.no}</Text>;
      },
    },
    {
      field: 'department',
      headerName: '部門',
      width: 110,
      renderCell: params => {
        const isMute = params.row?.enabled === '啟用' ? '' : muteColor;
        return <Text $color={isMute}>{params.row.department}</Text>;
      },
    },
    {
      field: 'section',
      headerName: '單位',
      width: 110,
      renderCell: params => {
        const isMute = params.row?.enabled === '啟用' ? '' : muteColor;
        return <Text $color={isMute}>{params.row.section}</Text>;
      },
    },
    {
      field: 'permission',
      headerName: '權限',
      width: 105,
      renderCell: params => {
        const isMute = params.row?.enabled === '啟用' ? '' : muteColor;
        return <Text $color={isMute}>{params.row.permission}</Text>;
      },
    },
    {
      field: 'name',
      headerName: '姓名',
      width: 110,
      renderCell: params => {
        const isMute = params.row?.enabled === '啟用' ? '' : muteColor;
        return <Text $color={isMute}>{params.row.name}</Text>;
      },
    },
    {
      field: 'employeeId',
      headerName: '員編',
      width: 110,
      renderCell: params => {
        const isMute = params.row?.enabled === '啟用' ? '' : muteColor;
        return <Text $color={isMute}>{params.row.employeeId}</Text>;
      },
    },
    {
      field: 'time',
      headerName: '到職日',
      width: 120,
      renderCell: params => {
        const isMute = params.row?.enabled === '啟用' ? '' : muteColor;
        return <Text $color={isMute}>{params.row.hireDate}</Text>;
      },
    },
    {
      field: 'enabled',
      headerName: '狀態',
      width: 105,
      renderCell: params => {
        const isMute = params.row?.enabled === '啟用' ? '#000' : muteColor;
        return <Text $color={isMute}>{params.row.enabled}</Text>;
      },
    },
    {
      field: 'reason',
      headerName: '備註',
      width: 105,
      renderCell: params => {
        // console.log(params.row);
        if (params.row.reason === '到職') return '';
        const isMute = params.row?.enabled === '啟用' ? '' : muteColor;
        return <Text $color={isMute}>{params.row.reason}</Text>;
      },
    },
    {
      field: 'action',
      headerName: ' ',
      width: 100,
      renderCell: params => {
        return (
          <Button
            type={'button'}
            $width={'3rem'}
            $color={'#333'}
            $bg={'transparent'}
            onClick={() => {
              showEditEmployeeModalElement(true, params.row.employeeId);
            }}
          >
            <Edit /> 編輯
          </Button>
        );
      },
    },
  ];
  const rowsSrc = employeeState.data || [];
  const rows = rowsSrc.map((employee, index) => {
    const {
      position,
      enabled,
      _id,
      employeeId,
      name,
      role,
      hireDate,
      lastEditedBy,
      createdAt,
      updatedAt,
      __v,
      email,
      token,
    } = employee;
    return {
      no: index + 1,
      department: position?.department,
      section: position?.section,
      permission: role,
      name,
      employeeId,
      hireDate: new Date(hireDate).toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
      enabled: enabled?.isActive ? '啟用' : '停用',
      reason: enabled?.reason,
    };
  });

  return (
    <Layout.PageLayout>
      <SEO title='員工帳號管理 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>員工帳號管理</h1>
          <Button
            type='button'
            onClick={() => {
              showAddEmployeeModalElement(true);
            }}
            $bg={'#3488f5'}
            $animation
          >
            新增
          </Button>
        </TitleContainer>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={row => row.no}
          checkboxSelection={false}
          disableSelectionOnClick
        />
        {operateType === 'add' && (
          <Modal
            open={showModalElement}
            onClose={() => showAddEmployeeModalElement(false)}
          >
            <AddEmployee
              showAddEmployeeModalElement={showAddEmployeeModalElement}
              handleAddEmployeeFormChange={handleAddEmployeeFormChange}
              handleAddEmployeeFormSubmit={handleAddEmployeeFormSubmit}
              formData={formData}
              submitClicked={submitClicked}
              promptMessage={promptMessage}
              employeeIsActiveRadioChecked={employeeIsActiveRadioChecked}
              employeeRoleRadioChecked={employeeRoleRadioChecked}
            />
          </Modal>
        )}
        {operateType === 'edit' && (
          <Modal
            open={showModalElement}
            onClose={() => showEditEmployeeModalElement(false)}
          >
            <EditEmployee
              showEditEmployeeModalElement={showEditEmployeeModalElement}
              handleEditEmployeeFormChange={handleEditEmployeeFormChange}
              handleEditEmployeeFormSubmit={handleEditEmployeeFormSubmit}
              submitClicked={submitClicked}
              formData={formData}
              promptMessage={promptMessage}
              employeeRoleRadioChecked={employeeRoleRadioChecked}
            />
          </Modal>
        )}
      </Container>
      <Layout.Loading
        type={'spinningBubbles'}
        active={employeeState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

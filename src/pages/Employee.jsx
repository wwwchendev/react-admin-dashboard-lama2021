import { PageLayout, } from '@/components';
import { useCurrentPage } from '../context/CurrentPageContext';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
import { tablet } from '../responsive';
import { convertIsoToTaipeiTime, convertDateToIsoTaipei } from '@/utils/format';
//取得資料+請求方法
import { useSelector, useDispatch } from 'react-redux';
import { EmployeeRequests, clearEmployeeError } from '@/store/employee';

/*-------------------------STYLED COMPONENTS-------------------------*/
// 標題
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 1.5rem;
  }
`;
//Modal
const ModalContainer = styled.div`
  display: ${props => (props.open ? 'block' : 'none')};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;
const ModalContent = styled.div`
  background-color: white;
  /* border: 1px solid #000; */
  border-radius: 8px;
  width: 50%;
  max-width: 500px;
  padding: 40px 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${tablet({
  width: '80%',
})};
`;
const Modal = ({ open, onClose, children }) => {
  return (
    <ModalContainer open={open}>
      <ModalContent>
        {children}
        <CloseBtn onClick={onClose}>X</CloseBtn >
      </ModalContent>
    </ModalContainer>
  );
};
//表單
const Form = styled.form`
  /* border: 1px solid red; */
  white-space: nowrap;
  h2{
    text-align: center;
    margin-bottom:24px;
  }
  hr{
    margin:16px 0;
    width: 100%;
  }
  & div{
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  select,input {
    width: 100%;
    border: 1px solid #949494;
    padding: 5px;
    border-radius: 5px;
  }
  span{
    color: #949494;
    cursor: pointer;
    font-size: 0.8rem;
  }
`
const FormField = styled.div`
display: flex;
justify-content: center;
width: ${props => (props.$width ? props.$width : '100')}%;
`
//按鈕
const Button = styled.button`
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: ${p => p.$bg ? p.$bg : '#5cc55f'};
  color: ${p => p.$color ? p.$color : '#fff'};
  cursor: pointer;
  &:disabled{
  background-color: #cccccc;
  color: #8d8d8d;
  }
`;
const TopButton = styled(Button)`
  width: 80px;
  border: none;
  padding: 5px 10px;
  background-color: ${p => p.$bg};
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: center;
  ${tablet({
  display: 'none',
})};
`;
const CloseBtn = styled.button`
position: absolute;
top: 16px;
right: 16px;
`
const Pre = styled.pre`
font-size: 12px;
`

/*-------------------------REACT PAGE-------------------------*/
export const Employee = () => {
  const { setCurrentPage } = useCurrentPage();
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken
  //REDUX
  const dispatch = useDispatch();
  const employeeState = useSelector(
    state => state.employee.employees,
  );
  const positionState = useSelector(
    state => state.employee.positions,
  );
  //MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  //MODAL/關閉Modal
  const handleCloseModal = () => { setIsModalOpen(false); };
  //MODAL/顯示資料
  const [operateType, setOperateType] = useState('');
  const [displayText, setDisplayText] = useState('');
  //MODAL/表單內容
  const initialForm = {
    employeeId: '',
    hireDate: convertDateToIsoTaipei(new Date()),
    name: '',
    role: '檢視',
    position: {
      department: '',
      section: '',
    },
    enabled: {
      isActive: true,
      reason: ''
    },
    updatedAt: '',
    lastEditedBy: ''
  }
  const [formData, setFormData] = useState(initialForm);
  const [radioIsActive, setRadioIsActive] = useState(formData.enabled.isActive);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'hireDate' && !isNaN(new Date(value))) {
      const isoDate = convertDateToIsoTaipei(new Date(value))
      setFormData(prevState => ({
        ...prevState,
        [name]: isoDate,
      }));
    } else if (name === 'isActive' || name === 'reason') {
      setFormData(prevState => ({
        ...prevState,
        enabled: {
          ...prevState.enabled,
          [name]: value,
        },
      }));
      if (name === 'isActive') {
        setRadioIsActive(prevState => !prevState);
      }
    } else if (name === 'department') {
      // 根據所選部門更改部門的分區（section）內容
      const selectedDepartment = value;
      const departmentObject = positionState.data.find(
        position => position.department === selectedDepartment
      );
      if (departmentObject) {
        setFormData(prevState => ({
          ...prevState,
          position: {
            ...prevState.position,
            department: selectedDepartment,
            section: ''
          },
        }));
      }
    } else if (name === 'section') {
      setFormData(prevState => ({
        ...prevState,
        position: {
          ...prevState.position,
          section: value
        },
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
    setIsEdited(true);
    setDisplayText('');
  };

  const [isEdited, setIsEdited] = useState(false);

  //設定當前頁面+獲取資料清單
  useEffect(() => {
    setCurrentPage('/employee');
    dispatch(EmployeeRequests.getAll(TOKEN))
    dispatch(EmployeeRequests.getPositions(TOKEN))
  }, []);
  //點擊新增以後
  const handleAddClick = () => {
    setOperateType('add')
    dispatch(clearEmployeeError());
    setFormData(initialForm);
    setDisplayText('');
    setIsModalOpen(true);
    setIsEdited(false)
  };
  //點擊編輯以後
  const handleEditClick = employeeId => () => {
    setOperateType('edit')
    dispatch(clearEmployeeError());
    setForm(employeeId)
    setIsModalOpen(true);
    setIsEdited(false)
  };

  const generateDefaultPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // 英文大寫、小寫和數字
    let defaultPassword = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      defaultPassword += characters[randomIndex];
    }
    return defaultPassword;
  };
  //提交編輯內容
  const handleSubmit = async (e) => {
    e.preventDefault();
    //更新資料庫
    if (operateType === 'add') {
      const initPassword = generateDefaultPassword()
      const addedData = {
        hireDate: new Date(formData.hireDate).toISOString(),
        name: formData.name,
        role: formData.role,
        position: formData.position,
        enabled: formData.enabled,
        lastEditedBy: authEmployeeState.data._id,
        initPassword,
      }
      await dispatch(EmployeeRequests.add(TOKEN, addedData));
      setFormData(prev => {
        return { ...prev, initPassword };
      });
    } else if (operateType === 'edit' && isEdited) {
      const updatedData = {
        name: formData.name,
        role: formData.role,
        position: formData.position,
        enabled: formData.enabled,
        lastEditedBy: authEmployeeState.data._id
      }
      await dispatch(
        EmployeeRequests.update(TOKEN, formData.employeeId, updatedData),
      );
    }
  };

  const setForm = (employeeId) => {
    const employee = employeeState.data.find(
      employee => employee.employeeId === employeeId,
    );
    setFormData({
      employeeId: employee.employeeId,
      hireDate: employee.hireDate,
      name: employee.name,
      role: employee.role,
      position: employee.position,
      enabled: employee.enabled,
      updatedAt: employee.updatedAt,
      lastEditedBy: employee.lastEditedBy
    });
    setRadioIsActive(employee.enabled.isActive)
    setDisplayText('');
  }

  //清單資料表頭
  const columns = [
    {
      field: 'no',
      headerName: '序號',
      width: 105,
    },
    {
      field: 'department',
      headerName: '部門',
      width: 110,
    },
    {
      field: 'section',
      headerName: '單位',
      width: 110,
    },
    {
      field: 'permission',
      headerName: '權限',
      width: 105,
    },
    {
      field: 'name',
      headerName: '姓名',
      width: 110,
    },
    {
      field: 'employeeId',
      headerName: '員編',
      width: 110,
    },
    {
      field: 'time',
      headerName: '到職日',
      width: 120,
    },
    {
      field: 'enabled',
      headerName: '狀態',
      width: 105,
    },
    {
      field: 'reason',
      headerName: '備註',
      width: 105,
      renderCell: params => {
        if (params.row.reason === '到職') return '';
        return (
          params.row.reason
        );
      }
    },
    {
      field: 'action',
      headerName: ' ',
      width: 150,
      renderCell: params => {
        return (
          <Button onClick={handleEditClick(params.row.employeeId)}>
            編輯
          </Button>
        );
      },
    }
  ];
  //清單資料內容
  const rows = employeeState.data.map((record, index) => {
    const { _id, employeeId, position, name, role, enabled, hireDate } = record;
    return {
      no: index + 1,
      department: position.department || '',
      section: position.section || '',
      name: name || 'N/A',
      permission: role || 'N/A',
      employeeId,
      time: new Date(hireDate).toLocaleDateString('zh-TW', {
        timeZone: 'Asia/Taipei',
      }),
      enabled: enabled.isActive ? '啟用' : '停用',
      reason: enabled.reason
    };
  });

  useEffect(() => {
    if (formData.employeeId !== '' && operateType === 'edit') {
      const employee = employeeState.data.find(
        employee => employee.employeeId === formData.employeeId,
      );
      setFormData((prev) => ({
        ...prev,
        updatedAt: employee.updatedAt,
        lastEditedBy: employee.lastEditedBy
      }));
      setDisplayText('✔️已變更')
    }

    if (operateType === 'add' && isEdited && !employeeState.error?.message) {
      if (formData.employeeId === '') {
        const index = employeeState.data.length - 1
        const employee = employeeState.data[index]
        setFormData(prev => {
          return {
            ...prev,
            employeeId: employee.employeeId,
            updatedAt: employee.updatedAt,
            lastEditedBy: employee.lastEditedBy
          };
        });
      } else if (formData.employeeId !== '') {
        setDisplayText(`✔️已新增，請使用預設密碼: ${formData.initPassword} 登入`)
      }
    }
  }, [employeeState.data, formData.initPassword])

  return (
    <PageLayout>
      <TitleContainer>
        <h1>員工帳號管理</h1>
        <TopButton
          type='button'
          $bg={'teal'}
          $color={'#ffffff'}
          onClick={handleAddClick}
        >
          新增
        </TopButton >
      </TitleContainer>
      {/* <p>{JSON.stringify(error)}</p> */}
      {/* <p>{JSON.stringify(TOKEN)}</p> */}
      {/* <p>{JSON.stringify(employeeState.employees.data[0], null, 2)}</p> */}
      {/* <p>{JSON.stringify(authEmployeeState.data, null, 2)}</p> */}

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={row => row.no}
        checkboxSelection={false}
        disableSelectionOnClick
      />

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {
          <Form onSubmit={handleSubmit}>
            <h2>{operateType === 'add' ? '新增員工資料' : '編輯員工資料'}</h2>
            <div>
              <FormField>
                <label>員工編號</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  disabled
                />
              </FormField>
              <FormField>
                <label>到職日期</label>
                <input
                  type="date"
                  name="hireDate"
                  value={
                    formData.hireDate
                      ? new Date(formData.hireDate).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={handleInputChange}
                  disabled={operateType === 'edit'}
                />
              </FormField>
            </div>
            <div>
              <FormField>
                <label>員工姓名</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </FormField>
              <FormField>
                <label>權限</label>
                <input
                  type='radio'
                  id='supervisor'
                  name='role'
                  value='主管'
                  checked={formData.role === '主管'}
                  onChange={handleInputChange}
                />
                <label htmlFor="supervisor">主管</label>
                <input
                  type='radio'
                  id='employee'
                  name='role'
                  value='職員'
                  checked={formData.role === '職員'}
                  onChange={handleInputChange}
                />
                <label htmlFor="employee">職員</label>
                <input
                  type='radio'
                  id='viewer'
                  name='role'
                  value='檢視'
                  checked={formData.role === '檢視'}
                  onChange={handleInputChange}
                />
                <label htmlFor="viewer">檢視</label>
              </FormField>
            </div>
            <div>
              <label>隸屬單位</label>
              <select
                name='department'
                value={formData.position.department}
                onChange={handleInputChange}
              >
                <option value={''} disabled>
                  請選擇部門
                </option>
                {positionState.data.map((position, idx) => {
                  return (
                    <option value={position.department} key={idx}>
                      {position.department}
                    </option>
                  );
                })}
              </select>
              <select
                name='section'
                value={formData.position.section}
                onChange={handleInputChange}
              >
                <option value={''} disabled>
                  請選擇組別
                </option>
                {positionState.data.map((position) => {
                  if (position.department === formData.position.department) {
                    return position.section.map((section, idx) => (
                      <option value={section} key={idx}>
                        {section}
                      </option>
                    ));
                  }
                  return null;
                })}
              </select>

            </div>
            <hr />
            <FormField $width={50}>
              <label>啟用狀態</label>
              <input
                type='radio'
                id='active'
                name='isActive'
                value='true'
                checked={radioIsActive === true}
                onChange={handleInputChange}
              />
              <label htmlFor="active">啟用</label>

              <input
                type='radio'
                id='inactive'
                name='isActive'
                value='false'
                checked={radioIsActive === false}
                onChange={handleInputChange}
              />
              <label htmlFor="inactive">停用</label>
            </FormField>

            <FormField $width={100}>
              <label>異動說明</label>
              <input
                type="text"
                name="reason"
                value={formData.enabled.reason}
                onChange={handleInputChange}
                placeholder='請說明異動原因:到職 \ 轉調 \ 休假 \ 其他: ...'
              />
            </FormField>

            <div>
              <label>最後更新</label>
              {formData.employeeId &&
                <>
                  <span>{new Date(formData.updatedAt).toLocaleString()}</span>
                  {formData.lastEditedBy && (
                    <span>
                      {(() => {
                        const editor = employeeState.data.find(
                          employee => employee._id === formData.lastEditedBy,
                        );
                        if (!editor?.name) {
                          return;
                        }
                        return `${editor?.name} (${editor?.employeeId})`
                      })()}
                    </span>
                  )}
                </>
              }

            </div>

            <FormField $width={100}>
              <span>
                {employeeState.error?.message
                  ? employeeState.error?.message
                  : displayText}
              </span>
            </FormField>

            <FormField $width={100}>
              <span onClick={handleCloseModal}>取消</span>
              <Button type='submit' disabled={employeeState.loading}>
                {operateType === 'add' ? '新增' : '更新'}
              </Button>
            </FormField>
          </Form>
        }
      </Modal>
      {/* <p>{JSON.stringify(formData, null, 2)}</p> */}
    </PageLayout >
  );
};

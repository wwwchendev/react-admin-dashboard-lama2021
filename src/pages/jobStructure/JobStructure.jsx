//react
import { useEffect, useState } from 'react';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import {
  jobStructureRequests,
  clearJobStructureError,
} from '@/store/jobStructure';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Flexbox,
  Button,
  TitleContainer,
  Modal,
} from '@/components/common';
import { DataGrid } from '@material-ui/data-grid';
import { Edit, Delete } from '@material-ui/icons';
import JobDepartment from './JobDepartment';
import AddJobSection from './AddJobSection';
import EditJobSection from './EditJobSection';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const JobStructure = () => {
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const jobStructureState = useSelector(state => state.jobStructure);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialDepartmentFormData = {
    'departmentName': '',
    'existedDepartments': jobStructureState.data.map(item => {
      return {
        _id: item._id,
        departmentName: item.departmentName,
        sectionCounts: item.sections.length,
        sections: item.sections,
      };
    }),
  };
  const [departmentFormData, setDepartmentFormData] = useState(
    initialDepartmentFormData,
  );

  const initialSectionFormData = {
    'departmentId': '',
    'sectionName': '',
  };
  const [sectionFormData, setSectionFormData] = useState(
    initialSectionFormData,
  );

  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [submitClicked, setSubmitClicked] = useState(false);
  const [showModalElement, setShowModalElement] = useState(false);

  //useEffect
  useEffect(() => {
    setCurrentPage('/jobstructure');
    dispatch(jobStructureRequests.getAll(TOKEN));
  }, []);

  useEffect(() => {
    if (operateType === 'addDepartment') {
      if (submitClicked & (jobStructureState.error === null)) {
        setDepartmentFormData(initialDepartmentFormData);
        setPromptMessage(prevState => ({
          ...prevState,
          default: `✔️新增完成`,
        }));
        setSubmitClicked(false);
      }
    } else if (operateType === 'updateDepartment') {
      if (submitClicked & (jobStructureState.error === null)) {
        setDepartmentFormData(initialDepartmentFormData);
        setPromptMessage(prevState => ({
          ...prevState,
          default: `✔️更新完成`,
        }));
        setSubmitClicked(false);
        setOperateType('department');
      }
    } else if (operateType === 'deleteDepartment') {
      if (submitClicked & (jobStructureState.error === null)) {
        setDepartmentFormData(initialDepartmentFormData);
        setPromptMessage(prevState => ({
          ...prevState,
          default: `✔️刪除完成`,
        }));
        setSubmitClicked(false);
      }
    } else if (operateType === 'addSection') {
      if (submitClicked & (jobStructureState.error === null)) {
        setDepartmentFormData(initialDepartmentFormData);
        setPromptMessage(prevState => ({
          ...prevState,
          default: `✔️新增完成`,
        }));
      }
    } else if (operateType === 'editSection') {
      if (submitClicked & (jobStructureState.error === null)) {
        setDepartmentFormData(initialDepartmentFormData);
        setPromptMessage(prevState => ({
          ...prevState,
          default: `✔️更新完成`,
        }));
      } else if (operateType === 'deleteSection') {
        if (submitClicked & (jobStructureState.error === null)) {
          setDepartmentFormData(initialDepartmentFormData);
          setSubmitClicked(false);
        }
      }
    }
  }, [jobStructureState.data]);
  //modal
  const [operateType, setOperateType] = useState('');

  //department
  const resetDepartmentFormData = () => {
    setDepartmentFormData(initialDepartmentFormData);
  };
  const showJobDepartmentModalElement = boolean => {
    setShowModalElement(boolean);
    setOperateType('department');
    setSectionFormData(initialDepartmentFormData);
    setPromptMessage(initPromptMessage);
    setSubmitClicked(false);
    dispatch(clearJobStructureError());
  };
  const handleJobDepartmentFormChange = (e, id) => {
    setSubmitClicked(false);
    dispatch(clearJobStructureError());
    setPromptMessage(initPromptMessage);
    const { name, value } = e.target;

    if (name === 'existedDepartments') {
      setDepartmentFormData(prevState => ({
        ...prevState,
        existedDepartments: prevState.existedDepartments.map(department =>
          department._id === id
            ? { ...department, departmentName: value }
            : department,
        ),
      }));
    } else {
      setDepartmentFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleJobDepartmentCreate = async e => {
    e.preventDefault();
    setOperateType('addDepartment');
    const { departmentName } = departmentFormData;
    if (departmentName !== '') {
      setSubmitClicked(true);
      const addedData = {
        'departmentName': departmentName,
      };
      await dispatch(jobStructureRequests.create.department(TOKEN, addedData));
    } else {
      const requireField = ['departmentName'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'departmentName':
            emptyField = '隸屬部門名稱欄位';
            break;
          default:
            return;
        }

        if (sectionFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };
  const handleJobDepartmentUpdate = async id => {
    setOperateType('updateDepartment');
    const department = departmentFormData.existedDepartments.find(
      item => item._id === id,
    );
    if (department) {
      setSubmitClicked(true);
      const updateDepartmentName = department.departmentName;
      dispatch(
        jobStructureRequests.update.department(TOKEN, id, {
          departmentName: updateDepartmentName,
        }),
      );
    }
  };
  const handleJobDepartmentDelete = async id => {
    setOperateType('deleteDepartment');
    const department = jobStructureState.data.find(item => {
      return item._id === id;
    });
    if (department?.sections.length === 0) {
      setSubmitClicked(true);
      dispatch(jobStructureRequests.delete.department(TOKEN, id));
    }
  };

  //addSection
  const showAddJobSectionModalElement = boolean => {
    setShowModalElement(boolean);
    setOperateType('addSection');
    setSectionFormData(initialSectionFormData);
    setPromptMessage(initPromptMessage);
    setSubmitClicked(false);
    dispatch(clearJobStructureError());
  };
  const handleAddJobSectionFormChange = async e => {
    e.preventDefault();
    setSubmitClicked(false);
    dispatch(clearJobStructureError());
    setPromptMessage(initPromptMessage);
    const { name, value } = e.target;
    setSectionFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleAddJobSectionCreate = async e => {
    e.preventDefault();
    const { departmentId, sectionName } = sectionFormData;
    if (departmentId !== '' && sectionName !== '') {
      setSubmitClicked(true);
      const addedData = {
        'departmentId': departmentId,
        'sectionName': sectionName,
      };
      await dispatch(jobStructureRequests.create.section(TOKEN, addedData));
    } else {
      const requireField = ['departmentId', 'sectionName'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'departmentId':
            emptyField = '隸屬部門欄位';
            break;
          case 'sectionName':
            emptyField = '組別名稱欄位';
            break;
          default:
            return;
        }

        if (sectionFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };
  //editSection
  const showEditJobSectionModalElement = (boolean, rowData) => {
    setShowModalElement(boolean);
    setOperateType('editSection');
    if (boolean === true) {
      const { departmentId, sectionName, sectionId } = rowData;
      setSectionFormData({
        'departmentId': departmentId,
        'sectionName': sectionName,
        'sectionId': sectionId,
      });
      setPromptMessage(initPromptMessage);
      setSubmitClicked(false);
      dispatch(clearJobStructureError());
    }
  };
  const handleEditJobSectionFormChange = async e => {
    e.preventDefault();
    setSubmitClicked(false);
    dispatch(clearJobStructureError());
    setPromptMessage(initPromptMessage);
    const { name, value } = e.target;
    setSectionFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleEditJobSectionUpdate = async e => {
    e.preventDefault();
    const { departmentId, sectionName, sectionId } = sectionFormData;
    if (departmentId !== '' && sectionName !== '') {
      setSubmitClicked(true);
      const updatedData = { 'sectionName': sectionName };
      await dispatch(
        jobStructureRequests.update.section(TOKEN, sectionId, updatedData),
      );
    } else {
      const requireField = ['sectionName'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'sectionName':
            emptyField = '組別名稱欄位';
            break;
          default:
            return;
        }

        if (sectionFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };

  //其他
  const handleJobSectionDelete = async (sectionId, sectionName) => {
    setOperateType('deleteSection');
    const confirmed = confirm(`確定要刪除組別－${sectionName}嗎`);
    if (confirmed) {
      setSubmitClicked(true);
      await dispatch(jobStructureRequests.delete.section(TOKEN, sectionId));
    }
  };

  //data-grid
  const columns = [
    {
      field: 'no',
      headerName: '序號',
      width: 105,
    },
    {
      field: 'departmentName',
      headerName: '部門',
      width: 120,
    },
    {
      field: 'sectionName',
      headerName: '組別',
      width: 120,
    },
    {
      field: 'count',
      headerName: '人數',
      width: 120,
    },
    {
      field: 'action',
      headerName: ' ',
      width: 100,
      renderCell: params => {
        return (
          <Button
            type={'button'}
            $width={'2rem'}
            $color={'#333'}
            $bg={'transparent'}
            onClick={() => {
              showEditJobSectionModalElement(true, params.row);
            }}
          >
            <Edit /> 編輯
          </Button>
        );
      },
    },
    {
      field: 'delete',
      headerName: ' ',
      width: 100,
      renderCell: params => {
        return (
          <>
            {params.row.count === 0 && (
              <>
                <Button
                  type={'button'}
                  $width={'4rem'}
                  $color={'#888070'}
                  $bg={'transparent'}
                  onClick={() => {
                    handleJobSectionDelete(
                      params.row.sectionId,
                      params.row.sectionName,
                    );
                  }}
                >
                  <Delete />
                  移除組別
                </Button>
              </>
            )}
          </>
        );
      },
    },
  ];

  const rowsSrc = jobStructureState.data || [];

  let globalIndex = 1;
  // console.log(rowsSrc);
  const rows = rowsSrc.flatMap(item => {
    const {
      _id: departmentId,
      departmentName,
      createdAt,
      updatedAt,
      sections,
    } = item;
    return sections.map(section => ({
      id: `${departmentId}-${section._id}`,
      departmentId,
      departmentName,
      sectionId: section._id,
      createdAt,
      updatedAt,
      sectionName: section.sectionName,
      count: section.counts,
      no: globalIndex++, // 使用計數器值作為序號，並每次映射後遞增計數器
    }));
  });

  return (
    <Layout.PageLayout>
      <SEO title='部門單位維護 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>部門單位維護</h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                showAddJobSectionModalElement(true);
              }}
              $bg={'#3488f5'}
              $color={'#fff'}
              $width={'6rem'}
              $padding={'10px'}
              $animation
            >
              新增組別
            </Button>
            <Button
              type='button'
              onClick={() => {
                showJobDepartmentModalElement(true);
              }}
              $bg={'transparent'}
              $border={'1px solid #3488f5'}
              $color={'#3488f5'}
              $width={'6rem'}
              $padding={'10px'}
              $animation
            >
              編輯部門
            </Button>
          </Flexbox>
        </TitleContainer>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={row => row.id}
          checkboxSelection={false}
          disableSelectionOnClick
        />
        {(operateType === 'department' ||
          operateType === 'addDepartment' ||
          operateType === 'deleteDepartment' ||
          operateType === 'updateDepartment') && (
            <Modal
              open={showModalElement}
              $maxWidth={'30%'}
              onClose={() => showJobDepartmentModalElement(false)}
            >
              <JobDepartment
                operateType={operateType}
                handleJobDepartmentFormChange={handleJobDepartmentFormChange}
                handleJobDepartmentCreate={handleJobDepartmentCreate}
                handleJobDepartmentUpdate={handleJobDepartmentUpdate}
                handleJobDepartmentDelete={handleJobDepartmentDelete}
                resetDepartmentFormData={resetDepartmentFormData}
                departmentFormData={departmentFormData}
                submitClicked={submitClicked}
                promptMessage={promptMessage}
              />
            </Modal>
          )}
        {operateType === 'addSection' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => showAddJobSectionModalElement(false)}
          >
            <AddJobSection
              showAddJobSectionModalElement={showAddJobSectionModalElement}
              handleAddJobSectionFormChange={handleAddJobSectionFormChange}
              handleAddJobSectionCreate={handleAddJobSectionCreate}
              sectionFormData={sectionFormData}
              submitClicked={submitClicked}
              promptMessage={promptMessage}
            />
          </Modal>
        )}
        {operateType === 'editSection' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => showEditJobSectionModalElement(false)}
          >
            <EditJobSection
              showEditJobSectionModalElement={showEditJobSectionModalElement}
              handleEditJobSectionFormChange={handleEditJobSectionFormChange}
              handleEditJobSectionUpdate={handleEditJobSectionUpdate}
              sectionFormData={sectionFormData}
              submitClicked={submitClicked}
              promptMessage={promptMessage}
            />
          </Modal>
        )}
      </Container>
      <Layout.Loading
        type={'spinningBubbles'}
        active={jobStructureState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

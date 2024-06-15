//react
import { useState, useEffect } from 'react';
//redux
import { useSelector } from 'react-redux';
//components
import * as Layout from '@/components/layout';
import {
  Form,
  Button,
  Flexbox,
  InputWrapper,
  Input,
  Span,
} from '@/components/common';
const { FormWrapper, FormBody, FormRow, FormCol, FormTitle, FormSide } = Form;
import { Add, Edit, Delete, Done } from '@material-ui/icons';

const JobDepartment = props => {
  const {
    operateType,
    handleJobDepartmentFormChange,
    handleJobDepartmentCreate,
    handleJobDepartmentUpdate,
    handleJobDepartmentDelete,
    resetDepartmentFormData,
    departmentFormData,
    submitClicked,
    promptMessage,
  } = props;
  //Redux
  const jobStructureState = useSelector(state => state.jobStructure);
  //狀態管理
  const [editingDepartmentIndex, setEditingDepartmentIndex] = useState(-1);
  const [showAddDepartmentInputElement, setShowAddDepartmentInputElement] =
    useState(false);

  useEffect(() => {
    if (operateType === 'department') {
      setEditingDepartmentIndex(-1);
    }
  }, [operateType]);

  return (
    <>
      <FormWrapper>
        <Flexbox $gap={'8px'} $margin={'0 0 1rem 0'}>
          <FormTitle $margin={'0'}>部門列表</FormTitle>
          <Button
            type='button'
            $bg={'transparent'}
            $color={'#333'}
            $width={'1rem'}
            onClick={e => {
              e.preventDefault();
              setEditingDepartmentIndex(-1);
              resetDepartmentFormData();
              setShowAddDepartmentInputElement(!showAddDepartmentInputElement);
            }}
            $animation
          >
            <Add />
          </Button>
        </Flexbox>

        <FormBody $gap={'0.75rem'}>
          <FormSide>
            {showAddDepartmentInputElement && (
              <>
                <FormRow>
                  <FormCol>
                    <Flexbox $gap={'1rem'} $margin={'0 0 1rem 0'}>
                      <InputWrapper
                        $border={
                          (jobStructureState.error?.errors.departmentName ||
                            promptMessage.departmentName) &&
                          '2px solid #d15252'
                        }
                      >
                        <Input
                          type='text'
                          name='departmentName'
                          value={departmentFormData?.departmentName}
                          onChange={handleJobDepartmentFormChange}
                        />
                        <Span $color={'#d15252'}>
                          {promptMessage.departmentName}
                        </Span>
                        <Span $color={'#d15252'}>
                          {jobStructureState.error?.errors.departmentName}
                        </Span>
                      </InputWrapper>
                      (0)
                      <Button
                        type='button'
                        $width={'2rem'}
                        $color={'#333'}
                        $bg={'transparent'}
                        onClick={handleJobDepartmentCreate}
                        disabled={submitClicked && !jobStructureState.error}
                      >
                        <Done />
                      </Button>
                    </Flexbox>
                  </FormCol>
                </FormRow>
                <hr />
              </>
            )}

            {departmentFormData.existedDepartments.map((department, idx) => {
              const isEditing = editingDepartmentIndex === idx;
              return (
                <FormRow key={department._id}>
                  <FormCol>
                    <Flexbox $gap={'1rem'}>
                      <InputWrapper $height={'2.5rem'}>
                        <Input
                          type='text'
                          name='existedDepartments'
                          value={department?.departmentName}
                          onChange={e =>
                            handleJobDepartmentFormChange(e, department._id)
                          }
                          disabled={!isEditing}
                        />
                      </InputWrapper>
                      ({department.sectionCounts})
                      {editingDepartmentIndex !== -1 && isEditing ? (
                        <Button
                          type={'button'}
                          $width={'2rem'}
                          $color={'#333'}
                          $bg={'transparent'}
                          disabled={editingDepartmentIndex !== -1 && !isEditing}
                          onClick={() => {
                            handleJobDepartmentUpdate(department._id);
                          }}
                        >
                          <Done />
                        </Button>
                      ) : (
                        <Button
                          type={'button'}
                          $width={'2rem'}
                          $color={'#333'}
                          $bg={'transparent'}
                          disabled={editingDepartmentIndex !== -1 && !isEditing}
                          onClick={() => {
                            setShowAddDepartmentInputElement(false);
                            resetDepartmentFormData();
                            setEditingDepartmentIndex(idx);
                          }}
                        >
                          <Edit />
                        </Button>
                      )}
                      <Button
                        type='button'
                        $width={'2rem'}
                        $color={'#333'}
                        $bg={'transparent'}
                        onClick={() => {
                          const confirmed = confirm(
                            `確定要刪除部門－${department.departmentName}嗎`,
                          );
                          if (confirmed) {
                            handleJobDepartmentDelete(department._id);
                          }
                        }}
                        disabled={isEditing || department?.sectionCounts > 0}
                      >
                        <Delete />
                      </Button>
                    </Flexbox>
                  </FormCol>
                </FormRow>
              );
            })}
          </FormSide>
        </FormBody>
        <Flexbox $margin={'4px 0 0 0'} $justifyContent={'flex-satrt'}>
          <Span $color={'#5cc55f'}>{promptMessage.default}</Span>
          <Span $color={'#d15252'}>
            {jobStructureState.error?.message &&
              `⛔${jobStructureState.error?.message}`}
          </Span>
        </Flexbox>
      </FormWrapper>
      <Layout.Loading
        type={'spinningBubbles'}
        active={jobStructureState.loading}
        color={'#00719F'}
        width={100}
      />
    </>
  );
};

export default JobDepartment;

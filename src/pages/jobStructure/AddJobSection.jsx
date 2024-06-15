//react
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
  Select,
  Span,
  SelectWrapper,
} from '@/components/common';
const { FormWrapper, FormBody, FormRow, FormCol, FormTitle, FormSide } = Form;

const AddJobSection = props => {
  const {
    showAddJobSectionModalElement,
    handleAddJobSectionFormChange,
    handleAddJobSectionCreate,
    sectionFormData,
    submitClicked,
    promptMessage,
  } = props;
  //Redux
  const jobStructureState = useSelector(state => state.jobStructure);

  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0 0 16px 0'}>新增組別</FormTitle>
        <FormBody $gap={'24px'} $padding={'0 16px 1.5rem 0'}>
          <FormSide>
            <FormRow>
              <FormCol>
                <label>隸屬部門</label>
                <SelectWrapper $spanOffset={'-1.2rem'}>
                  <Select
                    name='departmentId'
                    $border={
                      (promptMessage?.departmentId ||
                        jobStructureState.error?.errors.departmentId) &&
                      '2px solid #d15252'
                    }
                    value={sectionFormData.departmentId}
                    onChange={handleAddJobSectionFormChange}
                    disabled={submitClicked && !jobStructureState.error}
                  >
                    <option value={''} disabled>
                      請選擇部門
                    </option>
                    {jobStructureState.data.map((department, idx) => {
                      return (
                        <option value={department._id} key={department._id}>
                          {department.departmentName}
                        </option>
                      );
                    })}
                  </Select>
                  <Span $color={'#d15252'}>{promptMessage?.departmentId}</Span>
                </SelectWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol>
                <label>組別名稱</label>
                <InputWrapper
                  $border={
                    (promptMessage?.sectionName ||
                      jobStructureState.error?.errors.sectionName) &&
                    '2px solid #d15252'
                  }
                >
                  <Input
                    type='text'
                    name='sectionName'
                    value={sectionFormData?.sectionName}
                    onChange={handleAddJobSectionFormChange}
                    disabled={submitClicked && !jobStructureState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.sectionName}</Span>
                  <Span $color={'#d15252'}>
                    {jobStructureState.error?.errors.sectionName}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
          </FormSide>
        </FormBody>
        <Flexbox $justifyContent={'flex-satrt'}>
          <Span>{promptMessage.default}</Span>
          <Span $color={'#d15252'}>
            {jobStructureState.error?.message &&
              `⛔${jobStructureState.error?.message}`}
          </Span>
        </Flexbox>
        <Flexbox $gap={'8px'} $margin={'auto 0 0 0'}>
          {submitClicked && !jobStructureState.error ? (
            <Button
              type='button'
              $bg={'#7e7e7e'}
              onClick={() => {
                showAddJobSectionModalElement(false);
              }}
              $animation={!jobStructureState.loading}
              disabled={jobStructureState.loading}
            >
              關閉視窗
            </Button>
          ) : (
            <>
              <Flexbox $margin={'1rem 0 0 0'}>
                <Button
                  type='button'
                  $bg={'transparent'}
                  $color={'#333'}
                  onClick={() => {
                    showAddJobSectionModalElement(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  type='submit'
                  disabled={jobStructureState.loading}
                  onClick={handleAddJobSectionCreate}
                  $animation={!jobStructureState.loading}
                >
                  保存
                </Button>
              </Flexbox>
            </>
          )}
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

export default AddJobSection;

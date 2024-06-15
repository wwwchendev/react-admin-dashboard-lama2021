//react
import { useEffect, useState } from 'react';
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
const {
  FormWrapper,
  FormBody,
  FormRow,
  FormCol,
  FormRadioWrapper,
  FormTitle,
  FormSide,
} = Form;

const EditEmployee = props => {
  const {
    showEditEmployeeModalElement,
    handleEditEmployeeFormChange,
    handleEditEmployeeFormSubmit,
    formData,
    submitClicked,
    promptMessage,
  } = props;
  //Redux
  const employeeState = useSelector(state => state.employee.employees);
  const jobStructureState = useSelector(state => state.jobStructure);
  //狀態管理
  const [employeeIsActiveRadioChecked, setEmployeeIsActiveRadioChecked] =
    useState(formData?.enabled?.isActive);
  const [employeeRoleRadioChecked, setEmployeeRoleRadioChecked] = useState(
    formData?.role,
  );

  //useEffect
  useEffect(() => {
    setEmployeeRoleRadioChecked(formData?.role);
    setEmployeeIsActiveRadioChecked(formData?.enabled?.isActive);
  }, [formData?.role, formData?.enabled?.isActive]);

  return (
    <>
      <FormWrapper>
        <FormTitle>編輯員工資料</FormTitle>
        <FormBody $gap={'20px'}>
          <FormSide>
            <FormRow>
              <FormCol>
                <label>員工編號</label>
                <InputWrapper
                  $border={promptMessage.employeeId && '2px solid #d15252'}
                >
                  <Input
                    type='text'
                    name='employeeId'
                    value={formData.employeeId}
                    onChange={handleEditEmployeeFormChange}
                    disabled
                  />
                  {<Span $color={'#d15252'}>{promptMessage.employeeId}</Span>}
                </InputWrapper>
              </FormCol>
              <FormCol>
                <label>到職日期</label>
                <InputWrapper
                  $border={promptMessage.hireDate && '2px solid #d15252'}
                >
                  <Input
                    type='date'
                    name='hireDate'
                    value={formData.hireDate}
                    disabled={submitClicked && !employeeState.error}
                    onChange={handleEditEmployeeFormChange}
                  />
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol>
                <label>員工姓名</label>
                <InputWrapper
                  $border={
                    (promptMessage.name || employeeState.error?.errors?.name) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='text'
                    name='name'
                    value={formData.name}
                    disabled={submitClicked && !employeeState.error}
                    onChange={handleEditEmployeeFormChange}
                  />
                  <Span $color={'#d15252'}>{promptMessage.name}</Span>
                  <Span $color={'#d15252'}>
                    {employeeState.error?.errors?.name}
                  </Span>
                </InputWrapper>
              </FormCol>
              <FormCol>
                <label>操作權限</label>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='supervisor'
                    name='role'
                    value='主管'
                    checked={employeeRoleRadioChecked === '主管'}
                    onChange={handleEditEmployeeFormChange}
                    disabled={submitClicked && !employeeState.error}
                  />
                  <label htmlFor='supervisor'>主管</label>
                </FormRadioWrapper>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='employee'
                    name='role'
                    value='職員'
                    checked={employeeRoleRadioChecked === '職員'}
                    onChange={handleEditEmployeeFormChange}
                    disabled={submitClicked && !employeeState.error}
                  />
                  <label htmlFor='employee'>職員</label>
                </FormRadioWrapper>
                <FormRadioWrapper>
                  <input
                    type='radio'
                    id='viewer'
                    name='role'
                    value='檢視'
                    checked={employeeRoleRadioChecked === '檢視'}
                    onChange={handleEditEmployeeFormChange}
                    disabled={submitClicked && !employeeState.error}
                  />
                  <label htmlFor='viewer'>檢視</label>
                </FormRadioWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol>
                <label>隸屬單位</label>
                <SelectWrapper $spanOffset={'-1.2rem'}>
                  <Select
                    name='department'
                    $border={
                      promptMessage?.position?.department && '2px solid #d15252'
                    }
                    value={formData.position.department}
                    onChange={handleEditEmployeeFormChange}
                    disabled={submitClicked && !employeeState.error}
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
                  <Span $color={'#d15252'}>
                    {promptMessage?.position?.department}
                  </Span>
                </SelectWrapper>
                <SelectWrapper $spanOffset={'-1.2rem'}>
                  <Select
                    name='section'
                    $border={
                      promptMessage?.position?.section && '2px solid #d15252'
                    }
                    value={formData.position.section}
                    onChange={handleEditEmployeeFormChange}
                    disabled={submitClicked && !employeeState.error}
                  >
                    <option value={''} disabled>
                      請選擇組別
                    </option>
                    {jobStructureState.data.map((department, idx) => {
                      if (department._id === formData.position.department) {
                        return department.sections.map((section, i) => (
                          <option value={section._id} key={section._id}>
                            {section.sectionName}
                          </option>
                        ));
                      } else {
                        return null;
                      }
                    })}
                  </Select>
                  <Span $color={'#d15252'}>
                    {promptMessage?.position?.section}
                  </Span>
                </SelectWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol>
                <label htmlFor='email'>電子信箱</label>
                <InputWrapper
                  $border={
                    (promptMessage.email ||
                      employeeState.error?.errors?.email) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='email'
                    name='email'
                    id='email'
                    value={formData.email}
                    onChange={handleEditEmployeeFormChange}
                    disabled={submitClicked && !employeeState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage.email}</Span>
                  <Span $color={'#d15252'}>
                    {employeeState.error?.errors?.email}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <hr />
            <FormRow>
              <FormCol>
                <label>啟用狀態</label>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='active'
                    name='isActive'
                    value='true'
                    checked={employeeIsActiveRadioChecked === 'true'}
                    onChange={handleEditEmployeeFormChange}
                    disabled={submitClicked && !employeeState.error}
                  />
                  <label htmlFor='active'>啟用</label>
                </FormRadioWrapper>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='inactive'
                    name='isActive'
                    value='false'
                    checked={employeeIsActiveRadioChecked === 'false'}
                    onChange={handleEditEmployeeFormChange}
                    disabled={submitClicked && !employeeState.error}
                  />
                  <label htmlFor='inactive'>停用</label>
                </FormRadioWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol>
                <label>異動說明</label>
                <InputWrapper
                  $border={promptMessage.reason && '2px solid #d15252'}
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='text'
                    name='reason'
                    id='reason'
                    onChange={handleEditEmployeeFormChange}
                    value={formData.enabled.reason}
                    disabled={submitClicked && !employeeState.error}
                    placeholder='請說明異動原因:到職 \ 轉調 \ 休假 \ 其他: ...'
                  />
                  <Span $color={'#d15252'}>{promptMessage.reason}</Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol>
                <label>最後更新</label>
                {formData.employeeId && (
                  <>
                    <Span>{new Date(formData.updatedAt).toLocaleString()}</Span>
                    {formData.lastEditedBy && (
                      <Span>
                        {(() => {
                          const editor = employeeState.data.find(
                            employee =>
                              employee.employeeId === formData.lastEditedBy,
                          );
                          if (!editor?.name) {
                            return;
                          }
                          return `${editor?.name} (${editor?.employeeId})`;
                        })()}
                      </Span>
                    )}
                  </>
                )}
              </FormCol>
            </FormRow>
          </FormSide>
          {/* <FormSide>
          <pre><Span>employeeIsActive:{JSON.stringify(employeeIsActiveRadioChecked, null, 2)}</Span></pre>
          <pre><Span>employeeRole:{JSON.stringify(employeeRoleRadioChecked, null, 2)}</Span></pre>
          <pre><Span>{JSON.stringify(formData, null, 2)}</Span></pre></FormSide> */}
        </FormBody>
        <Flexbox $margin={'4px 0 0 0'} $justifyContent={'flex-satrt'}>
          <Span $color={'#5cc55f'}>{promptMessage.default}</Span>
          <Span $color={'#d15252'}>
            {employeeState.error?.message &&
              `⛔${employeeState.error?.message}`}
          </Span>
        </Flexbox>
        <Flexbox $gap={'8px'} $margin={'16px 0 0 0'}>
          {!submitClicked || employeeState.error !== null ? (
            <>
              <Button
                type='button'
                $bg={'transparent'}
                $color={'#333'}
                onClick={() => {
                  showEditEmployeeModalElement(false);
                }}
              >
                取消
              </Button>
              <Button
                type='submit'
                disabled={employeeState.loading}
                onClick={handleEditEmployeeFormSubmit}
                $animation={!employeeState.loading}
              >
                提交
              </Button>
            </>
          ) : (
            <>
              <Button
                type='button'
                onClick={() => {
                  showEditEmployeeModalElement(false);
                }}
                $bg={'#7e7e7e'}
                $animation
              >
                關閉視窗
              </Button>
            </>
          )}
        </Flexbox>
      </FormWrapper>
      <Layout.Loading
        type={'spinningBubbles'}
        active={employeeState.loading}
        color={'#00719F'}
        width={100}
      />
    </>
  );
};

export default EditEmployee;

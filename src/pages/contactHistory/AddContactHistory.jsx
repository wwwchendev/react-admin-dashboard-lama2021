//react
import { useState } from 'react';
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
  Textarea,
} from '@/components/common';
const {
  FormWrapper,
  FormBody,
  FormRow,
  FormCol,
  FormTitle,
  FormRadioWrapper,
  FormSide,
} = Form;
//utils

const AddContactHistory = props => {
  const {
    showAddContactHistoryModalElement,
    handleAddContactHistoryFormChange,
    handleAddContactHistoryCreate,
    addContactHistoryFormData,
    submitClicked,
    promptMessage,
  } = props;
  //Redux
  const contactHistoryState = useSelector(state => state.contactHistory);
  const jobStructureState = useSelector(state => state.jobStructure);
  const authEmployeeState = useSelector(state => state.authEmployee);
  //狀態管理
  const statusList = ['待處理', '處理中', '已結案', '已註銷'];
  const fromList = ['客服電話', '官網留言', 'LINE', '臉書', '其他'];
  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0 0 0.5rem 0'}>新增聯絡紀錄</FormTitle>
        <FormBody $padding={'0'}>
          {/* 左側聯絡綱要 */}
          <FormSide $gap={'1.2rem'}>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>案號</label>
                <InputWrapper
                  $border={
                    (promptMessage?.caseNumber ||
                      contactHistoryState.error?.errors.caseNumber) &&
                    '2px solid #d15252'
                  }
                >
                  <Input
                    type='text'
                    name='caseNumber'
                    value={addContactHistoryFormData?.caseNumber}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={true}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.caseNumber}</Span>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.caseNumber}
                  </Span>
                </InputWrapper>
              </FormCol>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>狀態</label>
                <SelectWrapper $spanOffset={'-1.2rem'}>
                  <Select
                    name='status'
                    $border={
                      (promptMessage?.status ||
                        contactHistoryState.error?.errors.status) &&
                      '2px solid #d15252'
                    }
                    value={addContactHistoryFormData?.status}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  >
                    {statusList.map((item, idx) => {
                      if (item !== '待處理') {
                        return (
                          <option value={item} key={idx} disabled>
                            {' '}
                            {item}{' '}
                          </option>
                        );
                      } else {
                        return (
                          <option value={item} key={idx}>
                            {' '}
                            {item}{' '}
                          </option>
                        );
                      }
                    })}
                  </Select>
                  <Span $color={'#d15252'}>{promptMessage?.status}</Span>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.status}
                  </Span>
                </SelectWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>來源</label>
                <SelectWrapper $spanOffset={'-1.2rem'}>
                  <Select
                    name='from'
                    $border={
                      (promptMessage?.from ||
                        contactHistoryState.error?.errors.from) &&
                      '2px solid #d15252'
                    }
                    value={addContactHistoryFormData?.from}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  >
                    <option value={''} disabled>
                      請選擇來源
                    </option>
                    {fromList.map((item, idx) => (
                      <option value={item} key={idx}>
                        {' '}
                        {item}{' '}
                      </option>
                    ))}
                  </Select>
                  <Span $color={'#d15252'}>{promptMessage?.from}</Span>
                </SelectWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>時間</label>
                <InputWrapper
                  $border={
                    (promptMessage?.callDate ||
                      contactHistoryState.error?.errors.callDate) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='date'
                    name='callDate'
                    value={addContactHistoryFormData?.callDate}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.callDate}</Span>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.callDate}
                  </Span>
                </InputWrapper>
                <InputWrapper
                  $border={
                    (promptMessage?.callTime ||
                      contactHistoryState.error?.errors.callTime) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='time'
                    name='callTime'
                    value={addContactHistoryFormData?.callTime}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.callTime}</Span>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.callTime}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>姓名</label>
                <InputWrapper
                  $border={
                    (promptMessage?.callerName ||
                      contactHistoryState.error?.errors.callerName) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='text'
                    name='callerName'
                    value={addContactHistoryFormData?.callerName}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.callerName}</Span>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.callerName}
                  </Span>
                </InputWrapper>
                <Flexbox $justifyContent={'flex-start'} $gap={'8px'}>
                  <FormRadioWrapper>
                    <Input
                      type='radio'
                      id='先生'
                      name='callerGender'
                      value='先生'
                      checked={
                        addContactHistoryFormData?.callerGender === '先生'
                      }
                      onChange={handleAddContactHistoryFormChange}
                      disabled={submitClicked && !contactHistoryState.error}
                    />
                    <label htmlFor='先生'>先生</label>
                  </FormRadioWrapper>
                  <FormRadioWrapper>
                    <Input
                      type='radio'
                      id='小姐'
                      name='callerGender'
                      value='小姐'
                      checked={
                        addContactHistoryFormData?.callerGender === '小姐'
                      }
                      onChange={handleAddContactHistoryFormChange}
                      disabled={submitClicked && !contactHistoryState.error}
                    />
                    <label htmlFor='小姐'>小姐</label>
                  </FormRadioWrapper>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.callerGender}
                  </Span>
                  <Span $color={'#d15252'}>{promptMessage?.callerGender}</Span>
                </Flexbox>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>電話</label>
                <InputWrapper
                  $border={
                    (promptMessage?.phoneNumber ||
                      contactHistoryState.error?.errors.phoneNumber) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='text'
                    name='phoneNumber'
                    value={addContactHistoryFormData?.phoneNumber}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.phoneNumber}</Span>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.phoneNumber}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>窗口</label>
                <SelectWrapper $spanOffset={'-1.2rem'}>
                  <Select
                    name='handlingDepartment'
                    $border={
                      (promptMessage?.handlingDepartment?.department ||
                        contactHistoryState.error?.errors?.handlingDepartment
                          ?.department) &&
                      '2px solid #d15252'
                    }
                    value={
                      addContactHistoryFormData?.handlingDepartment?.department
                    }
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
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
                    {promptMessage?.handlingDepartment?.department}
                  </Span>
                </SelectWrapper>
                <SelectWrapper $spanOffset={'-1.2rem'}>
                  <Select
                    name='handlingSection'
                    $border={
                      (promptMessage?.handlingDepartment?.section ||
                        contactHistoryState.error?.errors.handlingDepartment
                          ?.section) &&
                      '2px solid #d15252'
                    }
                    value={
                      addContactHistoryFormData?.handlingDepartment?.section
                    }
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  >
                    <option value={''} disabled>
                      請選擇單位
                    </option>
                    {jobStructureState.data.map((department, idx) => {
                      if (
                        department._id ===
                        addContactHistoryFormData?.handlingDepartment
                          ?.department
                      ) {
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
                    {promptMessage?.handlingDepartment?.section}
                  </Span>
                </SelectWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>主旨</label>
                <InputWrapper
                  $border={
                    (promptMessage?.callSubject ||
                      contactHistoryState.error?.errors.callSubject) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='text'
                    name='callSubject'
                    value={addContactHistoryFormData?.callSubject}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.callSubject}</Span>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.callSubject}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>內容</label>
                <InputWrapper
                  $border={
                    (promptMessage?.callContent ||
                      contactHistoryState.error?.errors.callContent) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Textarea
                    name='callContent'
                    value={addContactHistoryFormData?.callContent}
                    onChange={handleAddContactHistoryFormChange}
                    disabled={submitClicked && !contactHistoryState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.callContent}</Span>
                  <Span $color={'#d15252'}>
                    {contactHistoryState.error?.errors.callContent}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <Flexbox $gap={'0.5rem'} $justifyContent={'flex-start'}>
              <Span>
                {authEmployeeState.data.position.departmentName}\
                {authEmployeeState.data.position.sectionName}
              </Span>
              <Span>
                {authEmployeeState.data.name} (
                {authEmployeeState.data.employeeId})
              </Span>
            </Flexbox>
            {/* <pre>{JSON.stringify(addContactHistoryFormData, null, 2)}</pre> */}

            <Flexbox $justifyContent={'flex-satrt'}>
              <Span $color={'#5cc55f'}>{promptMessage?.default}</Span>
              <Span $color={'#d15252'}>
                {contactHistoryState.error?.message &&
                  `⛔${contactHistoryState.error?.message}`}
              </Span>
            </Flexbox>
          </FormSide>
        </FormBody>
        <Flexbox $gap={'8px'} $margin={'auto 0 0 0'}>
          {submitClicked && !contactHistoryState.error ? (
            <Button
              type='button'
              $bg={'#7e7e7e'}
              onClick={() => {
                showAddContactHistoryModalElement(false);
              }}
              $animation={!contactHistoryState.loading}
              disabled={contactHistoryState.loading}
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
                    showAddContactHistoryModalElement(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  type='submit'
                  disabled={contactHistoryState.loading}
                  onClick={handleAddContactHistoryCreate}
                  $animation={!contactHistoryState.loading}
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
        active={contactHistoryState.loading}
        color={'#00719F'}
        width={100}
      />
    </>
  );
};

export default AddContactHistory;

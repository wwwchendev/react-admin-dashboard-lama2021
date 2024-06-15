//react
//redux
import { useSelector } from 'react-redux';
//components
import styled from 'styled-components';
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
import { Add, Edit } from '@material-ui/icons';
//utils
import { tablet } from '@/utils/responsive';

const Contact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: ${p => (p.$border ? p.$border : '1px solid #949494')};
  border-radius: 5px;
  width: 100%;
  max-width: calc(100% - 4px);
  ${InputWrapper} {
    /* border: 1px solid red; */
    height: 100%;
  }
  ${Textarea} {
    /* border: 1px solid red; */
    height: 3rem;
    border: none;
  }
  ${Button} {
    width: 100%;
  }
`;
const ContactList = styled.div`
  /* border: 1px solid #ff0a0a; */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  height: 100%;
  height: ${p => (p.$setheightOffset ? '240px' : '340px')};

  ${Contact} {
    ${Button} {
      width: auto;
      border: none;
      position: absolute;
      right: 0;
      bottom: ${p => (p.$spanOffset ? p.$spanOffset : '-1.5rem')};
      padding: 0;
    }
  }
  ${tablet({
    overflow: 'visible',
  })};
`;

const SingleContactHistory = props => {
  const {
    showSingleContactHistoryModalElement,
    handleSingleContactHistoryFormChange,
    handleSingleContactHistoryUpdate,
    editContactHistoryFormData,
    setSubmitClicked,
    submitClicked,
    promptMessage,
    newProcessingHistoryFormData,
    handleNewProcessingHistoryFormChange,
    handleNewProcessingHistoryCreate,
    setOperateType,
    operateType,
    showAddContactHistoryInputElement,
    setShowAddContactHistoryInputElement,
    editingContactHistoryIndex,
    setEditingContactHistoryIndex,
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
        {operateType === 'view' ? (
          <FormTitle $margin={'0 0 0.75rem 0'}>
            檢視聯絡紀錄
            <Button
              $width={'2rem'}
              $bg={'#5cc55f'}
              $padding={'3px 1px'}
              $animation
              onClick={() => {
                setSubmitClicked(false);
                setOperateType('editContactHistory');
              }}
            >
              <Edit />
            </Button>
          </FormTitle>
        ) : (
          <FormTitle $margin={'0 0 0.75rem 0'}>修改聯絡紀錄</FormTitle>
        )}
        <FormBody $gap={'1rem'} $padding={'0 0.5rem 0.5rem 0'}>
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
                    value={editContactHistoryFormData?.caseNumber}
                    onChange={handleSingleContactHistoryFormChange}
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
                    value={editContactHistoryFormData?.status}
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
                  >
                    {statusList.map((item, idx) => {
                      return (
                        <option value={item} key={idx}>
                          {' '}
                          {item}{' '}
                        </option>
                      );
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
                    value={editContactHistoryFormData?.from}
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
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
                    value={editContactHistoryFormData?.callDate}
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
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
                    value={editContactHistoryFormData?.callTime}
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
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
                    value={editContactHistoryFormData?.callerName}
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
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
                        editContactHistoryFormData?.callerGender === '先生'
                      }
                      onChange={handleSingleContactHistoryFormChange}
                      disabled={
                        operateType === 'view' ||
                        (submitClicked && !contactHistoryState.error)
                      }
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
                        editContactHistoryFormData?.callerGender === '小姐'
                      }
                      onChange={handleSingleContactHistoryFormChange}
                      disabled={
                        operateType === 'view' ||
                        (submitClicked && !contactHistoryState.error)
                      }
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
                    value={editContactHistoryFormData?.phoneNumber}
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
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
                      editContactHistoryFormData?.handlingDepartment?.department
                    }
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
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
                      editContactHistoryFormData?.handlingDepartment?.section
                    }
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
                  >
                    <option value={''} disabled>
                      請選擇單位
                    </option>
                    {jobStructureState.data.map((department, idx) => {
                      if (
                        department._id ===
                        editContactHistoryFormData?.handlingDepartment
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
                      jobStructureState.error?.errors.callSubject) &&
                    '2px solid #d15252'
                  }
                >
                  <Input
                    type='text'
                    name='callSubject'
                    value={editContactHistoryFormData?.callSubject}
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
                  />
                  <Span $color={'#d15252'}>{promptMessage?.callSubject}</Span>
                  <Span $color={'#d15252'}>
                    {jobStructureState.error?.errors.callSubject}
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
                      jobStructureState.error?.errors.callContent) &&
                    '2px solid #d15252'
                  }
                >
                  <Textarea
                    name='callContent'
                    value={editContactHistoryFormData?.callContent}
                    onChange={handleSingleContactHistoryFormChange}
                    disabled={
                      operateType === 'view' ||
                      (submitClicked && !contactHistoryState.error)
                    }
                  />
                  <Span $color={'#d15252'}>{promptMessage?.callContent}</Span>
                  <Span $color={'#d15252'}>
                    {jobStructureState.error?.errors.callContent}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <Flexbox $gap={'0.5rem'} $justifyContent={'flex-start'}>
              <Span>
                {editContactHistoryFormData?.receiveDepartment?.departmentName}\
                {editContactHistoryFormData?.receiveDepartment?.sectionName}
              </Span>
              <Span>
                {editContactHistoryFormData?.receiverName} (
                {editContactHistoryFormData?.receiverId})
              </Span>
            </Flexbox>
          </FormSide>

          {/* 右側聯絡紀錄 */}
          <FormSide $gap={'5px'}>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <Flexbox $direction={'column'} $justifyContent={'flex-start'}>
                  <Flexbox $justifyContent={'flex-start'} $gap={'2rem'}>
                    <label htmlFor='newProcessingHistory'>聯繫紀錄</label>
                    <Button
                      type='button'
                      $width={'0px'}
                      $color={'#333'}
                      $bg={'transparent'}
                      $animation={operateType === 'editContactHistory'}
                      onClick={() => {
                        setShowAddContactHistoryInputElement(pre => !pre);
                      }}
                      disabled={
                        operateType === 'view' ||
                        (submitClicked && !contactHistoryState.error)
                      }
                    >
                      <Add />
                    </Button>
                  </Flexbox>
                  {showAddContactHistoryInputElement && (
                    <>
                      <Contact
                        $border={
                          (promptMessage?.content ||
                            contactHistoryState.error?.errors.content) &&
                          '2px solid #d15252'
                        }
                      >
                        <InputWrapper $spanOffset={'-2.5rem'}>
                          <Textarea
                            name='content'
                            id='content'
                            placeholder='輸入新的聯繫紀錄'
                            onChange={handleNewProcessingHistoryFormChange}
                            value={newProcessingHistoryFormData?.content}
                            disabled={
                              operateType === 'view' ||
                              (submitClicked && !contactHistoryState.error)
                            }
                          />
                          <Button
                            type={'button'}
                            $border={'1px solid #333'}
                            $bg={'#333'}
                            onClick={handleNewProcessingHistoryCreate}
                            disabled={
                              operateType === 'view' ||
                              (submitClicked && !contactHistoryState.error)
                            }
                          >
                            提交
                          </Button>
                          <Span $color={'#d15252'}>
                            {promptMessage?.content}
                          </Span>
                        </InputWrapper>
                      </Contact>
                      <Flexbox
                        $justifyContent={'flex-start'}
                        $margin={'0 0 1rem 0'}
                      >
                        <Span>
                          {`${authEmployeeState.data.name}(${authEmployeeState.data.employeeId}) ${editContactHistoryFormData?.callDate} ${editContactHistoryFormData?.callTime}`}
                        </Span>
                      </Flexbox>
                    </>
                  )}
                </Flexbox>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol>
                <ContactList
                  $setheightOffset={showAddContactHistoryInputElement}
                >
                  {editContactHistoryFormData?.processingHistory.length === 0
                    ? '尚無聯繫紀錄'
                    : editContactHistoryFormData?.processingHistory
                        .slice()
                        .reverse()
                        .map((item, idx) => {
                          const reversedIndex =
                            editContactHistoryFormData?.processingHistory
                              .length -
                            1 -
                            idx;
                          const reversedItem =
                            editContactHistoryFormData?.processingHistory[
                              reversedIndex
                            ];
                          const isEditing =
                            editingContactHistoryIndex === reversedIndex;
                          const isWrong =
                            promptMessage?.processingHistory &&
                            promptMessage?.processingHistory.includes(
                              reversedIndex,
                            );

                          return (
                            <Contact
                              key={reversedIndex}
                              $border={isWrong && '2px solid #d15252'}
                            >
                              <InputWrapper>
                                <Textarea
                                  rows='5'
                                  cols='33'
                                  name='processingHistory'
                                  id='processingHistory'
                                  placeholder=''
                                  onChange={
                                    handleSingleContactHistoryFormChange
                                  }
                                  value={reversedItem.content}
                                  $bg={isEditing ? '#f5f8e3' : ''}
                                  disabled={!isEditing}
                                />
                                <Flexbox>
                                  <Span>
                                    {`${reversedItem.processingDepartment.departmentName}\
                                ${reversedItem.processingDepartment.sectionName}
                                
                                ${reversedItem.handlerName}
                                ${new Date(
                                  reversedItem.timestamp,
                                ).toLocaleDateString('zh-TW', {
                                  timeZone: 'Asia/Taipei',
                                  hour12: false,
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}`}
                                  </Span>
                                  {operateType === 'editContactHistory' &&
                                    !isEditing && (
                                      <Button
                                        type='button'
                                        $width={'2rem'}
                                        $bg={'transparent'}
                                        $color={'#999'}
                                        $border={'1px solid red'}
                                        onClick={() => {
                                          setEditingContactHistoryIndex(
                                            reversedIndex,
                                          );
                                        }}
                                      >
                                        修改
                                      </Button>
                                    )}
                                </Flexbox>
                              </InputWrapper>
                            </Contact>
                          );
                        })}
                </ContactList>
              </FormCol>
            </FormRow>
            {/* <pre><Span>{JSON.stringify(promptMessage, null, 2)}</Span></pre> */}
            {/* <pre><Span>{JSON.stringify(newProcessingHistoryFormData, null, 2)}</Span></pre> */}
            {/* <pre><Span>{JSON.stringify(editContactHistoryFormData, null, 2)}</Span></pre> */}
          </FormSide>
        </FormBody>
        <Flexbox $direction={'column'} $margin={'auto 0 0 0'}>
          <Flexbox $justifyContent={'flex-satrt'}>
            <Span>{promptMessage?.default}</Span>
            <Span $color={'#d15252'}>
              {contactHistoryState.error?.message &&
                `⛔${contactHistoryState.error?.message}`}
            </Span>
          </Flexbox>
          {operateType === 'view' ||
          (submitClicked && !contactHistoryState.error) ? (
            <Flexbox $margin={'0rem 0 0 0'}>
              <Button
                type='button'
                $bg={'#7e7e7e'}
                onClick={() => {
                  showSingleContactHistoryModalElement(false);
                }}
                $animation={!contactHistoryState.loading}
                disabled={contactHistoryState.loading}
              >
                關閉視窗
              </Button>
            </Flexbox>
          ) : (
            <>
              <Flexbox $margin={'0rem 0 0 0'}>
                <Button
                  type='button'
                  $bg={'transparent'}
                  $color={'#333'}
                  onClick={() => {
                    showSingleContactHistoryModalElement(
                      true,
                      editContactHistoryFormData.caseNumber,
                    );
                  }}
                >
                  取消
                </Button>
                <Button
                  type='submit'
                  disabled={contactHistoryState.loading}
                  onClick={handleSingleContactHistoryUpdate}
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

export default SingleContactHistory;

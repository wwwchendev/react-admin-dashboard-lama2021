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
  Span,
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

const EditUser = props => {
  const {
    showEditUserModalElement,
    editUserFormData,
    handleEditUserFormChange,
    handleUserUpdate,
    submitClicked,
    promptMessage,
    userIsActiveRadioChecked,
    userGenderRadioChecked,
  } = props;
  //Redux
  const userState = useSelector(state => state.user);

  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0 0 0.75rem 0'}>編輯會員資料</FormTitle>
        <FormBody $padding={'0'} $direction={'column'}>
          <FormSide>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>帳號</label>
                <InputWrapper
                  $border={
                    (promptMessage?.username ||
                      userState.error?.errors.username) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    name='username'
                    value={editUserFormData?.username}
                    onChange={handleEditUserFormChange}
                    disabled={true}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.username}</Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.username}
                  </Span>
                </InputWrapper>
              </FormCol>

              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>生日</label>
                <InputWrapper
                  $border={
                    (promptMessage?.birthdate ||
                      userState.error?.errors.birthdate) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='date'
                    name='birthdate'
                    value={editUserFormData?.birthdate}
                    onChange={handleEditUserFormChange}
                    disabled={true}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.birthdate}</Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors?.birthdate}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>姓氏</label>
                <InputWrapper
                  $border={
                    (promptMessage?.lastName ||
                      userState.error?.errors.lastName) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    name='lastName'
                    value={editUserFormData?.lastName}
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.lastName}</Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.lastName}
                  </Span>
                </InputWrapper>
              </FormCol>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>名字</label>
                <InputWrapper
                  $border={
                    (promptMessage?.firstName ||
                      userState.error?.errors.firstName) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    name='firstName'
                    value={editUserFormData?.firstName}
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.firstName}</Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.firstName}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>性別</label>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='先生'
                    name='gender'
                    value='先生'
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                    checked={userGenderRadioChecked === '先生'}
                  />
                  <label htmlFor='先生'>先生</label>
                </FormRadioWrapper>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='小姐'
                    name='gender'
                    value='小姐'
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                    checked={userGenderRadioChecked === '小姐'}
                  />
                  <label htmlFor='小姐'>小姐</label>
                </FormRadioWrapper>
                <Span $color={'#d15252'}>{promptMessage?.gender}</Span>
                <Span $color={'#d15252'}>{userState.error?.errors.gender}</Span>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>手機</label>
                <InputWrapper
                  $border={
                    (promptMessage?.mobile || userState.error?.errors.mobile) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    name='mobile'
                    value={editUserFormData?.mobile}
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.mobile}</Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.mobile}
                  </Span>
                </InputWrapper>
              </FormCol>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>電話</label>
                <InputWrapper
                  $border={
                    (promptMessage?.phone || userState.error?.errors.phone) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    name='phone'
                    value={editUserFormData?.phone}
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.phone}</Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.phone}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>信箱</label>
                <InputWrapper
                  $border={
                    (promptMessage?.email || userState.error?.errors.email) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='email'
                    name='email'
                    value={editUserFormData?.email}
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>{promptMessage?.email}</Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.email}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>地址</label>
                <InputWrapper
                  $border={
                    (promptMessage?.address?.zipcode ||
                      userState.error?.errors.address?.zipcode) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    name='zipcode'
                    placeholder='郵遞區號'
                    value={editUserFormData?.address?.zipcode}
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>
                    {promptMessage?.address?.zipcode}
                  </Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.address?.zipcode}
                  </Span>
                </InputWrapper>
                <InputWrapper
                  $border={
                    (promptMessage?.address?.county ||
                      userState.error?.errors.address?.county) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    value={editUserFormData?.address?.county}
                    name='county'
                    placeholder='縣市'
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>
                    {promptMessage?.address?.county}
                  </Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.address?.county}
                  </Span>
                </InputWrapper>
                <InputWrapper
                  $border={
                    (promptMessage?.address?.district ||
                      userState.error?.errors.address?.district) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    value={editUserFormData?.address?.district}
                    name='district'
                    placeholder='鄉鎮市區'
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>
                    {promptMessage?.address?.district}
                  </Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.address?.district}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>{'　　'}</label>
                <InputWrapper
                  $border={
                    (promptMessage?.address?.address ||
                      userState.error?.errors.address?.address) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    value={editUserFormData?.address?.address}
                    name='address'
                    placeholder='路段號碼樓層'
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>
                    {promptMessage?.address?.address}
                  </Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.address?.address}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>

            <hr />
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>啟用</label>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='active'
                    name='isActive'
                    value='true'
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                    checked={userIsActiveRadioChecked === 'true'}
                  />
                  <label htmlFor='active'>啟用</label>
                </FormRadioWrapper>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='inactive'
                    name='isActive'
                    value='false'
                    onChange={handleEditUserFormChange}
                    disabled={submitClicked && !userState.error}
                    checked={userIsActiveRadioChecked === 'false'}
                  />
                  <label htmlFor='inactive'>停用</label>
                </FormRadioWrapper>
                <Span $color={'#d15252'}>
                  {promptMessage?.enabled?.isActive}
                </Span>
                <Span $color={'#d15252'}>
                  {userState.error?.errors.enabled?.isActive}
                </Span>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'2rem'}>
                <label>說明</label>
                <InputWrapper
                  $border={
                    (promptMessage?.enabled?.reason ||
                      userState.error?.errors.birthdate) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1rem'}
                >
                  <Input
                    type='text'
                    name='reason'
                    value={editUserFormData?.enabled?.reason}
                    onChange={handleEditUserFormChange}
                    placeholder='請說明異動原因:註冊 \ 其他: ...'
                    disabled={submitClicked && !userState.error}
                  />
                  <Span $color={'#d15252'}>
                    {promptMessage?.enabled?.reason}
                  </Span>
                  <Span $color={'#d15252'}>
                    {userState.error?.errors.birthdate}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'2rem'} $width={'4rem'}>
                <label>最後更新</label>
                {editUserFormData?.updatedAt && (
                  <>
                    <Span>
                      {editUserFormData?.updatedAt &&
                        new Date(editUserFormData?.updatedAt).toLocaleString()}
                    </Span>
                    <Span>
                      {`${editUserFormData?.lastEditerName}(${editUserFormData?.lastEditedBy})`}
                    </Span>
                  </>
                )}
              </FormCol>
            </FormRow>
          </FormSide>

          {/* <FormSide>
          <pre>{JSON.stringify(editUserFormData, null, 2)}</pre>
          <pre>{JSON.stringify(editUserFormData.lastEditerName, null, 2)}</pre>
          <pre>{JSON.stringify(userIsActiveRadioChecked, null, 2)}</pre>
        </FormSide> */}
        </FormBody>
        <Flexbox $margin={'4px 0 0 0'} $justifyContent={'flex-satrt'}>
          <Span $color={'#5cc55f'}>{promptMessage.default}</Span>
          <Span $color={'#d15252'}>
            {userState.error?.message && `⛔${userState.error?.message}`}
          </Span>
        </Flexbox>
        <Flexbox $gap={'8px'} $margin={'auto 0 0 0'}>
          {submitClicked && !userState.error ? (
            <Button
              type='button'
              $bg={'#7e7e7e'}
              onClick={() => {
                showEditUserModalElement(false);
              }}
              $animation={!userState.loading}
              disabled={userState.loading}
            >
              關閉視窗
            </Button>
          ) : (
            <>
              <Flexbox $margin={'auto 0 0 0'}>
                <Button
                  type='button'
                  $bg={'transparent'}
                  $color={'#333'}
                  onClick={() => {
                    showEditUserModalElement(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  type='submit'
                  disabled={userState.loading}
                  onClick={handleUserUpdate}
                  $animation={!userState.loading}
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
        active={userState.loading}
        color={'#00719F'}
        width={100}
      />
    </>
  );
};

export default EditUser;

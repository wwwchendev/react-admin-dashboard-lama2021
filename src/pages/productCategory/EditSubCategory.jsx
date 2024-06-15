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
import { useState } from 'react';
const {
  FormWrapper,
  FormRadioWrapper,
  FormBody,
  FormRow,
  FormCol,
  FormTitle,
  FormSide,
} = Form;

const EditSubCategory = props => {
  const {
    showEditSubCategoryModalElement,
    handleEditSubCategoryFormChange,
    handleSubCategorUpdate,
    subCategoryFormData,
    submitClicked,
    promptMessage,
    sortedMainCategoryData,
    subCategoryDisplayRadioChecked,
  } = props;
  //Redux
  const categoryState = useSelector(state => state.productCategory);

  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0 0 16px 0'}>編輯次分類</FormTitle>
        <FormBody $padding={'0 16px 1.5rem 0'}>
          <FormSide $gap={'24px'}>
            <FormRow>
              <FormCol $minWidth={'5rem'}>
                <label>所屬分類</label>
                <SelectWrapper $spanOffset={'-1.2rem'}>
                  <Select
                    name='parentCategoryId'
                    $border={
                      (promptMessage?.parentCategoryId ||
                        categoryState.error?.errors.parentCategoryId) &&
                      '2px solid #d15252'
                    }
                    value={subCategoryFormData.parentCategoryId}
                    onChange={handleEditSubCategoryFormChange}
                    disabled={submitClicked && !categoryState.error}
                  >
                    <option value={''} disabled>
                      請選擇分類
                    </option>
                    {sortedMainCategoryData?.map((item, idx) => {
                      // console.log(item);
                      return (
                        <option value={item._id} key={item._id}>
                          {item.type}/{item.categoryName}
                        </option>
                      );
                    })}
                  </Select>
                  <Span $color={'#d15252'}>
                    {promptMessage?.parentCategoryId}
                  </Span>
                </SelectWrapper>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'5rem'}>
                <label>次分類名稱</label>
                <InputWrapper
                  $border={
                    (promptMessage?.subCategoryName ||
                      categoryState.error?.errors.subCategoryName) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='text'
                    name='subCategoryName'
                    value={subCategoryFormData?.subCategoryName}
                    onChange={handleEditSubCategoryFormChange}
                    disabled={submitClicked && !categoryState.error}
                  />
                  <Span $color={'#d15252'}>
                    {promptMessage?.subCategoryName}
                  </Span>
                  <Span $color={'#d15252'}>
                    {categoryState.error?.errors.subCategoryName}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol $minWidth={'8rem'}>
                <label>顯示</label>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='display'
                    name='display'
                    value='true'
                    onChange={handleEditSubCategoryFormChange}
                    disabled={submitClicked && !categoryState.error}
                    checked={subCategoryDisplayRadioChecked === 'true'}
                  />
                  <label htmlFor='display'>是</label>
                </FormRadioWrapper>
                <FormRadioWrapper>
                  <Input
                    type='radio'
                    id='hidden'
                    name='display'
                    value='false'
                    onChange={handleEditSubCategoryFormChange}
                    disabled={submitClicked && !categoryState.error}
                    checked={subCategoryDisplayRadioChecked === 'false'}
                  />
                  <label htmlFor='hidden'>否</label>
                </FormRadioWrapper>
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol $minWidth={'5rem'}>
                <label>顯示排序</label>
                <InputWrapper
                  $border={
                    (promptMessage?.subCategorySortOrder ||
                      categoryState.error?.errors.subCategorySortOrder) &&
                    '2px solid #d15252'
                  }
                  $spanOffset={'-1.2rem'}
                >
                  <Input
                    type='number'
                    min={0}
                    name='subCategorySortOrder'
                    value={subCategoryFormData?.subCategorySortOrder}
                    onChange={handleEditSubCategoryFormChange}
                    disabled={submitClicked && !categoryState.error}
                  />
                  <Span $color={'#d15252'}>
                    {promptMessage?.subCategorySortOrder}
                  </Span>
                  <Span $color={'#d15252'}>
                    {categoryState.error?.errors.subCategorySortOrder}
                  </Span>
                </InputWrapper>
              </FormCol>
            </FormRow>
            {/* <pre><Span>{JSON.stringify(subCategoryFormData, null, 2)}</Span></pre> */}
            {/* <pre><Span>{JSON.stringify(promptMessage, null, 2)}</Span></pre> */}
          </FormSide>
        </FormBody>
        <Flexbox $justifyContent={'flex-satrt'}>
          <Span>{promptMessage.default}</Span>
          <Span $color={'#d15252'}>
            {categoryState.error?.message &&
              `⛔${categoryState.error?.message}`}
          </Span>
        </Flexbox>
        <Flexbox $gap={'8px'} $margin={'auto 0 0 0'}>
          {submitClicked && !categoryState.error ? (
            <Button
              type='button'
              $bg={'#7e7e7e'}
              onClick={() => {
                showEditSubCategoryModalElement(false);
              }}
              $animation={!categoryState.loading}
              disabled={categoryState.loading}
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
                    showEditSubCategoryModalElement(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  type='submit'
                  disabled={categoryState.loading}
                  onClick={handleSubCategorUpdate}
                  $animation={!categoryState.loading}
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
        active={categoryState.loading}
        color={'#00719F'}
        width={100}
      />
    </>
  );
};

export default EditSubCategory;

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

const AddSubCategory = props => {
  const {
    showAddSubCategoryModalElement,
    handleAddSubCategoryFormChange,
    handleSubCategorCreate,
    subCategoryFormData,
    submitClicked,
    promptMessage,
    sortedMainCategoryData,
  } = props;
  //Redux
  const categoryState = useSelector(state => state.productCategory);

  return (
    <>
      <FormWrapper>
        <FormTitle $margin={'0 0 16px 0'}>新增次分類</FormTitle>
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
                    onChange={handleAddSubCategoryFormChange}
                    disabled={submitClicked && !categoryState.error}
                  >
                    <option value={''} disabled>
                      請選擇分類
                    </option>
                    {sortedMainCategoryData.map((item, idx) => {
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
                    onChange={handleAddSubCategoryFormChange}
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
            {/* <pre><Span>{JSON.stringify(subCategoryFormData, null, 2)}</Span></pre>
          <pre><Span>{JSON.stringify(promptMessage, null, 2)}</Span></pre> */}
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
                showAddSubCategoryModalElement(false);
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
                    showAddSubCategoryModalElement(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  type='submit'
                  disabled={categoryState.loading}
                  onClick={handleSubCategorCreate}
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

export default AddSubCategory;

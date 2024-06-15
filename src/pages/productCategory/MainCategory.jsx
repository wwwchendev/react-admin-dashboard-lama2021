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
  Select,
  Span,
  SelectWrapper,
  Textarea,
} from '@/components/common';
const { FormWrapper, FormBody, FormRow, FormCol, FormTitle, FormSide } = Form;
import { Add, Edit, Delete, Done } from '@material-ui/icons';

const MainCategory = props => {
  const {
    operateType,
    handleMainCategoryFormChange,
    handleMainCategoryCreate,
    handleMainCategoryUpdate,
    handleMainCategoryDelete,
    resetMainCategoryFormData,
    mainCategoryFormData,
    submitClicked,
    promptMessage,
    typeOrderList,
  } = props;
  //Redux
  const categoryState = useSelector(state => state.productCategory);
  //狀態管理
  const [editingIndex, setEditingIndex] = useState(-1);
  const [showAddInputElement, setShowAddInputElement] = useState(false);

  useEffect(() => {
    if (operateType === 'mainCategory') {
      setEditingIndex(-1);
    }

  }, [operateType]);

  return (
    <>
      <FormWrapper>
        <Flexbox $gap={'8px'} $margin={'0 0 0.75rem 0'}>
          <FormTitle $margin={'0'}>主分類列表</FormTitle>
          <Button
            type='button'
            $bg={'transparent'}
            $color={'#333'}
            $width={'1rem'}
            onClick={e => {
              e.preventDefault();
              setEditingIndex(-1);
              setShowAddInputElement(!showAddInputElement);
            }}
            $animation
          >
            <Add />
          </Button>
        </Flexbox>
        {showAddInputElement && (
          <>
            <FormRow $direction={'column'}>
              <FormCol>
                <Flexbox $gap={'1rem'} $margin={'0'}>
                  <Flexbox $gap={'1rem'}>
                    <SelectWrapper $spanOffset={'-1.2rem'} $flex={'2'}>
                      <Select
                        name='newMainCategoryType'
                        $border={
                          (promptMessage?.newMainCategoryType ||
                            categoryState.error?.errors?.type) &&
                          '2px solid #d15252'
                        }
                        value={mainCategoryFormData?.newMainCategoryType}
                        onChange={handleMainCategoryFormChange}
                        disabled={submitClicked && !categoryState.error}
                      >
                        {typeOrderList.map((item, idx) => {
                          return (
                            <option value={item} key={idx}>
                              {' '}
                              {item}{' '}
                            </option>
                          );
                        })}
                      </Select>
                      <Span $color={'#d15252'}>
                        {promptMessage?.newMainCategoryType}
                      </Span>
                      <Span $color={'#d15252'}>
                        {categoryState.error?.errors?.type}
                      </Span>
                    </SelectWrapper>

                    <InputWrapper
                      $flex={'3'}
                      $spanOffset={'-1.2rem'}
                      $border={
                        (categoryState.error?.errors?.categoryName ||
                          promptMessage?.newMainCategoryName) &&
                        '2px solid #d15252'
                      }
                    >
                      <Input
                        type='text'
                        name='newMainCategoryName'
                        placeholder='分類名稱'
                        value={mainCategoryFormData?.newMainCategoryName}
                        onChange={handleMainCategoryFormChange}
                        disabled={submitClicked && !categoryState.error}
                      />
                      <Span $color={'#d15252'}>
                        {promptMessage?.newMainCategoryName}
                      </Span>
                      <Span $color={'#d15252'}>
                        {categoryState.error?.errors?.categoryName}
                      </Span>
                    </InputWrapper>
                  </Flexbox>
                  <Button
                    type='button'
                    $width={'2rem'}
                    $color={'#333'}
                    $bg={'transparent'}
                    onClick={handleMainCategoryCreate}
                    disabled={submitClicked && !categoryState.error}
                  >
                    <Done />
                  </Button>
                </Flexbox>
              </FormCol>
              <Span $color={'#5cc55f'}>{promptMessage?.newMainCategory}</Span>
              <hr />
            </FormRow>
          </>
        )}

        <FormRow $margin={' 0 0 0.75rem  0'}>
          <FormCol>
            <Flexbox $gap={'1rem'} $margin={'0'}>
              <Flexbox $gap={'1rem'}>
                <Flexbox $gap={'1rem'} $flex={'2.5'}>
                  <Span>類別</Span>
                </Flexbox>
                <Flexbox $gap={'1rem'} $flex={'4.5'}>
                  <Span>分類名稱</Span>
                </Flexbox>
                <Flexbox $gap={'1rem'} $flex={'2'}>
                  <Span>排序</Span>
                </Flexbox>
                <Flexbox $gap={'1rem'} $flex={'1'}>
                  <Span>子分類數量</Span>
                </Flexbox>
                <Flexbox $gap={'1rem'} $flex={'1'}>
                  <Span>{ }</Span>
                </Flexbox>
              </Flexbox>
            </Flexbox>
          </FormCol>
        </FormRow>
        <FormBody $gap={'0.75rem'}>
          <FormSide>
            {mainCategoryFormData?.existedMainCategories?.map((item, idx) => {
              const isEditing = editingIndex === idx;
              return (
                <FormRow key={item._id}>
                  <FormCol>
                    <Flexbox $gap={'1rem'}>
                      <Flexbox $gap={'1rem'}>
                        <InputWrapper
                          $height={'2.5rem'}
                          $flex={'2'}
                          $spanOffset={'-1rem'}
                        >
                          <Input
                            type='text'
                            name='type'
                            value={item?.type}
                            onChange={e =>
                              handleMainCategoryFormChange(e, item._id)
                            }
                            disabled={true}
                          />
                        </InputWrapper>
                        <InputWrapper
                          $height={'2.5rem'}
                          $flex={'3'}
                          $spanOffset={'-1rem'}
                          $border={
                            ((isEditing &&
                              categoryState.error?.errors?.categoryName) ||
                              (isEditing && promptMessage?.categoryName)) &&
                            '2px solid #d15252'
                          }
                        >
                          <Input
                            type='text'
                            name='categoryName'
                            value={item?.categoryName}
                            onChange={e =>
                              handleMainCategoryFormChange(e, item._id)
                            }
                            disabled={!isEditing}
                          />
                          {isEditing && (
                            <Span $color={'#d15252'}>
                              {promptMessage?.categoryName}
                            </Span>
                          )}
                          {isEditing && (
                            <Span $color={'#d15252'}>
                              {categoryState.error?.errors?.categoryName}
                            </Span>
                          )}
                        </InputWrapper>
                        <InputWrapper
                          $height={'2.5rem'}
                          $flex={'1'}
                          $spanOffset={'-1rem'}
                          $border={
                            ((isEditing &&
                              categoryState.error?.errors?.sortOrder) ||
                              (isEditing && promptMessage?.newSortOrder)) &&
                            '2px solid #d15252'
                          }
                        >
                          <Input
                            type='text'
                            name='sortOrder'
                            value={item?.newSortOrder}
                            onChange={e =>
                              handleMainCategoryFormChange(e, item._id)
                            }
                            disabled={!isEditing}
                          />
                          {isEditing && (
                            <Span $color={'#d15252'}>
                              {promptMessage?.newSortOrder}
                            </Span>
                          )}
                        </InputWrapper>
                      </Flexbox>
                      ({item.subCounts})
                      {editingIndex !== -1 && isEditing ? (
                        <Button
                          type={'button'}
                          $width={'2rem'}
                          $color={'#333'}
                          $bg={'transparent'}
                          disabled={editingIndex !== -1 && !isEditing}
                          onClick={() => {
                            handleMainCategoryUpdate(item._id);
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
                          disabled={editingIndex !== -1 && !isEditing}
                          onClick={() => {
                            setShowAddInputElement(false);
                            resetMainCategoryFormData();
                            setEditingIndex(idx);
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
                          setShowAddInputElement(false);
                          const confirmed = confirm(
                            `確定要刪除分類－${item.type}/${item.categoryName} 嗎`,
                          );
                          if (confirmed) {
                            handleMainCategoryDelete(item._id);
                          }
                        }}
                        disabled={isEditing || item?.subCounts > 0}
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
        {/* mainCategoryFormData.existedMainCategories
        <Span><pre>{JSON.stringify(mainCategoryFormData.existedMainCategories[0], null, 2)}</pre></Span> */}
        <Flexbox $margin={'4px 0 0 0'} $justifyContent={'flex-satrt'}>
          <Span $color={'#5cc55f'}>{promptMessage?.default}</Span>
          <Span $color={'#d15252'}>
            {categoryState.error?.message &&
              `⛔${categoryState.error?.message}`}
          </Span>
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

export default MainCategory;

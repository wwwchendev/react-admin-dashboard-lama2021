//react
import { useEffect, useState } from 'react';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import {
  productCategoryRequests,
  clearProductCategoryError,
} from '@/store/productCategory';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  TitleContainer,
  Modal,
  Button,
  Flexbox,
  Text,
} from '@/components/common';
import { Edit, Delete } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid';
import AddSubCategory from './AddSubCategory';
import EditSubCategory from './EditSubCategory';
import MainCategory from './MainCategory';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const ProductCategory = () => {
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const categoryState = useSelector(state => state.productCategory);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //資料排序
  const mainCategory = categoryState?.data.map(item => {
    return {
      _id: item._id,
      type: item.type,
      categoryName: item.categoryName,
      sortOrder: item.sortOrder,
      newSortOrder: item.sortOrder,
      subCategory: item.subCategory,
      subCounts: item.subCategory?.length,
      display: item.display,
      updatedAt: item?.updatedAt,
      createdAt: item?.createdAt,
    };
  });
  const typeOrderList = ['依群組', '依類別', '依日期'];

  const sortingData = (data) => {
    return data.sort((a, b) => {
      const typeA = typeOrderList.indexOf(a.type);
      const typeB = typeOrderList.indexOf(b.type);
      if (typeA !== typeB) {
        return typeA - typeB;
      }
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      if (a.subCategorySortOrder !== b.subCategorySortOrder) {
        return a.subCategorySortOrder - b.subCategorySortOrder;
      }
      if (a.categoryDisplay !== b.categoryDisplay) {
        return b.categoryDisplay - a.categoryDisplay;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }


  //表單管理
  const initialMainCategoryFormData = {
    newMainCategoryType: '依類別',
    newMainCategoryName: '',
    existedMainCategories: sortingData(categoryState?.data.map(item => {
      return {
        _id: item._id,
        type: item.type,
        categoryName: item.categoryName,
        sortOrder: item.sortOrder,
        newSortOrder: item.sortOrder,
        subCategory: item.subCategory,
        subCounts: item.subCategory?.length,
        display: item.display,
        updatedAt: item?.updatedAt,
        createdAt: item?.createdAt,
      };
    })) || [],
  };
  const [mainCategoryFormData, setMainCategoryFormData] = useState(
    initialMainCategoryFormData,
  );
  const initialSubCategoryFormData = {
    parentCategoryId: '',
    subCategoryName: '',
  };
  const [subCategoryFormData, setSubCategoryFormData] = useState(
    initialSubCategoryFormData,
  );

  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [submitClicked, setSubmitClicked] = useState(false);
  const [showModalElement, setShowModalElement] = useState(false);
  const [subCategoryDisplayRadioChecked, setSubCategoryDisplayRadioChecked] =
    useState(true);

  //useEffect
  useEffect(() => {
    setCurrentPage('/productCategory');
    dispatch(productCategoryRequests.getAll());
  }, []);


  useEffect(() => {

    if (operateType === 'addMainCategory') {
      if (submitClicked & (categoryState.error === null)) {
        setMainCategoryFormData(initialMainCategoryFormData);
        setPromptMessage(prevState => ({
          newMainCategory: `✔️已新增主類別 ${mainCategoryFormData.newMainCategoryType}/${mainCategoryFormData.newMainCategoryName}`,
        }));
        setSubmitClicked(false);
      }
    }
    if (operateType === 'deleteMainCategory') {
      if (submitClicked & (categoryState.error === null)) {
        setMainCategoryFormData(initialMainCategoryFormData);
        setPromptMessage(prevState => ({
          default: `✔️刪除完成`,
        }));
        setSubmitClicked(false);
      }
    }
    if (operateType === 'updateMainCategory') {
      if (submitClicked & (categoryState.error === null)) {
        setMainCategoryFormData(initialMainCategoryFormData);
        setPromptMessage(prevState => ({
          default: `✔️已更新`,
        }));
        setSubmitClicked(false);
        setOperateType('mainCategory');
      }
    }


    if (operateType === 'addSubCategory') {
      if (submitClicked & (categoryState.error === null)) {
        setPromptMessage(prevState => ({
          default: `✔️已新增次類別 ${subCategoryFormData.subCategoryName}`,
        }));
      }
    }
    if (operateType === 'deleteSubCategory') {
      if (submitClicked & (categoryState.error === null)) {
        alert('✔️刪除完成');
        setSubmitClicked(false);
      }
    }
    if (operateType === 'editSubCategory') {
      if (submitClicked & (categoryState.error === null)) {
        setPromptMessage(prevState => ({
          default: `✔️已更新`,
        }));
        setSubmitClicked(false);
      }
    }
  }, [categoryState.data]);

  //modal
  const [operateType, setOperateType] = useState('');

  //mainCategory
  const resetMainCategoryFormData = () => {
    setPromptMessage(initPromptMessage);
    dispatch(clearProductCategoryError());
    setMainCategoryFormData(initialMainCategoryFormData);
  };
  const showMainCategoryModalElement = boolean => {
    setShowModalElement(boolean);
    setOperateType('mainCategory');
    setMainCategoryFormData(initialMainCategoryFormData);
    setPromptMessage(initPromptMessage);
    setSubmitClicked(false);
    dispatch(clearProductCategoryError());
  };
  const handleMainCategoryFormChange = async (e, id) => {
    setSubmitClicked(false);
    const { name, value } = e.target;
    if (name === 'categoryName') {
      setMainCategoryFormData(prevState => ({
        ...prevState,
        existedMainCategories: prevState.existedMainCategories.map(item =>
          item._id === id ? { ...item, [name]: value } : item,
        ),
      }));
    } else if (name === 'sortOrder') {
      setMainCategoryFormData(prevState => ({
        ...prevState,
        existedMainCategories: prevState.existedMainCategories.map(item =>
          item._id === id ? { ...item, newSortOrder: value } : item,
        ),
      }));
    } else {
      setMainCategoryFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
    setPromptMessage(initPromptMessage);
  };

  //mainCategory-add
  const handleMainCategoryCreate = async e => {
    e.preventDefault();
    setOperateType('addMainCategory');
    const { newMainCategoryName, newMainCategoryType } = mainCategoryFormData;
    if (newMainCategoryName !== '' && newMainCategoryType !== '') {
      setSubmitClicked(true);
      const addedData = {
        type: newMainCategoryType,
        categoryName: newMainCategoryName,
      };
      await dispatch(
        productCategoryRequests.create.mainCategory(TOKEN, addedData),
      );
    } else {
      const requireField = ['newMainCategoryType', 'newMainCategoryName'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'newMainCategoryType':
            emptyField = '類型欄位';
            break;
          case 'newMainCategoryName':
            emptyField = '分類名稱欄位';
            break;
          default:
            return;
        }

        if (mainCategoryFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };
  const handleMainCategoryDelete = async id => {
    setOperateType('deleteMainCategory');
    const mainCategory = categoryState.data.find(item => {
      return item._id === id;
    });
    if (mainCategory && mainCategory.subCategory.length === 0) {
      setSubmitClicked(true);
      dispatch(productCategoryRequests.delete.mainCategory(TOKEN, id));
    }
  };
  const handleMainCategoryUpdate = async id => {
    setOperateType('updateMainCategory');
    const mainCategory = mainCategoryFormData.existedMainCategories.find(
      item => {
        return item._id === id;
      },
    );
    if (mainCategory) {
      if (
        mainCategory.categoryName !== '' &&
        mainCategory.newSortOrder !== '' &&
        mainCategory.newSortOrder !== undefined &&
        mainCategory.newSortOrder !== null
      ) {
        setSubmitClicked(true);
        const updatedData = {
          categoryName: mainCategory.categoryName,
          sortOrder: mainCategory.newSortOrder,
        };
        dispatch(
          productCategoryRequests.update.mainCategory(TOKEN, id, updatedData),
        );
      } else {
        const requireField = ['categoryName', 'newSortOrder'];
        requireField.forEach((f, idx) => {
          let emptyField;
          switch (f) {
            case 'categoryName':
              emptyField = '分類名稱欄位';
              break;
            case 'newSortOrder':
              emptyField = '分類排序欄位';
              break;
            default:
              return;
          }
          if (!mainCategory[f]) {
            setPromptMessage(prev => {
              return { ...prev, default: null, [f]: `${emptyField}不得為空` };
            });
          }
        });
      }
    }
  };

  //addSubCategory
  const showAddSubCategoryModalElement = boolean => {
    setShowModalElement(boolean);
    setOperateType('addSubCategory');
    setSubCategoryFormData(initialSubCategoryFormData);
    setPromptMessage(initPromptMessage);
    setSubmitClicked(false);
    dispatch(clearProductCategoryError());
  };
  const handleAddSubCategoryFormChange = async e => {
    setSubmitClicked(false);
    dispatch(clearProductCategoryError());
    const { name, value } = e.target;
    setSubCategoryFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setPromptMessage(initPromptMessage);
  };
  const handleSubCategorCreate = async e => {
    e.preventDefault();
    setOperateType('addSubCategory');
    const { parentCategoryId, subCategoryName } = subCategoryFormData;
    if (parentCategoryId !== '' && subCategoryName !== '') {
      setSubmitClicked(true);
      const addedData = { parentCategoryId, subCategoryName };
      await dispatch(
        productCategoryRequests.create.subCategory(TOKEN, addedData),
      );
    } else {
      const requireField = ['parentCategoryId', 'subCategoryName'];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'parentCategoryId':
            emptyField = '所屬分類欄位';
            break;
          case 'subCategoryName':
            emptyField = '次分類名稱欄位';
            break;
          default:
            return;
        }

        if (subCategoryFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };
  const handleSubCategoryDelete = async (id, data) => {
    setOperateType('deleteSubCategory');
    const confirmed = confirm(
      `確定要刪除${data.type}/${data.categoryName}的次分類【${data.subCategoryName}】嗎`,
    );
    if (confirmed) {
      setSubmitClicked(true);
      dispatch(productCategoryRequests.delete.subCategory(TOKEN, id));
    }
  };

  //editSubCategory
  const showEditSubCategoryModalElement = (boolean, rowData) => {
    setShowModalElement(boolean);
    if (boolean === true) {
      setOperateType('editSubCategory');
      setSubCategoryFormData({
        parentCategoryId: rowData.id,
        subCategoryId: rowData.subCategoryId,
        subCategoryName: rowData.subCategoryName,
        subCategorySortOrder: rowData.subCategorySortOrder,
        display: rowData.subCategoryDisplay,
      });
      setSubCategoryDisplayRadioChecked(
        rowData.subCategoryDisplay ? 'true' : 'false',
      );
      setPromptMessage(initPromptMessage);
      setSubmitClicked(false);
      dispatch(clearProductCategoryError());
    }
  };
  const handleEditSubCategoryFormChange = async (e, id) => {
    setSubmitClicked(false);
    dispatch(clearProductCategoryError());
    const { name, value } = e.target;
    setSubCategoryFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    if (name === 'display') {
      setSubCategoryDisplayRadioChecked(value);
    }
    setPromptMessage(initPromptMessage);
  };
  // console.log(categoryState.data);
  const handleSubCategorUpdate = async () => {
    const {
      parentCategoryId,
      subCategoryId,
      subCategoryName,
      subCategorySortOrder,
      display,
    } = subCategoryFormData;
    if (
      parentCategoryId &&
      subCategoryName &&
      subCategorySortOrder > -1 &&
      display !== null
    ) {
      setSubmitClicked(true);
      const updatedData = {
        parentCategoryId,
        subCategoryName,
        sortOrder: subCategorySortOrder,
        display,
      };
      await dispatch(
        productCategoryRequests.update.subCategory(
          TOKEN,
          subCategoryId,
          updatedData,
        ),
      );
    } else {
      const requireField = [
        'parentCategoryId',
        'subCategoryName',
        'subCategorySortOrder',
        'display',
      ];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'parentCategoryId':
            emptyField = '所屬分類欄位';
            break;
          case 'subCategoryName':
            emptyField = '次分類名稱欄位';
            break;
          case 'subCategorySortOrder':
            emptyField = '顯示排序欄位';
            break;
          case 'display':
            emptyField = '是否顯示欄位';
            break;
          default:
            return;
        }
        if (
          f === 'subCategorySortOrder' &&
          subCategoryFormData.subCategorySortOrder < 0
        ) {
          setPromptMessage(prev => {
            return { ...prev, subCategorySortOrder: `${emptyField}不得為負數` };
          });
        }
        if (subCategoryFormData[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };

  //data-grid
  const muteColor = '#a5a5a5';
  const columns = [
    {
      field: 'no',
      headerName: '序號',
      width: 105,
      renderCell: params => {
        const isMute = params.row.subCategoryDisplay === true ? '' : muteColor;
        return <Text $color={isMute}>{params.row.no}</Text>;
      },
    },
    {
      field: 'type',
      headerName: '類型',
      width: 105,
      renderCell: params => {
        const isMute = params.row.subCategoryDisplay === true ? '' : muteColor;
        return <Text $color={isMute}>{params.row.type}</Text>;
      },
    },
    {
      field: 'categoryName',
      headerName: '主分類',
      width: 120,
      renderCell: params => {
        const isMute = params.row.subCategoryDisplay === true ? '' : muteColor;
        return <Text $color={isMute}>{params.row.categoryName}</Text>;
      },
    },
    {
      field: 'subCategoryName',
      headerName: '次分類',
      width: 120,
      renderCell: params => {
        const isMute = params.row.subCategoryDisplay === true ? '' : muteColor;
        return <Text $color={isMute}>{params.row.subCategoryName}</Text>;
      },
    },
    {
      field: 'subCategorySortOrder',
      headerName: '顯示排序',
      width: 140,
      renderCell: params => {
        const isMute = params.row.subCategoryDisplay === true ? '' : muteColor;
        return <Text $color={isMute}>{params.row.subCategorySortOrder}</Text>;
      },
    },
    {
      field: 'subCategoryCount',
      headerName: '商品數',
      width: 120,
      renderCell: params => {
        const isMute = params.row.subCategoryDisplay === true ? '' : muteColor;
        return <Text $color={isMute}>{params.row.subCategoryCount}</Text>;
      },
    },
    {
      field: 'subCategoryDisplay',
      headerName: '顯示',
      width: 120,
      renderCell: params => {
        const isMute = params.row.subCategoryDisplay === true ? '' : muteColor;
        return (
          <Text $color={isMute}>
            {params.row.subCategoryDisplay === true ? '顯示' : '隱藏'}
          </Text>
        );
      },
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
              showEditSubCategoryModalElement(true, params.row);
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
            {params.row.subCategoryCount === 0 && (
              <>
                <Button
                  type={'button'}
                  $width={'4rem'}
                  $color={'#888070'}
                  $bg={'transparent'}
                  onClick={() => {
                    handleSubCategoryDelete(
                      params.row.subCategoryId,
                      params.row,
                    );
                  }}
                >
                  <Delete />
                  移除次分類
                </Button>
              </>
            )}
          </>
        );
      },
    },
  ];

  const rowsSrc = categoryState.data || []
  let globalIndex = 1;

  const rows = rowsSrc.flatMap(item => {
    const {
      _id,
      type,
      categoryName,
      display,
      sortOrder,
      __v,
      subCategory: subCategories,
    } = item;
    return subCategories.map(subCategory => ({
      id: _id,
      type,
      categoryName,
      categorySortOrder: sortOrder,
      categoryDisplay: display,
      subCategoryId: subCategory._id,
      subCategoryName: subCategory.subCategoryName,
      subCategorySortOrder: subCategory.sortOrder,
      subCategoryCount: subCategory.counts,
      subCategoryDisplay: subCategory.display,
      no: globalIndex++,
    }));
  });

  return (
    <Layout.PageLayout>
      <SEO title='商品分類 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>商品分類</h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                showAddSubCategoryModalElement(true);
              }}
              $bg={'#3488f5'}
              $color={'#fff'}
              $width={'7rem'}
              $animation
            >
              新增次分類
            </Button>
            <Button
              type='button'
              onClick={() => {
                showMainCategoryModalElement(true);
              }}
              $bg={'transparent'}
              $border={'1px solid #3488f5'}
              $color={'#3488f5'}
              $width={'6rem'}
              $animation
            >
              編輯分類
            </Button>
          </Flexbox>
        </TitleContainer>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={row => row.no}
          checkboxSelection={false}
          disableSelectionOnClick
        />

        {(operateType === 'mainCategory' ||
          operateType === 'addMainCategory' ||
          operateType === 'deleteMainCategory' ||
          operateType === 'updateMainCategory') && (
            <Modal
              open={showModalElement}
              $maxWidth={'40%'}
              onClose={() => {
                showMainCategoryModalElement(false);
              }}
            >
              <MainCategory
                operateType={operateType}
                handleMainCategoryFormChange={handleMainCategoryFormChange}
                handleMainCategoryCreate={handleMainCategoryCreate}
                handleMainCategoryUpdate={handleMainCategoryUpdate}
                handleMainCategoryDelete={handleMainCategoryDelete}
                mainCategoryFormData={mainCategoryFormData}
                resetMainCategoryFormData={resetMainCategoryFormData}
                submitClicked={submitClicked}
                promptMessage={promptMessage}
                typeOrderList={typeOrderList}
                sortedMainCategoryData={sortingData(mainCategory)}
              />
            </Modal>
          )}
        {operateType === 'addSubCategory' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => {
              showAddSubCategoryModalElement(false);
            }}
          >
            <AddSubCategory
              showAddSubCategoryModalElement={showAddSubCategoryModalElement}
              handleAddSubCategoryFormChange={handleAddSubCategoryFormChange}
              handleSubCategorCreate={handleSubCategorCreate}
              subCategoryFormData={subCategoryFormData}
              submitClicked={submitClicked}
              promptMessage={promptMessage}
              sortedMainCategoryData={sortingData(mainCategory)}
            />
          </Modal>
        )}
        {operateType === 'editSubCategory' && (
          <Modal
            open={showModalElement}
            $maxWidth={'30%'}
            onClose={() => {
              showEditSubCategoryModalElement(false);
            }}
          >
            <EditSubCategory
              showEditSubCategoryModalElement={showEditSubCategoryModalElement}
              handleEditSubCategoryFormChange={handleEditSubCategoryFormChange}
              handleSubCategorUpdate={handleSubCategorUpdate}
              subCategoryFormData={subCategoryFormData}
              submitClicked={submitClicked}
              promptMessage={promptMessage}
              sortedMainCategoryData={sortingData(mainCategory)}
              subCategoryDisplayRadioChecked={subCategoryDisplayRadioChecked}
            />
          </Modal>
        )}
        <pre> {JSON.stringify(categoryState.data.length, null, 2)}</pre>
      </Container>
      <Layout.Loading
        type={'spinningBubbles'}
        active={categoryState.loading}
        color={'#00719F'}
        width={100}
      />
    </Layout.PageLayout>
  );
};

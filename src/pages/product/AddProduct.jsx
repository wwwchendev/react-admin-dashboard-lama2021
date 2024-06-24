//react
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { productRequests, clearProductError } from '@/store/product';
import {
  fileRequests,
  uploadFailed,
  uploadSuccess,
  initFileState,
} from '@/store/file';
import {
  productCategoryRequests,
  clearProductCategoryError,
} from '@/store/productCategory';
//components
import styled from 'styled-components';
import * as Layout from '@/components/layout';
const { SEO } = Layout;
import {
  Flexbox,
  TitleContainer,
  Button,
  Input,
  Span,
  InputWrapper,
  Form,
  CustomJoditEditor,
  SelectWrapper,
  Select,
  File,
  FileWrapper,
  ProgressWrapper,
} from '@/components/common';
import {
  Add,
  Edit,
  Delete,
  Done,
  ArrowRight,
  AttachFile,
  Photo,
  PictureAsPdf,
  Publish,
  Queue,
} from '@material-ui/icons';
const {
  FormWrapper,
  FormRadioWrapper,
  FormBody,
  FormRow,
  FormCol,
  FormTitle,
  FormSide,
} = Form;
import { TagsInput } from 'react-tag-input-component';
//utility
import { uploadImage } from '../../utils/uploadFile';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const AddCategoryBtn = styled(Button)`
  width: 100%;
  color: #3488f5;
  border: 2px dotted #ccc;
  background-color: #f8fcff;
  padding: 8px 0;
  &:hover {
    border: 2px dotted #3488f5;
  }
`;

export const AddProduct = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const productState = useSelector(state => state.product);
  const fileState = useSelector(state => state.file);
  const categoryState = useSelector(state => state.productCategory);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;

  //表單管理
  const generateDefaultProductNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const newPrefixChars = 'P' + year + month;
    try {
      let defaultNumber;
      const products = productState.data;
      const latestProduct = products[0];

      if (latestProduct) {
        const latestProductNumber = latestProduct?.productNumber;
        const prefixChars = latestProductNumber.substring(0, 7);
        const lastChars = latestProductNumber.substring(
          latestProductNumber.length - 3,
        );

        if (newPrefixChars === prefixChars) {
          const number = (parseInt(lastChars) + 1).toString().padStart(3, '0');
          defaultNumber = `P${year}${month}${number}`;
        } else {
          defaultNumber = `P${year}${month}001`;
        }
      } else {
        defaultNumber = `P${year}${month}001`;
      }

      return defaultNumber;
    } catch (error) {
      console.log(error);
      throw new Error('生成產品編號失敗');
    }
  };
  const initialFormData = {
    productNumber: generateDefaultProductNumber(),
    productName: '',
    productPromotionImage: '',
    productImages: [],
    productCategories: [
      {
        categoryId: '',
        subCategoryId: '',
      },
    ],
    description: '',
    richContent: '',
    variants: [],
    display: 'true',
    createdBy: authEmployeeState.data?.employeeId,
    lastEditedBy: authEmployeeState.data?.employeeId,
  };
  const [form, setForm] = useState(initialFormData);
  const [variantList, setVariantList] = useState([]);
  const [specificationList, setSpecificationList] = useState([]);
  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [operateType, setOperateType] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [displayRadioChecked, setDisplayRadioChecked] = useState(form.display);

  //圖片上傳
  const [file, setFile] = useState(null);
  //1:1主要圖片
  const productPromotionImageInputRef = useRef(null);
  const [productPromotionImageState, setProductPromotionImageState] = useState({
    imagePreview: '',
    uploaded: false,
    percent: 0,
  });
  //賣場圖組
  const productImagesInputRefs = useRef([]);
  const [productImagesState, setProductImagesState] = useState([]);
  const [productImagesCurrentIndex, setProductImagesCurrentIndex] =
    useState(null);
  //商品規格
  const productVariantImagesInputRefs = useRef([]);
  const [productVariantImagesState, setProductVariantImagesState] = useState(
    [],
  );
  const [
    productVariantImagesCurrentIndex,
    setProductVariantImagesCurrentIndex,
  ] = useState(null);

  //useEffect
  useEffect(() => {
    setCurrentPage('/product');
    dispatch(initFileState());
    dispatch(productCategoryRequests.getAll());
    dispatch(
      fileRequests.resetFolder(TOKEN, {
        filePath: `/products/${form.productNumber}`,
      }),
    );
  }, []);
  useEffect(() => {
    if (operateType === 'addProduct') {
      if (submitClicked && productState.error === null) {
        const confirmed = confirm('已新增商品');
        if (confirmed) {
          navigator('/product');
        }
      }
    }
  }, [productState.data]);
  useEffect(() => {
    setPromptMessage(initPromptMessage);
    if (variantList.length > form.variants.length) {
      setProductVariantImagesState(pre => {
        const updatedArray = [...pre];
        updatedArray.push({
          item: variantList[variantList.length - 1],
          imagePreview: '',
          uploaded: false,
          percent: 0,
        });
        return updatedArray;
      });
    } else {
      setProductVariantImagesState(pre => {
        const updatedArray = pre.filter(v => variantList.includes(v.item));
        return updatedArray;
      });
    }
    setForm(prevForm => {
      //當品項規格改變的時候保留原本設定的數值
      const variantsStructure = prev => {
        return variantList.map((variant, idx) => {
          const existingVariant = form.variants.find(v => v.item === variant);
          const specifications =
            specificationList.length === 0
              ? existingVariant
                ? existingVariant.specification
                : [{ name: '常規', stock: 0 }]
              : specificationList.map(specification => {
                const existingSpec = existingVariant
                  ? existingVariant.specification.find(
                    s => s.name === specification,
                  )
                  : null;
                return {
                  name: specification,
                  stock: existingSpec ? existingSpec.stock : 0,
                };
              });
          return {
            item: variant,
            image: existingVariant ? existingVariant.image : '',
            price: existingVariant ? existingVariant.price : 0,
            specification: specifications,
          };
        });
      };

      return {
        ...prevForm,
        variants: variantsStructure(prevForm.variants),
      };
    });
  }, [variantList, specificationList]);
  useEffect(() => {
    if (operateType === 'uploadProductPromotionImage') {
      if (
        productPromotionImageState.uploaded &&
        fileState.data &&
        !fileState.error
      ) {
        setProductPromotionImageState(prev => ({
          imagePreview: '',
          uploaded: false,
          percent: 0,
        }));
      } else if (fileState?.data.imageUrl) {
        setForm(prevState => ({
          ...prevState,
          productPromotionImage: fileState?.data.imageUrl,
        }));
        setOperateType('');
      }
    }
    if (operateType === 'uploadProductImages') {
      if (
        productImagesState[productImagesCurrentIndex]?.uploaded &&
        fileState.data &&
        !fileState.error
      ) {
        setProductImagesState(pre => {
          const updatedArray = [...pre];
          updatedArray[productImagesCurrentIndex] = {
            imagePreview: '',
            uploaded: false,
            percent: 0,
          };
          return updatedArray;
        });
      } else if (fileState?.data.imageUrl) {
        setForm(prevState => {
          const updatedArray = [...prevState.productImages];
          updatedArray[productImagesCurrentIndex] = fileState?.data.imageUrl;
          return {
            ...prevState,
            productImages: updatedArray,
          };
        });
        setOperateType('');
      }
    }
    if (
      operateType === 'uploadProductVariantImage' &&
      fileState?.data?.imageUrl
    ) {
      if (
        productVariantImagesState[productVariantImagesCurrentIndex]?.uploaded &&
        fileState.data &&
        !fileState.error
      ) {
        setProductVariantImagesState(pre => {
          const updatedArray = [...pre];
          updatedArray[productVariantImagesCurrentIndex] = {
            ...pre[productVariantImagesCurrentIndex],
            percent: 100,
          };
          return updatedArray;
        });

        setForm(prevState => {
          const updatedArray = [...prevState.variants];
          updatedArray[productVariantImagesCurrentIndex].image =
            fileState?.data.imageUrl;
          return {
            ...prevState,
            variants: updatedArray,
          };
        });
        setOperateType('');
      }
    }
  }, [fileState.data]);

  const handleFormChange = async (e, rowIndex, specIndex) => {
    const { name, value, type } = e.target;
    if (productState.error) {
      setSubmitClicked(false);
      dispatch(clearProductError());
    }
    setPromptMessage(initPromptMessage);
    let file;
    if (type === 'file') {
      // 初始化
      dispatch(initFileState());
      file = e.target.files[0];
      // 檢查檔案類型是否正確
      if (!file || !file.type.startsWith('image/')) {
        alert('請選擇圖片檔案');
        return;
      }
      setFile(file); // 設置檔案
    }
    if (name === 'productPromotionImage') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductPromotionImageState(pre => ({
          ...pre,
          imagePreview: reader.result,
          percent: 0,
        }));
      };
      reader.readAsDataURL(file);
      await handleUpload(e.target.files[0]);
      return;
    }
    if (name === 'productImages') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagesState(pre => {
          const updatedArray = [...pre];
          updatedArray[rowIndex] = {
            ...pre[rowIndex],
            imagePreview: reader.result,
          };
          return updatedArray;
        });
      };
      reader.readAsDataURL(file);

      await handleUpload(e.target.files[0], rowIndex);
      return;
    }
    if (name === 'categoryId') {
      setForm(prev => {
        return {
          ...prev,
          productCategories: prev.productCategories.map((item, idx) =>
            idx === rowIndex ? { ...item, categoryId: value } : item,
          ),
        };
      });
    }
    if (name === 'subCategoryId') {
      setForm(prev => {
        return {
          ...prev,
          productCategories: prev.productCategories.map((item, idx) =>
            idx === rowIndex ? { ...item, subCategoryId: value } : item,
          ),
        };
      });
    }
    if (name === 'productVariantImages') {
      // console.log('規格圖片異動', 'form', form.variants.length, 'State', productVariantImagesState.length);
      //handleFormChange
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductVariantImagesState(pre => {
          const updatedArray = [...pre];
          updatedArray[rowIndex] = {
            item: pre[rowIndex]?.item,
            imagePreview: reader.result,
            uploaded: true,
            percent: 0,
          };
          return updatedArray;
        });
      };
      reader.readAsDataURL(file);
      await handleUpload(e.target.files[0], rowIndex);
      return;
    }
    if (name === 'display') {
      setDisplayRadioChecked(value);
    }
    if (name === 'price') {
      setForm(prevState => {
        const updatedVariants = [...prevState.variants];
        updatedVariants[rowIndex][name] = value;
        return {
          ...prevState,
          variants: updatedVariants,
        };
      });
      return;
    }
    if (name === 'stock') {
      setForm(prevState => {
        const updatedVariants = [...prevState.variants];
        updatedVariants[rowIndex].specification[specIndex].stock = value;
        return {
          ...prevState,
          variants: updatedVariants,
        };
      });
      return;
    }
    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    const {
      productNumber,
      productName,
      productPromotionImage,
      productImages,
      productCategories,
      description,
      richContent,
      variants,
      display,
      createdBy,
    } = form;
    setOperateType('addProduct');

    const verifyVariants = variants.every(variant => variant.image !== '');
    const verifyProductCategories = productCategories.every(
      category => category.categoryId !== '' && category.subCategoryId !== '',
    );

    if (
      productName !== '' &&
      productPromotionImage !== '' &&
      description !== '' &&
      richContent !== '' &&
      variants.length !== 0 &&
      verifyVariants === true &&
      verifyProductCategories === true
    ) {
      setSubmitClicked(true);
      const newData = {
        productNumber,
        productName,
        productPromotionImage,
        productImages,
        productCategories,
        description,
        richContent,
        variants,
        createdBy,
        lastEditedBy: authEmployeeState.data.employeeId,
        display,
      };
      await dispatch(productRequests.create(TOKEN, newData));
    } else {
      const requireField = [
        'productName',
        'productPromotionImage',
        'description',
        'richContent',
        'variants',
        'variantDetails',
        'productCategoriesDetails',
      ];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'productName':
            emptyField = '產品名稱欄位';
            break;
          case 'productPromotionImage':
            emptyField = '主要圖片欄位';
            break;
          case 'description':
            emptyField = '簡短描述欄位';
            break;
          case 'richContent':
            emptyField = '文章內容欄位';
            break;
          case 'variants':
            emptyField = '商品款式欄位';
            break;
          case 'variantDetails':
            emptyField = '規格圖片欄位';
            break;
          case 'productCategoriesDetails':
            emptyField = '商品分類欄位';
            break;
          default:
            return;
        }
        if (f === 'variants' && variants.length === 0) {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField} 不得為空` };
          });
          return;
        }
        if (f === 'variantDetails' && !verifyVariants) {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField} 不得為空` };
          });
          return;
        }
        if (f === 'productCategoriesDetails' && !verifyProductCategories) {
          setPromptMessage(prev => {
            return {
              ...prev,
              [f]: `請檢查${emptyField}設定: 主要類別與次要類別皆須設置，並移除閒置欄位`,
            };
          });
          return;
        }
        if (form[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField} 不得為空` };
          });
        }
      });
    }
  };
  //上傳圖片
  const handleUpload = async (file, productImagesIndex) => {
    setPromptMessage(initPromptMessage);
    if (!file) {
      setPromptMessage(prev => ({ ...prev, 'coverImage': `未選取任何檔案` }));
      return;
    }
    const filePath = `/products/${form.productNumber}`;

    let onUploadProgress;
    if (operateType === 'uploadProductPromotionImage') {
      setProductPromotionImageState(prev => ({
        ...prev,
        uploaded: true,
      }));
      onUploadProgress = progressEvent => {
        setProductPromotionImageState(prev => ({
          ...prev,
          percent: progressEvent.progress * 100,
        }));
      };
    }
    if (operateType === 'uploadProductImages') {
      setProductImagesState(pre => {
        const updatedArray = [...pre];
        updatedArray[productImagesIndex] = {
          ...pre[productImagesIndex],
          uploaded: true,
        };
        return updatedArray;
      });

      onUploadProgress = progressEvent => {
        setProductImagesState(pre => {
          const updatedArray = [...pre];
          updatedArray[productImagesIndex] = {
            ...pre[productImagesIndex],
            percent: progressEvent.progress * 100,
          };
          return updatedArray;
        });
      };
    }
    //handleUpload
    if (operateType === 'uploadProductVariantImage') {
      // 上傳前的初始化狀態
      setProductVariantImagesState(pre => {
        const updatedArray = [...pre];
        updatedArray[productVariantImagesCurrentIndex] = {
          ...pre[productVariantImagesCurrentIndex],
          item: form.variants[productVariantImagesCurrentIndex]?.item,
          uploaded: true,
          percent: 0,
        };
        return updatedArray;
      });

      // 上傳時更新進度
      onUploadProgress = progressEvent => {
        setProductVariantImagesState(pre => {
          const updatedArray = [...pre];
          updatedArray[productVariantImagesCurrentIndex] = {
            ...pre[productVariantImagesCurrentIndex],
            percent: progressEvent.progress * 100,
          };
          return updatedArray;
        });
      };
    }

    try {
      const response = await uploadImage(
        TOKEN,
        file,
        filePath,
        onUploadProgress,
      );
      dispatch(uploadSuccess(response.data));
    } catch (error) {
      dispatch(uploadFailed(error));
    }
  };

  return (
    <Layout.PageLayout>
      <SEO title='新增商品 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>
            商品維護 {JSON.stringify(form.productNumber)}
            <ArrowRight />
            新增
          </h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                const confirmed = confirm(
                  '確定要【返回】嗎? 請確保當前內容已保存',
                );
                if (confirmed) {
                  navigator('/product');
                }
              }}
              $bg={'#a5a5a5'}
              $animation
            >
              返回
            </Button>
            <Button
              type='button'
              onClick={handleFormSubmit}
              $bg={submitClicked && !productState.error ? '' : '#5cc55f'}
              $animation={submitClicked && !productState.error ? false : true}
              disabled={submitClicked && !productState.error}
            >
              提交
            </Button>
          </Flexbox>
        </TitleContainer>
        <FormWrapper>
          <FormBody $padding={'0 1rem 0 0'}>
            <FormSide $gap={'24px'}>
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>商品名稱</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.productName ||
                        productState.error?.errors.productName) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='productName'
                      type='text'
                      placeholder=''
                      onChange={handleFormChange}
                      value={form.productName}
                      disabled={submitClicked && !productState.error}
                    />
                    <Span $color={'#d15252'}>{promptMessage?.productName}</Span>
                    <Span $color={'#d15252'}>
                      {productState.error?.errors.productName}
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>
              {/* <Span>
                ✅file?.name
                <pre>
                  {JSON.stringify(file?.name)}
                </pre>
              </Span> */}
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>1:1圖片</label>
                  <FileWrapper
                    onClick={() => {
                      setOperateType('uploadProductPromotionImage');
                      productPromotionImageInputRef.current.click();
                    }}
                    $cursor={'pointer'}
                    $border={
                      (promptMessage?.productPromotionImage ||
                        productState.error?.errors
                          .uploadProductPromotionImage) &&
                      '2px solid #d15252'
                    }
                  >
                    <File
                      hidden
                      name='productPromotionImage'
                      ref={productPromotionImageInputRef}
                      onChange={handleFormChange}
                      disabled={submitClicked && !productState.error}
                    />

                    {!productPromotionImageState.uploaded &&
                      !productPromotionImageState.imagePreview &&
                      !form.productPromotionImage && (
                        <>
                          <Photo />
                          <Span $color={'#3488f5'}>新增圖片</Span>
                          <Span $color={'#3488f5'}>(0/1)</Span>
                        </>
                      )}

                    {form.productPromotionImage && (
                      <img
                        src={`${import.meta.env.VITE_APIURL}/file${form.productPromotionImage}`}
                        alt='Preview'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                      />
                    )}
                    {(productPromotionImageState.uploaded ||
                      productPromotionImageState.percent === 100) && (
                        <ProgressWrapper>
                          <progress value={productPromotionImageState.percent} />
                          <Span>
                            {productPromotionImageState?.percent?.toFixed(0)}%
                          </Span>
                        </ProgressWrapper>
                      )}
                  </FileWrapper>

                  {/* <Span><pre>{JSON.stringify(form.productPromotionImage, null, 2)}</pre>
                  </Span>
                  <Span><pre>{JSON.stringify(productPromotionImageState, null, 2)}</pre>
                  </Span> */}
                  <Span $color={'#d15252'}>
                    {promptMessage?.productPromotionImage}
                  </Span>
                  <Span $color={'#d15252'}>
                    {productState.error?.errors.productPromotionImage}
                  </Span>
                  {/* <Span>
                    ✅productPromotionImageState
                    <pre>
                      {JSON.stringify(productPromotionImageState, null, 2)}
                    </pre>
                  </Span> */}
                </FormCol>
              </FormRow>
              {/* <Span>
                <pre>{JSON.stringify(form.productPromotionImage, null, 2)}</pre>
              </Span> */}
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>商品圖組</label>
                  {[...form.productImages, ''].map((image, index) => {
                    if (index > 7) {
                      return;
                    }
                    return (
                      <FileWrapper
                        key={index}
                        onClick={() => {
                          setOperateType('uploadProductImages');
                          productImagesInputRefs.current[index]?.click();
                          setProductImagesCurrentIndex(index);
                        }}
                        $cursor={'pointer'}
                      >
                        <File
                          hidden
                          name={`productImages`}
                          ref={ref => {
                            // 確保 productImagesInputRefs 有足夠的長度，避免索引超出界限
                            if (ref && !productImagesInputRefs.current[index]) {
                              productImagesInputRefs.current[index] = ref;
                            }
                          }}
                          onChange={e => handleFormChange(e, index)}
                          disabled={submitClicked && !productState.error}
                        />
                        {!productImagesState[index]?.uploaded &&
                          !productImagesState[index]?.imagePreview &&
                          !form.productImages[index] && (
                            <>
                              <Queue />
                              <Span $color={'#3488f5'}>新增圖片</Span>
                              <Span $color={'#3488f5'}>({index}/8)</Span>
                            </>
                          )}
                        {(productImagesState[index]?.uploaded ||
                          productImagesState[index]?.percent === 100) && (
                            // 進度條
                            <ProgressWrapper>
                              <progress
                                value={productImagesState[index]?.percent}
                              />
                              <Span>
                                {productImagesState[index]?.percent?.toFixed(0)}%
                              </Span>
                            </ProgressWrapper>
                          )}
                        {form.productImages[index] && (
                          // 上傳完成
                          <img
                            src={`${import.meta.env.VITE_APIURL}/file${form.productImages[index]}`}
                            alt='Preview'
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                          />
                        )}
                      </FileWrapper>
                    );
                  })}
                  {/* <Span>
                    <pre>
                      ✅productImagesState {JSON.stringify(productImagesState, null, 2)}
                    </pre>
                  </Span> */}
                </FormCol>
              </FormRow>
              {/* <Span>
                ✅productImagesInputRefs
                <pre>
                  {productImagesInputRefs.current.map((inputRef, index) => (
                    <div key={index}>
                      <span>Name: {inputRef.name}</span><br />
                      <span>Type: {inputRef.type}</span><br />
                      <span>Value: {inputRef.value}</span><br />
                    </div>
                  ))}
                </pre>
              </Span> */}
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>商品分類</label>
                  <Flexbox $gap={'1rem'} $direction={'column'}>
                    {form.productCategories.map((item, idx) => {
                      return (
                        <FormRow key={idx}>
                          <SelectWrapper
                            $height={'2.5rem'}
                            $spanOffset={'-1.2rem'}
                          >
                            <Select
                              name='categoryId'
                              $border={
                                (promptMessage?.categoryId ||
                                  productState.error?.errors.categoryId) &&
                                '2px solid #d15252'
                              }
                              onChange={e => {
                                handleFormChange(e, idx);
                              }}
                              value={form.productCategories[idx].categoryId}
                              disabled={submitClicked && !productState.error}
                            >
                              <option value={''} disabled>
                                選擇主分類
                              </option>
                              {categoryState.data.map(item => {
                                if (idx === 0 && item.type === '依類別') {
                                  return (
                                    <option value={item._id} key={item._id}>
                                      {item.type} \ {item.categoryName}
                                    </option>
                                  );
                                } else {
                                  if (idx !== 0 && item.type !== '依類別') {
                                    return (
                                      <option value={item._id} key={item._id}>
                                        {item.type} \ {item.categoryName}
                                      </option>
                                    );
                                  }
                                }
                              })}
                            </Select>
                          </SelectWrapper>
                          <SelectWrapper
                            $height={'2.5rem'}
                            $spanOffset={'-1.2rem'}
                          >
                            <Select
                              name='subCategoryId'
                              $border={
                                (promptMessage?.subCategoryId ||
                                  productState.error?.errors.subCategoryId) &&
                                '2px solid #d15252'
                              }
                              onChange={e => {
                                handleFormChange(e, idx);
                              }}
                              value={form.productCategories[idx].subCategoryId}
                              disabled={submitClicked && !productState.error}
                            >
                              <option value={''} disabled>
                                選擇次要分類
                              </option>
                              {categoryState.data.map(item => {
                                if (
                                  item._id ===
                                  form.productCategories[idx].categoryId
                                ) {
                                  return item.subCategory.map(subItem => (
                                    <option
                                      value={subItem._id}
                                      key={subItem._id}
                                    >
                                      {subItem.subCategoryName}
                                    </option>
                                  ));
                                } else {
                                  return null;
                                }
                              })}
                            </Select>
                          </SelectWrapper>
                          <Button
                            type='button'
                            $width={'2rem'}
                            $color={'#333'}
                            $bg={'transparent'}
                            disabled={
                              (submitClicked && !productState.error) ||
                              form.productCategories.length === 1
                            }
                            onClick={() => {
                              setPromptMessage(initPromptMessage);
                              setForm(prev => {
                                const updatedCategories =
                                  prev.productCategories.filter(
                                    (item, index) => index !== idx,
                                  );
                                return {
                                  ...prev,
                                  productCategories: updatedCategories,
                                };
                              });
                            }}
                          >
                            <Delete />
                          </Button>
                        </FormRow>
                      );
                    })}
                  </Flexbox>
                </FormCol>
              </FormRow>
              {form.productCategories.length < 3 && (
                <FormRow>
                  <FormCol $minWidth={'5rem'}>
                    <label></label>
                    <AddCategoryBtn
                      type='button'
                      disabled={submitClicked && !productState.error}
                      onClick={() => {
                        if (form.productCategories.length + 1 > 3) return;
                        setPromptMessage(initPromptMessage);
                        setForm(prev => {
                          const array = [...prev.productCategories];
                          array.push({ 'categoryId': '', 'subCategoryId': '' });
                          return {
                            ...prev,
                            productCategories: array,
                          };
                        });
                      }}
                    >
                      增加分類
                      <Add />
                    </AddCategoryBtn>
                  </FormCol>
                </FormRow>
              )}
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label></label>
                  <Span $color={'#d15252'}>
                    {promptMessage?.productCategoriesDetails}
                  </Span>
                </FormCol>
              </FormRow>
              {/* <Span><pre>{JSON.stringify(form.productCategories)}</pre></Span> */}
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>簡短描述</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.description ||
                        productState.error?.errors.description) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='description'
                      type='text'
                      placeholder=''
                      onChange={handleFormChange}
                      value={form.description}
                      disabled={submitClicked && !productState.error}
                    />
                    <Span $color={'#d15252'}>{promptMessage?.description}</Span>
                    <Span $color={'#d15252'}>
                      {productState.error?.errors.description}
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>

              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>文章內容</label>
                  <Flexbox $direction={'column'} $alignItems={'flex-start'}>
                    <CustomJoditEditor
                      placeholder={null}
                      name='richContent'
                      state={form.richContent}
                      setState={value => {
                        setPromptMessage(initPromptMessage);
                        setForm(prevState => ({
                          ...prevState,
                          richContent: value,
                        }));
                      }}
                      $height={'280px'}
                      disabled={submitClicked && !productState.error}
                    />
                    <Span $color={'#d15252'}>{promptMessage?.richContent}</Span>
                    <Span $color={'#d15252'}>
                      {productState.error?.errors.richContent}
                    </Span>
                  </Flexbox>
                </FormCol>
              </FormRow>

              <FormRow>
                <FormCol $minWidth={'8rem'}>
                  <label>顯示狀態</label>
                  <Flexbox $gap={'1.5rem'} $justifyContent={'flex-start'}>
                    <FormRadioWrapper>
                      <Input
                        type='radio'
                        id='show'
                        name='display'
                        value='true'
                        onChange={e => {
                          return handleFormChange(e);
                        }}
                        checked={displayRadioChecked === 'true'}
                        disabled={submitClicked && !productState.error}
                      />
                      <label htmlFor='show'>顯示</label>
                    </FormRadioWrapper>
                    <FormRadioWrapper>
                      <Input
                        type='radio'
                        id='hidden'
                        name='display'
                        value='false'
                        onChange={e => {
                          return handleFormChange(e);
                        }}
                        checked={displayRadioChecked === 'false'}
                        disabled={submitClicked && !productState.error}
                      />
                      <label htmlFor='hidden'>隱藏</label>
                    </FormRadioWrapper>
                    <Span $color={'#d15252'}>{promptMessage?.display}</Span>
                    <Span $color={'#d15252'}>
                      {productState.error?.errors.display}
                    </Span>
                  </Flexbox>
                </FormCol>
              </FormRow>

              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>款式</label>
                  <FormRow $direction={'column'}>
                    <TagsInput
                      value={variantList}
                      onChange={setVariantList}
                      name='variants'
                      placeHolder='輸入完畢後以Enter提交'
                      disabled={submitClicked && !productState.error}
                    />
                    <Span $color={'#d15252'}>{promptMessage?.variants}</Span>
                  </FormRow>
                </FormCol>
              </FormRow>

              {/* <Span><pre>{JSON.stringify(variantList, null, 2)}</pre></Span> */}

              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>商品規格</label>
                  <FormRow $direction={'column'}>
                    <TagsInput
                      value={specificationList}
                      onChange={setSpecificationList}
                      name='specification'
                      placeHolder='輸入完畢後以Enter提交'
                      disabled={submitClicked && !productState.error}
                    />
                  </FormRow>
                </FormCol>
              </FormRow>
              {/* <Span><pre>{JSON.stringify(specificationList, null, 2)}</pre></Span> */}
              {/* <Span><pre>操作狀態: {isAddProductVariant ? "增加" : "減少"} {JSON.stringify(isAddProductVariant, null, 2)}</pre></Span>
              <Span><pre>productVariantImagesCurrentIndex:  {JSON.stringify(productVariantImagesCurrentIndex, null, 2)}</pre></Span>
              <Span><pre>variantList:  {JSON.stringify(variantList, null, 2)}</pre></Span> */}
              {/* <Span>
                <pre>
                  ✅productVariantImagesState {JSON.stringify(productVariantImagesState, null, 2)}
                </pre>
              </Span> */}
              <FormRow $height={'auto'}>
                <FormCol $minWidth={'5rem'}>
                  <label>價格庫存</label>
                  <FormRow $direction={'column'}>
                    <FormRow $direction={'column'}>
                      <FormCol $minWidth={'5rem'}></FormCol>
                    </FormRow>

                    <FormCol $minWidth={'5rem'}>
                      <table>
                        <thead>
                          <tr>
                            <th scope='col'>品項</th>
                            <th scope='col'>圖片</th>
                            <th scope='col'>價格</th>
                            <th scope='col'>規格</th>
                            <th scope='col'>商品數量</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.variants.map((rowData, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                              <tr>
                                <td rowSpan={rowData.specification.length}>
                                  {rowData.item}
                                </td>
                                <td rowSpan={rowData.specification.length}>
                                  {/* 上傳圖片 */}
                                  <Flexbox>
                                    <FileWrapper
                                      onClick={() => {
                                        setOperateType(
                                          'uploadProductVariantImage',
                                        );
                                        productVariantImagesInputRefs.current[
                                          rowIndex
                                        ]?.click();
                                        setProductVariantImagesCurrentIndex(
                                          rowIndex,
                                        );
                                      }}
                                      $cursor={'pointer'}
                                    >
                                      <File
                                        hidden
                                        name='productVariantImages'
                                        ref={ref => {
                                          productVariantImagesInputRefs.current[
                                            rowIndex
                                          ] = ref;
                                        }}
                                        onChange={e =>
                                          handleFormChange(e, rowIndex)
                                        }
                                        disabled={
                                          submitClicked && !productState.error
                                        }
                                      />
                                      {!productVariantImagesState[rowIndex]
                                        ?.uploaded &&
                                        !productVariantImagesState[rowIndex]
                                          ?.imagePreview &&
                                        !form.variants[rowIndex]?.image && (
                                          <>
                                            <Photo />
                                            <Span $color={'#3488f5'}>
                                              新增圖片
                                            </Span>
                                            <Span $color={'#3488f5'}>
                                              (0/1)
                                            </Span>
                                          </>
                                        )}

                                      {form.variants[rowIndex]?.image && (
                                        <img
                                          src={`${import.meta.env.VITE_APIURL}/file${form.variants[rowIndex]?.image}`}
                                          alt='Preview'
                                          style={{
                                            maxWidth: '200px',
                                            maxHeight: '200px',
                                          }}
                                        />
                                      )}
                                      {(productVariantImagesState[rowIndex]
                                        ?.uploaded ||
                                        productVariantImagesState[rowIndex]
                                          ?.percent === 100) && (
                                          <ProgressWrapper>
                                            <progress
                                              value={
                                                productVariantImagesState[
                                                  rowIndex
                                                ]?.percent
                                              }
                                            />
                                            <Span>
                                              {productVariantImagesState[
                                                rowIndex
                                              ]?.percent?.toFixed(0)}
                                              %
                                            </Span>
                                          </ProgressWrapper>
                                        )}
                                    </FileWrapper>
                                  </Flexbox>
                                </td>
                                <td rowSpan={rowData.specification.length}>
                                  <Flexbox>
                                    <Span>NT$</Span>
                                    <InputWrapper
                                      $height={'3rem'}
                                      $width={'10rem'}
                                    >
                                      <Input
                                        name='price'
                                        type='number'
                                        min={0}
                                        value={rowData.price}
                                        onChange={e =>
                                          handleFormChange(e, rowIndex, 0)
                                        }
                                        disabled={
                                          submitClicked && !productState.error
                                        }
                                      />
                                    </InputWrapper>
                                  </Flexbox>
                                </td>
                                <td>{rowData.specification[0]?.name}</td>
                                <td>
                                  <Flexbox>
                                    <InputWrapper
                                      $height={'3rem'}
                                      $width={'10rem'}
                                    >
                                      <Input
                                        name='stock'
                                        type='number'
                                        min={0}
                                        value={rowData.specification[0]?.stock}
                                        onChange={e =>
                                          handleFormChange(e, rowIndex, 0)
                                        }
                                        disabled={
                                          submitClicked && !productState.error
                                        }
                                      />
                                    </InputWrapper>
                                  </Flexbox>
                                </td>
                              </tr>
                              {/* Rows for specifications and quantities */}
                              {rowData.specification
                                .slice(1)
                                .map((spec, specIndex) => (
                                  <tr key={`${rowIndex}-${specIndex}`}>
                                    <td>{spec.name}</td>
                                    <td>
                                      <Flexbox>
                                        <InputWrapper
                                          $height={'3rem'}
                                          $width={'10rem'}
                                        >
                                          <Input
                                            type='number'
                                            name='stock'
                                            value={spec.stock}
                                            min={0}
                                            onChange={e =>
                                              handleFormChange(
                                                e,
                                                rowIndex,
                                                specIndex + 1,
                                              )
                                            }
                                            disabled={
                                              submitClicked &&
                                              !productState.error
                                            }
                                          />
                                        </InputWrapper>
                                      </Flexbox>
                                    </td>
                                  </tr>
                                ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                        {/* <Span><pre>{JSON.stringify(form.variants, null, 2)}</pre></Span> */}
                      </table>
                    </FormCol>
                    <Span $color={'#d15252'}>
                      {promptMessage?.variantDetails}
                    </Span>
                  </FormRow>
                </FormCol>
              </FormRow>
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>最後更新</label>
                  <Span>
                    {authEmployeeState?.data?.name} /{' '}
                    {authEmployeeState?.data?.employeeId}
                  </Span>
                </FormCol>
              </FormRow>

              {/* <Span>
                <pre>{JSON.stringify(form, null, 2)}</pre>
              </Span> */}
              {/* <Span><pre>{JSON.stringify(file?.name, null, 2)}</pre></Span> */}
              {/*<Span><pre>{JSON.stringify(progress, null, 2)}</pre></Span>*/}
              {/* <Span><pre>{JSON.stringify(promptMessage, null, 2)}</pre></Span> */}
              {/* <Span><pre>{JSON.stringify(productState.data, null, 2)}</pre></Span> */}
            </FormSide>
          </FormBody>
        </FormWrapper>
        <Layout.Loading
          type={'spinningBubbles'}
          active={productState.loading}
          color={'#00719F'}
          width={100}
        />
      </Container>
    </Layout.PageLayout>
  );
};

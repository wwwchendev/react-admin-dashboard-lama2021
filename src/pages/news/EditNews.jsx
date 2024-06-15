//react
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//redux
import { useConfigs } from '../../context/ConfigsContext';
import { useSelector, useDispatch } from 'react-redux';
import { newsRequests, clearNewsError } from '@/store/news';
import { uploadFailed, uploadSuccess, initFileState } from '@/store/file';
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
} from '@/components/common';
import { Edit, Delete, ArrowRight } from '@material-ui/icons';
const {
  FormWrapper,
  FormRadioWrapper,
  FormBody,
  FormRow,
  FormCol,
  FormTitle,
  FormSide,
} = Form;
//utility
import { uploadImage } from '../../utils/uploadFile';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;
export const EditNews = () => {
  const navigator = useNavigate();
  const { id } = useParams();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const fileState = useSelector(state => state.file);
  const newsState = useSelector(state => state.news);
  const currentData = newsState.data.find(item => item.newsNumber === id);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const initialFormData = {
    newsNumber: currentData?.newsNumber,
    title: currentData?.title,
    description: currentData?.description,
    coverImage: currentData?.coverImage,
    richContent: currentData?.richContent,
    display: currentData?.display.toString(),
    createdBy: currentData?.createdBy,
  };
  const [form, setForm] = useState(initialFormData);
  //表單提示
  const initPromptMessage = { default: '' };
  const [promptMessage, setPromptMessage] = useState(initPromptMessage);
  //狀態管理
  const [operateType, setOperateType] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [uploadClicked, setUploadClicked] = useState(false);
  const [displayRadioChecked, setDisplayRadioChecked] = useState(form.display);

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState({
    started: false,
    percent: 0,
    status: '',
  });

  useEffect(() => {
    setCurrentPage('/news');
    dispatch(initFileState());
  }, []);

  useEffect(() => {
    if (operateType === 'deleteNews') {
      if (submitClicked & (newsState.error === null)) {
        const confirmed = confirm('已刪除文章');
        if (confirmed) {
          navigator('/news');
        }
      }
    } else if (operateType === 'updateNews') {
      if (submitClicked & (newsState.error === null)) {
        alert('已更新文章');
      }
    }
  }, [newsState.data]);

  useEffect(() => {
    if (uploadClicked && fileState.data && !fileState.error) {
      setProgress(prev => ({ ...prev, status: `上傳成功✓` }));
      setForm(prevState => ({
        ...prevState,
        coverImage: fileState?.data.imageUrl,
      }));
    }
  }, [fileState.data]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    if (authEmployeeState.error) {
      setSubmitClicked(false);
      dispatch(clearNewsError());
    }
    setPromptMessage(initPromptMessage);
    if (name === 'coverImage') {
      setFile(e.target.files[0]);
      dispatch(initFileState());
      setUploadClicked(false);
      setForm(prevState => ({
        ...prevState,
        coverImage: '',
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      setProgress(prev => ({ started: false, percent: 0, status: `尚未上傳` }));
      return;
    }
    if (name === 'display') {
      setDisplayRadioChecked(value);
    }
    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    const {
      newsNumber,
      title,
      description,
      coverImage,
      richContent,
      display,
      createdBy,
    } = form;
    setOperateType('updateNews');
    if (
      title !== '' &&
      description !== '' &&
      coverImage !== '' &&
      richContent !== ''
    ) {
      setSubmitClicked(true);
      const newData = {
        'title': title,
        'description': description,
        'coverImage': coverImage,
        'richContent': richContent,
        'display': display,
        'createdBy': createdBy,
      };
      await dispatch(newsRequests.update(TOKEN, currentData._id, newData));
    } else {
      const requireField = [
        'title',
        'description',
        'coverImage',
        'richContent',
      ];
      requireField.forEach((f, idx) => {
        let emptyField;
        switch (f) {
          case 'title':
            emptyField = '文章標題欄位';
            break;
          case 'description':
            emptyField = '簡短描述欄位';
            break;
          case 'coverImage':
            emptyField = '封面圖片欄位';
            break;
          case 'richContent':
            emptyField = '文章內容欄位';
            break;
          default:
            return;
        }
        if (form[f] === '') {
          setPromptMessage(prev => {
            return { ...prev, [f]: `${emptyField}不得為空` };
          });
        }
      });
    }
  };
  //上傳圖片
  const handleUpload = async e => {
    setPromptMessage(initPromptMessage);
    if (!file) {
      setPromptMessage(prev => ({ ...prev, 'coverImage': `未選取任何檔案` }));
      return;
    }
    const filePath = `/news/${form.newsNumber}`;
    const onUploadProgress = progressEvent => {
      setProgress(prev => ({ ...prev, percent: progressEvent.progress * 100 }));
    };
    try {
      setUploadClicked(true);
      const response = await uploadImage(
        TOKEN,
        file,
        filePath,
        onUploadProgress,
      );
      const result = response.data;
      setProgress(prev => ({ ...prev, started: true, status: `正在上傳...` }));
      dispatch(uploadSuccess(result));
    } catch (error) {
      setUploadClicked(false);
      dispatch(uploadFailed(error));
    }
  };

  return (
    <Layout.PageLayout>
      <SEO title='編輯消息 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>
            最新消息
            <ArrowRight />
            編輯
          </h1>

          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                setOperateType('deleteNews');
                const confirmed = confirm(
                  `確定要【刪除】最新消息 ${form.title} 嗎`,
                );
                if (confirmed) {
                  setSubmitClicked(true);
                  dispatch(newsRequests.delete(TOKEN, currentData._id));
                }
              }}
              $bg={'#d15252'}
              $animation
            >
              刪除
            </Button>
            <Button
              type='button'
              onClick={() => {
                const confirmed = confirm(
                  '確定要【返回】嗎? 請確保當前文章已保存',
                );
                if (confirmed) {
                  navigator('/news');
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
              $bg={'#5cc55f'}
              $animation
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
                  <label>文章標題</label>
                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.title || newsState.error?.errors.title) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='title'
                      type='text'
                      placeholder=''
                      onChange={handleFormChange}
                      value={form.title}
                      disabled={
                        operateType === 'deleteNews' &&
                        submitClicked &&
                        !newsState.error
                      }
                    />
                    <Span $color={'#d15252'}>{promptMessage?.title}</Span>
                    <Span $color={'#d15252'}>
                      {newsState.error?.errors.title}
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>簡短描述</label>

                  <InputWrapper
                    $height={'2.5rem'}
                    $spanOffset={'-1.2rem'}
                    $border={
                      (promptMessage?.description ||
                        newsState.error?.errors.description) &&
                      '2px solid #d15252'
                    }
                  >
                    <Input
                      name='description'
                      type='text'
                      placeholder=''
                      onChange={handleFormChange}
                      value={form.description}
                      disabled={
                        operateType === 'deleteNews' &&
                        submitClicked &&
                        !newsState.error
                      }
                    />
                    <Span $color={'#d15252'}>{promptMessage?.description}</Span>
                    <Span $color={'#d15252'}>
                      {newsState.error?.errors.description}
                    </Span>
                  </InputWrapper>
                </FormCol>
              </FormRow>

              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>封面圖片</label>
                  <Flexbox $direction={'column'} $alignItems={'flex-start'}>
                    <Flexbox $gap={'0.5rem'}>
                      <InputWrapper
                        $height={'2.5rem'}
                        $spanOffset={'-1.2rem'}
                        $border={
                          (promptMessage?.coverImage ||
                            newsState.error?.errors.coverImage) &&
                          '2px solid #d15252'
                        }
                      >
                        <Input
                          name='coverImage'
                          type='file'
                          placeholder=''
                          onChange={handleFormChange}
                          // value={form.coverImage}
                          disabled={
                            operateType === 'deleteNews' &&
                            submitClicked &&
                            !newsState.error
                          }
                        />
                      </InputWrapper>
                      <Button
                        type='button'
                        onClick={handleUpload}
                        $border={'1px solid #5cc55f'}
                        $bg={'transparent'}
                        $color={'#5cc55f'}
                        $padding={'0.6rem '}
                        disabled={
                          operateType === 'deleteNews' &&
                          submitClicked &&
                          !newsState.error
                        }
                      >
                        上傳
                      </Button>
                    </Flexbox>
                    <Span $color={'#d15252'}>{promptMessage?.coverImage}</Span>
                    <Flexbox
                      $gap={'0.25rem'}
                      $direction={'column'}
                      $justifyContent={'flex-start'}
                      $alignItems={'flex-start'}
                      $margin={'1rem 0 0 0'}
                    >
                      {/* 圖片預覽 */}
                      {!imagePreview && (
                        <img
                          src={`${import.meta.env.VITE_APIURL}/file${form.coverImage}`}
                          alt='Preview'
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      )}
                      {imagePreview && !uploadClicked && (
                        <img
                          src={imagePreview}
                          alt='Preview'
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      )}
                      {imagePreview && uploadClicked && (
                        <img
                          src={`${import.meta.env.VITE_APIURL}/file${form.coverImage}`}
                          alt='Preview'
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      )}

                      {/* 進度條 */}
                      <Flexbox
                        $gap={'0.25rem'}
                        $alignItems={'flex-start'}
                        $justifyContent={'flex-start'}
                      >
                        <Span>
                          {progress.started && (
                            <progress max='100' value={progress.percent} />
                          )}
                        </Span>
                        <Span
                          $color={
                            (progress?.status === '尚未上傳' && '#d15252') ||
                            (progress?.status === '上傳成功✓' && '#257cff') ||
                            (progress?.status === '上傳失敗' && '#d15252')
                          }
                        >
                          {progress?.status}
                        </Span>
                      </Flexbox>
                    </Flexbox>
                  </Flexbox>
                </FormCol>
              </FormRow>
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>文章內容</label>
                  <Flexbox $direction={'column'} $alignItems={'flex-start'}>
                    <CustomJoditEditor
                      placeholder={null}
                      state={form.richContent}
                      setState={value => {
                        setForm(prevState => ({
                          ...prevState,
                          richContent: value,
                        }));
                      }}
                      $height={'280px'}
                      disabled={
                        operateType === 'deleteNews' &&
                        submitClicked &&
                        !newsState.error
                      }
                    />
                    <Span $color={'#d15252'}>{promptMessage?.richContent}</Span>
                    <Span $color={'#d15252'}>
                      {newsState.error?.errors.richContent}
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
                        onChange={handleFormChange}
                        checked={displayRadioChecked === 'true'}
                        disabled={submitClicked && !newsState.error}
                      />
                      <label htmlFor='show'>顯示</label>
                    </FormRadioWrapper>
                    <FormRadioWrapper>
                      <Input
                        type='radio'
                        id='hidden'
                        name='display'
                        value='false'
                        onChange={handleFormChange}
                        checked={displayRadioChecked === 'false'}
                        disabled={submitClicked && !newsState.error}
                      />
                      <label htmlFor='hidden'>隱藏</label>
                    </FormRadioWrapper>
                    <Span $color={'#d15252'}>{promptMessage?.display}</Span>
                    <Span $color={'#d15252'}>
                      {newsState.error?.errors.display}
                    </Span>
                  </Flexbox>
                </FormCol>
              </FormRow>
              <FormRow>
                <FormCol $minWidth={'5rem'}>
                  <label>最後更新</label>
                  <Span>
                    {currentData?.lastEditerName} / {currentData?.lastEditedBy}
                  </Span>
                </FormCol>
              </FormRow>
              {/* <Span><pre>{JSON.stringify(promptMessage, null, 2)}</pre></Span>
              <Span><pre>{JSON.stringify(form, null, 2)}</pre></Span> */}
            </FormSide>
          </FormBody>
        </FormWrapper>
      </Container>
    </Layout.PageLayout>
  );
};

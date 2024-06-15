//react
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const AddNews = () => {
  const navigator = useNavigate();
  //Redux
  const dispatch = useDispatch();
  const { setCurrentPage } = useConfigs();
  const newsState = useSelector(state => state.news);
  const fileState = useSelector(state => state.file);
  //TOKEN
  const authEmployeeState = useSelector(state => state.authEmployee);
  const TOKEN = authEmployeeState.data?.accessToken;
  //表單管理
  const generateDefaultNewsNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const newPrefixChars = year + month;
    try {
      let defaultNumber;
      const news = newsState.data;
      const latestNews = news[0];

      if (latestNews) {
        const lastNewsNumber = latestNews.newsNumber;
        const prefixChars = lastNewsNumber.substring(0, 6);
        const lastChars = lastNewsNumber.substring(lastNewsNumber.length - 2);

        if (newPrefixChars === prefixChars) {
          const number = (parseInt(lastChars) + 1).toString().padStart(3, '0');
          defaultNumber = `${year}${month}${number}`;
        } else {
          defaultNumber = `${year}${month}001`;
        }
      } else {
        defaultNumber = `${year}${month}001`;
      }

      return defaultNumber;
    } catch (error) {
      console.log(error);
      throw new Error('生成文章編號失敗');
    }
  };
  const initialFormData = {
    newsNumber: generateDefaultNewsNumber(),
    title: '',
    description: '',
    coverImage: '',
    richContent: '',
    display: 'true',
    createdBy: authEmployeeState.data?.employeeId,
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
    if (operateType === 'addNews') {
      if (submitClicked & (newsState.error === null)) {
        const confirmed = confirm('已新增文章');
        if (confirmed) {
          navigator('/news');
        }
      }
    }

    if (uploadClicked && fileState.data && !fileState.error) {
      setProgress(prev => ({ ...prev, status: `上傳成功✓` }));
      setForm(prevState => ({
        ...prevState,
        coverImage: fileState?.data.imageUrl,
      }));
    }
  }, [fileState.data, newsState.data]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    if (newsState.error) {
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
    setOperateType('addNews');
    if (
      title !== '' &&
      description !== '' &&
      coverImage !== '' &&
      richContent !== ''
    ) {
      setSubmitClicked(true);
      const newData = {
        'newsNumber': newsNumber,
        'title': title,
        'description': description,
        'coverImage': coverImage,
        'richContent': richContent,
        'display': display,
        'createdBy': createdBy,
      };
      await dispatch(newsRequests.add(TOKEN, newData));
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
      <SEO title='新增消息 | 漾活管理後台' description={null} url={null} />
      <Container>
        <TitleContainer>
          <h1>
            最新消息
            <ArrowRight />
            新增
          </h1>
          <Flexbox $justifyContent={'flex-end'} $gap={'1rem'}>
            <Button
              type='button'
              onClick={() => {
                const confirmed = confirm('確定要返回嗎? 請確保當前文章已保存');
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
                      disabled={submitClicked && !newsState.error}
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
                      disabled={submitClicked && !newsState.error}
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
                          disabled={submitClicked && !newsState.error}
                        />
                      </InputWrapper>
                      <Button
                        type='button'
                        onClick={handleUpload}
                        $border={'1px solid #5cc55f'}
                        $bg={'transparent'}
                        $color={'#5cc55f'}
                        $padding={'0.6rem '}
                        disabled={submitClicked && !newsState.error}
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
                      {imagePreview && fileState.data && uploadClicked && (
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
                      disabled={submitClicked && !newsState.error}
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
                    {authEmployeeState?.data?.name} /{' '}
                    {authEmployeeState?.data?.employeeId}
                  </Span>
                </FormCol>
              </FormRow>
              {/* <Span><pre>{JSON.stringify(form, null, 2)}</pre></Span> */}
              {/*<Span><pre>{JSON.stringify(progress, null, 2)}</pre></Span>
              <Span><pre>{JSON.stringify(promptMessage, null, 2)}</pre></Span> */}
              {/* <Span><pre>{JSON.stringify(fileState.data, null, 2)}</pre></Span> */}
            </FormSide>
          </FormBody>
        </FormWrapper>
        <Layout.Loading
          type={'spinningBubbles'}
          active={newsState.loading}
          color={'#00719F'}
          width={100}
        />
      </Container>
    </Layout.PageLayout>
  );
};

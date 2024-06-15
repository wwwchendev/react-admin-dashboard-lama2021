import styled from 'styled-components';
import { tablet, mobile } from '@/utils/responsive';
import { Input } from '../Input/Input';
import { Select } from '../select/Select';

const FormWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  max-height: 75vh;
  height: 100%;
  hr {
    margin: 0.75rem 0;
  }
`;

const FormTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  margin: ${p => (p.$margin ? p.$margin : '0 0 10px 0 ')};
  /* border: 1px solid blue; */
`;

const FormBody = styled.form`
  position: ${p => (p.$position ? p.$position : '')};
  /* border: 1px solid blue; */
  display: flex;
  overflow-y: auto;
  padding: ${p => (p.$padding ? p.$padding : '0px 16px 0px 0')};
  display: flex;
  flex-direction: ${p => (p.$direction ? p.$direction : 'row')};
  align-items: flex-start;
  gap: ${p => (p.$gap ? p.$gap : '12px')};
  height: 100%;
  max-height: 100%;
  hr {
    margin: 4px 0;
  }
  ${tablet({
    flexDirection: 'column',
  })};
`;
const FormSide = styled.div`
  /* border: 1px solid blue;  */
  display: flex;
  flex-direction: column;
  gap: ${p => (p.$gap ? p.$gap : '16px')};
  flex: 1;
  max-height: 100%;
  height: 100%;
  width: 100%;
  ${tablet({
    flexDirection: 'column',
  })};
`;
const FormRow = styled.div`
  border: ${p => (p.$border ? '1px solid purple' : '')};
  display: flex;
  position: ${p => (p.$position ? p.$position : '')};
  top: ${p => (p.$top ? p.$top : '')};
  bottom: ${p => (p.$bottom ? p.$bottom : '')};
  gap: ${p => (p.$gap ? p.$gap : '8px')};
  margin: ${p => (p.$margin ? p.$margin : '')};
  margin-top: ${p => (p.$mt ? p.$mt : '')};
  justify-content: ${p => (p.$justifyContent ? p.$justifyContent : '')};
  flex-direction: ${p => (p.$direction ? p.$direction : 'row')};
  max-height: ${p => (p.$maxHeight ? p.$maxHeight : '100%')};
  width: 100%;
  ${mobile({
    flexDirection: 'column',
  })};

  table {
    border-radius: 4px;
    width: 100%;
    /* height: 200px; */
    tbody {
      height: 100%;
      /* border: 1px solid #ccc; */
    }
    th,
    td {
      border: 1px solid #ccc;
      width: 20%;
      height: 2.5rem;
      text-align: center;
      padding: 0.5rem;
    }
    input {
      font-size: 1rem;
      width: 75%;
      border-radius: 4px;
      max-width: 100%;
      border: 1px solid #ccc;
      text-align: center;
      background-color: #f1f5fd;
    }
  }
`;

const FormCol = styled.div`
  /* border: 1px solid red; */
  border: ${p => (p.$border ? '1px solid purple' : '')};
  flex-direction: ${p => (p.$direction ? p.$direction : '')};
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  gap: 8px;
  height: ${p => (p.$height ? p.$height : '')};
  min-height: ${p => (p.$minHeight ? p.$minHeight : '')};
  max-height: ${p => (p.$maxHeight ? p.$maxHeight : '')};
  margin-top: ${p => (p.$mt ? p.$mt : '')};
  label {
    /* border: 1px solid red; */
    width: ${p => (p.$width ? p.$width : '4rem')};
    min-width: ${p => (p.$minWidth ? p.$minWidth : '')};
  }
  textarea,
  input {
    width: 100%;
  }
`;

const FormRadioWrapper = styled.div`
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;

  ${Input} {
    margin-right: 3px;
  }
  label {
    cursor: pointer;
    font-size: 15px;
  }
`;

export const Form = {
  FormSide,
  FormTitle,
  FormWrapper,
  FormBody,
  FormRow,
  FormCol,
  FormRadioWrapper,
};

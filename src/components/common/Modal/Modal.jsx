import styled from 'styled-components';
import { tablet, mobile } from '@/utils/responsive';
import { Button } from '@/components/common';
import { Close } from '@material-ui/icons';
const ModalContainer = styled.div`
  display: ${props => (props.open ? 'block' : 'none')};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* border: 1px solid #20fdb4; */
`;
const CloseBtn = styled(Button)`
  position: absolute;
  background: transparent;
  border: none;
  cursor: pointer;
  top: 16px;
  right: -16px;
  color: black;
  height: 1.5rem;
`;
const ModalContent = styled.div`
  background-color: white;
  /* border: 1px solid #20fdb4; */
  overflow: hidden;
  border-radius: 8px;
  padding: ${p => (p.$padding ? p.$padding : '25px')};
  width: 100%;
  max-width: ${p => (p.$maxWidth ? p.$maxWidth : '35%')};
  height: ${p => (p.$height ? p.$height : 'auto')};
  max-height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${tablet({
    width: '60%',
    maxHeight: '80%',
    maxWidth: '100%',
  })};
  ${mobile({
    width: '90%',
    padding: '20px 10px',
  })};
`;

export const Modal = ({
  open,
  onClose,
  children,
  $maxWidth,
  $height,
  $padding,
}) => {
  return (
    <ModalContainer open={open}>
      <ModalContent $maxWidth={$maxWidth} $height={$height} $padding={$padding}>
        {children}
        <CloseBtn onClick={onClose} $animation>
          <Close />
        </CloseBtn>
      </ModalContent>
    </ModalContainer>
  );
};

/* eslint-disable no-unused-vars */
import ReactLoading from 'react-loading';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  /* border: 10px solid red; */
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(1.5px);
  z-index: 9;
  inset: 0;
`;

export const Loading = ({ active, type, color, delay, height, width }) => {
  // type LoadingType = "blank" | "balls" | "bars" | "bubbles" | "cubes" | "cylon" | "spin" | "spinningBubbles" | "spokes";
  return (
    <>
      {active && (
        <Container>
          <ReactLoading
            type={type ? type : 'bubbles'}
            color={color ? color : '#b2a963'}
            height={height ? height : 60}
            width={width ? width : 150}
          />
        </Container>
      )}
    </>
  );
};

import React from "react";
import styled from "styled-components";

const CloseR = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  return <StyledCloseR {...props} ref={ref} icon-role="close-r" />;
});
export default CloseR;

const StyledCloseR = styled.i`
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
  &::after,
  &::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 17px;
    height: 2px;
    background: currentColor;
    transform: rotate(45deg);
    border-radius: 5px;
    top: 9px;
    left: 2px;
  }
  &::after {
    transform: rotate(-45deg);
  }
`;

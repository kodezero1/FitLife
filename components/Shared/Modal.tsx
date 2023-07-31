import { useRef, useEffect } from "react";
import styled from "styled-components";
import useLockedBody from "../hooks/useLockedBody";

interface Props {
  children: React.ReactNode;
  removeModal: () => void;
  isOpen: any;
}

const Modal: React.FC<Props> = ({ children, removeModal, isOpen }) => {
  const shadow = useRef<HTMLDivElement>(null);

  const [_, setLocked] = useLockedBody(isOpen);

  const handleShadowClick = (e) => {
    e.stopPropagation();
    if (e.target.classList.contains(`modal_overlay_shadow`)) removeModal();
  };

  useEffect(() => {
    if (isOpen) setLocked(true);
    return () => setLocked(false);
  }, [isOpen]);

  return isOpen ? (
    <Shadow ref={shadow} className={`modal_overlay_shadow`} onClick={handleShadowClick}>
      {children}
    </Shadow>
  ) : (
    <></>
  );
};
export default Modal;

const Shadow = styled.div`
  position: fixed;
  left: 0;
  top: -20px; // To account for animation slideUp
  height: calc(100vh + 20px); // Also to account for animation slideUp
  width: 100%;
  padding-top: 20px; // And another
  background: ${({ theme }) => theme.opacityBackground};
  z-index: 99998;
  animation: slideUp 0.3s ease;
  transition: all 0.5s ease-in;

  touch-action: none;
  -webkit-overflow-scrolling: none;
  overflow: hidden;
  overscroll-behavior: none;
`;

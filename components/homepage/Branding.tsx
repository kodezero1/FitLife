import styled from "styled-components";
import Image from "next/image";
import { useThemeState } from "../Themes/useThemeState";

const Branding: React.FC = () => {
  const { theme } = useThemeState();

  return (
    <Brand>
      <div className={theme.type === "dark" ? "dark" : "light"}>
        <Image src="/favicon.png" height="100" width="100" alt="Lift Club Logo" priority />
      </div>

      <h1 className="heading-gradient">FitLife</h1>
    </Brand>
  );
};
export default Branding;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 5rem;

  div {
    img {
      height: 80px;
      width: 80px;
      display: block;
      max-height: 100%;
    }
  }

  &.dark img {
    opacity: 0.8;
  }

  h1 {
    width: max-content;
    letter-spacing: 1px;
    font-weight: 500;
    font-size: 3rem;
  }
`;

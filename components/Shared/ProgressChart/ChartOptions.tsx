import styled, { css } from "styled-components";

const options = [
  { value: "avg", text: "Average" },
  { value: "total", text: "Volume" },
  { value: "max", text: "Max" },
];

interface Props {
  setStatOption: React.Dispatch<React.SetStateAction<"avg" | "total" | "max">>;
  statOption: "avg" | "total" | "max";
}

const ChartOptions: React.FC<Props> = ({ setStatOption, statOption }) => {
  const handleButtonClick = (e) => {
    setStatOption(e.target.value);
  };

  return (
    <Buttons xPos={options.findIndex(({ value }) => value === statOption) * 33.33}>
      {options.map(({ value, text }) => (
        <button
          key={value}
          onClick={handleButtonClick}
          value={value}
          className={statOption === value ? "highlight" : ""}
        >
          {text}
        </button>
      ))}
    </Buttons>
  );
};
export default ChartOptions;

const Buttons = styled.div<{ xPos: number }>`
  height: 30px;
  display: flex;
  width: 100%;
  margin: 0 auto 0.5rem;
  position: relative;

  button {
    background: transparent;
    flex: 1;
    font-weight: 300;
    font-size: 0.8rem;
    padding: 0.25rem;
    color: ${({ theme }) => theme.textLight};
    border: none;
    transition: all 0.2s ease;
    border-radius: 0 0 5px 5px;

    &.highlight {
      color: ${({ theme }) => theme.text};
      font-weight: 400;
    }
  }
  ${({ xPos }) => css`
    &::after {
      pointer-events: none;
      transition: all 0.2s ease;
      border-radius: 0 0 5px 5px;
      content: "";
      left: ${xPos}%;
      position: absolute;
      height: 100%;
      width: 33.33%;
      background-color: ${({ theme }) => theme.medOpacity};
    }
  `}
`;

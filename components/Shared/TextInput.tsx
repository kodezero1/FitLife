import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useDebouncedState from "../hooks/useDebouncedState";

interface Props {
  onChange: (inputText: string) => void;
  onFocus?: (inputText: string) => void;
  onBlur?: (inputText: string) => void;
  inputName: string;
  debounceTime?: number;
  labelText?: string;
  placeholder?: string;
  autoComplete?: boolean;
}

const TextInput: React.FC<Props> = ({
  onChange,
  onFocus,
  onBlur,
  inputName,
  debounceTime = 0,
  labelText,
  placeholder,
  autoComplete = true,
}) => {
  const router = useRouter();

  const textInput = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const debouncedText = useDebouncedState(text, debounceTime);

  const handleTermChange = useCallback(
    ({ target }) => {
      setText(target.value);
    },
    [setText]
  );

  const handleXClick = () => {
    setText("");
    textInput.current?.focus();
  };

  useEffect(() => {
    onChange(debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    setText("");
  }, [router]);

  return (
    <InputContainer className="TextInput">
      <label htmlFor={inputName}>{labelText}</label>

      <div className="input-bar">
        <input
          ref={textInput}
          type="text"
          value={text}
          onChange={handleTermChange}
          onFocus={() => onFocus && onFocus(text)}
          onBlur={() => onBlur && onBlur(text)}
          name={inputName}
          className="text-input"
          placeholder={placeholder}
          autoComplete={autoComplete?.toString()}
        />

        <span onClick={handleXClick} className={`clear-btn ${text.length ? "highlight" : ""}`}>
          ✕
        </span>
      </div>
    </InputContainer>
  );
};

export default TextInput;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
  padding: 0.25rem;

  label {
    font-weight: 300;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
  }

  .input-bar {
    display: flex;
    align-items: center;

    .text-input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      font-size: inherit;
      font-weight: 400;

      flex: 1;
      width: 100%;
      background: transparent;
      border: none;
      padding: 0.25rem 0.25rem;
      color: inherit;
      border-radius: 0;
      border: 1px solid transparent;
      border-bottom: 1px solid ${({ theme }) => theme.border};
      box-shadow: none;

      &:focus {
        outline: none;
        border-radius: 5px;
        border: 1px solid ${({ theme }) => theme.accent};
        background: ${({ theme }) => theme.medOpacity};
      }
      &::placeholder {
        color: ${({ theme }) => theme.border};
      }
      &:focus::placeholder {
        color: ${({ theme }) => theme.textLight};
      }
    }
    .clear-btn {
      position: absolute;
      right: 0.23rem;
      opacity: 0;
      text-align: center;
      padding: 0 6px;
      transition: all 0.25s ease;
      cursor: pointer;
      color: ${({ theme }) => theme.textLight};

      &.highlight {
        opacity: 1;
      }
    }
  }
`;

import Link from "next/link";
import React, { CSSProperties } from "react";
import styled from "styled-components";

interface Props {
  path: string;
  label: string;
  style?: CSSProperties;
}

const LinkButton = ({ path, label, style }: Props) => {
  return (
    <Link href={path} passHref>
      <StyledLink style={style} className="button-press">
        {label}
      </StyledLink>
    </Link>
  );
};

export default LinkButton;

const StyledLink = styled.a`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.medOpacity};
  border: 1px solid ${({ theme }) => theme.accent};
  padding: 0.4rem 1rem;
  border-radius: 5px;
  transition: all 0.2s ease;

  @media screen and (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

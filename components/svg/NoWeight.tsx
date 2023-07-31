import React from "react";

type Props = {
  height?: number;
  width?: number;
  color?: string;
};

const NoWeight = ({ height = 20, width = 20, color = "currentColor" }: Props) => {
  return (
    <svg
      height={height}
      width={width}
      stroke={color}
      fill="none"
      strokeWidth="1"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M2 12h1"></path>
      <path d="M6 8h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h2"></path>
      <path d="M6.298 6.288a0.997 .997 0 0 0 -.298 .712v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-8"></path>
      <path d="M9 12h3"></path>
      <path d="M15 15v2a1 1 0 0 0 1 1h1c.275 0 .523 -.11 .704 -.29m.296 -3.71v-7a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1v4"></path>
      <path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1"></path>
      <path d="M22 12h-1"></path>
      <path d="M3 3l18 18"></path>
    </svg>
  );
};

export default NoWeight;

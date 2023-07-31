interface Props {
  color?: string;
}

const Expand: React.FC<Props> = ({ color = "currentColor" }) => {
  return (
    <svg width="21px" height="21px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <g
        fill="none"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(1 2)"
      >
        <path d="m.5.5v16.021" />
        <path d="m18.5.5v16.021" />
        <path d="m12.507 12.515 4-4-4-4.015" />
        <path d="m6.507 12.515-4-4 4-4.015" />
        <path d="m16.5 8.5h-14" />
      </g>
    </svg>
  );
};

export default Expand;

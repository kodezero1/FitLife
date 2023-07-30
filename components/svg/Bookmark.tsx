interface Props {
  color?: string;
  filled?: boolean;
}

const Bookmark: React.FC<Props> = ({ color = "currentColor", filled = false }) => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 3H7a2 2 0 0 0-2 2v15.138a.5.5 0 0 0 .748.434l5.26-3.005a2 2 0 0 1 1.984 0l5.26 3.006a.5.5 0 0 0 .748-.435V5a2 2 0 0 0-2-2z"
        fill={filled ? color : ""}
      />
    </svg>
  );
};

export default Bookmark;

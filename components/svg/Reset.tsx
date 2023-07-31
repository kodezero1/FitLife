interface Props {
  color?: string;
}

const Reset: React.FC<Props> = ({ color = "currentColor" }) => {
  return (
    <svg
      x="0px"
      y="0px"
      width="17px"
      height="17px"
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <path d="M218.39,320.61,246.77,349H157a93,93,0,0,1,0-186h18V133H157a123,123,0,0,0,0,246h89.77l-28.38,28.38,21.22,21.23L304.22,364l-64.61-64.61Z" />
      <path d="M355,133H265.23l28.38-28.38L272.39,83.39,207.78,148l64.61,64.61,21.22-21.22L265.23,163H355a93,93,0,0,1,0,186H336.44v30H355a123,123,0,0,0,0-246Z" />
    </svg>
  );
};

export default Reset;

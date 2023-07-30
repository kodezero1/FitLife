import router from "next/router";
import React from "react";
import { demoLogin, useUserDispatch } from "../../store";

type Props = {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const DemoLoginButton = ({ setLoading }: Props) => {
  const dispatch = useUserDispatch();

  const handleDemoLogin = async () => {
    setLoading && setLoading(true);
    const response = await demoLogin(dispatch);
    if (response._id) {
      localStorage.setItem("demo-welcome", "true");
      router.push(`/log`);
    } else {
      setLoading && setLoading(false);
    }
  };

  return (
    <button className="demo-account" type="button" onClick={handleDemoLogin}>
      Try Demo Account
    </button>
  );
};

export default DemoLoginButton;

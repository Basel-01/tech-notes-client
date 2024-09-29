import { useState, useEffect } from "react";

const useRememberMe = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    const savedRememberMe = localStorage.getItem("remember-me");
    if (savedRememberMe && ["true", "false"].includes(savedRememberMe)) {
      return JSON.parse(savedRememberMe);
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("remember-me", JSON.stringify(rememberMe));
  }, [rememberMe]);

  return [rememberMe, setRememberMe];
};

export default useRememberMe;

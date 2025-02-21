import { useEffect, useRef } from "react";

const Timer = ({ refreshRate, onRefresh }) => {
  const intervalRef = useRef();

  useEffect(() => {
    if (refreshRate > 0) {
      intervalRef.current = setInterval(onRefresh, refreshRate);
    }
    return () => clearInterval(intervalRef.current);
  }, [refreshRate, onRefresh]);

  return null;
};

export default Timer;
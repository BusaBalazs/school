import { useState, useEffect } from "react";

import { useCtx } from "../context/context";

//-----------------------------------------------------------
const displayTime = (unit) => {
  return unit < 10 ? `0${unit}` : unit;
};

//-----------------------------------------------------------
//-----------------------------------------------------------
const Timer = ({ isEnd, ...props }) => {
  const { getFinalTime, isStart } = useCtx();

  const [elapsedTime, setElapsedTime] = useState({
    sec: 0,
    min: 0,
    hour: 0,
  });

  //-----------------------------------------------------------
  useEffect(() => {
    if (isStart) {
      const time = setInterval(() => {
        const getStatus = JSON.parse(localStorage.getItem("status"));
        let getTime = getStatus.time;
        getTime.sec++;
        if (getTime.sec >= 60) {
          getTime.min++;
          getTime.sec = 0;
        }

        if (getTime.min >= 60) {
          getTime.hour++;
          getTime.min = 0;
        }

        window.localStorage.setItem(
          "status",
          JSON.stringify({ ...getStatus, time: getTime })
        );

        setElapsedTime(getTime);
      }, 1000);
      //-----------------------------------------------------
      //get the final time throughout the context.jsx when the last qr code was written
      //and stop the timer

      if (isEnd) {
        const getStatus = JSON.parse(localStorage.getItem("status"));
        getFinalTime(getStatus.time);
        clearInterval(time);
      }

      return () => {
        clearInterval(time);
      };
    }
  }, [isStart, isEnd]);

  //-----------------------------------------------------------
  return (
    <p {...props}>{`${displayTime(elapsedTime.hour)}:${displayTime(
      elapsedTime.min
    )}:${displayTime(elapsedTime.sec)}`}</p>
  );
};

export default Timer;

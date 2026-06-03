import React, { useEffect, useRef } from "react";
import gsap from "gsap";

//-----------------------------------------------------------------

import classes from "./Process.module.css";

//-----------------------------------------------------------------//-----------------------------------------------------------------
const Process = ({ numOfQuestion, numOfAllQuestion }) => {
  const indicator = useRef();

  useEffect(() => {
    const calculatedWidth = ((numOfQuestion + 1) / (numOfAllQuestion + 1)) * 100;

    gsap.to("#process", {
      width: `${calculatedWidth}%`,
      delay: 1,
    });
  }, [numOfQuestion]);

  //--------------------------------------------------------------
  return (
    <section className={classes["process-container"]}>
      <div className={classes["process-indicator-container"]}>
        <div className={classes["process-lines-container"]}>
          <p className={classes["num-of-question"]}>{`${
            numOfQuestion + 1
          } / ${numOfAllQuestion + 1}`} kérdés</p>
          <span
            id="process"
            ref={indicator}
            className={classes["process-indicator-blue"]}
          />
          <span className={classes["process-indicator-white"]} />
        </div>
      </div>
    </section>
  );
};

export default Process;

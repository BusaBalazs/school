import React from "react";
import { useNavigate } from "react-router";
//-----------------------------------------------------------------
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";

import { useCtx } from "../context/context";

import { imgWand, imgDiploma } from "../assets";

import classes from "./Diploma.module.css";

//-----------------------------------------------------------------
//-----------------------------------------------------------------
const Diploma = () => {
  const { diplomaData, restart } = useCtx();
  const navigate = useNavigate();

  const handleRestart = () => {
    restart();
    navigate("/");
  };

  //--------------------------------------------------------------
  // downnload diploma
  const handleCapture = async () => {
    const diplomaContainer = document.querySelector("#diploma");

    const canvas = await html2canvas(diplomaContainer, {
      backgroundColor: null,
    });

    const dataURL = canvas.toDataURL("image/png");
    downloadjs(dataURL, "magic_diploma.png", "image/png");
  };

  const diplomaTime = diplomaData && {
    hour:
      diplomaData.time.hour < 10
        ? `0${diplomaData.time.hour}`
        : diplomaData.time.hour,
    min:
      diplomaData.time.min < 10
        ? `0${diplomaData.time.min}`
        : diplomaData.time.min,
    sec:
      diplomaData.time.sec < 10
        ? `0${diplomaData.time.sec}`
        : diplomaData.time.sec,
  };
  return (
    <section className={classes["diploma-section-bg"]}>
      <div className={classes["header-container"]}>
        <h2>gratulálunk</h2>
      </div>
      <p className={classes["diploma-text"]}>Végigmentél minden állomáson!</p>
      <p className={classes["diploma-text"]}>
        Kaptál pár tippet, hogyan bánhatsz okosabban a pénzel.
      </p>
      <div id="diploma" className={classes["diploma-container"]}>
        <div className={classes["diploma-text-container"]}>
          <p>
            <span className={classes["time"]}>
              <span>
                {diplomaData &&
                  `${diplomaTime.hour}:${diplomaTime.min}:${diplomaTime.sec}`}
              </span>
            </span>{" "}
            idő alatt teljesítetted a feladatokat
          </p>
        </div>
      </div>

      {/* <button
        onClick={handleRestart}
        className={`${classes["leader-board-btn"]} btn`}
      >
        ok
      </button> */}
    </section>
  );
};

export default Diploma;

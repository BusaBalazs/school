import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
  useEffect,
} from "react";

import downloadjs from "downloadjs";
import html2canvas from "html2canvas";

//-----------------------------------------------------------------

import Reader from "./Reader.jsx";

import classes from "./Modal.module.css";

import { useCtx } from "../context/context.jsx";

import { imgWand, maps } from "../assets/index.js";


//-----------------------------------------------------------------
//-----------------------------------------------------------------

const Modal = forwardRef(({ getScanId, modalText, actualQuestionNum }, ref) => {
  const [id, setId] = useState();
  const dialog = useRef();
  const [isScan, setIsScan] = useState(false);
  const { isEnd, finalTime, restart } = useCtx();
  //-----------------------------------------------------------------
  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        setIsScan(false);
        dialog.current.close();
      },
    };
  });

  const handlScan = () => {
    setIsScan(true);
  };

  const handleScanId = (result) => {
    getScanId(result);
  };

  const handleRestart = () => {
    restart();
  };

  //-----------------------------------------------------------------
  // get question id

  useEffect(() => {
    const getStatus = JSON.parse(localStorage.getItem("status"));
    setId(getStatus.questionId);
  }, []);

  //-----------------------------------------------------------------
  const handleCapture = async () => {
    const dialog = document.querySelector(".modal");
    console.log(dialog);
    const canvas = await html2canvas(dialog);
    const dataURL = canvas.toDataURL("image/png");
    downloadjs(dataURL, "potter.png", "image/png");
  };

  //-----------------------------------------------------------------
  return (
    <dialog className="modal" ref={dialog}>
      <div className={classes["modal-content"]}>
        {isScan && <Reader scanId={handleScanId} />}
        {!isScan && !isEnd && (
          <>
            <div>
              <h2
                className={`${classes["code-scan-modal-title"]} ${
                  !modalText.qr ? classes.alert : null
                }`}
              >
                {modalText.title}
              </h2>

              <p
                className={`${!modalText.qr ? classes.alert : null} ${
                  classes["feedback-p"]
                }`}
              >
                {modalText.paragraphe}
              </p>
            </div>
            <div className={classes["map-img-container"]}>
              <img src={id && maps[id[actualQuestionNum]]} alt="map" className={classes["map-img"]} />
            </div>
            <div>
              <button onClick={handlScan} className="btn-big">
                jel beolvasás
              </button>
              {/* {!isEnd && <button onClick={onCancel}>Vissza</button>} */}
            </div>
          </>
        )}
        {isEnd && (
          <>
            <h2>Szuper vagy!</h2>
            <img
              src={imgWand}
              className={classes["magic-wand-img"]}
              alt="magic wand"
            />
            {finalTime && (
              <p className={classes["final-time"]}>{`Az időd: ${finalTime}`}</p>
            )}
            <button onClick={handleRestart} className={classes["restart-btn"]}>
              Újra játszok
            </button>
            <button onClick={handleCapture}>pic</button>
          </>
        )}
      </div>
    </dialog>
  );
});

export default Modal;

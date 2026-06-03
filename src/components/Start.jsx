import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap/gsap-core";

import { detectBrowser } from "../utility/detectBrowser";
import { useCtx } from "../context/context";

import classes from "./Start.module.css";

//------------------------------------------------------------------
//******************************************************************
//------------------------------------------------------------------
// if the app is running on a not supported browser
const UnkownBrowser = () => {
  const [isCopy, setIsCopy] = useState(false);

  //------------------------------------------------------------------
  // Check if the browser is one of the specified ones
  const copyToClipboard = () => {
    const url = "https://penzugy-kviz.netlify.app/";
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(url)
        .then(() => setIsCopy(true))
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      // Create a temporary input to select and copy
      const tempInput = document.createElement("input");
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand("copy");
        setIsCopy(true);
      } catch (err) {
        setIsCopy(false);
        alert("Másold ki a linket kézzel: " + url);
      }
      document.body.removeChild(tempInput);
    }
  };

  return (
    <div className={classes["wrong-browser-container"]}>
      <div id="hero-gsap" className={classes["wrong-browser-content"]}>
        <h1>ISMERETLEN BÖNGÉSZŐ</h1>
        <p>
          Olyan böngészőt használsz, mely nem felel meg ennek az alkalmazásnak a
          futtatásához.
        </p>
        <p>
          Kérlek a "Link másolása" gombbal másold ki a linkek és nyisd meg másik
          böngészőben. Pl.: Chrome, Safari, Firefox, Opera."
        </p>
        <button onClick={copyToClipboard}>Link másolása</button>
        {isCopy && (
          <p className={classes["succes-copy-text"]}>
            Link másolva a vágólapra!
          </p>
        )}
      </div>
    </div>
  );
};

//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------
const Start = () => {
  const leaderboard = useRef();
  const navigate = useNavigate();

  const browser = detectBrowser();
 
  //from context.jsx
  const { startGame } = useCtx();

  useEffect(() => {
    const loaded = () => {
      gsap.fromTo(
        "#start-btn",
        {
          scale: 0.5,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          ease: "expo.out",
          duration: 1,
          delay: 0.3,
        }
      );
    };

    if (document.readyState === "complete") {
      loaded();
    } else {
      window.addEventListener("load", loaded);

      return () => {
        window.removeEventListener("load", loaded);
      };
    }
  }, []);

  //-----------------------------------------------------------

  //invoke the startGame function in context.jsx
  const handleStart = () => {
    startGame();
    navigate("/questions");
  };

  //-----------------------------------------------------------
  return (
    <>
      {!browser ? (
        <UnkownBrowser />
      ) : (
        <section className={classes["start-page"]}>
          <div className={classes["card"]}>
            <div className={classes["welcome-text"]}>
              <h2>Induljon a játékos pénzügyi utazás!</h2>
              <p>
                Olvasd be a QR-kódot, válaszolj a kvízre, és ha jól teljesítesz,
                a térkép segít továbblépni.
              </p>
              <p>
                Szórakozva tanulhatod meg, hogyan gazdálkodj okosan a
                zsebpénzeddel.
              </p>
            </div>
            <div onClick={handleStart} className={classes["btn-container"]}>
              <button id="start-btn" className={classes["start-btn"]}>
                start
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Start;

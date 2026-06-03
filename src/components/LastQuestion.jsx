import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";

import Process from "./Process";
import Timer from "./Timer";
import QuestionItem from "./QuestionItem";
import Modal from "./Modal";

import { useCtx } from "../context/context";
import { ANSWER_FEEDBACK, QR_FEEDBACK } from "../lib/constatnt";
import { money } from "../assets";

//-----------------------------------------------------------------
import classes from "./Questions.module.css";
import { lastQuestions, question } from "../lib/testData";

// shuffle the answers function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

lastQuestions.tasks.map((item) => shuffleArray(item.answers));

//-----------------------------------------------------------------
// local storage functions

const getLocaldata = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const setLocalData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

//-----------------------------------------------------------------
//-----------------------------------------------------------------
const LastQuestion = () => {
  const btns = useRef([]);
  const questionRef = useRef();
  const dialog = useRef();

  const navigate = useNavigate();

  const [questionNum, setQuestionNum] = useState(0);
  const [questionId, setQuestionId] = useState([]);
  const [imgLoaded, setImgLoaded] = useState(false);

  const [answerIsTrue, setAnswerIsTrue] = useState(true);
  const [feedback, setFeedback] = useState(ANSWER_FEEDBACK);
  const { onTurn, isEnd } = useCtx();
  //--------------------------------------------------------------

  useEffect(() => {
    try {
      const getStatus = getLocaldata("status");
      if (getStatus) {
        setQuestionId(getStatus.questionId);
      } else {
        setQuestionId([7, 0, 2, 10, 6, 5, 3, 8, 9, 4, 1]);
      }
    } catch (error) {
      console.error("Error fetching status from localStorage:", error);
    }
    const container = questionRef.current;
    let ctx;
    if (questionNum >= 0) {
      gsap.to(".answer-gsap", {
        x: 0,
        opacity: 1,
        ease: "power1.inOut",
        duration: 0.4,
        stagger: 0.4,
        delay: 0.7,
      });

      ctx = gsap.context(() => {
        gsap.from(container, {
          y: -50,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: "bounce.out",
        });
      });
    }

    // handle image load time
    const loaded = () => {
      setImgLoaded(true);
    };

    if (document.readyState === "complete") {
      loaded();
    } else {
      window.addEventListener("load", loaded);
    }

    return () => {
      window.removeEventListener("load", loaded);
      setImgLoaded(false);
      ctx.revert();
    };
  }, [questionNum]);

  useEffect(() => {
    gsap.fromTo(
      "#money-image",
      { scale: 0 },
      { scale: 1, duration: 1, delay: 1.5, ease: "circ.out" }
    );
  }, [imgLoaded]);

  //--------------------------------------------------------------
  // check the selected answer and add feedback if it is wrong
  const isOk = (e, index, answer) => {
    if (answer) {
      if (questionNum > 4) {
        dialog.current.open();
        return;
      }

      setQuestionNum((prev) => prev + 1);
      setAnswerIsTrue(true);
      setImgLoaded(false);y
    } else {
      setAnswerIsTrue(false);
      //setBtn(e.target);

      btns.current[index].style.background = "rgba(194, 0, 0, 0.7)";
      setTimeout(() => {
        btns.current[index].style.background = "";
        setAnswerIsTrue(true);
      }, 1500);
    }
  };

  //---------------------------------------------------------------
  const handlCancel = () => {
    dialog.current.close();
  };

  // check the QR code, and set the next question if the code is right
  const handleGetScanId = (result) => {
    dialog.current.close();
    if (parseInt(result) === questionId[10]) {
      onTurn();
      navigate("/diploma");
      setFeedback(ANSWER_FEEDBACK);
      return;
    } else {
      dialog.current.open();
      setFeedback(QR_FEEDBACK);
    }
  };

  //---------------------------------------------------------------
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  const handleTest = () => {
    onTurn();
    navigate("/diploma");
  };
  //-----------------------------------------------------------
  return (
    <>
      <Modal
        ref={dialog}
        onCancel={handlCancel}
        getScanId={handleGetScanId}
        modalText={feedback}
        actualQuestionNum={10}
      />

      <section className={`${classes["container"]}`}>
        <div>
          <Process numOfQuestion={10} numOfAllQuestion={10} />
        </div>
        <div className={classes["question-section"]}>
          <div
            ref={questionRef}
            id="question-gsap"
            className={classes["question-container"]}
          >
            <div className={classes["question"]}>
              <h2>{lastQuestions.question}</h2>
            </div>
          </div>
          <img
            id="money-image"
            src={money[questionNum]}
            alt="hungarian money"
            className={classes["money-img"]}
          />
          <ul className={classes.list}>
            {lastQuestions.tasks[questionNum].answers.map((item, i) => (
              <QuestionItem
                key={item.answer}
                CheckAnswer={(e, index = i) => isOk(e, index, item.right)}
                isDisabled={!answerIsTrue ? true : false}
                ref={(el) => (btns.current[i] = el)}
                className="answer-gsap question-item"
              >
                {item.answer}
              </QuestionItem>
            ))}
          </ul>
          <Timer className={classes["timer-display"]} isEnd={isEnd} />
        </div>

        {/* <div className={classes.test}>
          <button onClick={handleTest}>{questionId[10]}</button>
        </div> */}
      </section>
    </>
  );
};

export default LastQuestion;

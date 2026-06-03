import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";

import { useCtx } from "../context/context";

//-----------------------------------------------------------------
import QuestionItem from "./QuestionItem";
import Modal from "./Modal";
import Process from "./Process";
import Timer from "./Timer";
//-----------------------------------------------------------------
import classes from "./Questions.module.css";

//-----------------------------------------------------------------
import { question } from "../lib/testData";
import { ANSWER_FEEDBACK, QR_FEEDBACK } from "../lib/constatnt";

//-----------------------------------------------------------------

// shuffle the answers function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

question.map((item) => shuffleArray(item.answers));

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
//-----------------------------------------------------------------
const Questions = () => {
  const dialog = useRef();
  const navigate = useNavigate();

  const [answerIsTrue, setAnswerIsTrue] = useState(true);
  const [questionNum, setQuestionNum] = useState(0);
  const [feedback, setFeedback] = useState(ANSWER_FEEDBACK);
  const [questionId, setQuestionId] = useState([]);

  const btns = useRef([]);
  const questionRef = useRef();
  const { onTurn, isEnd } = useCtx();

  //---------------------------------------------------------------

  //--------------------------------------------------------------

  useEffect(() => {
    const getStatus = getLocaldata("status");
    let getCounter = getStatus.questionCounter;
    let gameEnd = getStatus.gameEnd;
    // when the page loded or reloaded this useEffect set the actual question number, if the game just has begun set the first question
    if (getCounter === 0) {
      setQuestionNum(0);
    } else {
      setQuestionNum(getCounter);
    }

    //listen every game turn to the last question and invoke the onTurn function in context.jsx

    if (gameEnd && getCounter + 1 === question.length) {
      onTurn();
    }

    setQuestionId(getStatus.questionId);
  }, []);

  //--------------------------------------------------------------

  useLayoutEffect(() => {
    if (!isEnd) {
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
      return () => ctx.revert();
    }
  }, [questionNum]);

  //--------------------------------------------------------------

  // check the selected answer and add feedback if it is wrong
  const isOk = (e, index, answer) => {
    if (answer) {
      dialog.current.open();
      setAnswerIsTrue(true);
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

  //--------------------------------------------------------------

  // check the QR code, and set the next question if the code is right
  const handleGetScanId = (result) => {
    dialog.current.close();
    if (parseInt(result) === questionId[questionNum]) {
      try {
        const getStatus = getLocaldata("status");
        let getCounter = getStatus.questionCounter;
        getCounter++;

        if (getCounter === question.length) {
          navigate("/last");
          return;
        }

        setLocalData("status", { ...getStatus, questionCounter: getCounter });

        //listen every game turn to the last question and invoke the onTurn function in context.jsx
        if (getCounter === question.length) {
          setQuestionNum(getCounter - 1);
          getCounter--;
          setLocalData("status", { ...getStatus, questionCounter: getCounter });
          onTurn();
          navigate("/diploma");
          return;
        }
        setQuestionNum(getCounter);
        setFeedback(ANSWER_FEEDBACK);
      } catch (error) {
        console.log(error);
      }
    } else {
      dialog.current.open();
      setFeedback(QR_FEEDBACK);
    }
  };

  //--------------------------------------------------------------

  const handleTest = () => {
    try {
      const getStatus = getLocaldata("status");
      let getCounter = getStatus.questionCounter;

      getCounter++;
      if (getCounter === question.length) {
        navigate("/last");
        return;
      }

      setLocalData("status", { ...getStatus, questionCounter: getCounter });

      setQuestionNum(getCounter);
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------------------------------------------------
  return (
    <>
      <Modal
        ref={dialog}
        onCancel={handlCancel}
        getScanId={handleGetScanId}
        modalText={feedback}
        actualQuestionNum={questionNum}
      />
      <section className={`${classes["container"]}`}>
        <div>
          <Process
            numOfQuestion={questionNum}
            numOfAllQuestion={question.length}
          />
        </div>
        <div className={classes["question-section"]}>
          <div
            ref={questionRef}
            id="question-gsap"
            className={classes["question-container"]}
          >
            <div className={classes["question"]}>
              <h2>{question[questionNum].question}</h2>
              <code>{question[questionNum].operation}</code>
            </div>
          </div>
          <ul className={classes.list}>
            {question[questionNum].answers.map((item, i) => (
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
          <button onClick={handleTest}>{questionId[questionNum]}</button>
        </div> */}
      </section>
    </>
  );
};

export default Questions;

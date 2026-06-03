import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useState,
} from "react";
//---------------------------------------------------------
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
//---------------------------------------------------------

import classes from "./Leaderboard.module.css";
import { imgWand } from "../assets";
//---------------------------------------------------------
//calculate the user's time in milisec
const milisecTimes = (hour, min, sec) => {
  return (hour * 3600 + min * 60 + sec) * 1000;
};

//---------------------------------------------------------
//---------------------------------------------------------
const Leaderboard = forwardRef(({}, ref) => {
  const dialog = useRef();
  const [leaderboardData, setLeaderboardData] = useState([]);

  //-------------------------------------------------------
  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      },
    };
  });

  useEffect(() => {
    // fetch the actual users data
    const getDocId = async (collectionName) => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const documents = querySnapshot.docs.map((doc) => doc.data());
        // get the user name and the time
        const leaderboardUsers = documents.map((item) => {
          return {
            user: item.userName,
            time: item.time,
            milisec: milisecTimes(item.time.hour, item.time.min, item.time.sec),
            uId: item.uId,
          };
        });

        // sort data by time
        leaderboardUsers.sort((a, b) => a.milisec - b.milisec);
        let topTen = [];
        if (leaderboardUsers.length < 10) {
          topTen = leaderboardUsers.map((item, index) => {
            if (item.milisec !== 0) {
              return (
                <li key={item.uId}>
                  <div className={classes["list-item"]}>
                    <div className={classes["user"]}>
                      <span>{index + 1}.</span>
                      <span>{item.user}</span>
                    </div>
                    <span>{`${item.time.hour}:${item.time.min}:${item.time.sec}`}</span>
                  </div>
                </li>
              );
            }
          });
        } else {
          for (let i = 0; i <= 9; i++) {
            if (leaderboardUsers[i].milisec !== 0) {
              topTen.push(
                <li key={leaderboardUsers[i].uId}>
                  <div className={classes["list-item"]}>
                    <div className={classes["user"]}>
                      <span>{i + 1}.</span>
                      <span>{leaderboardUsers[i].user}</span>
                    </div>
                    <span>{`${leaderboardUsers[i].time.hour}:${leaderboardUsers[i].time.min}:${leaderboardUsers[i].time.sec}`}</span>
                  </div>
                </li>
              );
            }
          }
        }

        setLeaderboardData(topTen);
      } catch (error) {
        console.log(error);
      }
    };

    getDocId("users");
  }, []);

  //-------------------------------------------------------

  //------------------------------------------------------
  const handleClose = () => dialog.current.close();

  //-------------------------------------------------------
  return (
    <dialog ref={dialog} className={`modal`}>
      <section>
        <div className="header-contaier">
          <h2>ranglista</h2>
          <img src={imgWand} className="magic-wand-img" alt="magic wand" />
        </div>
        <ul className={classes["users-list"]}>{leaderboardData}</ul>
        <button
          className={`${classes["leader-board-btn"]} btn`}
          onClick={handleClose}
        >
          vissza
        </button>
      </section>
    </dialog>
  );
});

export default Leaderboard;

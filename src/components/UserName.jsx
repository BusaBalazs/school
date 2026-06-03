import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

import { useCtx } from "../context/context";

import { v4 as uuidv4 } from "uuid";
//-------------------------------------------------------
import { imgWand } from "../assets";
import classes from "./UserName.module.css";

//-------------------------------------------------------
// user name checking function
const userNameIsOk = (str, forbiddenName) => {
  // check the forbidden word
  let string = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f\s+]/g, "")
    .toLowerCase();
  const checkByCharacter = string.trim().split("").join("");

  //--------------------------------------------------------
  // check by words
  const bStr = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const checkByWords = bStr.trim().split(" ");

  return {
    byChr: forbiddenName.includes(checkByCharacter),
    byWord: forbiddenName.filter((value) => checkByWords.includes(value)),
  };
};

const forbiddenUserName = [
  "fasz",
  "faszvero",
  "faszom",
  "kurva",
  "anyad",
  "anyadat",
  "azanyadat",
  "kurvaanyad",
  "akurvaanyad",
  "kurvaanyadat",
  "akurvaanyadat",
  "kocsog",
  "pina",
  "picsa",
  "picsaba",
  "picsafasz",
  "bazdmeg",
  "baszdmeg",
  "basszameg",
  "baszameg",
  "megbassza",
  "megbasza",
  "baszik",
  "baszo",
  "anyabaszo",
  "lofasz",
  "hulyepicsa",
  "segg",
  "seg",
  "hujepicsa",
  "faszallito",
  "faszalito",
  "pinagyar",
  "anusz",
  "segbekur",
  "seggbekur",
  "seglyuk",
  "elmeszteapicsaba",
  "geci",
  "gecilada",
  "geciputtony",
  "gecipotter",
  "geciharrypotter",
  "buzi",
  "buzerator",
  "homokos",
];

//-------------------------------------------------------
//-------------------------------------------------------
const UserName = forwardRef(({}, ref) => {
  const dialog = useRef();
  const userName = useRef();

  const [warning, setWarning] = useState(false);
  const [forbiddenName, setForbiddenName] = useState(false);

  const { welcomeUser } = useCtx();
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

  //-------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = uuidv4();
    //-----------------------------------------------------
    // check user name validation
    const checkUserName = userNameIsOk(
      userName.current.value,
      forbiddenUserName
    );

    if (checkUserName.byChr || checkUserName.byWord.length !== 0) {
      setForbiddenName(true);
      return;
    }

    //----------------------------------------------------
    // set user name if it is ok
    const getUserName = userName.current.value;
    welcomeUser(getUserName);
    //-------------------------------------------------------------
    // save data to local storage
    const gameStatus = JSON.parse(localStorage.getItem("status"));
    localStorage.setItem(
      "status",
      JSON.stringify({
        ...gameStatus,
        userName: getUserName,
        uId: userId,
      })
    );

    //-------------------------------------------------------------
    // save data to firestore
    try {
      await addDoc(collection(db, "users"), {
        userName: getUserName.toUpperCase(),
        uId: userId,
        createdAt: Timestamp.now(),
        time: {
          hour: 0,
          min: 0,
          sec: 0,
        },
      });
    } catch (error) {
      console.log(error);
    }

    dialog.current.close();
  };

  //-------------------------------------------------------
  // set back warning, forbidden name to false if the user is typing
  const handleInput = () => {
    setWarning(false);
    setForbiddenName(false);
  };

  //-------------------------------------------------------
  const handleCancel = () => {
    dialog.current.close();
  };

  //-------------------------------------------------------
  return (
    <dialog ref={dialog} className={`${classes["user-name-modal"]} modal`}>
      <div className="header-contaier">
        <h2>varázsló név</h2>
        <img src={imgWand} className="magic-wand-img" alt="magic wand" />
      </div>
      {forbiddenName && (
        <p className={classes["forbidden-alert"]}>Válassz másik nevet!</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={userName}
          type="text"
          required
          onInput={handleInput}
          className={classes["user-input"]}
        />
        <div className={classes["btns-container"]}>
          <button
            className={classes["btn-cancel"]}
            type="button"
            onClick={handleCancel}
          >
            Vissza
          </button>
          <button className="btn" type="submit">
            OK
          </button>
        </div>
      </form>
    </dialog>
  );
});

export default UserName;

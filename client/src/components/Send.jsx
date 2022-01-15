import React, { useState } from "react";
import styles from "./send.module.css";

function Send() {
  const [userInput, setUserInput] = useState("");

  async function validateMessage(event) {
    try {
      event.preventDefault();
    } catch (err) {
      console.log({ err });
    } finally {
    }
  }

  function updateUserInput(event) {
    setUserInput(event.target.value);
  }

  return (
    <div className={styles.send}>
      <form className={styles["input-form"]} onSubmit={validateMessage}>
        <textarea
          className={styles["input-field"]}
          onChange={updateUserInput}
          value={userInput}
          rows={1}
          placeholder="Shkruaj dicka ..."
        />
        <button className={styles["submit-field"]} type="submit">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default Send;

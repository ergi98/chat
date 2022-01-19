import React, { useRef } from "react";
import styles from "./send.module.css";

const Send = React.forwardRef((props, ref) => {
  const userInput = useRef({});

  async function validateMessage(event) {
    event.preventDefault();
    let message = userInput.current.innerText;
    emptyInput();
    await props.setMessage(message);
  }

  function emptyInput() {
    userInput.current.innerHTML = "";
  }

  return (
    <div ref={ref} className={styles.send}>
      <form onSubmit={validateMessage}>
        <div className={styles["input-container"]}>
          <div
            ref={userInput}
            className={styles["input-field"]}
            contentEditable={true}
          />
          <button className={styles["submit-field"]} type="submit">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
});

export default Send;

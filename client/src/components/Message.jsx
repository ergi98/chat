import React from "react";
import styles from "./message.module.css";

let myId = "1";

function Message({ message }) {
  function displayDate(date) {
    let localDate = new Date(date);
    let hours = localDate.getHours().toString().padStart(2, "0");
    let minutes = localDate.getMinutes().toString().padStart(2, "0");

    let output = `${hours}:${minutes}`;
    return output;
  }

  return (
    <div
      className={`${styles.message} ${
        message.sentBy === myId ? styles.mine : styles.theirs
      }`}
    >
      <div className={styles.content}>
        <span>{message.text}</span>
        <div className={styles["bottom-row"]}>
          <span className={styles["sent-at"]}>
            {displayDate(message.sentAt)}
          </span>
          <svg className={styles["check-svg"]} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Message;

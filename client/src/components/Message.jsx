import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import styles from "./message.module.css";

// Animation
import { motion } from "framer-motion";

function Message({ message }) {
  const user = useContext(UserContext);

  function displayDate(date) {
    let localDate = new Date(date);
    let hours = localDate.getHours().toString().padStart(2, "0");
    let minutes = localDate.getMinutes().toString().padStart(2, "0");

    let output = `${hours}:${minutes}`;
    return output;
  }

  let variants = {
    initial: {
      x: message.sentBy === user.socketId ? "50%" : "-50%",
      rotate: "20deg",
    },
    final: {
      x: "0",
      rotate: "0deg",
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="final"
      variants={variants}
      className={`${styles.message} ${
        message.sentBy === user.socketId ? styles.mine : styles.theirs
      }`}
    >
      <div className={styles.content}>
        <span>{message.text}</span>
        <div className={styles["bottom-row"]}>
          <span className={styles["sent-at"]}>
            {message.sentAt ? displayDate(message.sentAt) : ""}
          </span>
          {message.sentAt ? (
            <svg className={styles["check-svg"]} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z"
              />
            </svg>
          ) : (
            <div className={styles["sending-div"]}>
              <span className={styles["sending-text"]}>Sending</span>
              <svg className={styles["check-svg"]} viewBox="0 0 24 24">
                <path
                  className={styles["sending-icon"]}
                  fill="currentColor"
                  d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Message;

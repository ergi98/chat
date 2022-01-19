import React from "react";
import styles from "./room.module.css";
// UUID
import { v4 } from "uuid";

const roomId = v4();

function SelectRoom() {
  const roomLink = window.location.href + roomId;

  function copyLink() {
    navigator.clipboard.writeText(roomLink);
  }
  return (
    <div className={`height-full ${styles["select-room"]}`}>
      <div>
        <div className={styles.title}>Chat Room</div>
        <div className={styles.hint}>
          Invite a friend to chat together by sending them the link below
        </div>
        <div className={styles.link}>{roomLink}</div>
        <button onClick={copyLink} className={styles.copy}>
          Copy Link
        </button>
      </div>
    </div>
  );
}

export default SelectRoom;

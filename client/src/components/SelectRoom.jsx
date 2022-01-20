import React, { useEffect, useState } from "react";
import styles from "./room.module.css";
// UUID
import { v4 } from "uuid";

// Room
import { create as createRoom } from "../mongo/room.js";
import { create as createUser } from "../mongo/user.js";

// ANTD
import { Button, message, Spin } from "antd";

function SelectRoom() {
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState(null);

  function copyLink() {
    navigator.clipboard.writeText(
      `Hey lets chat together. Click the link below to join me! \n ${window.location.href}`
    );
    message.success("Room link coppied");
  }

  useEffect(async () => {
    async function openRoom() {
      try {
        let user = await createUser();
        let result = await createRoom(user);
        setRoom(result.data.room);
      } catch (err) {
        message.error(err.message);
      }
    }

    await openRoom();
    return () => {
      second;
    };
  }, []);

  return (
    <div className={`height-full ${styles["select-room"]}`}>
      {!loading ? (
        <div>
          <div className={styles.title}>Chat Room</div>
          <div className={styles.hint}>
            Invite a friend to chat together by sending them the link below
          </div>
          <div className={styles.link}>{roomLink}</div>
          <Button onClick={copyLink} type="primary" className={styles.copy}>
            Copy Link
          </Button>
        </div>
      ) : (
        <div>
          <Spin size="large" /> <br />
          <div className={styles["loading-text"]}>Creating a Room ...</div>
        </div>
      )}
    </div>
  );
}

export default SelectRoom;

import React, { useEffect, useReducer } from "react";
import styles from "./room.module.css";

import {
  create as createRoom,
  checkIfRoomExists,
  assignUserToRoom,
} from "../mongo/room.js";
import {
  create as createUser,
  getUser,
  checkIfUserBelongsToRoom,
} from "../mongo/user.js";

// ANTD
import { Button, message, Spin } from "antd";

// Router
import { useParams, useNavigate } from "react-router-dom";

const initialState = {
  loading: true,
  room: null,
  user: null,
  text: "Creating a room for you to chat in ...",
};

function reducer(state, action) {
  switch (action.type) {
    case "created-room":
      return {
        ...state,
        room: action.payload,
        text: "Creating your user ...",
      };
    case "created-user":
      return {
        ...state,
        loading: false,
        user: action.payload,
        text: "Invite a friend to chat together by sending them the link below",
      };
    case "assigned-user-to-room":
      return {
        ...state,
        room: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
}

function SelectRoom() {
  const navigate = useNavigate();

  const { roomId } = useParams();

  const [state, dispatch] = useReducer(reducer, initialState);

  function copyLink() {
    navigator.clipboard.writeText(
      `Hey lets chat together. Click the link below to join me! \n ${window.location.href}${state.room._id}`
    );
    message.success("Room link copied");
  }

  useEffect(async () => {
    async function initialSetup() {
      try {
        let user = "";
        let jwt = JSON.parse(localStorage.getItem("jwt"));
        let room = JSON.parse(localStorage.getItem("room"));

        if (!roomId && room !== null) {
          navigate(`/${room._id}`, { replace: true });
        }

        if (!roomId) {
          let data = await createRoom();
          room = data.room;
          dispatch({
            type: "created-room",
            payload: room,
          });
        } else if (roomId) {
          let data = await checkIfRoomExists(roomId);
          room = data.room;
          if (!room) {
            dispatch({
              type: "room-error",
            });
            throw new Error(
              "The room you are trying to join does not seem to exists anymore."
            );
          } else {
            dispatch({
              type: "created-room",
              payload: room,
            });
          }
        }

        if (jwt === null) {
          let data = await createUser(room._id);
          user = data.user;
          dispatch({
            type: "created-user",
            payload: user,
          });
        } else {
          let data = await getUser();
          user = data.user;
          dispatch({
            type: "created-user",
            payload: user,
          });
        }

        let result = await checkIfUserBelongsToRoom();

        if (result.belongs) {
          navigate(`/chat/${room._id}`, { replace: true });
        } else {
          await assignUserToRoom();
          navigate(`/chat/${room._id}`, { replace: true });
        }
      } catch (err) {
        console.log(err);
        message.error(err.message);
      }
    }
    initialSetup();
  }, []);

  return (
    <div className={`height-full ${styles["select-room"]}`}>
      <div>
        <div className={styles.title}>Chat Room</div>
        <div>
          {state.loading ? (
            <div>
              <Spin size="large" /> <br />
              <div className={styles["loading-text"]}>{state.text}</div>
            </div>
          ) : (
            <>
              <div className={styles.hint}>{state.text}</div>
              <div className={styles.link}>
                {`${window.location.href}${state.room?._id}`}
              </div>
              <Button onClick={copyLink} type="primary" className={styles.copy}>
                Copy Link
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectRoom;

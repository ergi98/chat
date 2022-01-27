import React, { useContext, useEffect, useReducer } from "react";
import styles from "./room.module.css";

// JWT
import jwt_decode from "jwt-decode";

import {
  create as createRoom,
  getRoom,
  assignUserToRoom,
} from "../mongo/room.js";
import { create as createUser } from "../mongo/user.js";

// ANTD
import { Button, message, Spin } from "antd";

// Router
import { useParams, useNavigate } from "react-router-dom";

// Context
import { SocketContext } from "../SocketContext.js";

const initialState = {
  loading: true,
  text: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "invited-user-arrived":
    case "getting-room":
    case "creating-room":
    case "creating-user":
      return {
        ...state,
        loading: true,
        text: action.message,
      };
    case "waiting":
    case "room-error":
    case "invited-user-assigned":
      return {
        ...state,
        loading: false,
        text: action.message,
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

  const socket = useContext(SocketContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  function copyLink() {
    let JWT = JSON.parse(localStorage.getItem("jwt"));
    if (!JWT) return;
    let decoded = jwt_decode(JWT);
    navigator.clipboard.writeText(
      `Hey lets chat together.` +
        `Click the link below to join me! \n` +
        `http://${window.location.host}/${decoded.roomId}`
    );
    message.success("Room link copied");
  }

  useEffect(() => {
    const JWT = JSON.parse(localStorage.getItem("jwt"));
    JWT && setNewMemberListener();
  }, []);

  function setNewMemberListener() {
    socket.on("new-member", (data) => {
      let JWT = JSON.parse(localStorage.getItem("jwt"));
      let decoded = jwt_decode(JWT);
      if (decoded._id !== data._id) {
        message.info("Redirecting to chat ...");
        setTimeout(() => {
          navigate(`/chat/${data.roomId}`, { replace: true });
        }, 1000);
      }
    });
  }

  useEffect(async () => {
    async function initialSetup() {
      try {
        const currentToken = JSON.parse(localStorage.getItem("jwt"));

        let status = await checkForRedirect(currentToken);
        // If the JWT exists there is no point in handling user creation
        if (status) return;

        roomId
          ? await handleInvite(currentToken)
          : await handleNewUser(currentToken);

        const newToken = JSON.parse(localStorage.getItem("jwt"));

        socket.emit("new-member", newToken);
        setNewMemberListener();
      } catch (err) {
        message.error(err.message);
      }
    }

    async function checkForRedirect(token) {
      if (token) {
        let { room } = await getRoom();
        if (room) {
          room.members?.length > 1
            ? navigate(`/chat/${room._id}`, { replace: true })
            : dispatch({
                type: "waiting",
                message: "Waiting for a friend to join you ..",
              });
          return true;
        } else {
          dispatch({
            type: "room-error",
            message: "The room you are trying to join is no longer active.",
          });
        }
      }
      return false;
    }

    async function handleInvite(token) {
      dispatch({
        type: "invited-user-arrived",
        message: "Welcome! \n We are getting things ready for you ...",
      });
      if (!token) {
        await createUser(roomId);
      }
      let data = await getRoom();
      if (data.room) {
        await assignUserToRoom();
        dispatch({
          type: "invited-user-assigned",
          message: "All set! Redirecting you to your room.",
        });
        setTimeout(() => {
          navigate(`/chat/${data.room._id}`, { replace: true });
        }, 1000);
      } else {
        dispatch({
          type: "room-error",
          message: "The room you are trying to join does no longer exist.",
        });
      }
    }

    async function handleNewUser(token) {
      if (token) {
        dispatch({ type: "getting-room", message: "Getting your room ..." });
        let { room } = await getRoom();
        if (room) {
          dispatch({
            type: "room-error",
            message: "The room created for you is no longer active.",
          });
        } else {
          dispatch();
        }
      } else {
        dispatch({ type: "creating-room", message: "Creating your room ..." });
        let { room } = await createRoom();
        dispatch({ type: "creating-user", message: "Creating your user ..." });
        await createUser(room._id);
        await assignUserToRoom();
        dispatch({
          type: "waiting",
          message:
            "Waiting for other members to join you! \n Invite a friend to chat together by sending them the link below.",
        });
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
                {`http://${window.location.host}`}
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

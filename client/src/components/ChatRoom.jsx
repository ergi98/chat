import React, { useRef, useEffect, useState } from "react";

// Components
import Send from "./Send";
import Chat from "./Chat";
import TopRibbon from "./TopRibbon";

// Context
import { useRoot } from "../RootContext";

// Api
import { sendMessage } from "../mongo/message.js";

// UUID
import { v4 } from "uuid";

// Router
import { useParams, useNavigate } from "react-router-dom";

// ANTD
import { message } from "antd";

function ChatRoom() {
  const navigate = useNavigate();

  const rootData = useRoot();

  const { roomId } = useParams();

  const sendRef = useRef(null);
  const chatRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [hasSetListeners, setHasSetListeners] = useState(false);
  const [roomMessages, setRoomMessages] = useState([]);

  // Resize the chat depending on the input field height
  let observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      chatRef.current.style.paddingBottom = `${
        entry.target.offsetHeight + 14
      }px`;
    }
  });

  useEffect(() => {
    function checkForRedirect() {
      console.log("%c Check for redirect ChatRoom", "color: #bf55da");
      if (!roomId) {
        let storedRoomId = rootData.room;
        storedRoomId
          ? navigate(`/chat/${storedRoomId}`, { replace: true })
          : navigate(`/`, { replace: true });
      }
    }
    rootData && checkForRedirect();
  }, [rootData]);

  useEffect(() => {
    function setSocketListeners() {
      console.log("%c new-message listener ChatRoom", "color: #bf55da");
      rootData.socket.on("new-message", (message) => {
        console.log("NEW MESSAGE BITCHES");
        // If yours update
        if (message.sentBy === rootData.user) {
          setRoomMessages((previous) =>
            previous.map((prev) => {
              return prev._id === message._id ? message : prev;
            })
          );
        }
        // If not yours append to end
        else setRoomMessages((previous) => [...previous, message]);
      });
      rootData.socket.on("new-member", (data) => {
        if (rootData.user !== data._id) {
          message.info("New user joined");
        }
      });
      setHasSetListeners(true);
    }
    if (rootData !== null && !hasSetListeners) setSocketListeners();

    return () => {
      if (rootData !== null && hasSetListeners) {
        rootData.socket.off("new-message");
        rootData.socket.off("new-member");
      }
    };
  }, [rootData, hasSetListeners]);

  // TODO: Make api call to fetch last 50 messages
  async function addNewMessage(text) {
    let tempMessageId = v4(),
      message = {
        _id: tempMessageId,
        text,
        sentBy: rootData.user,
        status: "sending",
      };
    try {
      setRoomMessages((prev) => [...prev, message]);
      let data = await sendMessage(text);
      message = data.message;
      setRoomMessages((previous) =>
        previous.map((prev) => {
          return prev._id === tempMessageId ? message : prev;
        })
      );
      message && rootData.socket.emit("sent-message", message);
    } catch (err) {
      console.log("message with error");
      // TODO: Mark message as unsent to retry again
      setRoomMessages((previous) =>
        previous.map((prev) => {
          return prev._id === tempMessageId
            ? { ...message, status: "error" }
            : prev;
        })
      );
    }
  }

  useEffect(() => {
    if (sendRef && sendRef.current) {
      console.log("%c Resize observer ChatRoom", "color: #bf55da");
      observer.observe(sendRef.current);
    }
    return () => {
      if (sendRef && sendRef.current && observer)
        observer.unobserve(sendRef.current);
    };
  }, [sendRef]);

  return (
    <div style={{ overflow: "none" }}>
      <TopRibbon />
      <Chat ref={chatRef} messages={roomMessages} />
      <Send ref={sendRef} addMessage={addNewMessage} />
    </div>
  );
}

export default ChatRoom;

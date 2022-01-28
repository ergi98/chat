import React, { useRef, useEffect, useState } from "react";

// Components
import Chat from "./Chat";
import Send from "./Send";

// Context
import { useRoot } from "../RootContext";

// Api
import { sendMessage } from "../mongo/message.js";

// UUID
import { v4 } from "uuid";

// Router
import { useNavigate } from "react-router-dom";

// Axios
import { clearAxiosInstance } from "../../axios_config/axios-config";

function ChatRoom() {
  const navigate = useNavigate();

  const rootData = useRoot();

  const sendRef = useRef(null);
  const chatRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [roomMessages, setRoomMessages] = useState([]);

  // Resize the chat depending on the input field height
  let observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      chatRef.current.style.height = `calc(100vh - ${entry.target.offsetHeight}px)`;
    }
  });

  useEffect(() => {
    if (!rootData?.jwt) {
      localStorage.clear();
      clearAxiosInstance();
      navigate(`/`, { replace: true });
    }
    console.log("%c Check for redirect ChatRoom", "color: #bf55da");
  }, []);

  useEffect(() => {
    if (!rootData) return;
    console.log("%c new-message listener ChatRoom", "color: #bf55da");
    rootData.socket.on("new-message", (message) => {
      // If yours update
      if (message.sentBy === userId) {
        setRoomMessages((previous) =>
          previous.map((prev) => {
            return prev._id === message._id ? message : prev;
          })
        );
      }
      // If not yours append to end
      else setRoomMessages((previous) => [...previous, message]);
    });
  }, [rootData]);

  // TODO: Make api call to fetch last 50 messages

  async function addNewMessage(text) {
    try {
      setRoomMessages((prev) => [
        ...prev,
        { _id: v4(), text, sentBy: rootData.user },
      ]);
      let result = await sendMessage(text);
    } catch (err) {
      // TODO: Mark message as unsent to retry again
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
      <Chat ref={chatRef} messages={roomMessages} />
      <Send ref={sendRef} addMessage={addNewMessage} />
    </div>
  );
}

export default ChatRoom;

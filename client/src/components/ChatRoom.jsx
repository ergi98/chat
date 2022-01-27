import React, { useRef, useEffect, useState } from "react";

// Components
import Chat from "./Chat";
import Send from "./Send";

// Api
import { sendMessage, getMessages } from "../mongo/message.js";

function ChatRoom() {
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

  // TODO: Make api call to fetch last 50 messages

  async function addNewMessage(text) {
    try {
      let result = await Message;
    } catch (err) {}
  }

  useEffect(() => {
    if (sendRef && sendRef.current) {
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

import React, { useEffect, useRef, useState } from "react";

// Components
import Chat from "./components/Chat";
import Send from "./components/Send";

// UUID
import { v4 } from "uuid";

// Socket
import io from "socket.io-client";

// Context
import { UserContext } from "./UserContext";
import SelectRoom from "./components/SelectRoom";

const socket = io(window.location.href);

function App() {
  const sendRef = useRef(null);
  const chatRef = useRef(null);

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // Resize the chat depending on the input field height
  let observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      chatRef.current.style.height = `calc(100vh - ${entry.target.offsetHeight}px)`;
    }
  });

  useEffect(() => {
    if (sendRef && sendRef.current) {
      observer.observe(sendRef.current);
    }
    return () => {
      if (sendRef && sendRef.current && observer)
        observer.unobserve(sendRef.current);
    };
  }, [sendRef]);

  // Socket
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     setUser({
  //       socketId: socket.id,
  //     });
  //     socket.emit("connected", socket.id);
  //   });
  //   return () => socket && socket.disconnect();
  // }, []);

  useEffect(() => {
    function scrollToBottom() {
      if (chatRef && chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }

    if (user) {
      socket.on("message", (message) => {
        // Already have this message
        if (message.sentBy === user.socketId) {
          setMessages((previousMessages) => {
            return previousMessages.map((previous) => {
              return previous._id === message._id ? message : previous;
            });
          });
        } else {
          setMessages((previousMessages) => [...previousMessages, message]);
        }
        scrollToBottom();
      });
    }
  }, [user]);
  async function setMessage(text) {
    try {
      let message = {
        _id: v4(),
        text,
        sentBy: user.socketId,
        members: [],
        sentAt: "",
      };
      setMessages((previousMessages) => [...previousMessages, message]);
      socket.emit("send-message", message);
    } catch (err) {
      alert(err);
    }
  }

  function updateMessage(updatedMessage) {
    let updatedMessages = messages.map((message) => {
      if (message._id !== updatedMessage._id) return message;
      else return updatedMessage;
    });
    setMessages(updatedMessages);
  }

  function setUserData(userData) {
    setUser({
      _id: v4(),
      roomId: userData.roomId,
      name: userData.name,
    });
  }

  return (
    <div style={{ overflow: "none" }}>
      {user && user.roomId ? (
        <UserContext.Provider value={user}>
          <Chat ref={chatRef} messages={messages} />
          <Send
            ref={sendRef}
            setMessage={setMessage}
            updateMessage={updateMessage}
          />
        </UserContext.Provider>
      ) : (
        <SelectRoom setUserData={setUserData} />
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useRef, useState } from "react";

// Components
import NotFound from "./components/NotFound";
import SelectRoom from "./components/SelectRoom";
import ChatRoom from "./components/ChatRoom";

// UUID
import { v4 } from "uuid";

// Socket
// import io from "socket.io-client";

// Context
import { UserContext } from "./UserContext";

// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// const socket = io(window.location.href);

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
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<SelectRoom />}>
            <Route path=":roomId" element={<SelectRoom />} />
          </Route>
          <Route path="chat" element={<ChatRoom />}>
            <Route path=":roomId" element={<ChatRoom />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;

import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./chat-room.module.css";

// Components
import Send from "./Send";
import Chat from "./Chat";
import TopRibbon from "./TopRibbon";

// Context
import { useRoot } from "../RootContext";

// Api
import { sendMessage, getMessagesByChunks } from "../mongo/message.js";

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

  const chatRef = useRef(null);
  const sendRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [lastFetchDate, setLastFetchDate] = useState(null);

  const [hasSetListeners, setHasSetListeners] = useState(false);
  const [roomMessages, setRoomMessages] = useState([]);

  // Resize the chat depending on the input field height
  let observer;

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
        scrollToBottom();
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
  }, [rootData, hasSetListeners, scrollToBottom]);

  useEffect(() => {
    if (sendRef && sendRef.current) {
      console.log("%c Resize observer ChatRoom", "color: #bf55da");
      observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          chatRef.current.style.height = `calc(var(--vh, 1vh) * 100 - ${entry.target.offsetHeight}px - 55px)`;
        }
      });
      observer.observe(sendRef.current);
    }
    return () => {
      if (sendRef && sendRef.current && observer)
        observer.unobserve(sendRef.current);
    };
  }, [sendRef]);

  useEffect(() => {
    function setGlobalVh() {
      let vh = window.innerHeight * 0.01;
      let root = document.querySelector(":root");
      root.style.setProperty("--vh", `${vh}px`);
    }
    setGlobalVh();
    window.addEventListener("resize", setGlobalVh);
    return () => {
      window.removeEventListener("resize", setGlobalVh);
    };
  }, []);

  useEffect(() => {
    async function initialFetch() {
      await fetchMessages();
      scrollToBottom();
    }
    hasSetListeners && initialFetch();
  }, [hasSetListeners, fetchMessages, scrollToBottom]);

  useEffect(() => {
    async function checkIfScrolledToTop(event) {
      if (event.target.scrollTop === 0) {
        await fetchMessages();
      }
    }

    if (chatRef && chatRef?.current) {
      chatRef.current.removeEventListener("scroll", checkIfScrolledToTop);
      chatRef.current.addEventListener("scroll", checkIfScrolledToTop);
    }

    return () => {
      if (chatRef && chatRef?.current) {
        chatRef.current.removeEventListener("scroll", checkIfScrolledToTop);
      }
    };
  }, [chatRef, lastFetchDate, loading, fetchMessages]);

  const fetchMessages = useCallback(async () => {
    console.log("Fetching", lastFetchDate);
    try {
      setLoading(true);
      let { date, messages } = await getMessagesByChunks(lastFetchDate);
      setLastFetchDate(date);
      setRoomMessages((prev) => [...messages, ...prev]);
      // TODO:
      chatRef.current.scrollTop = 50 * messages.length;
    } catch (err) {
      console.log(err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [loading, lastFetchDate]);

  // TODO: Make api call to fetch last 50 messages
  async function addNewMessage(text) {
    let tempMessageId = v4(),
      message = {
        text,
        status: "sending",
        _id: tempMessageId,
        sentBy: rootData.user,
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
      setRoomMessages((previous) =>
        previous.map((prev) => {
          return prev._id === tempMessageId
            ? { ...message, status: "error" }
            : prev;
        })
      );
    }
  }

  const scrollToBottom = useCallback(() => {
    if (chatRef && chatRef?.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatRef]);

  return (
    <div className={styles["chat-room"]}>
      <TopRibbon />
      <Chat ref={chatRef} messages={roomMessages} loading={loading} />
      <Send
        ref={sendRef}
        addMessage={addNewMessage}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}

export default ChatRoom;

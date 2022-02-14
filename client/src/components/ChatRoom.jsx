import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import styles from './chat-room.module.css';

// Components
import Send from './Send';
import Chat from './Chat';
import TopRibbon from './TopRibbon';

// Context
import { useRoot } from '../RootContext';

// Api
import { sendMessage, getMessagesByChunks } from '../mongo/message.js';

// UUID
import { v4 } from 'uuid';

// Router
import { useParams, useNavigate } from 'react-router-dom';

// ANTD
import { message } from 'antd';

async function fetchMessages(date = null) {
  try {
    let data = await getMessagesByChunks(date);
    return data;
    // chatRef.current.scrollTop = 50 * messages.length;
  } catch (err) {
    console.log(err);
    message.error(err.message);
  }
}

function ChatRoom() {
  const navigate = useNavigate();

  const rootData = useRoot();

  const { roomId } = useParams();

  const chatRef = useRef(null);
  const sendRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [hasMoreToFetch, setHasMoreToFetch] = useState(true);
  const [lastFetchDate, setLastFetchDate] = useState(null);

  const [hasSetListeners, setHasSetListeners] = useState(false);
  const [roomMessages, setRoomMessages] = useState([]);
  const [typingIndicator, setTypingIndicator] = useState(false);

  useEffect(() => {
    function checkForRedirect() {
      console.log('%c Check for redirect ChatRoom', 'color: #bf55da');
      if (!roomId) {
        let storedRoomId = rootData.room;
        storedRoomId
          ? navigate(`/chat/${storedRoomId}`, { replace: true })
          : navigate(`/`, { replace: true });
      }
    }

    rootData && checkForRedirect();
  }, [rootData, navigate, roomId]);

  useEffect(() => {
    function setSocketListeners() {
      console.log('%c new-message listener ChatRoom', 'color: #bf55da');
      rootData.socket.on('new-message', (message) => {
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
      rootData.socket.on('new-member', (data) => {
        if (rootData.user !== data._id) {
          message.info('New user joined');
        }
      });
      rootData.socket.on('typing', () => {
        setTypingIndicator(true);
      });
      rootData.socket.on('finished-typing', () => {
        setTypingIndicator(false);
      });
      setHasSetListeners(true);
    }

    if (rootData !== null && !hasSetListeners) setSocketListeners();

    return () => {
      if (rootData !== null && hasSetListeners) {
        rootData.socket.off('new-message');
        rootData.socket.off('new-member');
        rootData.socket.off('typing');
        rootData.socket.on('finished-typing');
      }
    };
  }, [rootData, hasSetListeners, scrollToBottom]);

  useLayoutEffect(() => {
    let observer, localSendRef, localChatRef;

    function attachResizeObserver(expandingElRef, shrinkingElRef) {
      console.log('%c Resize observer ChatRoom', 'color: #bf55da');
      // Resize the chat depending on the input field height
      observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          shrinkingElRef.style.height = `calc(var(--vh, 1vh) * 100 - ${entry.target.offsetHeight}px - 55px)`;
        }
      });
      observer.observe(expandingElRef);
    }

    if (sendRef?.current && chatRef?.current) {
      let localSendRef = sendRef.current;
      let localChatRef = chatRef.current;
      attachResizeObserver(localSendRef, localChatRef);
    }

    return () => {
      if (localChatRef?.current && observer) observer.unobserve(localSendRef);
    };
  }, [sendRef]);

  useLayoutEffect(() => {
    function setGlobalVh() {
      let vh = window.innerHeight * 0.01;
      let root = document.querySelector(':root');
      root.style.setProperty('--vh', `${vh}px`);
    }
    setGlobalVh();
    window.addEventListener('resize', setGlobalVh);
    return () => {
      window.removeEventListener('resize', setGlobalVh);
    };
  }, []);

  useEffect(() => {
    async function initialFetch() {
      setLoading(true);
      let { date, messages } = await fetchMessages();
      setLastFetchDate(date);
      setRoomMessages((prev) => [...messages, ...prev]);
      setLoading(false);
      scrollToBottom();
    }
    hasSetListeners && initialFetch();
  }, [hasSetListeners, scrollToBottom]);

  useEffect(() => {
    let chatCurrent;

    async function checkIfScrolledToTop(event) {
      if (event.target.scrollTop === 0) {
        if (hasMoreToFetch === false) return;
        setLoading(true);
        let { date, messages } = await fetchMessages(lastFetchDate);
        setLastFetchDate(date);
        setHasMoreToFetch(!!messages.length);
        setRoomMessages((prev) => [...messages, ...prev]);
        setLoading(false);
      }
    }

    if (chatRef?.current) {
      chatCurrent = chatRef.current;
      chatCurrent.removeEventListener('scroll', checkIfScrolledToTop);
      chatCurrent.addEventListener('scroll', checkIfScrolledToTop);
    }

    return () => {
      if (chatCurrent) {
        chatCurrent.removeEventListener('scroll', checkIfScrolledToTop);
      }
    };
  }, [chatRef, hasMoreToFetch, lastFetchDate]);

  async function addNewMessage({ text, imageData, audio }) {
    let tempMessageId = v4();
    let message = {
      status: 'sending',
      _id: tempMessageId,
      sentBy: rootData.user
    };
    try {
      text && (message.text = text);
      audio && (message.audio = audio);
      imageData && (message.image = imageData.imageBase64);

      setRoomMessages((prev) => [...prev, message]);

      let data = await sendMessage({
        ...message,
        image: imageData?.image
      });

      message = data.message;

      rootData.socket.emit('sent-message', message);

      setRoomMessages((previous) =>
        previous.map((prev) => {
          return prev._id === tempMessageId ? message : prev;
        })
      );
    } catch (err) {
      console.log(err);
      setRoomMessages((previous) =>
        previous.map((prev) => {
          return prev._id === tempMessageId ? { ...message, status: 'error' } : prev;
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
    <div className={styles['chat-room']}>
      <TopRibbon />
      <Chat ref={chatRef} messages={roomMessages} loading={loading}>
        {typingIndicator ? (
          <div className={styles['typing-indicator']}>Friend is typing ...</div>
        ) : null}
      </Chat>
      <Send ref={sendRef} addMessage={addNewMessage} scrollToBottom={scrollToBottom} />
    </div>
  );
}

export default ChatRoom;

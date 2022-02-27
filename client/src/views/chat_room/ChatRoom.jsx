import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import styles from './chat-room.module.css';

// Components
import Send from '../../components/chat_room/send/Send';
import Chat from '../../components/chat_room/chat/Chat';
import TopRibbon from '../../components/chat_room/top_ribbon/TopRibbon';
import NoUsersLeftModal from '../../components/chat_room/no_users_modal/NoUsersLeftModal';

// Context
import { useRoot } from '../../RootContext';

// Api
import { getRoom } from '../../mongo/room';
import { sendMessage, getMessagesByChunks } from '../../mongo/message.js';

// UUID
import { v4 } from 'uuid';

// ANTD
import { Button, message } from 'antd';

// Utilities
import { throttle } from '../../utilities/general.utilities';

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
  const rootData = useRoot();

  const chatRef = useRef(null);
  const sendRef = useRef(null);
  const endOfMessages = useRef(null);

  const [loading, setLoading] = useState(false);
  const [roomMessages, setRoomMessages] = useState([]);
  const [lastFetchDate, setLastFetchDate] = useState(null);
  const [hasMoreToFetch, setHasMoreToFetch] = useState(true);
  const [showNoUsersLeft, setShowNoUsersLeft] = useState(false);

  const [showNewMessage, setShowNewMessage] = useState(false);

  const [hasSetListeners, setHasSetListeners] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);

  // Socket listeners
  useEffect(() => {
    function handleNewMessage(message) {
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
      isOverflowing(chatRef) && setShowNewMessage(true);
    }

    function handleNewMember(data) {
      if (rootData.user !== data._id) {
        message.info('New user joined');
        setShowNoUsersLeft(false);
      }
    }

    function toggleTyping(value) {
      setTypingIndicator(value);
    }

    async function handleMemberLeave() {
      try {
        let { room } = await getRoom();
        if (room && room?.members?.length === 1) setShowNoUsersLeft(true);
        else message.info('A user left chat');
      } catch (err) {
        message.error(err.message);
      }
    }

    function setSocketListeners() {
      console.log('%c ChatRoom - Setting socket listeners', 'color: #bf55da');
      rootData.socket.on('typing', () => toggleTyping(true));
      rootData.socket.on('left-chat', async () => await handleMemberLeave());
      rootData.socket.on('finished-typing', () => toggleTyping(false));
      rootData.socket.on('new-member', (data) => handleNewMember(data));
      rootData.socket.on('new-message', (data) => handleNewMessage(data));
      setHasSetListeners(true);
    }

    setSocketListeners();

    return () => {
      rootData?.socket?.off('typing');
      rootData?.socket?.off('left-chat');
      rootData?.socket?.off('new-member');
      rootData?.socket?.off('new-message');
      rootData?.socket?.off('finished-typing');
    };
  }, [rootData.socket, rootData.user]);

  // Resize Observer (When send field expands vertically)
  useLayoutEffect(() => {
    let observer,
      localSendRef = sendRef.current,
      localChatRef = chatRef.current;

    function attachResizeObserver(observerVar, expandingElRef, shrinkingElRef) {
      // Resize the chat depending on the input field height
      observerVar = new ResizeObserver((entries) => {
        for (let entry of entries) {
          // TODO:
          shrinkingElRef.style.height = `calc(var(--vh, 1vh) * 100 - ${entry.target.offsetHeight}px - 55px)`;
        }
      });
      observerVar.observe(expandingElRef);
    }

    attachResizeObserver(observer, localSendRef, localChatRef);

    return () => {
      if (localChatRef?.current && observer) {
        observer?.unobserve(localSendRef);
      }
    };
  }, []);

  // Global View Height (Mobile 100vh Fix)
  useLayoutEffect(() => {
    function setGlobalVh() {
      let vh = window.innerHeight * 0.01;
      let root = document.querySelector(':root');
      root.style.setProperty('--vh', `${vh}px`);
      window.addEventListener('resize', setGlobalVh);
    }

    setGlobalVh();

    return () => {
      window.removeEventListener('resize', setGlobalVh);
    };
  }, []);

  // Initial Message Fetch
  useEffect(() => {
    async function initialFetch() {
      setLoading(true);
      let { date, messages } = await fetchMessages();
      setLastFetchDate(date);
      setRoomMessages((prev) => [...messages, ...prev]);
      setLoading(false);
      if (messages?.length && isOverflowing(chatRef)) setShowNewMessage(true);
    }
    hasSetListeners && initialFetch();
  }, [hasSetListeners]);

  // Fetch Messages on top scroll
  // TODO:
  useEffect(() => {
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
      console.log('CHAT REF', chatRef.current);
      console.log('%c ChatRoom - Adding scroll top event listener', 'color: #bf55da');
      // chatCurrent.removeEventListener('scroll', checkIfScrolledToTop);
      chatRef.current.addEventListener('scroll', checkIfScrolledToTop);
    }

    return () => {
      if (chatRef?.current) {
        console.log(
          '%c  ChatRoom - Removing scroll top event listener',
          'background: red; color: #fefefe'
        );
        console.log(chatRef.current);
        chatRef.current.removeEventListener('scroll', checkIfScrolledToTop);
      }
    };
  }, [chatRef, hasMoreToFetch, lastFetchDate]);

  // Hide new message on bottom scroll
  useEffect(() => {
    function checkIfScrolledToBottom(event) {
      let current = event.target.scrollHeight - event.target.scrollTop;
      let max = event.target.clientHeight;
      if (Math.abs(current - max) <= 10) {
        setShowNewMessage(false);
      }
    }

    function addScrollBottomListener() {
      chatRef.current.addEventListener('scroll', throttle(checkIfScrolledToBottom, 500));
    }

    addScrollBottomListener();

    return () => {
      chatRef.current.removeEventListener('scroll', throttle(checkIfScrolledToBottom, 500));
    };
  }, []);

  function isOverflowing(ref) {
    let value = false;
    // Is overflowing
    if (ref.current.scrollHeight > ref.current.clientHeight) {
      // Is not at the end
      if (ref.current.scrollTop !== ref.current.scrollHeight) {
        value = true;
      }
    }
    return value;
  }

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

  function scrollToBottom() {
    endOfMessages.current.scrollIntoView({ behavior: 'smooth' });
    setShowNewMessage(false);
  }

  return (
    <div className={styles['chat-room']}>
      <TopRibbon />
      <Chat ref={chatRef} messages={roomMessages} loading={loading}>
        {typingIndicator && !showNewMessage ? (
          <div className={styles['typing-indicator']}>Friend is typing ...</div>
        ) : null}
        <div ref={endOfMessages}></div>
        {showNewMessage ? (
          <Button onClick={scrollToBottom} className={styles['new-message']} type="dashed">
            New Message
          </Button>
        ) : null}
      </Chat>
      <Send ref={sendRef} addMessage={addNewMessage} scrollToBottom={scrollToBottom} />
      {showNoUsersLeft ? <NoUsersLeftModal show={showNoUsersLeft} /> : null}
    </div>
  );
}

export default ChatRoom;

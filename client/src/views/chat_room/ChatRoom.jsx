import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import styles from './chat-room.module.css';

// Components
import Send from '../../components/chat_room/send/Send';
import Chat from '../../components/chat_room/chat/Chat';
import TopRibbon from '../../components/chat_room/top_ribbon/TopRibbon';

// Context
import { useRoot } from '../../RootContext';

// Api
import { sendMessage, getMessagesByChunks } from '../../mongo/message.js';

// UUID
import { v4 } from 'uuid';

// ANTD
import { message } from 'antd';
import { getRoom } from '../../mongo/room';
import NoUsersLeftModal from '../../components/chat_room/no_users_modal/NoUsersLeftModal';

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

  const [loading, setLoading] = useState(false);
  const [roomMessages, setRoomMessages] = useState([]);
  const [lastFetchDate, setLastFetchDate] = useState(null);
  const [hasMoreToFetch, setHasMoreToFetch] = useState(true);
  const [showNoUsersLeft, setShowNoUsersLeft] = useState(false);

  const [hasSetListeners, setHasSetListeners] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);

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
      scrollToBottom();
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
      rootData.socket.off('typing');
      rootData.socket.off('left-chat');
      rootData.socket.off('new-member');
      rootData.socket.off('new-message');
      rootData.socket.off('finished-typing');
    };
  }, [rootData.socket, rootData.user, scrollToBottom]);

  useLayoutEffect(() => {
    let observer, localSendRef, localChatRef;

    function attachResizeObserver(expandingElRef, shrinkingElRef) {
      console.log('%c ChatRoom - Resize observer', 'color: #bf55da');
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
      if (localChatRef?.current && observer) {
        console.log('%c  ChatRoom - Removing observer', 'background: red; color: #fefefe');
        observer.unobserve(localSendRef);
      }
    };
  }, [sendRef]);

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

  useEffect(() => {
    async function initialFetch() {
      console.log('%c ChatRoom - Fetching the initial messages', 'color: #bf55da');
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
    if (chatRef?.current) {
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
      {showNoUsersLeft ? <NoUsersLeftModal show={showNoUsersLeft} /> : null}
    </div>
  );
}

export default ChatRoom;

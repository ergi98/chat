import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './chat.module.css';

// Components
import Message from '../message/Message';

// ANTD
import { Spin, Empty } from 'antd';

const Chat = React.forwardRef(({ loadMore, messages, loading, children }, ref) => {
  // An object with each day as key and an array of messages as value
  const [groupedMessages, setGroupedMessages] = useState({});
  const [observerSet, setObserverSet] = useState(false);

  const topRef = useRef(null);

  const emitFetch = useCallback(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          let oldScrollTop = ref.current.scrollTop;
          let oldScrollHeight = ref.current.scrollHeight;
          let oldScrollDiff = oldScrollHeight - ref.current.clientHeight;
          await loadMore();
          if (oldScrollHeight === ref.current.scrollHeight) return;
          let value;
          let newScroll = ref.current.scrollHeight - ref.current.clientHeight;
          oldScrollTop === 0
            ? (value = ref.current.scrollHeight)
            : (value = oldScrollTop + 100 + newScroll - oldScrollDiff);
          ref.current.scrollTop = value;
        }
      });
    },
    [loadMore, ref]
  );

  useEffect(() => {
    let topElementRef = null;
    let observer = null;

    function setTopObserver() {
      if (!topRef.current || !ref) return;
      topElementRef = topRef.current;
      observer = new IntersectionObserver(emitFetch, {
        threshold: 1,
        root: ref.current,
        rootMargin: '250px'
      });
      observer.observe(topElementRef);
      setObserverSet(true);
    }

    setTopObserver();

    return () => {
      if (observer && topElementRef) {
        observer.disconnect(topElementRef);
      }
    };
  }, [emitFetch, topRef, observerSet, ref]);

  useEffect(() => {
    function groupMessagesByDay(messageArray) {
      if (!Array.isArray(messageArray) || messageArray?.length === 0)
        return { [formatMessageDate(new Date())]: [] };

      let groupedMessages = {};

      for (let message of messageArray) {
        let groupDateKey = formatMessageDate(message.sentAt ?? new Date());
        let messageObject = { ...message };
        groupedMessages[groupDateKey]
          ? groupedMessages[groupDateKey].push(messageObject)
          : (groupedMessages[groupDateKey] = [messageObject]);
      }

      return groupedMessages;
    }

    function formatMessageDate(date) {
      let dateObj = new Date(date);
      // 13 Mon 2022
      return `${dateObj.getDate()} ${mapMonth(dateObj.getMonth())} ${dateObj.getFullYear()}`;
    }

    function mapMonth(index) {
      let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      return months[index];
    }
    let groupedMessages = groupMessagesByDay(messages);
    setGroupedMessages(groupedMessages);
  }, [messages]);

  return (
    <div ref={ref} className={styles.chat}>
      <div ref={topRef}>Hello</div>
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : Array.isArray(messages) && messages?.length ? (
        <>
          {Object.entries(groupedMessages).map(([date, messageArray]) => (
            <div key={date}>
              {date ? <div className={styles['date-header']}>{date}</div> : null}
              {messageArray.map((message) => (
                <Message key={message._id} message={message} />
              ))}
            </div>
          ))}
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {children}
    </div>
  );
});

Chat.displayName = 'Chat';

export default Chat;

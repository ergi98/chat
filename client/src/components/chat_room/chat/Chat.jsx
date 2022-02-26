import React, { useState, useEffect } from 'react';
import styles from './chat.module.css';

// Components
import Message from '../message/Message';

// ANTD
import { Spin, Empty } from 'antd';

const Chat = React.forwardRef((props, ref) => {
  // An object with each day as key and an array of messages as value
  const [groupedMessages, setGroupedMessages] = useState({});

  useEffect(() => {
    function groupMessagesByDay(messageArray) {
      console.log('%c Chat - Grouping Messages', 'color: #bf55da');
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
    let groupedMessages = groupMessagesByDay(props.messages);
    setGroupedMessages(groupedMessages);
  }, [props.messages]);

  return (
    <div ref={ref} className={styles.chat}>
      {props.loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : props.messages.length ? (
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
      {props.children}
    </div>
  );
});

Chat.displayName = 'Chat';

export default Chat;

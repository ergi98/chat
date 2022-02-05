import React from 'react';
import styles from './message.module.css';

// Context
import { useRoot } from '../RootContext';

// Animation
import { motion } from 'framer-motion';

// Antd
import { Button } from 'antd';

import { ExclamationCircleFilled, LoadingOutlined, CheckOutlined } from '@ant-design/icons';

function Message({ message }) {
  const rootData = useRoot();

  function displayDate(date) {
    let localDate = new Date(date);
    let hours = localDate.getHours().toString().padStart(2, '0');
    let minutes = localDate.getMinutes().toString().padStart(2, '0');
    let output = `${hours}:${minutes}`;
    return output;
  }

  let variants = {
    initial: {
      x: message.sentBy === rootData.user ? '50%' : '-50%',
      rotate: '20deg'
    },
    final: {
      x: '0',
      rotate: '0deg'
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="final"
      variants={variants}
      className={`${styles.message} ${
        message.sentBy === rootData.user ? styles.mine : styles.theirs
      } ${message.status === 'error' ? styles.error : ''}`}>
      <div className={styles.content}>
        <span>{message.text}</span>
        <div className={styles['bottom-row']}>
          <span className={styles['sent-at']}>
            {message.status === 'sent' ? displayDate(message.sentAt) : ''}
          </span>
          {/* className={styles["check-svg"]} */}
          {message.status === 'sent' ? (
            <CheckOutlined className={styles['check-svg']} />
          ) : message.status === 'sending' ? (
            <LoadingOutlined />
          ) : null}
        </div>
        {/* Resend icon */}
        {message.sentBy === rootData.user && message.status === 'error' ? (
          <Button
            className={styles['resend-button']}
            icon={<ExclamationCircleFilled className={styles['resend-icon']} />}
            shape="round"
            size="large"
            type="text"
            danger
          />
        ) : null}
      </div>
    </motion.div>
  );
}

export default Message;

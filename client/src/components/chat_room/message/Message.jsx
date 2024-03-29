import React, { useMemo } from 'react';
import styles from './message.module.css';

// Context
import { useRoot } from '../../../RootContext';

// Animation
import { AnimatePresence, motion } from 'framer-motion';

// Antd
import { Button, Image } from 'antd';

import { ExclamationCircleFilled, LoadingOutlined, CheckOutlined } from '@ant-design/icons';

// Components
import AudioPlayer from '../audio_player/AudioPlayer';

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
      x: message.sentBy === rootData.user ? '20px' : '-20px',
      rotate: '20deg'
    },
    final: {
      x: '0',
      rotate: '0deg'
    }
  };

  const messageImage = useMemo(() => {
    if (message.audio || !message.image) return null;

    return (
      <Image
        // eslint-disable-next-line no-undef
        src={`${process.env.REACT_APP_PROXY}${message.image}`}
        className={styles['message-image']}
        preview={false}
        width={320}
      />
    );
  }, [message.image, message.audio]);

  const messageText = useMemo(() => {
    if (message.audio || !message.text) return null;
    return <div className={styles['message-text']}>{message.text}</div>;
  }, [message.text, message.audio]);

  const spacer = useMemo(() => {
    if (message.audio || !(message.image && message.text)) return null;
    return <div className={styles.spacer}></div>;
  }, [message.text, message.image, message.audio]);

  const messageDate = useMemo(
    () => (message.status === 'sent' ? displayDate(message.sentAt) : null),
    [message.sentAt, message.status]
  );

  const messageStatus = useMemo(() => {
    let icon = null;
    switch (message.status) {
      case 'sent':
        icon = <CheckOutlined />;
        break;
      case 'sending':
        icon = <LoadingOutlined />;
        break;
    }
    return icon;
  }, [message.status]);

  const resendOption = useMemo(() => {
    if (message.sentBy === rootData.user && message.status === 'error')
      <Button
        className={styles['resend-button']}
        icon={<ExclamationCircleFilled className={styles['resend-icon']} />}
        shape="round"
        size="large"
        type="text"
        danger
      />;
    else return null;
  }, [message.sentBy, message.status, rootData.user]);

  const messageStyles = useMemo(() => {
    let msgStyles = styles.message;
    message.sentBy === rootData.user
      ? (msgStyles += ` ${styles.mine}`)
      : (msgStyles += ` ${styles.theirs}`);
    message.status === 'error' && (msgStyles += ` ${styles.error}`);
    return msgStyles;
  }, [message.sentBy, rootData.user, message.status]);

  const messageAudio = useMemo(() => {
    if (!message.audio) return null;
    // eslint-disable-next-line no-undef
    return <AudioPlayer src={`${process.env.REACT_APP_PROXY}${message.audio}`} />;
  }, [message.audio]);

  // TODO: Animate presence
  return (
    <AnimatePresence>
      {message && (
        <motion.div initial="initial" animate="final" variants={variants} className={messageStyles}>
          <div className={styles.content}>
            {messageImage}
            {spacer}
            {messageText}
            {messageAudio}
            <div className={styles['bottom-row']}>
              <span className={styles['sent-at']}>{messageDate}</span>
              {messageStatus}
            </div>
            {resendOption}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Message;

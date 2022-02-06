import React, { useState, useRef } from 'react';
import styles from './send.module.css';

import { Input, Button } from 'antd';
import { SendOutlined, AudioOutlined, CameraOutlined } from '@ant-design/icons';

// Components
import GlassDiv from './GlassDiv';

// Context
import { useRoot } from '../RootContext';
import CameraModal from './CameraModal';

const { TextArea } = Input;

const Send = React.forwardRef((props, ref) => {
  const [userInput, setUserInput] = useState(null);

  const inputRef = useRef(null);
  const [hasEmitted, setHasEmitted] = useState(false);

  const rootData = useRoot();

  // Camera Modal
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);

  function handleUserInput(event) {
    if (event.target.value !== '' && !hasEmitted) {
      emitTyping();
    } else if (!event.target.value) {
      emitStopTyping();
    }
    setUserInput(event.target.value);
  }

  function emitTyping() {
    rootData.socket.emit('typing', {
      room: rootData.room,
      user: rootData.user
    });
    setHasEmitted(true);
  }

  function emitStopTyping() {
    rootData.socket.emit('finished-typing', {
      room: rootData.room,
      user: rootData.user
    });
    setHasEmitted(false);
  }

  async function submitMessage(event) {
    event.preventDefault();
    inputRef.current.focus();
    if (typeof userInput === 'string' && userInput !== '') await props.addMessage(userInput);
    setUserInput(null);
    emitStopTyping();
  }

  function toggleCameraModal() {
    setIsCameraModalVisible((prev) => !prev);
  }

  function toggleAudioMode() {}

  function submitImage(file) {
    console.log(file);
  }

  return (
    <GlassDiv ref={ref} className={styles.container}>
      <form onSubmit={submitMessage} className={styles.form}>
        <Button
          className={styles['action-button']}
          onClick={toggleCameraModal}
          icon={<CameraOutlined />}
          shape="circle"
          size="large"
          type="text"
        />
        <Button
          className={styles['action-button']}
          onClick={toggleAudioMode}
          icon={<AudioOutlined />}
          shape="circle"
          size="large"
          type="text"
        />
        <div className={styles['input-container']}>
          <TextArea
            ref={inputRef}
            onFocus={props.scrollToBottom}
            value={userInput}
            onPressEnter={submitMessage}
            onChange={handleUserInput}
            autoSize={{ minRows: 1, maxRows: 6 }}
            bordered={false}
            className={styles['input-field']}
            placeholder="Write something..."
          />
          <Button
            onClick={submitMessage}
            icon={<SendOutlined />}
            shape="circle"
            size="large"
            type="primary"
          />
        </div>
      </form>
      {isCameraModalVisible ? (
        <CameraModal
          isVisible={isCameraModalVisible}
          close={toggleCameraModal}
          onCapture={submitImage}
        />
      ) : null}
    </GlassDiv>
  );
});

Send.displayName = 'Send';

export default Send;

import React, { useState, useRef } from 'react';
import styles from './send.module.css';

import { Input, Button, Image } from 'antd';
import { SendOutlined, AudioOutlined, CameraOutlined, CloseOutlined } from '@ant-design/icons';

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

  const [imageData, setImageData] = useState({
    image: null,
    imageBase64: null
  });

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
    if (
      (typeof userInput === 'string' && userInput !== '') ||
      (imageData.image !== null && imageData.imageBase64 !== null)
    ) {
      let message = { text: userInput };
      if (imageData.image && imageData.imageBase64) {
        message.imageData = imageData;
      }
      setUserInput(null);
      if (imageData.image && imageData.imageBase64) setSelectedImage();
      emitStopTyping();
      await props.addMessage(message);
    }
  }

  function toggleCameraModal() {
    setIsCameraModalVisible((prev) => !prev);
  }

  function toggleAudioMode() {}

  function setSelectedImage(imageData = { imageBase64: null, image: null }) {
    setImageData(imageData);
  }

  return (
    <GlassDiv ref={ref} className={styles.container}>
      {imageData.imageBase64 ? (
        <div className={styles['image-container']}>
          <Image height={150} preview={false} src={imageData.imageBase64}></Image>
          <Button
            onClick={setSelectedImage}
            className={styles['remove-image']}
            icon={<CloseOutlined className={styles['close-icon']} />}
            shape="circle"
            type="text"
          />
        </div>
      ) : null}
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
          setSelectedImage={setSelectedImage}
          isVisible={isCameraModalVisible}
          close={toggleCameraModal}
        />
      ) : null}
    </GlassDiv>
  );
});

Send.displayName = 'Send';

export default Send;

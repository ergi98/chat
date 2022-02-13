import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './send.module.css';

import { Input, Button, Image, Tooltip } from 'antd';
import { SendOutlined, AudioOutlined, CameraOutlined, CloseOutlined } from '@ant-design/icons';

// Components
import GlassDiv from './GlassDiv';

// Context
import { useRoot } from '../RootContext';
import CameraModal from './CameraModal';

const { TextArea } = Input;

let audioRecorder;

const Send = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);

  const [userInput, setUserInput] = useState(null);
  const [hasEmitted, setHasEmitted] = useState(false);

  const [recordingData, setRecordingData] = useState({
    chunks: [],
    audioUrl: '',
    recording: false
  });

  const [imageData, setImageData] = useState({
    image: null,
    imageBase64: null
  });

  const rootData = useRoot();

  // Camera Modal
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);

  useEffect(() => {
    async function startRecording() {
      try {
        if (!recordingData.recording) return;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          let audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true
          });
          audioRecorder = new MediaRecorder(audioStream);
          audioRecorder.start(1000);
          audioRecorder.ondataavailable = storeAudioChunk;
        }
      } catch (err) {
        console.log(err);
      }
    }

    function storeAudioChunk(event) {
      setRecordingData((prev) => {
        return { ...prev, chunks: [...prev.chunks, event.data] };
      });
    }

    startRecording();

    return () => {
      if (audioRecorder) {
        audioRecorder.stop();
        audioRecorder = null;
      }
    };
  }, [recordingData.recording]);

  useEffect(() => {
    function storeRecording() {
      if (Array.isArray(recordingData.chunks) && recordingData.chunks?.length) {
        const audioBlob = new Blob(recordingData.chunks, { type: 'audio/ogg; codecs=opus' });
        setRecordingData((prev) => {
          return {
            ...prev,
            audioUrl: window.URL.createObjectURL(audioBlob)
          };
        });
      }
    }
    audioRecorder && (audioRecorder.onstop = storeRecording);
  }, [recordingData.chunks]);

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
    if (typeof userInput === 'string' && userInput !== '') inputRef.current.focus();
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
    } else if (recordingData.audioUrl !== '') {
      let message = { audio: recordingData.audioUrl };
      await props.addMessage(message);
    }
  }

  function toggleCameraModal() {
    setIsCameraModalVisible((prev) => !prev);
  }

  function toggleAudioMode() {
    setRecordingData((prev) => {
      return {
        ...prev,
        recording: !prev.recording,
        chunks: !prev.recording ? [] : prev.chunks
      };
    });
  }

  const getRecordingLength = useMemo(() => {
    let chunkLength = recordingData.chunks.length;
    let min = 0,
      sec = 0;
    while (chunkLength > 0) {
      // 60sec = 1min
      if (chunkLength > 60) {
        min++;
        chunkLength -= 60;
      } else {
        sec++;
        chunkLength -= 1;
      }
    }
    sec = sec.toString().padStart(2, '0');
    min = min.toString().padStart(2, '0');
    return `${min}:${sec}`;
  }, [recordingData.chunks.length]);

  function setSelectedImage(imageData = { imageBase64: null, image: null }) {
    setImageData(imageData);
  }

  const getPlaceholderText = useMemo(() => {
    let msg = 'Write something...';
    if (recordingData.recording) msg = 'Recording...';
    else if (!recordingData.recording && recordingData.chunks.length) msg = 'Audio Recorded!';
    return msg;
  }, [recordingData.recording, recordingData.chunks]);

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
          disabled={recordingData.chunks.length || recordingData.recording}
          shape="circle"
          size="large"
          type="text"
        />
        <Tooltip
          title={getRecordingLength}
          visible={recordingData.chunks.length || recordingData.recording}
          color={'blue'}
        >
          <Button
            className={styles['action-button']}
            onClick={toggleAudioMode}
            type={recordingData.recording ? 'primary' : 'text'}
            icon={<AudioOutlined />}
            shape="circle"
            size="large"
          />
        </Tooltip>
        <div className={styles['input-container']}>
          <TextArea
            ref={inputRef}
            bordered={false}
            value={userInput}
            onChange={handleUserInput}
            onPressEnter={submitMessage}
            onFocus={props.scrollToBottom}
            placeholder={getPlaceholderText}
            className={styles['input-field']}
            autoSize={{ minRows: 1, maxRows: 6 }}
            disabled={recordingData.chunks.length || recordingData.recording}
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

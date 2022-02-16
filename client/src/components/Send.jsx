import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './send.module.css';

import { Input, Button, Image, Tooltip } from 'antd';
import {
  SendOutlined,
  AudioOutlined,
  CameraOutlined,
  CloseOutlined,
  AudioMutedOutlined
} from '@ant-design/icons';

// Components
import GlassDiv from './GlassDiv';
import CameraModal from './CameraModal';

// Context
import { useRoot } from '../RootContext';

const { TextArea } = Input;

let audioRecorder;
let audioAnalyzer;

function getSupportedMime() {
  const types = [
    'audio/mpeg',
    'audio/webm',
    'audio/webm;codecs=opus',
    'audio/ogg',
    'audio/opus',
    'audio/wav',
    'audio/aac',
    'audio/3gpp',
    'audio/3gpp2',
    'audio/midi',
    'audio/x-midi'
  ];

  for (let type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
}

const supportedMime = getSupportedMime();

const Send = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);

  const [userInput, setUserInput] = useState(null);
  const [hasEmitted, setHasEmitted] = useState(false);

  const [recordingData, setRecordingData] = useState({
    chunks: [],
    audioFile: '',
    visualizer: [],
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
          if (!supportedMime) throw new Error('No mime support');
          audioRecorder = new MediaRecorder(audioStream, {
            mimeType: supportedMime,
            audioBitsPerSecond: 128000,
            audioBitrateMode: 'constant'
          });
          const audioContext = new AudioContext();
          audioAnalyzer = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(audioStream);
          audioAnalyzer.fftSize = 64;

          source.connect(audioAnalyzer);

          setTimeout(() => {
            audioRecorder.stop();
            audioRecorder = null;
            setRecordingData((prev) => {
              return {
                ...prev,
                recording: !prev.recording
              };
            });
          }, 5 * 60 * 1000);

          audioRecorder.start(1000);
          audioRecorder.ondataavailable = storeAudioChunk;
        }
      } catch (err) {
        console.log(err);
      }
    }

    function storeAudioChunk(event) {
      let bufferLength = audioAnalyzer.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);
      audioAnalyzer.getByteTimeDomainData(dataArray);
      console.log(dataArray);
      setRecordingData((prev) => {
        return {
          ...prev,
          chunks: [...prev.chunks, event.data],
          visualizer: [...prev.visualizer, ...dataArray]
        };
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
    async function storeRecording() {
      if (Array.isArray(recordingData.chunks) && recordingData.chunks?.length) {
        const audioBlob = new Blob(recordingData.chunks, { type: supportedMime });
        // await visualizeAudio(audioBlob);
        setRecordingData((prev) => {
          return {
            ...prev,
            audioFile: new File([audioBlob], `recording.mp3`, {
              type: supportedMime
            })
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

    // Conditions
    let sendingText = typeof userInput === 'string' && userInput !== '';
    let sendingImage = imageData.image !== null && imageData.imageBase64 !== null;
    let sendingAudio = recordingData.audioFile !== '';

    if (sendingText) inputRef.current.focus();

    if (sendingText || sendingImage || sendingAudio) {
      let message = {};

      // Populating
      sendingText && (message.text = userInput);
      sendingImage && (message.imageData = imageData);
      sendingAudio && (message.audio = recordingData.audioFile);

      // Cleanup
      sendingImage && setSelectedImage();
      if (sendingText) {
        setUserInput(null);
        emitStopTyping();
      }
      sendingAudio && clearAudioRecording();

      console.log('SEND', message);
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

  function clearAudioRecording() {
    setRecordingData((prev) => {
      return {
        ...prev,
        chunks: [],
        audioFile: ''
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

  const isRecordingAudio = useMemo(() => {
    let chunkLength = recordingData.chunks.length;
    let recording = recordingData.recording;
    return recording || (!recording && chunkLength);
  }, [recordingData.recording, recordingData.chunks.length]);

  const hasPendingAudio = useMemo(() => {
    let chunkLength = recordingData.chunks.length;
    let recording = recordingData.recording;
    return !recording && chunkLength;
  }, [recordingData.chunks.length, recordingData.recording]);

  const getPlaceholderText = useMemo(() => {
    let msg = 'Write something...';
    if (recordingData.recording) msg = 'Recording...';
    else if (!recordingData.recording && recordingData.chunks.length)
      msg = 'Tap button to send recorded audio...';
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
          disabled={isRecordingAudio}
          shape="circle"
          size="large"
          type="text"
        />
        <Tooltip title={getRecordingLength} visible={isRecordingAudio} color={'blue'}>
          <Button
            className={styles['action-button']}
            onClick={hasPendingAudio ? clearAudioRecording : toggleAudioMode}
            type={recordingData.recording ? 'primary' : 'text'}
            icon={hasPendingAudio ? <AudioMutedOutlined /> : <AudioOutlined />}
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
            disabled={isRecordingAudio}
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

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import styles from './message.module.css';

// Context
import { useRoot } from '../RootContext';

// Animation
import { motion } from 'framer-motion';

// Antd
import { Button, Image } from 'antd';

import { ExclamationCircleFilled, LoadingOutlined, CheckOutlined } from '@ant-design/icons';

function Message({ message }) {
  const rootData = useRoot();
  const audioCanvas = useRef(null);

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

  const messageImage = useMemo(() => {
    if (message.audio || !message.image) return null;

    return (
      <Image
        src={`http://${window.location.hostname}:5050/${message.image}`}
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
    () => (message.status === 'sent' ? displayDate(message.sentAt) : ''),
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

  useLayoutEffect(() => {
    async function displayAudioBars() {
      // Canvas
      const canvas = audioCanvas.current;
      canvas.height = 45;
      canvas.width = window.innerWidth * 0.5 > 350 ? 350 : window.innerWidth * 0.5;
      const canvasContext = canvas.getContext('2d');

      // Audio
      const audio = await fetch(`http://${window.location.hostname}:5050/${message.audio}`);
      const audioBuffer = await audio.arrayBuffer();
      console.log(audioBuffer)
      const audioContext = new AudioContext();
      audioContext.decodeAudioData(audioBuffer);

      console.log(audioBuffer);
      // let filteredAudioData = filterData(audioBuffer);

      // console.log(filteredAudioData);

      // let analyser = audioContext.createAnalyser();
      // audioSource.connect(analyser);
      // analyser.connect(audioContext.destination);
      // analyser.fftSize = 32;

      // console.log(analyser);

      // const bufferLength = analyser.frequencyBinCount;
      // const dataArray = new Uint8Array(bufferLength);

      // const barWidth = canvas.width / bufferLength;
      // let barHeight;
      // let x;
      // analyser.getByteFrequencyData(dataArray);

      // for (let i = 0; i < bufferLength; i++) {
      //   barHeight = dataArray[i];
      //   console.log(barHeight);
      //   canvasContext.fillStyle = 'white';
      //   canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      //   x += barWidth;
      // }
    }

    function filterData(audioBuffer) {
      const rawData = audioBuffer.getChannelData(0);
      const samples = 70;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum = sum + Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }
      return filteredData;
    }

    message.audio && displayAudioBars();
  }, [message.audio]);

  const messageAudio = useMemo(() => {
    if (!message.audio) return null;
    return <canvas ref={audioCanvas}></canvas>;
  }, [message.audio]);

  return (
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
  );
}

export default Message;

import React, { useEffect, useRef, useState } from 'react';
import styles from './camera-modal.module.css';

// Antd
import { Modal, Button, Space, Upload } from 'antd';

// Icons
import { CloseOutlined, CameraOutlined, FileImageOutlined, RedoOutlined } from '@ant-design/icons';

function CameraModal({ isVisible, close }) {
  const videoRef = useRef(null);

  const [facingMode, setFacingMode] = useState('user');
  const [image, setImage] = useState('');
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let currentVideo = videoRef.current;
    let videoStream;
    async function setVideoSource() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          let deviceWidth = window.innerWidth;
          let deviceHeight = window.innerHeight;
          let videoWidth = deviceWidth - 60 > 470 ? 470 : deviceWidth - 65;
          let videoHeight = 0.5 * deviceHeight;
          setVideoDimensions({
            width: videoWidth,
            height: videoHeight
          });
          videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: videoWidth,
              height: videoHeight,
              facingMode: facingMode ? 'user' : 'environment'
            }
          });
          currentVideo.srcObject = videoStream;
          currentVideo.onloadedmetadata = () => {
            currentVideo.play();
          };
        }
      } catch (err) {
        console.log(err);
      }
    }

    videoRef.current && setVideoSource();

    return () => {
      videoStream.getTracks().forEach((track) => {
        if (track.readyState == 'live' && track.kind === 'video') track.stop();
      });
    };
  }, [facingMode, videoRef]);

  function flipCamera() {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }

  async function uploadPhoto(event) {
    try {
      let file = await shrinkFileSize(event.file.originFileObj);
      console.log(file);
    } catch (err) {
      console.log(err);
    }
  }

  function shrinkFileSize(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        let resizedImage;
        reader.onload = () => {
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement('canvas');
            let maxSize = 1200;
            let width = image.width;
            let height = image.height;

            if (width > height && width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            } else if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;

            canvas.getContext('2d').drawImage(0, 0, width, height);
            resizedImage = canvas.toDataURL('image/jpeg');
            resolve(resizedImage);
          };
        };
        reader.readAsDataURL(file);
      } catch (err) {
        reject(err);
        console.log(err);
      }
    });
  }

  function clearPreviousPhoto() {}

  function capturePhoto() {}

  function captureOrClearPhoto() {
    image ? clearPreviousPhoto() : capturePhoto();
  }

  return (
    <Modal
      title={
        <div className="modal-header">
          <div className="header-content">
            <div></div>
            <Button
              onClick={() => close()}
              icon={<CloseOutlined className={styles['close-icon']} />}
              shape="circle"
              type="text"
            />
          </div>
        </div>
      }
      footer={null}
      closable={false}
      visible={isVisible}
      autoFocusButton={null}
      bodyStyle={{
        background: 'var(--dark-bg)'
      }}
      maskStyle={{
        background: 'var(--overlay)'
      }}
      onCancel={() => close()}
      destroyOnClose={true}>
      <div className={styles['video-container']}>
        {image ? (
          <canvas></canvas>
        ) : (
          <video ref={videoRef}>
            <source></source>
          </video>
        )}
      </div>
      <div className={styles['button-holder']}>
        <Space>
          <Upload onChange={uploadPhoto} showUploadList={false} accept="image/*" maxCount={1}>
            <Button type="text" shape="circle">
              <FileImageOutlined className={styles['close-icon']} />
            </Button>
          </Upload>
          <Button onClick={captureOrClearPhoto} shape="circle" type="primary" size="large">
            {image ? <CloseOutlined /> : <CameraOutlined />}
          </Button>
          <Button onClick={flipCamera} type="text">
            <RedoOutlined className={styles['close-icon']} />
          </Button>
        </Space>
      </div>
    </Modal>
  );
}

export default CameraModal;

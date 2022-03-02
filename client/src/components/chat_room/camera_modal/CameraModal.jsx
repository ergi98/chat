import React, { useEffect, useRef, useState } from 'react';
import styles from './camera-modal.module.css';

// Antd
import { Modal, Button, Space, Upload, Image as ImageTag } from 'antd';

// Icons
import {
  CloseOutlined,
  CameraOutlined,
  FileImageOutlined,
  RedoOutlined,
  CheckOutlined
} from '@ant-design/icons';

let videoStream;

function CameraModal({ isVisible, setSelectedImage, close }) {
  const videoRef = useRef(null);
  const captureCanvas = useRef(null);

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  const [facingMode, setFacingMode] = useState('user');
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    async function setVideoSource(currentVideo) {
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

    if (videoRef.current && !imageBase64) setVideoSource(videoRef.current);

    return () => {
      if (videoStream) {
        videoStream.getTracks()?.forEach((track) => {
          if (track.readyState == 'live' && track.kind === 'video') track.stop();
        });
      }
    };
  }, [facingMode, imageBase64, videoRef]);

  function flipCamera() {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }

  async function uploadPhoto(event) {
    try {
      if (loading) return;
      setLoading(true);
      let file = await shrinkImage(event.file.originFileObj);
      setImage(event.file.originFileObj);
      setImageBase64(file);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function shrinkImage(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        let resizedImage;
        reader.onload = () => {
          const image = new Image();
          image.src = reader.result;
          image.onload = () => {
            const canvas = document.createElement('canvas');

            let width = image.width;
            let height = image.height;

            if (width > height) {
              if (width > videoDimensions.width) {
                height *= videoDimensions.width / width;
                width = videoDimensions.width;
              }
            } else if (height > videoDimensions.height) {
              width *= videoDimensions.height / height;
              height = videoDimensions.height;
            }

            canvas.width = width;
            canvas.height = height;

            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            resizedImage = canvas.toDataURL();
            resolve(resizedImage);
          };
        };
        reader.onerror = (err) => {
          reject(err);
          console.log(err);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        reject(err);
        console.log(err);
      }
    });
  }

  const clearPreviousPhoto = () => setImageBase64('');

  function capturePhoto() {
    try {
      let captureContext = captureCanvas.current.getContext('2d');

      captureCanvas.current.width = videoDimensions.width;
      captureCanvas.current.height = videoDimensions.height;

      captureContext.drawImage(
        videoRef.current,
        0,
        0,
        videoDimensions.width,
        videoDimensions.height
      );
      let base64 = captureCanvas.current.toDataURL('image/jpg');
      let image = formImageFileFromBase64(base64);
      setImageBase64(base64);
      setImage(image);
    } catch (err) {
      console.log({ err });
    }
  }

  function formImageFileFromBase64(base64) {
    let parts = base64.split(',');
    let mime = parts[0].match(/:(.*?);/)[1];
    let bstr = atob(parts[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], 'user-screenshot.jpg', { type: mime });
  }

  function selectPhoto() {
    setSelectedImage({
      image,
      imageBase64
    });
    close();
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
      destroyOnClose={true}
    >
      <div className={styles['video-container']}>
        {imageBase64 ? (
          <div className={styles['image-preview']}>
            <ImageTag preview={false} src={imageBase64} />
          </div>
        ) : (
          <>
            <video ref={videoRef}>
              <source></source>
            </video>
            <canvas ref={captureCanvas} style={{ display: 'none' }}></canvas>
          </>
        )}
      </div>
      <div className={styles['button-holder']}>
        <Space>
          {imageBase64 ? (
            <>
              <Button onClick={clearPreviousPhoto} type="text" shape="circle">
                <CloseOutlined className={styles['close-icon']} />
              </Button>
              <Button onClick={selectPhoto} shape="circle" type="primary" size="large">
                <CheckOutlined />
              </Button>
              <div style={{ width: '32px', height: '32px' }}></div>
            </>
          ) : (
            <>
              <Upload
                onChange={uploadPhoto}
                showUploadList={false}
                accept="image/*"
                action="#"
                maxCount={1}
              >
                <Button type="text" shape="circle">
                  <FileImageOutlined className={styles['close-icon']} />
                </Button>
              </Upload>
              <Button onClick={capturePhoto} shape="circle" type="primary" size="large">
                <CameraOutlined />
              </Button>
              <Button onClick={flipCamera} shape="circle" type="text">
                <RedoOutlined className={styles['close-icon']} />
              </Button>
            </>
          )}
        </Space>
      </div>
    </Modal>
  );
}

export default CameraModal;

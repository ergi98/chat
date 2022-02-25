import React, { useState, useEffect } from 'react';
import styles from './paste-link.module.css';

// Icons
import { CloseOutlined } from '@ant-design/icons';

// ANTD
import { Button, Modal, Input } from 'antd';

// Mongo
import { createUserAndAssignToRoom } from '../../../mongo/user';

// Root
import { useRootUpdate } from '../../../RootContext';

function PasteLinkDialog(props) {
  const updateRootData = useRootUpdate();

  const [roomLink, setRoomLink] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [status, setStatus] = useState({
    type: '',
    message: ''
  });

  useEffect(() => {
    function getLinkFromClipboard() {
      navigator.permissions.query({ name: 'clipboard-read' }).then((result) => {
        if (result.state == 'granted' || result.state == 'prompt') {
          navigator.clipboard.readText().then((text) => {
            if (text) {
              let bits = text.split('\n');
              if (bits.length) {
                let url = bits[1];
                if (url && url?.includes(window.location.href)) {
                  setRoomLink(url);
                  setStatus({
                    type: 'success',
                    message: 'We found a link in your clipboard and pasted it for you!'
                  });
                }
              }
            }
          });
        }
      });
    }
    getLinkFromClipboard();
  }, []);

  function handleInputChange(event) {
    let text = event.target.value;
    setRoomLink(text);
  }

  const closeDialog = () => props.toggle(false);

  function getRoomIdFromUrl(url) {
    let msg = 'The link you entered is not a valid room link!';
    if (!url || typeof url !== 'string') throw new Error(msg);
    let id;
    let bits = url.split(`${window.location.href}join/`);
    bits.length === 2 && (id = bits[1]);
    if (!id || typeof id !== 'string') throw new Error(msg);
    return id;
  }

  async function attemptToJoinRoom() {
    try {
      if (status.type === 'error') {
        setStatus({
          type: '',
          message: ''
        });
      }
      if (!roomLink) {
        throw new Error('Please specify a room link to join!');
      } else if (!roomLink.includes(window.location.href)) {
        throw new Error('The link you entered is not a valid room link!');
      }
      setIsJoining(true);
      let id = getRoomIdFromUrl(roomLink);
      let data = await createUserAndAssignToRoom(id);
      updateRootData({
        jwt: data.token,
        user: data.user._id,
        room: data.room._id
      });
      setStatus({
        type: 'success',
        message: 'All set! Redirecting you to your chat room.'
      });
      props.success(data.room._id, data.token);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message
      });
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <Modal
      title={
        <div className="modal-header">
          <div className="header-content">
            <div className={styles.header}>Enter your Link</div>
            <Button
              onClick={closeDialog}
              icon={<CloseOutlined className={styles['text']} />}
              shape="circle"
              type="text"
            />
          </div>
        </div>
      }
      footer={null}
      closable={false}
      visible={props.show}
      autoFocusButton={null}
      bodyStyle={{
        background: 'var(--dark-bg)'
      }}
      maskStyle={{
        background: 'var(--overlay)'
      }}
      onCancel={closeDialog}
      destroyOnClose={true}
    >
      <p className={styles['text']}>
        Enter the link of the chat you want to join in the field below and then press the{' '}
        <strong>Join</strong> button.
      </p>
      <Input
        value={roomLink}
        onChange={handleInputChange}
        className={styles['link-input']}
        placeholder="Room Link"
        allowClear
      />
      <div className={`${styles.status} ${styles[status.type]}`}>{status.message}</div>
      <Button
        onClick={attemptToJoinRoom}
        className={styles['join-btn']}
        loading={isJoining}
        type="primary"
        block
      >
        Join Room
      </Button>
    </Modal>
  );
}

export default PasteLinkDialog;

import React, { useEffect, useState } from 'react';
import styles from './no-users.module.css';

// ANTD
import { Button, message, Modal } from 'antd';

// Root
import { useRoot } from '../../../RootContext';

// Utilities
import { handleUserLeave } from '../../../utilities/auth.utilities';

function NoUsersLeftModal({ show }) {
  const rootData = useRoot();
  const [isLeaving, setIsLeaving] = useState(false);
  const [roomLink, setRoomLink] = useState(null);

  useEffect(() => {
    function setLink() {
      rootData.room && setRoomLink(`http://${window.location.host}/join/${rootData.room}`);
    }
    setLink();
  }, [rootData.room]);

  function copyRoomLink() {
    try {
      navigator.clipboard.writeText(
        `Hey lets chat together.` + `Click the link below to join me! \n` + roomLink
      );
      message.success('Room link copied!');
    } catch (err) {
      console.log(err);
      message.success('Could not copy room link :(');
    }
  }

  async function leaveRoom() {
    try {
      setIsLeaving(true);
      await handleUserLeave(rootData.socket, rootData.room);
    } catch (err) {
      message.error(err.message);
      setIsLeaving(false);
    }
  }

  return (
    <Modal
      title={
        <div className="modal-header">
          <div className="header-content">Lonely Alert</div>
        </div>
      }
      footer={null}
      closable={false}
      visible={show}
      autoFocusButton={null}
      bodyStyle={{
        background: 'var(--dark-bg)'
      }}
      maskStyle={{
        background: 'var(--overlay)'
      }}
      destroyOnClose={true}
    >
      <div className={styles.emoji}>🚨</div>
      <div className={styles.subtitle}>There seems to be no one left for you to chat with.</div>
      <p className="secondary-text">
        If you wish to create another room refresh this page or press the{' '}
        <span className={styles.bold}>Leave Room</span> button. To invite another friend copy the
        link below.
      </p>
      <div className={styles.warning}>
        *Warning: If you leave the room all your messages will be deleted forever.
      </div>
      <div className={styles.buttons}>
        <Button
          onClick={leaveRoom}
          className={styles['leave-btn']}
          loading={isLeaving}
          type="text"
          block
        >
          Leave Room
        </Button>
        <Button
          onClick={copyRoomLink}
          className={styles['copy-btn']}
          disabled={isLeaving}
          type="primary"
          block
        >
          Copy Link
        </Button>
      </div>
    </Modal>
  );
}

export default NoUsersLeftModal;

import React, { useState } from 'react';
import styles from './no-room.module.css';

// ANTD
import { Button, Modal } from 'antd';

function NoRoomModal(props) {
  const [isSettingUp, setIsSettingUp] = useState(false);

  async function goToInitialScreen() {
    try {
      
    } catch(err) {

    }
  }

  return (
    <Modal
      title={
        <div className="modal-header">
          <div className="header-content">
            <div className={styles.header}>Whoops.</div>
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
      destroyOnClose={true}
    >
      <p className={styles['text']}>
        The room you are waiting for does not seem to exist anymore. <br />
        Click the button below to start from the beginning.
      </p>
      <div className={`${styles.status} ${styles[status.type]}`}>{status.message}</div>
      <Button
        onClick={goToInitialScreen}
        className={styles['join-btn']}
        loading={isSettingUp}
        type="primary"
        block
      >
        Join Room
      </Button>
    </Modal>
  );
}

export default NoRoomModal;

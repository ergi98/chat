import React, { useState } from 'react';
import styles from './initial-screen.module.css';

// Router
import { useNavigate } from 'react-router-dom';

// ANTD
import { Button, message, Spin } from 'antd';

// Mongo
import { createUserAndRoom } from '../../mongo/user';

// Context
import { useRoot, useRootUpdate } from '../../RootContext';

// Components
import PasteLinkDialog from '../../components/initial_screen/link_dialog/PasteLinkDialog';

function InitialScreen() {
  const navigate = useNavigate();

  const rootData = useRoot();
  const updateRootData = useRootUpdate();

  const [isCreating, setIsCreating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  async function handleCreate() {
    try {
      setIsCreating(true);
      let result = await createUserAndRoom();
      updateRootData({
        jwt: result.token,
        user: result.user._id,
        room: result.room._id
      });
      rootData.socket.emit('new-member', result.token);
      redirectToWaitScreen(result.room._id);
    } catch (err) {
      message.error(err.message);
      setIsCreating(false);
    }
  }

  function toggleLinkDialog(value) {
    setShowLinkDialog(value);
  }

  function redirectToChat(roomId, jwt) {
    setCurrentStatus('All set!. Redirecting you to your chat room.');
    rootData.socket.emit('new-member', jwt);

    setTimeout(() => {
      navigate(`/chat/${roomId}`, { replace: true });
    }, 1000);
  }

  function redirectToWaitScreen(roomId) {
    setTimeout(() => {
      navigate(`/wait/${roomId}`, { replace: true });
    }, 1000);
  }

  return (
    <main className={`height-full ${styles['initial-screen']}`}>
      <h1 className={styles['welcome-title']}>Welcome!</h1>
      <p className={styles['explain-paragraph']}>
        Create your own room or enter a link to join your friends.
      </p>
      {isCreating ? (
        <div className={styles['creating-room']}>
          <Spin size="large" /> <br />
          <div className={styles['status-indicator']}>{currentStatus}</div>
        </div>
      ) : (
        <div>
          <Button onClick={() => toggleLinkDialog(true)} type="text" className={styles['link-btn']}>
            Enter room link
          </Button>
          <Button onClick={handleCreate} type="primary" className={styles['create-btn']}>
            Create Room
          </Button>
        </div>
      )}
      {showLinkDialog ? (
        <PasteLinkDialog show={showLinkDialog} toggle={toggleLinkDialog} success={redirectToChat} />
      ) : null}
    </main>
  );
}

export default InitialScreen;

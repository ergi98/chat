import React, { useState, useEffect, useCallback } from 'react';
import styles from './waiting-room.module.css';

// ANTD
import { Button, message } from 'antd';

// Router
import { useNavigate, useParams } from 'react-router-dom';

// Context
import { useRoot } from '../../RootContext';

// Utils
import { handleUserLeave } from '../../utilities/auth.utilities';

// TODO: Left here for some reason this is called before RootData setup

// TODO: Check nesting routes: https://v5.reactrouter.com/web/example/nesting

// TODO: Check redirects: https://v5.reactrouter.com/web/example/auth-workflow

// TODO: Check animated transitions between paths: https://v5.reactrouter.com/web/example/animated-transitions

function WaitingRoom() {
  const navigate = useNavigate();

  const [roomLink, setRoomLink] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);

  const rootData = useRoot();
  const { roomId } = useParams();

  useEffect(() => {
    function initialSetup() {
      if (roomId) setRoomLink(`http://${window.location.host}/${roomId}`);
    }
    initialSetup();
  }, [roomId]);

  useEffect(() => {
    function setNewMemberListener() {
      if (!rootData.socket) return;
      rootData.socket.on('new-member', (data) => {
        message.info('A friend joined!. Redirecting to chat ...');
        setTimeout(() => {
          navigate(`/chat/${data.roomId}`, { replace: true });
        }, 1000);
      });
    }

    setNewMemberListener();

    return () => {
      rootData.socket && rootData.socket.off('new-member');
    };
  }, [rootData.socket, navigate]);

  const handleLeave = useCallback(async () => {
    try {
      setIsLeaving(true);
      await handleUserLeave();
      navigate(`/`, { replace: true });
    } catch (err) {
      message.error(err.message);
      setIsLeaving(false);
    }
  }, [setIsLeaving, navigate]);

  function copyLink() {
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

  return (
    <main className={`height-full center-content primary-background ${styles['waiting-room']}`}>
      <div className={styles['waiting-title']}>Waiting ...</div>
      <div className={styles.hint}>
        Waiting for other members to join you! <br />
        Invite a friend to chat together by sending them the link below.
      </div>
      <div className={styles.link}>{roomLink}</div>
      <div className={styles.buttons}>
        <Button onClick={handleLeave} loading={isLeaving} type="text" className={styles.leave}>
          Leave Room
        </Button>
        <Button onClick={copyLink} disabled={!roomLink} type="primary" className={styles.copy}>
          Copy Link
        </Button>
      </div>
    </main>
  );
}

export default WaitingRoom;

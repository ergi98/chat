import React, { useEffect } from 'react';
import styles from './join-room.module.css';

// Navigation
import { useNavigate, useParams } from 'react-router-dom';

// Mongo
import { createUserAndAssignToRoom } from '../../mongo/user';

// Root
import { useRoot, useRootUpdate } from '../../RootContext';

// ANTD
import { Spin, message } from 'antd';

function JoinRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const rootData = useRoot();
  const updateRootData = useRootUpdate();

  useEffect(() => {
    async function joinRoom(roomId) {
      try {
        if (!roomId) return;
        let data = await createUserAndAssignToRoom(roomId);
        updateRootData({
          jwt: data.jwt,
          user: data.user._id,
          room: data.room._id
        });
        rootData.socket.emit('new-member', data.jwt);
        navigate(`/chat/${data.room._id}`, { replace: true });
      } catch (err) {
        message.error(err.message);
      }
    }
    joinRoom(roomId);
  }, [roomId, rootData.socket, updateRootData, navigate]);

  return (
    <main className={`height-full ${styles['joining-screen']}`}>
      <div className={styles['joining-title']}>Joining Room</div>
      <div className={styles.hint}>
        Please be patient while we set things up for you! <br /> This should not take long 😁
      </div>
      <Spin size="large" className={styles.spinner} /> <br />
    </main>
  );
}

export default JoinRoom;

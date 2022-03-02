import React, { useEffect, useState } from 'react';
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

  const [data, setData] = useState(null);
  const [hasSetListeners, setHasSetListeners] = useState(false);

  useEffect(() => {
    async function create() {
      try {
        if (data || rootData.jwt) return;
        let data = await createUserAndAssignToRoom(roomId);
        setData(data);
      } catch (err) {
        message.error(err.message);
      }
    }
    create();
  }, [rootData.jwt, roomId]);

  useEffect(() => {
    async function joinRoom() {
      if (!data || hasSetListeners) return;
      try {
        updateRootData({
          jwt: data.token,
          user: data.user._id,
          room: data.room._id
        });
        rootData.socket.emit('new-member', data.token);
        setHasSetListeners(true);
        setTimeout(() => {
          navigate(`/chat/${data.room._id}`, { replace: true });
        }, 1000);
      } catch (err) {
        message.error(err.message);
      }
    }
    joinRoom();
  }, [data, hasSetListeners, rootData.socket, updateRootData, navigate]);

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

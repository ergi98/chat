import React, { useState, useEffect } from 'react';
import styles from './waiting-room.module.css';

// ANTD
import { Button, message } from 'antd';

// Router
import { useParams, useNavigate } from 'react-router-dom';

// Context
import { useRoot } from '../../RootContext';

// Mongo
import { getRoom } from '../../mongo/room';

// Components
import NoRoomModal from '../../components/waiting_room/no_room_modal/NoRoomModal';

function WaitingRoom() {
  const [roomLink, setRoomLink] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [showNoRoom, setShowNoRoom] = useState(false);

  // const navigate = useNavigate();
  // const { roomId } = useParams();

  const rootData = useRoot();

  // useEffect(() => {
  //   function checkForRoomId(id) {
  //     if (!id) {
  //       rootData.room
  //         ? navigate(`/wait/${rootData.room}`, { replace: true })
  //         : navigate(`/`, { replace: true });
  //     } else setRoomLink(`http://${window.location.host}/${id}`);
  //   }
  //   checkForRoomId(roomId);
  // }, [roomId, rootData.room, navigate]);

  // Checking if room exists
  useEffect(() => {
    async function checkRoom() {
      try {
        let { room } = await getRoom();
        !room && setShowNoRoom(true);
      } catch (err) {
        message.error(err.message);
      }
    }

    checkRoom();
  }, []);

  async function handleLeave() {
    // deleteUserAndRemoveRoom
    try {
      setIsLeaving(true);
    } catch (err) {
      //
    } finally {
      setIsLeaving(false);
    }
  }

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
    <main className={`height-full ${styles['waiting-screen']}`}>
      <div className={styles.hint}>
        Waiting for other members to join you! <br />
        Invite a friend to chat together by sending them the link below.
      </div>
      <div className={styles.link}>{roomLink}</div>
      <Button onClick={handleLeave} loading={isLeaving} type="text" className={styles.leave}>
        Leave Room
      </Button>
      <Button onClick={copyLink} disabled={!roomLink} type="primary" className={styles.copy}>
        Copy Link
      </Button>
      <NoRoomModal show={showNoRoom} />
    </main>
  );
}

export default WaitingRoom;

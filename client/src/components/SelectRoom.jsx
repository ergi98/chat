import React, { useEffect, useState, useReducer } from 'react';
import styles from './room.module.css';

import { create as createRoom, getRoom, assignUserToRoom } from '../mongo/room.js';
import { create as createUser } from '../mongo/user.js';

// ANTD
import { Button, message, Spin } from 'antd';

// Router
import { useParams, useNavigate } from 'react-router-dom';

// Context
import { useRoot, useRootUpdate } from '../RootContext.js';

// JWT
import jwt_decode from 'jwt-decode';

const initialState = {
  loading: true,
  text: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'invited-user-arrived':
    case 'getting-room':
    case 'creating-room':
    case 'creating-user':
      return {
        ...state,
        loading: true,
        text: action.message
      };
    case 'waiting':
    case 'room-error':
    case 'invited-user-assigned':
      return {
        ...state,
        loading: false,
        text: action.message
      };
    default:
      return {
        ...state
      };
  }
}

function SelectRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const rootData = useRoot();
  const updateRootData = useRootUpdate();

  const [hasPerformedSetup, setHasPerformedSetup] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  function copyLink() {
    try {
      navigator.clipboard.writeText(
        `Hey lets chat together.` +
          `Click the link below to join me! \n` +
          `http://${window.location.host}/${rootData.room}`
      );
      message.success('Room link copied');
    } catch (err) {
      console.log(err);
      message.success('Could not copy room link :(');
    }
  }

  useEffect(() => {
    async function initialSetup() {
      try {
        await checkForRedirect();
        // If the JWT exists there is no point in handling user creation
        if (rootData.jwt) return;
        roomId ? await handleInvite() : await handleNewUser();
      } catch (err) {
        message.error(err.message);
      } finally {
        setHasPerformedSetup(true);
      }
    }

    async function checkForRedirect() {
      if (rootData.jwt) {
        let { room } = await getRoom();
        if (room) {
          room.members?.length > 1
            ? navigate(`/chat/${room._id}`, { replace: true })
            : dispatch({
                type: 'waiting',
                message:
                  'Waiting for other members to join you! \n Invite a friend to chat together by sending them the link below.'
              });
        } else {
          dispatch({
            type: 'room-error',
            message: 'The room you are trying to join is no longer active.'
          });
        }
      }
    }

    async function handleInvite() {
      dispatch({
        type: 'invited-user-arrived',
        message: 'Welcome! \n We are getting things ready for you ...'
      });
      await createUser(roomId);
      setGlobalData();
      let data = await getRoom();
      if (data.room) {
        await assignUserToRoom();
        dispatch({
          type: 'invited-user-assigned',
          message: 'All set! Redirecting you to your room.'
        });
        setTimeout(() => {
          navigate(`/chat/${roomId}`, { replace: true });
        }, 1000);
      } else {
        dispatch({
          type: 'room-error',
          message: 'The room you are trying to join does no longer exist.'
        });
      }
    }

    async function handleNewUser() {
      dispatch({ type: 'creating-room', message: 'Creating your room ...' });
      let { room } = await createRoom();
      dispatch({ type: 'creating-user', message: 'Creating your user ...' });
      await createUser(room._id);
      setGlobalData();
      await assignUserToRoom();
      dispatch({
        type: 'waiting',
        message:
          'Waiting for other members to join you! \n Invite a friend to chat together by sending them the link below.'
      });
    }

    function setGlobalData() {
      let JWT = JSON.parse(localStorage.getItem('jwt'));
      let decoded = jwt_decode(JWT);
      updateRootData({
        jwt: JWT,
        user: decoded._id,
        room: decoded.roomId
      });
    }

    if (rootData !== null && hasPerformedSetup === false) {
      console.log(rootData, hasPerformedSetup);
      console.log('%c InitialSetup SelectRoom', 'color: #557fda');
      initialSetup();
    }
  }, [rootData, hasPerformedSetup, navigate, roomId, updateRootData]);

  useEffect(() => {
    if (hasPerformedSetup && rootData !== null && rootData.jwt) {
      rootData.socket.on('new-member', (data) => {
        if (rootData.user !== data._id) {
          message.info('Redirecting to chat ...');
          setTimeout(() => {
            navigate(`/chat/${data.roomId}`, { replace: true });
          }, 1000);
        }
      });
      rootData.socket.emit('new-member', rootData.jwt);
    }
    return () => {
      rootData && rootData.socket.off('new-member');
    };
  }, [hasPerformedSetup, rootData, navigate]);

  return (
    <div className={`height-full ${styles['select-room']}`}>
      <div>
        <div className={styles.title}>Chat Room</div>
        <div>
          {state.loading ? (
            <div>
              <Spin size="large" /> <br />
              <div className={styles['loading-text']}>{state.text}</div>
            </div>
          ) : (
            <>
              <div className={styles.hint}>{state.text}</div>
              <div className={styles.link}>{`http://${window.location.host}`}</div>
              <Button onClick={copyLink} type="primary" className={styles.copy}>
                Copy Link
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectRoom;

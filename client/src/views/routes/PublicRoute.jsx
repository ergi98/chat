import React, { useEffect } from 'react';

// Router
import { useNavigate } from 'react-router-dom';

// Root
import { useRoot, useRootUpdate } from '../../RootContext';

// Mongo
import { getRoom } from '../../mongo/room';
import { clearAxiosInstance } from '../../../axios_config/axios-config';

function PublicRoute({ children, path }) {
  const rootData = useRoot();
  const updateRootData = useRootUpdate();

  const navigate = useNavigate();

  useEffect(() => {
    async function checkForRedirect() {
      try {
        if (rootData.jwt) {
          let { room } = await getRoom();
          if (!room) {
            // Clear user data if the room no longer exists
            clearAxiosInstance();
            localStorage.clear();
            updateRootData();
          } else {
            let pathToGo = room.members.length > 1 ? `/chat/${room._id}` : `/wait/${room._id}`;
            if (pathToGo !== path) navigate(pathToGo, { replace: true });
          }
        }
        // return room.members.length > 1?
      } catch (err) {
        console.log(err);
      }
    }
    checkForRedirect();
  }, [rootData.jwt, navigate, updateRootData, path]);

  return <>{children}</>;
}

export default PublicRoute;

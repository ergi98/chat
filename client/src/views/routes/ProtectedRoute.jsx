import React, { useEffect } from 'react';

// Router
import { useNavigate } from 'react-router-dom';

// Root
import { useRoot } from '../../RootContext';

// Mongo
import { getRoom } from '../../mongo/room';

function ProtectedRoute({ children, path }) {
  const rootData = useRoot();

  const navigate = useNavigate();

  useEffect(() => {
    async function checkForRedirect() {
      try {
        if (rootData.jwt) {
          let { room } = await getRoom();
          if (room) {
            let pathToGo = room.members.length > 1 ? `/chat/${room._id}` : `/wait/${room._id}`;
            if (pathToGo !== path) navigate(pathToGo, { replace: true });
          }
        }
      } catch (err) {
        navigate('/', { replace: true });
        console.log(err);
      }
    }
    checkForRedirect();
  }, [rootData.jwt, path, navigate]);

  return <>{children}</>;
}

export default ProtectedRoute;

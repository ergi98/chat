import { createContext, useContext, useEffect, useState } from 'react';

// JWT
import jwt_decode from 'jwt-decode';

// Socket
import io from 'socket.io-client';

// Axios
import { setTokenInterceptor } from '../axios_config/axios-config';

// eslint-disable-next-line no-undef
const socket = io.connect(process.env.REACT_APP_PROXY);

const RootContext = createContext();
const RootUpdateContext = createContext();

export function useRoot() {
  return useContext(RootContext);
}

export function useRootUpdate() {
  return useContext(RootUpdateContext);
}

const initialContext = {
  jwt: null,
  user: null,
  room: null,
  socket: null,
  initialSetup: false
};

export function ContextProvider({ children }) {
  const [rootContext, setRootContext] = useState({ ...initialContext });

  useEffect(() => {
    function initialSetup() {
      const JWT = JSON.parse(localStorage.getItem('jwt'));
      if (JWT) {
        let userData = jwt_decode(JWT);
        socket.emit('new-member', JWT);
        setTokenInterceptor(JWT);
        updateRootContext({
          jwt: JWT,
          socket: socket,
          initialSetup: true,
          user: userData._id,
          room: userData.roomId
        });
      } else {
        updateRootContext({
          socket: socket,
          initialSetup: true
        });
      }
    }
    initialSetup();
  }, []);

  function updateRootContext(data) {
    if (data === null) {
      socket.removeAllListeners();
      socket.disconnect();
      setRootContext({ ...initialContext });
    } else
      setRootContext((previous) => {
        return {
          ...previous,
          ...data
        };
      });
  }

  return (
    <RootContext.Provider value={rootContext}>
      <RootUpdateContext.Provider value={updateRootContext}>{children}</RootUpdateContext.Provider>
    </RootContext.Provider>
  );
}

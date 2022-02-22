import { createContext, useContext, useEffect, useState } from 'react';

// JWT
import jwt_decode from 'jwt-decode';

// Socket
import io from 'socket.io-client';

// Axios
import { setTokenInterceptor } from '../axios_config/axios-config';

const socket = io.connect(`http://${window.location.hostname}:5050`);

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
  socket: null
};

export function ContextProvider({ children }) {
  const [rootContext, setRootContext] = useState({ ...initialContext });

  useEffect(() => {
    function initialSetup() {
      console.log(`%c RootContext - Initial Setup`, 'color: #bada55');
      const JWT = JSON.parse(localStorage.getItem('jwt'));
      if (JWT) {
        let userData = jwt_decode(JWT);
        setTokenInterceptor(JWT);
        updateRootContext({
          jwt: JWT,
          socket: socket,
          user: userData._id,
          room: userData.roomId
        });
        socket.emit('new-member', JWT);
      } else {
        updateRootContext({
          socket: socket
        });
      }
    }
    initialSetup();
  }, []);

  window.onbeforeunload = () => {
    console.log(
      '%c RootContext - Disconnecting Socket & Listeners',
      'background: red; color: #fefefe'
    );
    socket.removeAllListeners();
    socket.disconnect();
  };

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

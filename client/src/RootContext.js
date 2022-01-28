import { createContext, useContext, useEffect, useState } from "react";

// JWT
import jwt_decode from "jwt-decode";

// Socket
import io from "socket.io-client";

const socket = io.connect(`http://${window.location.hostname}:5050`);

const RootContext = createContext();
const RootUpdateContext = createContext();

export function useRoot() {
  return useContext(RootContext);
}

export function useRootUpdate() {
  return useContext(RootUpdateContext);
}

export function ContextProvider({ children }) {
  const [rootContext, setRootContext] = useState(null);

  useEffect(() => {
    const JWT = JSON.parse(localStorage.getItem("jwt"));
    if (JWT) {
      let userData = jwt_decode(JWT);
      updateRootContext({
        socket: socket,
        jwt: JWT,
        user: userData._id,
        room: userData.roomId,
      });
    } else {
      updateRootContext({
        socket: socket,
      });
    }
    console.log("%c Use effect on RootContext", "color: #bada55");
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      if (rootContext !== null && rootContext.jwt) {
        console.log("%c Emitting new member RootContext", "color: #bada55");
        socket.emit("new-member", rootContext.jwt);
      }
    });
  }, [rootContext]);

  function updateRootContext(data) {
    setRootContext((previous) => {
      return {
        ...previous,
        ...data,
      };
    });
  }

  return (
    <RootContext.Provider value={rootContext}>
      <RootUpdateContext.Provider value={updateRootContext}>
        {children}
      </RootUpdateContext.Provider>
    </RootContext.Provider>
  );
}

import React, { useEffect } from "react";

// Components
import NotFound from "./components/NotFound";
import ChatRoom from "./components/ChatRoom";
import SelectRoom from "./components/SelectRoom";

// Context
import { SocketContext } from "./SocketContext.js";

// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Socket
import io from "socket.io-client";

const socket = io.connect(`http://${window.location.hostname}:5050`);

function App() {
  useEffect(() => {
    let JWT = JSON.parse(localStorage.getItem("jwt"));
    socket.on("connect", () => {
      JWT && socket.emit("new-member", JWT);
    });
    return () => {};
  }, []);
  return (
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/" element={<SelectRoom />}>
            <Route path=":roomId" element={<SelectRoom />} />
          </Route>
          <Route path="chat" element={<ChatRoom />}>
            <Route path=":roomId" element={<ChatRoom />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketContext.Provider>
    </BrowserRouter>
  );
}

export default App;

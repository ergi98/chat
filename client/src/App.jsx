import React, { useEffect } from "react";

// Components
import Chat from "./components/Chat";
import Send from "./components/Send";

// Socket
import io from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("localhost:5050");
    socket.on("connect", () => {
      console.log(socket.id);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ overflow: "none" }}>
      <Chat />
      <Send />
    </div>
  );
}

export default App;

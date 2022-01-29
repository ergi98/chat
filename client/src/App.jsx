import React from "react";

// Components
import NotFound from "./components/NotFound";
import ChatRoom from "./components/ChatRoom";
import SelectRoom from "./components/SelectRoom";

// Context Provider
import { ContextProvider } from "./RootContext";

// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Routes>
          <Route path="/" element={<SelectRoom />}>
            <Route path=":roomId" element={<SelectRoom />} />
          </Route>
          <Route path="chat" element={<ChatRoom />}>
            <Route path=":roomId" element={<ChatRoom />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;

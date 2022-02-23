import React, { useEffect } from 'react';

// Context Provider
import { ContextProvider } from './RootContext';

// Theme
import { getDeviceTheme, getSelectedTheme, setAppTheme } from './utilities/theme.utilities';

// Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import ChatRoom from './views/chat_room/ChatRoom';
import JoinRoom from './views/join_room/JoinRoom';
import NotFound from './views/not_found/NotFound';
import WaitingRoom from './views/waiting_room/WaitingRoom';
import InitialScreen from './views/initial_screen/InitialScreen';

const onDevicePreferenceChange = () => setAppTheme('device');

function App() {
  useEffect(() => {
    function setUserTheme() {
      console.log('%c App - Setting user theme', 'color: #bf55da');
      let deviceTheme = getDeviceTheme();
      let selectedTheme = getSelectedTheme();
      setAppTheme(selectedTheme ?? deviceTheme);
    }

    function listenForChanges() {
      console.log('%c App - Listening for theme change', 'color: #bf55da');
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', onDevicePreferenceChange);
    }

    setUserTheme();
    listenForChanges();
  }, []);

  window.onbeforeunload = () => {
    console.log('%c  App - Removing theme change listener', 'background: red; color: #fefefe');
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', onDevicePreferenceChange);
  };

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ContextProvider>
          <Routes>
            <Route path="/" element={<InitialScreen />} />
            <Route path="join" element={<JoinRoom />}>
              <Route path=":roomId" element={<JoinRoom />} />
            </Route>
            <Route path="wait" element={<WaitingRoom />}>
              <Route path=":roomId" element={<WaitingRoom />} />
            </Route>
            <Route path="chat" element={<ChatRoom />}>
              <Route path=":roomId" element={<ChatRoom />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ContextProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;

import React, { useEffect } from 'react';

// Components
import NotFound from './components/NotFound';
import ChatRoom from './components/ChatRoom';
import SelectRoom from './components/SelectRoom';

// Context Provider
import { ContextProvider } from './RootContext';

// Theme
import { getDeviceTheme, getSelectedTheme, setAppTheme } from './utilities/theme.utilities';

// Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  useEffect(() => {
    function setUserTheme() {
      let deviceTheme = getDeviceTheme();
      let selectedTheme = getSelectedTheme();
      setAppTheme(selectedTheme ?? deviceTheme);
    }

    function listenForChanges() {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', onDevicePreferenceChange);
    }

    const onDevicePreferenceChange = () => setAppTheme('device');

    setUserTheme();
    listenForChanges();

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', onDevicePreferenceChange);
    };
  }, []);


  return (
    <React.StrictMode>
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
    </React.StrictMode>
  );
}

export default App;

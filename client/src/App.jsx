import React, { useEffect } from 'react';

// Context Provider
import { ContextProvider } from './RootContext';

// Theme
import { getDeviceTheme, getSelectedTheme, setAppTheme } from './utilities/theme.utilities';

// Components
import AppRoutes from './views/routes/AppRoutes';

const onDevicePreferenceChange = () => setAppTheme('device');

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

    setUserTheme();
    listenForChanges();
  }, []);

  return (
    <React.StrictMode>
      <ContextProvider>
        <AppRoutes />
      </ContextProvider>
    </React.StrictMode>
  );
}

export default App;

import React from 'react';

// Router
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Context
import { useRoot } from '../../RootContext';

// Components
import PublicRoute from './PublicRoute';
import ChatRoom from '../chat_room/ChatRoom';
import JoinRoom from '../join_room/JoinRoom';
import NotFound from '../not_found/NotFound';
import LoadingScreen from '../LoadingScreen';
import ProtectedRoute from './ProtectedRoute';
import WaitingRoom from '../waiting_room/WaitingRoom';
import InitialScreen from '../initial_screen/InitialScreen';

function AppRoutes() {
  const rootData = useRoot();

  const appRoutes = [
    {
      path: '/',
      element: <InitialScreen />,
      private: false
    },
    {
      path: '/join/:roomId',
      element: <JoinRoom />,
      private: true
    },
    {
      path: '/wait/:roomId',
      element: <WaitingRoom />,
      private: true
    },
    {
      path: '/chat/:roomId',
      element: <ChatRoom />,
      private: true
    },
    {
      path: '*',
      element: <NotFound />,
      private: false
    }
  ];

  return (
    <>
      {rootData.initialSetup ? (
        <BrowserRouter>
          <Routes>
            {appRoutes.map((route) =>
              route.private ? (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<ProtectedRoute path={route.path}>{route.element}</ProtectedRoute>}
                />
              ) : (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<PublicRoute path={route.path}>{route.element}</PublicRoute>}
                />
              )
            )}
          </Routes>
        </BrowserRouter>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default AppRoutes;

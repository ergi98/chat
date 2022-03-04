import React, { lazy, Suspense } from 'react';

// Router
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Context
import { useRoot } from '../../RootContext';

// Components
import LoadingScreen from '../LoadingScreen';
const PublicRoute = lazy(() => import('./PublicRoute'));
const ChatRoom = lazy(() => import('../chat_room/ChatRoom'));
const JoinRoom = lazy(() => import('../join_room/JoinRoom'));
const NotFound = lazy(() => import('../not_found/NotFound'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const WaitingRoom = lazy(() => import('../waiting_room/WaitingRoom'));
const InitialScreen = lazy(() => import('../initial_screen/InitialScreen'));

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
      private: false
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
          <Suspense fallback={<LoadingScreen />}>
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
          </Suspense>
        </BrowserRouter>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default AppRoutes;

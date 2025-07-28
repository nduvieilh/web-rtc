import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import { UserIdProvider } from './context/UserIdContext.tsx';
import { WebSocketProvider } from './context/WebSocketContext';
import { WebRTCProvider } from './context/WebRTCContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebSocketProvider>
      <WebRTCProvider>
        <UserIdProvider>
          <App />
        </UserIdProvider>
      </WebRTCProvider>
    </WebSocketProvider>
  </React.StrictMode>,
);

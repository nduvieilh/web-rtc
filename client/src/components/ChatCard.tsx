import Icon from '@mdi/react';
import { mdiChatOutline, mdiAlertCircleOutline } from '@mdi/js';
import { MessageList } from './MessageList';
import { SendForm } from './SendForm';

import { ConnectionStatus } from './ConnectionStatus';
import { useWebSocket } from '../context/WebSocketContext';
import Video from './Video';

export function ChatCard() {
  const { connected, messages } = useWebSocket();
  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0">
            <Icon path={mdiChatOutline} size={1} className="me-2" />
            Web RTC Chat Application
          </h4>
          <ConnectionStatus connected={connected} />
        </div>
      </div>
      <div className="card-body">
        <Video />
        <div className="mb-4">
          <h5 className="mb-3">
            Messages
          </h5>
          <MessageList messages={messages} />
        </div>
        <SendForm />
        {!connected && (
          <div className="alert alert-warning mt-3 mb-0">
            <Icon path={mdiAlertCircleOutline} size={0.8} className="me-2" />
            Disconnected from server. Please check if the WebSocket server is running on port 8080.
          </div>
        )}
      </div>
    </div>
  );
}

import Icon from '@mdi/react';
import { mdiSend } from '@mdi/js';
import { useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useUserId } from '../context/UserIdContext';

export function SendForm() {
  const { userId } = useUserId();
  const { connected, sendMessage } = useWebSocket();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message.trim(), userId);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="row g-2">
      <div className="col">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!connected}
        />
      </div>
      <div className="col-auto">
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={!connected || !message.trim()}
        >
          <Icon path={mdiSend} size={0.8} className="me-1" />
          Send
        </button>
      </div>
    </div>
  );
}

import { Message } from './Message';
import Icon from '@mdi/react';
import { mdiChatOutline } from '@mdi/js';

interface MessageType {
  text: string;
  userId: string;
  timestamp: string;
}

interface MessageListProps {
  messages: MessageType[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="text-center text-muted py-4">
          <Icon path={mdiChatOutline} size={3} className="mb-3 opacity-50" />
          <p className="mb-0">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg, index) => <Message key={index} {...msg} index={index} />)
      )}
    </div>
  );
}

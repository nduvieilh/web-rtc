import { UserIdBadge } from './UserIdBadge';

interface MessageProps {
  text: string;
  userId: string;
  timestamp: string;
  index: number;
}

export function Message({ text, userId, timestamp, index }: MessageProps) {
  return (
    <div className="alert alert-light mb-2 py-2 position-relative">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <small className="text-muted">Message #{index + 1}</small>
          <div className="mt-1">{text}</div>
        </div>
        <UserIdBadge userId={userId} />
      </div>
      <small className="text-muted">
        {new Date(timestamp).toLocaleTimeString()}
      </small>
    </div>
  );
}

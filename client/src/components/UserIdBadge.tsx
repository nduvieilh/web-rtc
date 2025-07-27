import { useUserId } from "../context/UserIdContext";

interface props {
  userId: string;
}
export function UserIdBadge({userId}: props) {
  const { userId: myUserId } = useUserId();
  const me = userId === myUserId;
  return (
    <span className={`badge ms-2 ${me ? 'bg-info' : ''}`} style={{ backgroundColor: `#${userId}`}}>
      {me ? 'You' : '#'+userId}
    </span>
  );
}

import Icon from '@mdi/react';
import { mdiConnection, mdiWifiOff, mdiRefresh } from '@mdi/js';
import { useUserId } from '../context/UserIdContext';

interface ConnectionStatusProps {
  connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  const { userId, regenerateUserId } = useUserId();
  return (
    <div className="btn-group btn-group-sm" role="group">
      {connected ? (
        <div className="btn btn-success">
          <Icon path={mdiConnection} size={0.7} className="me-1" />
          Connected as
        </div>
      ) : (
        <div className="btn btn-danger">
          <Icon path={mdiWifiOff} size={0.7} className="me-1" />
          Disconnected
        </div>
      )}

      {connected && (
        <div className="btn btn-user-color" onClick={regenerateUserId}>
          #{userId} <Icon path={mdiRefresh} size={0.8} className="ms-1" />
        </div>
      )}
    </div>
  );
}

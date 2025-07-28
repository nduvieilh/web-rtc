import React from 'react';
import { useWebRTC } from '../context/WebRTCContext';

const Video: React.FC = () => {
  const { localStream, remoteStream, startVideo, stopVideo } = useWebRTC();
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  React.useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleStart = async () => {
    await startVideo();
    setActive(true);
  };

  const handleStop = () => {
    stopVideo();
    setActive(false);
  };

  return (
    <div
      className="video-container"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <div>Local Video</div>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: 320, height: 240, background: '#222' }}
          />
        </div>
        <div>
          <div>Remote Video</div>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: 320, height: 240, background: '#222' }}
          />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        {active ? (
          <button className="btn btn-danger" onClick={handleStop}>
            Stop Video
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleStart}>
            Start Video
          </button>
        )}
      </div>
    </div>
  );
};

export default Video;

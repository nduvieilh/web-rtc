import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WebRTCContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startVideo: () => Promise<void>;
  stopVideo: () => void;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const WebRTCProvider = ({ children }: { children: ReactNode }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const host = window.location.hostname;
    const ws = new WebSocket(`ws://${host}:8080`);
    setSocket(ws);
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'offer') {
        await handleReceiveOffer(data.offer);
      } else if (data.type === 'answer') {
        await handleReceiveAnswer(data.answer);
      } else if (data.type === 'ice-candidate') {
        await handleReceiveIceCandidate(data.candidate);
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
      }
    };
    pc.ontrack = (event) => {
      setRemoteStream(prev => {
        if (prev) return prev;
        const newStream = new MediaStream();
        newStream.addTrack(event.track);
        return newStream;
      });
    };
    return pc;
  };

  const startVideo = async () => {
    if (localStream) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      setLocalStream(stream);
      const pc = createPeerConnection();
      setPeerConnection(pc);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      if (socket) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.send(JSON.stringify({ type: 'offer', offer }));
      }
    } catch (err: any) {
      console.error('Could not access camera/microphone:', err);
      alert('Could not access camera/microphone. Please check device permissions and availability.');
    }
  };

  const stopVideo = () => {
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    peerConnection?.close();
    setPeerConnection(null);
  };

  const handleReceiveOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      setLocalStream(stream);
      const pc = createPeerConnection();
      setPeerConnection(pc);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      if (socket) {
        socket.send(JSON.stringify({ type: 'answer', answer }));
      }
    } catch (err: any) {
      console.error('Could not access camera/microphone (on offer):', err);
      alert('Could not access camera/microphone. Please check device permissions and availability.');
    }
  };

  const handleReceiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleReceiveIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding received ice candidate', e);
      }
    }
  };

  return (
    <WebRTCContext.Provider value={{
      localStream,
      remoteStream,
      startVideo,
      stopVideo
    }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export function useWebRTC() {
  const ctx = useContext(WebRTCContext);
  if (!ctx) throw new Error('useWebRTC must be used within a WebRTCProvider');
  return ctx;
}

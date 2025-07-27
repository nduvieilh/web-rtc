import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Message {
  text: string;
  userId: string;
  timestamp: string;
}


interface WebSocketContextType {
  messages: Message[];
  connected: boolean;
  sendMessage: (msg: string, userId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);


  useEffect(() => {
    const host = window.location.hostname;
    const ws = new WebSocket(`ws://${host}:8080`);

    ws.onopen = () => {
      setConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'broadcast') {
        setMessages(prev => [...prev, {
          text: data.message,
          userId: data.userId,
          timestamp: data.timestamp
        }]);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setSocket(null);
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
    // eslint-disable-next-line
  }, []);




  const sendMessage = (msg: string, userId: string) => {
    if (socket && msg.trim()) {
      socket.send(JSON.stringify({ message: msg.trim(), userId }));
    }
  };


  return (
    <WebSocketContext.Provider value={{
      messages,
      connected,
      sendMessage
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within a WebSocketProvider');
  return ctx;
}

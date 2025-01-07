import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  conversationId: string;
  message: {
    content: string;
    createdAt: string;
  };
  senderId: string;
}

interface SocketContextType {
  socket: Socket | null;
  sendChatMessage: (conversationId: string, content: string, userId: string) => void;
  sendChartDataRequest: (data: any) => void;
  onChatMessage: (callback: (message: Message) => void) => void;
  onChartDataUpdate: (callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = 'https://lingomate-backend.onrender.com';
const clientId = "newMessage";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authStorage] = useState<string | null>(localStorage.getItem('auth'));
  const [userId, token] = useMemo(() => {
    const authData = authStorage ? JSON.parse(authStorage) : null;
    return [authData?.user?.id, authData?.token];
  }, [authStorage]);

  useEffect(() => {
    if (!socket && userId && token) {
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        path: '/ws',
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('register', { clientId, userId, jwtToken: token });
      });

      newSocket.on("registered", () => {
        console.log("Socket registered successfully");
        setSocket(newSocket);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userId, token]);

  const sendChatMessage = (conversationId: string, content: string, userId: string) => {
    if (socket) {
      socket.emit('chat_message', {
        conversationId,
        userId,
        content,
      });
    }
  };

  const sendChartDataRequest = (data: any) => {
    socket?.emit('chart_data_request', data);
  };

  const onChatMessage = (callback: (message: Message) => void) => {
    if (!socket) return;
    socket.on('newMessage', (data: Message) => {
      callback(data);
    });
  };

  const onChartDataUpdate = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('chart_data_update', callback);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendChatMessage,
        sendChartDataRequest,
        onChatMessage,
        onChartDataUpdate,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

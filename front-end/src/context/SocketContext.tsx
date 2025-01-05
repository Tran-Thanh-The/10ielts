import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  sendChatMessage: (message: string) => void;
  sendChartDataRequest: (data: any) => void;
  onChatMessage: (callback: (message: string) => void) => void;
  onChartDataUpdate: (callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = 'http://localhost:3001';
const clientId = "newMessage";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authStorage, setAuthStorage] = useState<string | null>(localStorage.getItem('auth'));
  const [userId, token] = useMemo(() => {
    const authData = authStorage ? JSON.parse(authStorage) : null;
    return [authData?.user?.id, authData?.token];
  }, [authStorage]);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        path: '/ws',
      });

      newSocket.on('connect', () => {
        setSocket(newSocket);
        newSocket.emit('register', { clientId, userId, jwtToken: token });
      });

      newSocket.on("registered", () => {
        console.log("Registered");
      })

      return () => {
        newSocket.disconnect();
      };
    }
  }, [socket]);

  // Hàm gửi tin nhắn Chat
  const sendChatMessage = (message: string) => {
    socket?.emit('chat_message', message);
  };

  // Hàm gửi yêu cầu cập nhật biểu đồ
  const sendChartDataRequest = (data: any) => {
    socket?.emit('chart_data_request', data);
  };

  // Lắng nghe tin nhắn Chat
  const onChatMessage = (callback: (message: string) => void) => {
    if (socket) {
      socket.on('newMessage', callback);
    }
  };

  // Lắng nghe cập nhật dữ liệu biểu đồ
  const onChartDataUpdate = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('chart_data_update', callback);
    }
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

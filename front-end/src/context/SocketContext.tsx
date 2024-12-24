import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  sendChatMessage: (message: string) => void;
  sendChartDataRequest: (data: any) => void;
  onChatMessage: (callback: (message: string) => void) => void;
  onChartDataUpdate: (callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = 'http://localhost:3008';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Tạo kết nối WebSocket
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
    });
    setSocket(newSocket);

    // Dọn dẹp khi component bị unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

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
      socket.on('chat_message', callback);
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

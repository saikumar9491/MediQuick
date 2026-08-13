import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE } from '../utils/apiConfig';

export const useSocket = (room) => {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(API_BASE, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setConnected(true);
      console.log('🔌 Socket.IO connected:', socketInstance.id);
      if (room) {
        socketInstance.emit('join:admin'); // join admin room
      }
    });

    socketInstance.on('disconnect', (reason) => {
      setConnected(false);
      console.log('❌ Socket.IO disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      setConnected(false);
      console.error('⚠️ Socket.IO connection error:', error);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [room]);

  return {
    connected,
    socket
  };
};

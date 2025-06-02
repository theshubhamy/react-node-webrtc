import { useContext } from 'react';
import { SocketContext } from '../context/Socket';

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn('useSocket must be used within a <SocketProvider>');
  }
  return socket;
};

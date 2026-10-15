import { io } from 'socket.io-client';
import apiUrl from './utils/configureUrl';

export const socket = io(apiUrl, {
  autoConnect: false, // Important: you control when it connects manually
  transports: ['websocket'], // Use WebSocket first
});

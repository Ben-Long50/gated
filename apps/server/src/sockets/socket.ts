import type { Server } from 'socket.io';

let io: Server;

export const registerIO = (server: Server) => {
  io = server;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not registered');
  }
  return io;
};

let io;
export const registerIO = (server) => {
    io = server;
};
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not registered');
    }
    return io;
};

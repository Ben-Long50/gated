import prisma from '../config/database.js';
export function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('campaign', (campaignId) => {
            console.log('campaign emitter');
            io.to(`campaign ${campaignId}`).emit('campaign', campaignId);
        });
        socket.on('registerData', ({ playerId, username }) => {
            socket.data.playerId = playerId;
            socket.data.username = username;
            console.log(`Registered player ${username}`);
        });
        socket.on('startCampaign', (campaignId) => {
            socket.join(`campaign ${campaignId}`);
            console.log(`Started campaign ${campaignId}`);
            io.emit('campaign', campaignId);
            console.log('Broadcasted campaign startup to all players');
        });
        socket.on('joinCampaign', (campaignId) => {
            socket.join(`campaign ${campaignId}`);
            console.log(`Joined campaign ${campaignId}`);
        });
        socket.on('endCampaign', (campaignId) => {
            socket.leave(campaignId);
            console.log(`Ended campaign ${campaignId}`);
            io.to(`campaign ${campaignId}`).emit('endCampaign', campaignId);
            console.log('Broadcasted campaign end to all players');
        });
        socket.on('globalCampaign', async (campaignId) => {
            const campaign = await prisma.campaign.findUnique({
                where: { id: campaignId },
                include: {
                    players: { select: { id: true } },
                    pendingPlayers: { select: { id: true } },
                },
            });
            const players = (campaign === null || campaign === void 0 ? void 0 : campaign.players.map((player) => player.id)) || [];
            const pendingPlayers = (campaign === null || campaign === void 0 ? void 0 : campaign.pendingPlayers.map((player) => player.id)) || [];
            const playerIds = [campaign === null || campaign === void 0 ? void 0 : campaign.ownerId, ...players, ...pendingPlayers];
            io.emit('globalCampaign', { campaignId, playerIds });
            console.log(`Broadcasted campaign ${campaignId} to all players`);
        });
        socket.on('location', ({ locationId, campaignId }) => {
            io.to(`campaign ${campaignId}`).emit('location', locationId);
            console.log(`Broadcasted location ${locationId} to campaign ${campaignId}`);
        });
        socket.on('character', ({ characterId, campaignId }) => {
            io.to(`campaign ${campaignId}`).emit('character', characterId);
            console.log(`Broadcasted character ${characterId} to campaign ${campaignId}`);
        });
        socket.on('item', ({ itemId, campaignId }) => {
            io.to(`campaign ${campaignId}`).emit('item', itemId);
            console.log(`Broadcasted item ${itemId} to campaign ${campaignId}`);
        });
        socket.on('affiliation', ({ affiliationId, campaignId }) => {
            io.to(`campaign ${campaignId}`).emit('affiliation', affiliationId);
            console.log(`Broadcasted affiliation ${affiliationId} to campaign ${campaignId}`);
        });
        socket.on('encounter', ({ campaignId, encounterId }) => {
            io.to(`campaign ${campaignId}`).emit('encounter', encounterId);
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('joinEncounter', async ({ room, playerId }) => {
            socket.join(room);
            const sockets = (await io.in(room).fetchSockets())
                .map((socket) => socket.data)
                .sort();
            io.to(room).emit('playerJoined', { playerId, playerIdList: sockets });
            console.log(`${playerId} joined ${room}`);
        });
        socket.on('leaveEncounter', async ({ room, playerId }) => {
            socket.leave(room);
            const sockets = (await io.in(room).fetchSockets())
                .map((socket) => socket.data)
                .sort();
            io.to(room).emit('playerLeft', { playerId, playerIdList: sockets });
            console.log(`${playerId} left ${room}`);
        });
        socket.on('navigateToEncounter', ({ encounterId, mapId, campaignId }) => {
            socket
                .to(`encounter ${encounterId}`)
                .emit('navigateToEncounter', { encounterId, mapId, campaignId });
        });
        socket.on('changeTarget', ({ encounterId, characterId }) => {
            io.to(`encounter ${encounterId}`).emit('changeTarget', { characterId });
            console.log(`Broadcasted change target ${characterId} to encounter ${encounterId}`);
        });
        socket.on('resetBoard', ({ encounterId }) => {
            io.to(`encounter ${encounterId}`).emit('resetBoard');
            console.log(`Broadcasted reset board to encounter ${encounterId}`);
        });
        socket.on('disconnect', (reason) => {
            console.log('User disconnected:', socket.id, 'Reason:', reason);
        });
        socket.on('disconnect', (reason) => {
            console.log('User disconnected:', socket.id, 'Reason:', reason);
        });
    });
}

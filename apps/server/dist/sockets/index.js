import prisma from '../config/database.js';
import characterStatServices from '../services/characterStatServices.js';
import characterServices from '../services/characterServices.js';
import conditionServices from '../services/conditionServices.js';
export function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('startCampaign', (campaignId) => {
            socket.join(campaignId);
            console.log(`Started campaign ${campaignId}`);
            io.emit('campaign', campaignId);
            console.log('Broadcasted campaign startup to all players');
        });
        socket.on('joinCampaign', (campaignId) => {
            socket.join(campaignId);
            console.log(`Joined campaign ${campaignId}`);
        });
        socket.on('endCampaign', (campaignId) => {
            socket.leave(campaignId);
            console.log(`Ended campaign ${campaignId}`);
            io.to(campaignId).emit('endCampaign', campaignId);
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
            io.to(campaignId).emit('location', locationId);
            console.log(`Broadcasted location ${locationId} to campaign ${campaignId}`);
        });
        socket.on('character', ({ characterId, campaignId }) => {
            io.to(campaignId).emit('character', characterId);
            console.log(`Broadcasted character ${characterId} to campaign ${campaignId}`);
        });
        socket.on('item', ({ itemId, campaignId }) => {
            io.to(campaignId).emit('item', itemId);
            console.log(`Broadcasted item ${itemId} to campaign ${campaignId}`);
        });
        socket.on('affiliation', ({ affiliationId, campaignId }) => {
            io.to(campaignId).emit('affiliation', affiliationId);
            console.log(`Broadcasted affiliation ${affiliationId} to campaign ${campaignId}`);
        });
        socket.on('combatRoll', async ({ campaignId, characterId, targetInfo, damage, rollResult }) => {
            const targetCharacter = await characterServices.getCharacterById(targetInfo.id);
            console.log(targetInfo.stats);
            if ((targetCharacter === null || targetCharacter === void 0 ? void 0 : targetCharacter.stats.currentHealth) - damage <= 0) {
                if (!!(targetCharacter === null || targetCharacter === void 0 ? void 0 : targetCharacter.conditions.some((condition) => condition.condition.name === 'Wounded'))) {
                    await characterStatServices.editCharacterStat(targetInfo.id, {
                        injuries: 1,
                        currentHealth: targetInfo.stats.currentHealth * -1,
                    });
                }
                else {
                    const wounded = await conditionServices.getConditionByName('Wounded');
                    await characterStatServices.resetCharacterStat(targetInfo.id, {
                        currentHealth: targetInfo.stats.maxHealth,
                    });
                    await characterServices.createCharacterConditions(targetInfo.id, [
                        { conditionId: wounded === null || wounded === void 0 ? void 0 : wounded.id },
                    ]);
                }
            }
            else {
                await characterStatServices.editCharacterStat(targetInfo.id, {
                    currentHealth: damage * -1,
                });
            }
            io.to(campaignId).emit('combatRoll', {
                characterId,
                targetId: targetInfo.id,
                damage,
                rollResult,
            });
            console.log(`Broadcasted combat roll to campaign ${campaignId}`);
        });
        socket.on('advanceTurn', ({ campaignId, encounterId }) => {
            io.to(campaignId).emit('advanceTurn', encounterId);
            console.log(`Broadcasted combat ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('disconnect', (reason) => {
            console.log('User disconnected:', socket.id, 'Reason:', reason);
        });
    });
}

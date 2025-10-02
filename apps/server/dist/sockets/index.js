import prisma from '../config/database.js';
import encounterServices from '../services/encounterServices.js';
import characterStatServices from '../services/characterStatServices.js';
import itemStatServices from '../services/itemStatServices.js';
export function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('registerData', ({ playerId, username }) => {
            socket.data.playerId = playerId;
            socket.data.username = username;
            console.log(`Registered player ${username}`);
        });
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
        socket.on('encounter', ({ campaignId, encounterId }) => {
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('joinEncounter', async ({ room, playerId }) => {
            socket.join(room);
            const sockets = (await io.in(room).fetchSockets())
                .map((socket) => socket.data.username)
                .sort();
            io.to(room).emit('playerJoined', { playerId, playerIdList: sockets });
            console.log(`${room} joined`);
        });
        socket.on('leaveEncounter', async ({ room, playerId }) => {
            socket.leave(room);
            const sockets = (await io.in(room).fetchSockets())
                .map((socket) => socket.data.username)
                .sort();
            io.to(room).emit('playerLeft', { playerId, playerIdList: sockets });
            console.log(`${room} left`);
        });
        socket.on('activateEncounter', async ({ campaignId, encounterId }) => {
            await encounterServices.activateEncounter(encounterId);
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('actionRoll', async ({ campaignId, encounterId, activeCharacter, targetCharacter, action, item, damage, rollResult, }) => {
            const historyData = {
                characterId: activeCharacter.id,
                actionId: action.id,
            };
            if (targetCharacter) {
                historyData.targetId = targetCharacter.id;
            }
            if (item) {
                historyData.itemId = item.id;
            }
            if (rollResult) {
                historyData.rollResult = rollResult;
            }
            await encounterServices.createEncounterHistory(campaignId, encounterId, historyData);
            const calculateCosts = (character, item, action) => {
                const costs = action
                    ? action.name === 'Salvo Fire'
                        ? Object.assign(Object.assign({}, action.costs), { currentAmmoCount: item === null || item === void 0 ? void 0 : item.stats.salvo }) : action.costs
                    : null;
                if (item.keywords.some((keyword) => keyword.keyword.name === '2H')) {
                    costs.currentHands = 2;
                }
                if (item.keywords.some((keyword) => keyword.keyword.name === '1H')) {
                    costs.currentHands = 1;
                }
                const characterCosts = {};
                const itemCosts = {};
                Object.entries(costs).forEach(([stat, value]) => {
                    if (character.stats[stat]) {
                        const costInfo = {
                            stat,
                            available: character.stats[stat],
                            required: value,
                        };
                        if (costInfo.required > costInfo.available) {
                            alert(`Your character does not have enough ${stat} to complete this action`);
                        }
                        characterCosts[costInfo.stat] =
                            costInfo.available - costInfo.required;
                    }
                    if (item.stats[stat]) {
                        const costInfo = {
                            stat,
                            available: item.stats[stat],
                            required: value,
                        };
                        if (costInfo.required > costInfo.available) {
                            alert(`Your item does not have enough ${stat} to complete this action`);
                        }
                        itemCosts[costInfo.stat] = costInfo.available - costInfo.required;
                    }
                });
                return { characterCosts, itemCosts };
            };
            const { characterCosts, itemCosts } = calculateCosts(activeCharacter, item, action);
            if (Object.keys(characterCosts).length > 0) {
                await characterStatServices.resetCharacterStat(activeCharacter.id, characterCosts);
                socket.emit('character', activeCharacter.id);
            }
            if (Object.keys(itemCosts).length > 0) {
                await itemStatServices.resetItemStats(item.id, itemCosts);
                socket.emit('item', item.id);
            }
            await encounterServices.setCombatPhase(encounterId, 'reaction');
            // const targetCharacter = await characterServices.getCharacterById(
            //   targetInfo.id,
            // );
            // if (targetCharacter?.stats.currentHealth - damage <= 0) {
            //   if (
            //     !!targetCharacter?.conditions.some(
            //       (condition) => condition.condition.name === 'Wounded',
            //     )
            //   ) {
            //     await characterStatServices.editCharacterStat(targetInfo.id, {
            //       injuries: 1,
            //       currentHealth: targetInfo.stats.currentHealth * -1,
            //     });
            //   } else {
            //     const wounded =
            //       await conditionServices.getConditionByName('Wounded');
            //     await characterStatServices.resetCharacterStat(targetInfo.id, {
            //       currentHealth: targetInfo.stats.maxHealth,
            //     });
            //     await characterServices.createCharacterConditions(targetInfo.id, [
            //       { conditionId: wounded?.id },
            //     ]);
            //   }
            // } else {
            //   await characterStatServices.editCharacterStat(targetInfo.id, {
            //     currentHealth: damage * -1,
            //   });
            // }
            io.to(campaignId).emit('actionRoll', {
                encounterId,
                activeCharacter,
                targetCharacter,
                action,
                item,
                damage,
                rollResult,
            });
            console.log(`Broadcasted action roll to campaign ${campaignId}`);
        });
        socket.on('reactionRoll', async ({ campaignId, encounterId, reactiveCharacter, targetCharacter, reaction, item, rollResult, }) => {
            const historyData = {
                characterId: reactiveCharacter.id,
                actionId: reaction.id,
            };
            if (targetCharacter) {
                historyData.targetId = targetCharacter.id;
            }
            if (item) {
                historyData.itemId = item.id;
            }
            if (rollResult) {
                historyData.rollResult = rollResult;
            }
            await encounterServices.createEncounterHistory(campaignId, encounterId, historyData);
            io.to(campaignId).emit('reactionRoll', {
                encounterId,
                reactiveCharacter,
                targetCharacter,
                reaction,
                item,
                rollResult,
            });
            console.log(`Broadcasted reaction roll to campaign ${campaignId}`);
        });
        socket.on('scheduleReaction', async ({ campaignId, encounterId, characterId }) => {
            await encounterServices.scheduleReaction(encounterId, characterId);
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted combat ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('passReaction', async ({ campaignId, encounterId, characterId }) => {
            await encounterServices.passReaction(encounterId, characterId);
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted combat ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('finishReaction', async ({ campaignId, encounterId, characterId }) => {
            await encounterServices.finishReaction(encounterId, characterId);
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted combat ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('passAllReactions', async ({ campaignId, encounterId }) => {
            await encounterServices.passAllReactions(encounterId);
            io.to(campaignId).emit('encounter', encounterId);
            io.to(campaignId).emit('resetRolls');
            console.log(`Broadcasted combat ${encounterId} to campaign ${campaignId}`);
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

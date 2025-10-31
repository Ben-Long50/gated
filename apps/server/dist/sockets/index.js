import prisma from '../config/database.js';
import encounterServices from '../services/encounterServices.js';
import characterServices from '../services/characterServices.js';
import { calculateCosts, calculateDamage, calculateRoll, } from '../utils/rollUtilities.js';
import itemServices from '../services/itemServices.js';
export function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('campaign', (campaignId) => {
            console.log('campaign emitter');
            io.to(campaignId).emit('campaign', campaignId);
        });
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
                .map((socket) => socket.data)
                .sort();
            io.to(room).emit('playerJoined', { playerId, playerIdList: sockets });
            console.log(`${room} joined`);
        });
        socket.on('leaveEncounter', async ({ room, playerId }) => {
            socket.leave(room);
            const sockets = (await io.in(room).fetchSockets())
                .map((socket) => socket.data)
                .sort();
            io.to(room).emit('playerLeft', { playerId, playerIdList: sockets });
            console.log(`${room} left`);
        });
        socket.on('activateEncounter', async ({ campaignId, encounterId }) => {
            await encounterServices.activateEncounter(encounterId);
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('rollInitiative', async (encounterId) => {
            const encounter = await encounterServices.getEncounterById(encounterId);
            const rolls = new Map();
            for (const id of encounter.turnOrder) {
                const character = await characterServices.getCharacterById(id);
                const violenceRolls = [
                    { attribute: 'violence', skill: 'assault' },
                    { attribute: 'violence', skill: 'shooting' },
                    { attribute: 'violence', skill: 'subterfuge' },
                    { attribute: 'violence', skill: 'threshold' },
                ];
                const rollInitiative = async () => {
                    const rollResults = calculateRoll(character === null || character === void 0 ? void 0 : character.attributes, { roll: violenceRolls }, []) || { result: [], successes: 0 };
                    rolls.set(character === null || character === void 0 ? void 0 : character.id, {
                        characterId: character === null || character === void 0 ? void 0 : character.id,
                        name: character === null || character === void 0 ? void 0 : character.firstName,
                        playerCharacter: character === null || character === void 0 ? void 0 : character.playerCharacter,
                        diceArray: rollResults.result,
                        successes: rollResults.successes,
                    });
                };
                rollInitiative();
            }
            const rollsArray = Array.from(rolls.entries());
            io.to(`encounter ${encounterId}`).emit('initiativeRoll', rollsArray);
        });
        socket.on('navigateToEncounter', ({ encounterId, mapId, campaignId }) => {
            socket
                .to(`encounter ${encounterId}`)
                .emit('navigateToEncounter', { encounterId, mapId, campaignId });
        });
        socket.on('actionRoll', async ({ campaignId, encounterId, activeCharacter, targetCharacter, action, modifiers, extraDice, item, }) => {
            const rollResults = calculateRoll(activeCharacter.attributes, { name: action.name, roll: action.roll }, modifiers, extraDice) || { result: [], successes: 0 };
            const rolls = new Map();
            const damage = calculateDamage(item, action, rollResults.successes);
            rolls.set(activeCharacter === null || activeCharacter === void 0 ? void 0 : activeCharacter.id, {
                characterId: activeCharacter === null || activeCharacter === void 0 ? void 0 : activeCharacter.id,
                name: `${activeCharacter === null || activeCharacter === void 0 ? void 0 : activeCharacter.firstName} ${activeCharacter === null || activeCharacter === void 0 ? void 0 : activeCharacter.lastName}`,
                playerCharacter: activeCharacter === null || activeCharacter === void 0 ? void 0 : activeCharacter.playerCharacter,
                diceArray: rollResults.result,
                successes: rollResults.successes,
            });
            const rollsArray = Array.from(rolls.entries());
            await calculateCosts(activeCharacter, item, action);
            io.to(`encounter ${encounterId}`).emit('actionRoll', {
                encounterId,
                rollsArray,
                targetId: (targetCharacter === null || targetCharacter === void 0 ? void 0 : targetCharacter.id) || null,
            });
            io.to(campaignId).emit('character', activeCharacter.id);
            if (item) {
                await itemServices.setItemNotAvailable(item.id);
                io.to(campaignId).emit('item', item.id);
            }
            if (targetCharacter) {
                io.to(campaignId).emit('character', targetCharacter.id);
                // applyDamage(targetCharacter, damage);
            }
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
            if (rollResults) {
                historyData.rollResult = {
                    result: rollResults.result,
                    successes: rollResults.successes,
                    modifiers: [],
                    damage,
                };
            }
            const phaseAction = await encounterServices.createEncounterHistory(campaignId, encounterId, historyData);
            await encounterServices.setCombatPhase(encounterId, 'reaction');
            await encounterServices.setPhaseAction(encounterId, phaseAction);
            socket.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted action roll to encounter ${encounterId}`);
        });
        socket.on('reactionRoll', async ({ campaignId, encounterId, reactiveCharacter, targetCharacter, reaction, modifiers, extraDice, item, }) => {
            const rollResults = calculateRoll(reactiveCharacter.attributes, { name: reaction.name, roll: reaction.roll }, modifiers, extraDice) || { result: [], successes: 0 };
            const rolls = new Map();
            rolls.set(reactiveCharacter === null || reactiveCharacter === void 0 ? void 0 : reactiveCharacter.id, {
                characterId: reactiveCharacter === null || reactiveCharacter === void 0 ? void 0 : reactiveCharacter.id,
                name: `${reactiveCharacter === null || reactiveCharacter === void 0 ? void 0 : reactiveCharacter.firstName} ${reactiveCharacter === null || reactiveCharacter === void 0 ? void 0 : reactiveCharacter.lastName}`,
                playerCharacter: reactiveCharacter === null || reactiveCharacter === void 0 ? void 0 : reactiveCharacter.playerCharacter,
                diceArray: rollResults.result,
                successes: rollResults.successes,
            });
            const rollsArray = Array.from(rolls.entries());
            await calculateCosts(reactiveCharacter, item, reaction);
            io.to(`encounter ${encounterId}`).emit('reactionRoll', {
                encounterId,
                rollsArray,
                targetId: (targetCharacter === null || targetCharacter === void 0 ? void 0 : targetCharacter.id) || null,
            });
            io.to(campaignId).emit('character', reactiveCharacter.id);
            if (item) {
                io.to(campaignId).emit('item', item.id);
            }
            if (targetCharacter) {
                io.to(campaignId).emit('character', targetCharacter.id);
            }
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
            if (rollResults) {
                historyData.rollResult = {
                    result: rollResults.result,
                    successes: rollResults.successes,
                    modifiers: [],
                    damage: rollResults.successes * -1,
                };
            }
            const phaseReaction = await encounterServices.createEncounterHistory(campaignId, encounterId, historyData);
            await encounterServices.setPhaseReaction(encounterId, phaseReaction);
            socket.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted reaction roll to campaign ${campaignId}`);
        });
        socket.on('scheduleReaction', async ({ campaignId, encounterId, characterId }) => {
            await encounterServices.scheduleReaction(encounterId, characterId);
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('passReaction', async ({ campaignId, encounterId, characterId }) => {
            await encounterServices.passReaction(encounterId, characterId);
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('finishReaction', async ({ campaignId, encounterId, characterId }) => {
            await encounterServices.finishReaction(encounterId, characterId);
            io.to(campaignId).emit('encounter', encounterId);
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('passAllReactions', async ({ campaignId, encounterId }) => {
            await encounterServices.passAllReactions(encounterId);
            io.to(campaignId).emit('encounter', encounterId);
            io.to(campaignId).emit('resetRolls');
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('confirmActionQueueResults', async ({ campaignId, encounterId }) => {
            const targetId = await encounterServices.confirmActionQueueResults(encounterId);
            io.to(campaignId).emit('character', targetId);
        });
        socket.on('advanceTurn', async ({ campaignId, encounterId }) => {
            const itemIds = await encounterServices.advanceTurn(encounterId);
            if (itemIds.length > 0) {
                for (const id of itemIds) {
                    io.to(campaignId).emit('item', id);
                }
            }
            io.to(campaignId).emit('encounter', encounterId);
            io.to(campaignId).emit('resetRolls');
            console.log(`Broadcasted encounter ${encounterId} to campaign ${campaignId}`);
        });
        socket.on('disconnect', (reason) => {
            console.log('User disconnected:', socket.id, 'Reason:', reason);
        });
    });
}

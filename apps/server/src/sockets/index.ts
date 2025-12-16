import { Server } from 'socket.io';
import prisma from '../config/database.js';

export function setupSocketIO(io: Server) {
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
      socket.join(campaignId);
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

      const players = campaign?.players.map((player) => player.id) || [];

      const pendingPlayers =
        campaign?.pendingPlayers.map((player) => player.id) || [];

      const playerIds = [campaign?.ownerId, ...players, ...pendingPlayers];

      io.emit('globalCampaign', { campaignId, playerIds });
      console.log(`Broadcasted campaign ${campaignId} to all players`);
    });

    socket.on('location', ({ locationId, campaignId }) => {
      io.to(`campaign ${campaignId}`).emit('location', locationId);
      console.log(
        `Broadcasted location ${locationId} to campaign ${campaignId}`,
      );
    });

    socket.on('character', ({ characterId, campaignId }) => {
      io.to(`campaign ${campaignId}`).emit('character', characterId);
      console.log(
        `Broadcasted character ${characterId} to campaign ${campaignId}`,
      );
    });

    socket.on('item', ({ itemId, campaignId }) => {
      io.to(`campaign ${campaignId}`).emit('item', itemId);
      console.log(`Broadcasted item ${itemId} to campaign ${campaignId}`);
    });

    socket.on('affiliation', ({ affiliationId, campaignId }) => {
      io.to(`campaign ${campaignId}`).emit('affiliation', affiliationId);
      console.log(
        `Broadcasted affiliation ${affiliationId} to campaign ${campaignId}`,
      );
    });

    socket.on('encounter', ({ campaignId, encounterId }) => {
      io.to(`campaign ${campaignId}`).emit('encounter', encounterId);
      console.log(
        `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
      );
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

    // socket.on('activateEncounter', async ({ campaignId, encounterId }) => {
    //   await encounterServices.activateEncounter(encounterId);
    //   await encounterServices.advancePhase(encounterId);

    //   io.to(`campaign ${campaignId}`).emit('encounter', encounterId);

    //   console.log(
    //     `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
    //   );
    // });

    // socket.on('rollInitiative', async (encounterId) => {
    //   const encounter = await encounterServices.getEncounterById(encounterId);

    //   const rolls = new Map();

    //   for (const id of encounter.turnOrder) {
    //     const character = await characterServices.getCharacterById(id);

    //     const violenceRolls = [
    //       { attribute: 'violence', skill: 'assault' },
    //       { attribute: 'violence', skill: 'shooting' },
    //       { attribute: 'violence', skill: 'subterfuge' },
    //       { attribute: 'violence', skill: 'threshold' },
    //     ];

    //     const rollInitiative = async () => {
    //       const rollResults = calculateRoll(
    //         character?.attributes,
    //         { roll: violenceRolls },
    //         [],
    //       ) || { result: [], successes: 0 };

    //       rolls.set(character?.id, {
    //         characterId: character?.id,
    //         name: character?.firstName,
    //         playerCharacter: character?.playerCharacter,
    //         diceArray: rollResults.result,
    //         successes: rollResults.successes,
    //       });
    //     };
    //     rollInitiative();
    //   }

    //   const rollsArray = Array.from(rolls.entries());

    //   io.to(`encounter ${encounterId}`).emit('initiativeRoll', rollsArray);
    // });

    socket.on('navigateToEncounter', ({ encounterId, mapId, campaignId }) => {
      socket
        .to(`encounter ${encounterId}`)
        .emit('navigateToEncounter', { encounterId, mapId, campaignId });
    });

    socket.on('changeTarget', ({ encounterId, characterId }) => {
      io.to(`encounter ${encounterId}`).emit('changeTarget', { characterId });

      console.log(
        `Broadcasted change target ${characterId} to encounter ${encounterId}`,
      );
    });

    socket.on('resetBoard', ({ encounterId }) => {
      socket.to(`encounter ${encounterId}`).emit('resetBoard');
      console.log(`Broadcasted reset board to encounter ${encounterId}`);
    });

    // socket.on(
    //   'actionRoll',
    //   async ({
    //     campaignId,
    //     encounterId,
    //     activeCharacterId,
    //     targetCharacterId,
    //     actionId,
    //     modifiers,
    //     extraDice,
    //     itemId,
    //   }) => {
    //     const reactiveCharacterPromise = activeCharacterId
    //       ? characterServices.getCharacterById(activeCharacterId)
    //       : Promise.resolve(null);

    //     const targetCharacterPromise = targetCharacterId
    //       ? characterServices.getCharacterById(targetCharacterId)
    //       : Promise.resolve(null);

    //     const reactionPromise = actionId
    //       ? actionServices.getActionById(actionId)
    //       : Promise.resolve(null);

    //     const itemPromise = itemId
    //       ? itemServices.getItemById(itemId)
    //       : Promise.resolve(null);

    //     const [activeCharacter, targetCharacter, action, item] =
    //       await Promise.all([
    //         reactiveCharacterPromise,
    //         targetCharacterPromise,
    //         reactionPromise,
    //         itemPromise,
    //       ]);

    //     const rollResults =
    //       //@ts-ignore
    //       action && action.roll.length > 0
    //         ? calculateRoll(
    //             activeCharacter?.attributes,
    //             //@ts-ignore
    //             { name: action.name, roll: action.roll },
    //             modifiers,
    //             extraDice,
    //           ) || { result: [], successes: 0 }
    //         : null;

    //     const rolls = new Map();

    //     const { damage } =
    //       rollResults && item
    //         ? //@ts-ignore
    //           calculateDamage(item, action, rollResults.successes)
    //         : { damage: null };

    //     if (rollResults) {
    //       rolls.set(activeCharacter?.id, {
    //         characterId: activeCharacter?.id,
    //         name: `${activeCharacter?.firstName} ${activeCharacter?.lastName}`,
    //         playerCharacter: activeCharacter?.playerCharacter,
    //         diceArray: rollResults.result,
    //         successes: rollResults.successes,
    //         modifiers,
    //       });
    //     }

    //     const rollsArray = rollResults ? Array.from(rolls.entries()) : null;

    //     await calculateCosts(activeCharacter, item, action);

    //     const historyData = {
    //       characterId: activeCharacter?.id,
    //       actionId: action?.id,
    //     } as {
    //       characterId: number;
    //       targetId?: number;
    //       actionId: number;
    //       itemId?: number;
    //       rollResult?: {
    //         result: number[];
    //         successes: number;
    //         modifiers: string[];
    //         damage: number;
    //       };
    //     };

    //     if (targetCharacter) {
    //       historyData.targetId = targetCharacter.id;
    //     }
    //     if (item) {
    //       historyData.itemId = item.id;
    //     }
    //     if (rollResults) {
    //       historyData.rollResult = {
    //         result: rollResults.result,
    //         successes: rollResults.successes,
    //         modifiers,
    //         damage: damage || 0,
    //       };
    //     }

    //     const phaseAction = await encounterServices.createEncounterHistory(
    //       campaignId,
    //       encounterId,
    //       historyData,
    //     );

    //     await encounterServices.advancePhase(encounterId);

    //     await encounterServices.setPhaseAction(encounterId, phaseAction);

    //     if (rollResults) {
    //       io.to(`encounter ${encounterId}`).emit('actionRoll', {
    //         encounterId,
    //         rollsArray,
    //       });
    //     } else {
    //       io.to(`encounter ${encounterId}`).emit('actionRoll', {
    //         encounterId,
    //       });
    //     }

    //     io.to(`campaign ${campaignId}`).emit('character', activeCharacter?.id);

    //     if (item) {
    //       await itemServices.setItemNotAvailable(item.id);
    //       io.to(`campaign ${campaignId}`).emit('item', item.id);
    //     }

    //     if (targetCharacter) {
    //       io.to(`campaign ${campaignId}`).emit('character', targetCharacter.id);
    //     }

    //     console.log(`Broadcasted action roll to encounter ${encounterId}`);
    //   },
    // );

    // socket.on(
    //   'reactionRoll',
    //   async ({
    //     campaignId,
    //     encounterId,
    //     reactiveCharacterId,
    //     targetCharacterId,
    //     reactionId,
    //     modifiers,
    //     extraDice,
    //     itemId,
    //   }) => {
    //     const reactiveCharacterPromise = reactiveCharacterId
    //       ? characterServices.getCharacterById(reactiveCharacterId)
    //       : Promise.resolve(null);

    //     const targetCharacterPromise = targetCharacterId
    //       ? characterServices.getCharacterById(targetCharacterId)
    //       : Promise.resolve(null);

    //     const reactionPromise = reactionId
    //       ? actionServices.getActionById(reactionId)
    //       : Promise.resolve(null);

    //     const itemPromise = itemId
    //       ? itemServices.getItemById(itemId)
    //       : Promise.resolve(null);

    //     const [reactiveCharacter, targetCharacter, reaction, item] =
    //       await Promise.all([
    //         reactiveCharacterPromise,
    //         targetCharacterPromise,
    //         reactionPromise,
    //         itemPromise,
    //       ]);

    //     const rollResults =
    //       //@ts-ignore
    //       reaction && reaction.roll.length > 0
    //         ? calculateRoll(
    //             reactiveCharacter?.attributes,
    //             //@ts-ignore
    //             { name: reaction.name, roll: reaction.roll },
    //             modifiers,
    //             extraDice,
    //           ) || { result: [], successes: 0 }
    //         : null;

    //     const rolls = new Map();

    //     if (rollResults) {
    //       rolls.set(reactiveCharacter?.id, {
    //         characterId: reactiveCharacter?.id,
    //         name: `${reactiveCharacter?.firstName} ${reactiveCharacter?.lastName}`,
    //         playerCharacter: reactiveCharacter?.playerCharacter,
    //         diceArray: rollResults.result,
    //         successes: rollResults.successes,
    //         modifiers,
    //       });
    //     }

    //     const rollsArray = rollResults ? Array.from(rolls.entries()) : null;

    //     await calculateCosts(reactiveCharacter, item, reaction);

    //     const historyData = {
    //       characterId: reactiveCharacter?.id,
    //       actionId: reaction?.id,
    //     } as {
    //       characterId: number;
    //       targetId?: number;
    //       actionId: number;
    //       itemId?: number;
    //       rollResult?: {
    //         result: number[];
    //         successes: number;
    //         modifiers: string[];
    //         damage?: number;
    //       };
    //     };
    //     if (targetCharacter) {
    //       historyData.targetId = targetCharacter.id;
    //     }
    //     if (item) {
    //       historyData.itemId = item.id;
    //     }
    //     if (rollResults) {
    //       historyData.rollResult = {
    //         result: rollResults.result,
    //         successes: rollResults.successes,
    //         modifiers,
    //       };
    //     }

    //     const phaseReaction = await encounterServices.createEncounterHistory(
    //       campaignId,
    //       encounterId,
    //       historyData,
    //     );

    //     await encounterServices.setPhaseReaction(encounterId, phaseReaction);

    //     if (rollResults) {
    //       io.to(`encounter ${encounterId}`).emit('reactionRoll', {
    //         encounterId,
    //         rollsArray,
    //       });
    //     } else {
    //       io.to(`encounter ${encounterId}`).emit('reactionRoll', {
    //         encounterId,
    //       });
    //     }

    //     io.to(`campaign ${campaignId}`).emit('character', reactiveCharacter?.id);

    //     if (item) {
    //       io.to(`campaign ${campaignId}`).emit('item', item.id);
    //     }

    //     if (targetCharacter) {
    //       io.to(`campaign ${campaignId}`).emit('character', targetCharacter.id);
    //     }

    //     console.log(`Broadcasted reaction roll to campaign ${campaignId}`);
    //   },
    // );

    // socket.on(
    //   'scheduleReaction',
    //   async ({ campaignId, encounterId, characterId }) => {
    //     await encounterServices.scheduleReaction(encounterId, characterId);
    //     io.to(`campaign ${campaignId}`).emit('encounter', encounterId);
    //     console.log(
    //       `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
    //     );
    //   },
    // );

    // socket.on(
    //   'passReaction',
    //   async ({ campaignId, encounterId, characterId }) => {
    //     await encounterServices.passReaction(encounterId, characterId);
    //     io.to(`campaign ${campaignId}`).emit('encounter', encounterId);
    //     console.log(
    //       `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
    //     );
    //   },
    // );

    // socket.on(
    //   'finishReaction',
    //   async ({ campaignId, encounterId, characterId }) => {
    //     await encounterServices.finishReaction(encounterId, characterId);
    //     io.to(`campaign ${campaignId}`).emit('encounter', encounterId);
    //     console.log(
    //       `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
    //     );
    //   },
    // );

    // socket.on('passAllReactions', async ({ campaignId, encounterId }) => {
    //   await encounterServices.passAllReactions(encounterId);
    //   io.to(`campaign ${campaignId}`).emit('encounter', encounterId);
    //   io.to(`campaign ${campaignId}`).emit('resetRolls');

    //   console.log(
    //     `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
    //   );
    // });

    // socket.on(
    //   'confirmActionQueueResults',
    //   async ({ campaignId, encounterId, blockData }) => {
    //     const { targetId, armorIds } =
    //       await encounterServices.confirmActionQueueResults(
    //         encounterId,
    //         blockData,
    //       );

    //     if (targetId) {
    //       io.to(`campaign ${campaignId}`).emit('character', targetId);
    //     }

    //     if (armorIds.length > 0) {
    //       for (const itemId of armorIds) {
    //         io.to(`campaign ${campaignId}`).emit('item', itemId);
    //       }
    //     }
    //   },
    // );

    // socket.on('advancePhase', async ({ campaignId, encounterId }) => {
    //   await encounterServices.advancePhase(encounterId);

    //   io.to(`campaign ${campaignId}`).emit('encounter', encounterId);
    //   io.to(`campaign ${campaignId}`).emit('resetRolls');

    //   console.log(
    //     `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
    //   );
    // });

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id, 'Reason:', reason);
    });

    // socket.on('advanceTurn', async ({ campaignId, encounterId }) => {
    //   const itemIds = await encounterServices.advanceTurn(encounterId);

    //   if (itemIds.length > 0) {
    //     for (const itemId of itemIds) {
    //       io.to(`campaign ${campaignId}`).emit('item', itemId);
    //     }
    //   }

    //   io.to(`campaign ${campaignId}`).emit('encounter', encounterId);
    //   io.to(`campaign ${campaignId}`).emit('resetRolls');

    //   console.log(
    //     `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
    //   );
    // });

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id, 'Reason:', reason);
    });
  });
}

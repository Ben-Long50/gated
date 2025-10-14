import { Server } from 'socket.io';
import prisma from '../config/database.js';
import encounterServices from '../services/encounterServices.js';
import characterStatServices from '../services/characterStatServices.js';
import itemStatServices from '../services/itemStatServices.js';
import characterServices from '../services/characterServices.js';
import {
  applyDamage,
  calculateCosts,
  calculateDamage,
  calculateRoll,
} from '../utils/rollUtilities.js';

export function setupSocketIO(io: Server) {
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

      const players = campaign?.players.map((player) => player.id) || [];

      const pendingPlayers =
        campaign?.pendingPlayers.map((player) => player.id) || [];

      const playerIds = [campaign?.ownerId, ...players, ...pendingPlayers];

      io.emit('globalCampaign', { campaignId, playerIds });
      console.log(`Broadcasted campaign ${campaignId} to all players`);
    });

    socket.on('location', ({ locationId, campaignId }) => {
      io.to(campaignId).emit('location', locationId);
      console.log(
        `Broadcasted location ${locationId} to campaign ${campaignId}`,
      );
    });

    socket.on('character', ({ characterId, campaignId }) => {
      io.to(campaignId).emit('character', characterId);
      console.log(
        `Broadcasted character ${characterId} to campaign ${campaignId}`,
      );
    });

    socket.on('item', ({ itemId, campaignId }) => {
      io.to(campaignId).emit('item', itemId);
      console.log(`Broadcasted item ${itemId} to campaign ${campaignId}`);
    });

    socket.on('affiliation', ({ affiliationId, campaignId }) => {
      io.to(campaignId).emit('affiliation', affiliationId);
      console.log(
        `Broadcasted affiliation ${affiliationId} to campaign ${campaignId}`,
      );
    });

    socket.on('encounter', ({ campaignId, encounterId }) => {
      io.to(campaignId).emit('encounter', encounterId);
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

      console.log(
        `Broadcasted encounter ${encounterId} to campaign ${campaignId}`,
      );
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
          const rollResults = calculateRoll(
            character?.attributes,
            { roll: violenceRolls },
            [],
          ) || { result: [], successes: 0 };

          rolls.set(character?.id, {
            characterId: character?.id,
            name: character?.firstName,
            playerCharacter: character?.playerCharacter,
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

    socket.on(
      'actionRoll',
      async ({
        campaignId,
        encounterId,
        activeCharacter,
        targetCharacter,
        action,
        modifiers,
        item,
      }) => {
        const rollResults = calculateRoll(
          activeCharacter.attributes,
          { name: action.name, roll: action.roll },
          modifiers,
        ) || { result: [], successes: 0 };

        const rolls = new Map();

        const damage = calculateDamage(item, action, rollResults.successes);

        rolls.set(activeCharacter?.id, {
          characterId: activeCharacter?.id,
          name: activeCharacter?.firstName,
          playerCharacter: activeCharacter?.playerCharacter,
          diceArray: rollResults.result,
          successes: rollResults.successes,
        });

        const rollsArray = Array.from(rolls.entries());

        await calculateCosts(activeCharacter, item, action);

        io.to(`encounter ${encounterId}`).emit('actionRoll', {
          encounterId,
          rollsArray,
        });

        io.to(campaignId).emit('item', item.id);
        io.to(campaignId).emit('character', activeCharacter.id);

        await encounterServices.setCombatPhase(encounterId, 'reaction');

        applyDamage(targetCharacter, damage);

        io.to(campaignId).emit('character', targetCharacter.id);

        return;

        const historyData = {
          characterId: activeCharacter.id,
          actionId: action.id,
        } as {
          characterId: number;
          targetId?: number;
          actionId: number;
          itemId?: number;
          rollResult?: {
            result: number[];
            successes: number;
            modifiers: string[];
            damage: number;
          };
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

        await encounterServices.createEncounterHistory(
          campaignId,
          encounterId,
          historyData,
        );

        console.log(`Broadcasted action roll to encounter ${encounterId}`);
      },
    );

    socket.on(
      'reactionRoll',
      async ({
        campaignId,
        encounterId,
        reactiveCharacter,
        targetCharacter,
        reaction,
        item,
        rollResult,
      }) => {
        const historyData = {
          characterId: reactiveCharacter.id,
          actionId: reaction.id,
        } as {
          characterId: number;
          targetId?: number;
          actionId: number;
          itemId?: number;
          rollResult?: {
            result: number[];
            successes: number;
            modifiers: string[];
            damage: number;
          };
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

        await encounterServices.createEncounterHistory(
          campaignId,
          encounterId,
          historyData,
        );

        io.to(campaignId).emit('reactionRoll', {
          encounterId,
          reactiveCharacter,
          targetCharacter,
          reaction,
          item,
          rollResult,
        });
        console.log(`Broadcasted reaction roll to campaign ${campaignId}`);
      },
    );

    socket.on(
      'scheduleReaction',
      async ({ campaignId, encounterId, characterId }) => {
        await encounterServices.scheduleReaction(encounterId, characterId);
        io.to(campaignId).emit('encounter', encounterId);
        console.log(
          `Broadcasted combat ${encounterId} to campaign ${campaignId}`,
        );
      },
    );

    socket.on(
      'passReaction',
      async ({ campaignId, encounterId, characterId }) => {
        await encounterServices.passReaction(encounterId, characterId);
        io.to(campaignId).emit('encounter', encounterId);
        console.log(
          `Broadcasted combat ${encounterId} to campaign ${campaignId}`,
        );
      },
    );

    socket.on(
      'finishReaction',
      async ({ campaignId, encounterId, characterId }) => {
        await encounterServices.finishReaction(encounterId, characterId);
        io.to(campaignId).emit('encounter', encounterId);
        console.log(
          `Broadcasted combat ${encounterId} to campaign ${campaignId}`,
        );
      },
    );

    socket.on('passAllReactions', async ({ campaignId, encounterId }) => {
      await encounterServices.passAllReactions(encounterId);
      io.to(campaignId).emit('encounter', encounterId);
      io.to(campaignId).emit('resetRolls');
      console.log(
        `Broadcasted combat ${encounterId} to campaign ${campaignId}`,
      );
    });

    socket.on('advanceTurn', ({ campaignId, encounterId }) => {
      io.to(campaignId).emit('advanceTurn', encounterId);
      console.log(
        `Broadcasted combat ${encounterId} to campaign ${campaignId}`,
      );
    });

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id, 'Reason:', reason);
    });
  });
}

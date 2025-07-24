import { Server } from 'socket.io';
import prisma from '../config/database.js';
import encounterServices from '../services/encounterServices.js';

export function setupSocketIO(io: Server) {
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

    socket.on(
      'actionRoll',
      async ({
        campaignId,
        encounterId,
        activeCharacter,
        targetCharacter,
        action,
        item,
        damage,
        rollResult,
      }) => {
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
        if (rollResult) {
          historyData.rollResult = rollResult;
        }

        await encounterServices.createEncounterHistory(
          campaignId,
          encounterId,
          historyData,
        );

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
      },
    );

    socket.on(
      'reactionRoll',
      async ({
        campaignId,
        encounterId,
        activeCharacter,
        targetCharacter,
        reaction,
        item,
        rollResult,
      }) => {
        const historyData = {
          characterId: activeCharacter.id,
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
          activeCharacter,
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

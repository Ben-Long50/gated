// @ts-nocheck

import {
  $Enums,
  Character,
  CombatPhase,
  Encounter,
  History,
} from '@prisma/client';
import prisma from '../config/database.js';
import itemServices from './itemServices.js';
import { applyDamage, calculateCosts } from '../utils/rollUtilities.js';
import { getIO } from '../sockets/socket.js';
import characterServices from './characterServices.js';
import actionServices from './actionServices.js';
import actionFuncs from '../utils/actionFuncs.js';
import { camelCase } from 'change-case';
import reactionFuncs from '../utils/reactionFuncs.js';
import parseBlockData from '../utils/parseBlockData.js';
import {
  Action,
  AttributeTree,
  calculateItemStats,
  calculateRoll,
  calculateSuccesses,
  combineAttributeTrees,
  Item,
  RollData,
  RollResult,
  violenceRolls,
} from '@gated/shared';

const encounterInclude = {
  campaign: { select: { id: true, ownerId: true } },
  characters: {
    select: { id: true, userId: true, playerCharacter: true },
  },
  map: {
    select: { id: true, name: true, generatedPicture: true },
  },
  history: {
    take: 10,
    orderBy: { createdAt: 'desc' as const },
  },
  phaseHistory: {
    take: 1,
    orderBy: { createdAt: 'desc' as const },
    include: { action: true, reactions: true },
  },
};

const encounterServices = {
  getEncounters: async (campaignId: number) => {
    const encounters = await prisma.encounter.findMany({
      where: {
        campaignId,
      },
      include: encounterInclude,
      orderBy: { id: 'asc' },
    });

    return encounters;
  },

  getEncounterById: async (encounterId: number) => {
    const encounter = await prisma.encounter.findUnique({
      where: { id: Number(encounterId) },
      include: encounterInclude,
    });

    if (!encounter) {
      throw new Error('Failed to find encounter');
    }

    return encounter;
  },

  getBatchEncounters: async (encounterIds: number[]) => {
    const encounters = await prisma.encounter.findMany({
      where: {
        id: { in: encounterIds },
      },
      include: encounterInclude,
    });

    return encounters;
  },

  getEncounterHistory: async (encounterId: number) => {
    const encounter = await prisma.encounter.findUnique({
      where: {
        id: encounterId,
      },
      select: {
        phaseHistory: {
          take: 10,
          where: { action: { isNot: null } },
          orderBy: { createdAt: 'desc' },
          include: { action: true, reactions: true },
        },
      },
    });

    if (!encounter) {
      throw new Error('Failed to find encounter');
    }

    const history = encounter?.phaseHistory;

    return history;
  },

  activateEncounter: async (encounterId: number) => {
    const encounter = await prisma.encounter.update({
      where: {
        id: encounterId,
      },
      data: {
        combatPhase: 'initiative',
      },
      include: encounterInclude,
    });

    return encounter;
  },

  advancePhase: async (encounterId: number) => {
    const { encounter, initiative } = await prisma.$transaction(async (tx) => {
      const encounter = await tx.encounter.findUnique({
        where: { id: encounterId },
        select: { combatPhase: true, turn: true, round: true },
      });

      if (!encounter) {
        throw new Error('Failed to find encounter');
      }

      const initiative = encounter.combatPhase === 'initiative';

      let nextPhase = null as CombatPhase | null;

      switch (encounter.combatPhase) {
        case 'pending':
          nextPhase = 'initiative';
          break;
        case 'initiative':
          nextPhase = 'action';
          break;
        case 'action':
          nextPhase = 'reaction';
          break;
        case 'reaction':
          nextPhase = 'action';
          break;
        default:
          nextPhase = null;
          break;
      }

      if (!nextPhase) {
        throw new Error('Failed to advance encounter phase');
      }

      const phaseHistoryData = {
        turn: encounter.turn + 1,
        round: encounter.round,
      } as any;

      const newEncounter =
        nextPhase === 'action'
          ? await prisma.encounter.update({
              where: { id: encounterId },
              data: {
                combatPhase: nextPhase,
                reactions: [],
                passes: [],
                phaseHistory: { create: phaseHistoryData },
              },
              include: encounterInclude,
            })
          : await prisma.encounter.update({
              where: { id: encounterId },
              data: {
                combatPhase: nextPhase,
                reactions: [],
                passes: [],
              },
              include: encounterInclude,
            });

      return { encounter: newEncounter, initiative };
    });

    return { encounter, initiative };
  },

  advanceTurn: async (encounter: Encounter, encounterId: number) => {
    const io = getIO();

    const newRound = encounter.turnPosition + 1 >= encounter.turnOrder.length;

    const nextCharacterId = newRound
      ? encounter.turnOrder[0]
      : encounter.turnOrder[encounter.turnPosition + 1];

    const usedItems = await prisma.item.findMany({
      where: {
        available: false,
        characterInventory: {
          characterId: {
            in: encounter.turnOrder,
          },
        },
      },
      select: {
        id: true,
      },
    });

    const usedItemIds = usedItems.map((item) => item.id);

    const data = {
      turn: encounter.turn + 1,
      turnPosition: newRound ? 0 : encounter.turnPosition + 1,
      combatPhase: 'action',
      reactions: [],
      passes: [],
    } as any;

    const phaseHistoryData = {
      turn: encounter.turn + 1,
      round: encounter.round,
    } as any;

    if (newRound) {
      data.round = encounter.round + 1;
      phaseHistoryData.round = encounter.round + 1;
    }

    await prisma.$transaction(async (tx) => {
      await tx.encounter.update({
        where: {
          id: encounterId,
        },
        data: { phaseHistory: { create: phaseHistoryData }, ...data },
      });

      await tx.item.updateMany({
        where: { id: { in: usedItemIds } },
        data: { available: true },
      });
    });

    const updatedEncounter =
      await encounterServices.getEncounterById(encounterId);

    if (nextCharacterId) {
      io.to(`campaign ${encounter.campaignId}`).emit(
        'character',
        nextCharacterId,
      );
    }

    if (usedItemIds.length > 0) {
      for (const itemId of usedItemIds) {
        io.to(`campaign ${encounter.campaignId}`).emit('item', itemId);
      }
    }

    io.to(`encounter ${encounterId}`).emit('updateEncounter', updatedEncounter);

    io.to(`encounter ${encounterId}`).emit('resetBoard');
  },

  rollInitiative: async (encounterId: number, rollData: RollData) => {
    const rollMap = new Map(rollData);
    const rollResultMap: Map<number, RollResult> = new Map();

    const { encounter, rollResultData } = await prisma.$transaction(
      async (tx) => {
        const characters = await tx.character.findMany({
          where: { id: { in: Array.from(rollMap.keys()) } },
          include: { characterLevelBonuses: { select: { attributes: true } } },
        });

        for (const character of characters) {
          const data = rollMap.get(character.id);

          if (!data) {
            continue;
          }

          const attributes = combineAttributeTrees(
            character.characterLevelBonuses.map(
              (bonus) => bonus.attributes as AttributeTree,
            ),
          );

          const action = { name: 'Initiative', roll: violenceRolls };

          const { diceArray, successes } = calculateRoll(
            attributes,
            action.name,
            violenceRolls,
            data.modifiers ?? [],
            data.extraDice ?? 0,
          );

          rollResultMap.set(character.id, {
            diceArray,
            successes,
          });
        }

        const rollResultData = Array.from(rollResultMap.entries());

        const sortedRollResultData = Array.from(rollResultMap.entries()).sort(
          (a, b) => b[1].successes - a[1].successes,
        );

        const newTurnOrder = sortedRollResultData.map((data) => data[0]);

        const encounter = await tx.encounter.update({
          where: { id: encounterId },
          data: { turnOrder: newTurnOrder },
          include: encounterInclude,
        });

        return { encounter, rollResultData };
      },
    );

    return { encounter, rollResultData };
  },

  rollAction: async (
    campaignId: number,
    encounterId: number,
    actionData: {
      activeCharacterId: number;
      targetCharacterId?: number;
      actionId: number;
      itemId?: number;
      tile?: {
        start: { row: number; col: number };
        end: { row: number; col: number };
      };
      modifiers: string[];
      extraDice: number;
    },
  ) => {
    const io = getIO();

    const characterPromise = characterServices.getCharacterById(
      actionData.activeCharacterId,
    );

    const actionPromise = actionServices.getActionById(actionData.actionId);

    const targetPromise = actionData.targetCharacterId
      ? characterServices.getCharacterById(actionData.targetCharacterId)
      : Promise.resolve(null);

    const itemPromise = actionData.itemId
      ? itemServices.getItemById(actionData.itemId)
      : Promise.resolve(null);

    const tile = actionData.tile || null;

    const [character, target, action, item] = await Promise.all([
      characterPromise,
      targetPromise,
      actionPromise,
      itemPromise,
    ]);

    if (!character) {
      throw new Error('Failed to find character');
    }

    if (!action) {
      throw new Error('Failed to find action');
    }

    const rollResults =
      action.roll && action.roll.length > 0
        ? calculateRoll(
            character?.attributes,
            { name: action.name, roll: action.roll },
            actionData.modifiers,
            actionData.extraDice,
          ) || { result: [], successes: 0 }
        : null;

    const rolls = new Map();

    if (rollResults) {
      rolls.set(character?.id, {
        characterId: character?.id,
        name: character?.name,
        playerCharacter: character?.playerCharacter,
        diceArray: rollResults.result,
        successes: rollResults.successes,
        modifiers: actionData.modifiers,
      });
    }

    const rollsArray = rollResults ? Array.from(rolls.entries()) : null;

    await calculateCosts(character, item, action);

    const historyData: History = {
      character,
      action,
    } as {
      character: Character;
      target?: Character;
      action: Action;
      item?: Item;
      tile?: {
        start: { row: number; col: number };
        end: { row: number; col: number };
      };
      rollResult?: {
        result: number[];
        successes: number;
        modifiers: string[];
      };
    };

    if (target) {
      historyData.target = target;
    }
    if (item) {
      historyData.item = item;
    }
    if (rollResults) {
      historyData.rollResult = {
        result: rollResults.result,
        successes: rollResults.successes,
        modifiers: actionData.modifiers,
      };
    }
    if (tile) {
      historyData.tile = tile;
    }

    const phaseAction = await encounterServices.createEncounterHistory(
      campaignId,
      encounterId,
      historyData,
    );

    if (rollResults) {
      io.to(`encounter ${encounterId}`).emit('actionRoll', {
        encounterId,
        rollsArray,
      });
    } else {
      io.to(`encounter ${encounterId}`).emit('actionRoll', {
        encounterId,
      });
    }

    if (item) {
      io.to(`campaign ${campaignId}`).emit('item', item.id);
    }

    io.to(`campaign ${campaignId}`).emit('character', character.id);

    return phaseAction;
  },

  scheduleReaction: async (encounterId: number, characterId: number) => {
    const io = getIO();

    await prisma.encounter.update({
      where: {
        id: encounterId,
      },
      data: {
        reactions: { push: characterId },
      },
    });

    const updatedEncounter =
      await encounterServices.getEncounterById(encounterId);

    io.to(`encounter ${encounterId}`).emit('updateEncounter', updatedEncounter);
  },

  passReaction: async (encounterId: number, characterId: number) => {
    const io = getIO();

    await prisma.encounter.update({
      where: {
        id: encounterId,
      },
      data: {
        passes: { push: characterId },
      },
    });

    const updatedEncounter =
      await encounterServices.getEncounterById(encounterId);

    io.to(`encounter ${encounterId}`).emit('updateEncounter', updatedEncounter);
  },

  finishReaction: async (encounterId: number, characterId: number) => {
    const io = getIO();

    const encounter = await prisma.encounter.findUnique({
      where: { id: encounterId },
      select: { campaignId: true, reactions: true, passes: true },
    });

    if (!encounter) throw new Error('Failed to find encounter');

    const updatedReactions =
      encounter.reactions.filter((id) => id !== characterId) || [];

    const updatedPasses = !encounter.passes.includes(characterId)
      ? [...encounter.passes, characterId]
      : encounter.passes;

    await prisma.encounter.update({
      where: {
        id: encounterId,
      },
      data: {
        reactions: updatedReactions,
        passes: updatedPasses,
      },
    });

    const updatedEncounter =
      await encounterServices.getEncounterById(encounterId);

    io.to(`encounter ${encounterId}`).emit('updateEncounter', updatedEncounter);
  },

  passAllReactions: async (encounterId: number) => {
    const io = getIO();

    const encounter = await prisma.encounter.findUnique({
      where: { id: encounterId },
      select: { campaignId: true, turnOrder: true, turnPosition: true },
    });

    if (!encounter) {
      throw new Error('Failed to find encounter');
    }

    const reactiveIds = encounter?.turnOrder.filter(
      (_, index) => index !== encounter.turnPosition,
    );

    await prisma.encounter.update({
      where: {
        id: encounterId,
      },
      data: {
        reactions: [],
        passes: reactiveIds,
      },
    });

    const updatedEncounter =
      await encounterServices.getEncounterById(encounterId);

    io.to(`encounter ${encounterId}`).emit('updateEncounter', updatedEncounter);
    io.to(`encounter ${encounterId}`).emit('resetBoard');
  },

  confirmActionQueueResults: async (
    encounter: Encounter,
    blockData: [
      key: string,
      {
        blockedDamage: number;
        blockedSanityDamage: number;
        armorIds: number[];
      }[],
    ][],
  ) => {
    const io = getIO();

    if (!encounter) {
      throw new Error('Failed to find encounter');
    }

    const phaseHistory = encounter.phaseHistory[0];
    const phaseAction = phaseHistory.action;
    const phaseReactions = phaseHistory.reactions;

    if (!phaseHistory) {
      throw new Error('Failed to find phase history');
    }

    let characterIds = [] as number[];
    let itemIds = [] as number[];

    const blockDataMap = blockData ? new Map(blockData) : null;

    let reducedSuccesses = 0;

    for (const reaction of phaseReactions) {
      const results = await reactionFuncs[
        `${camelCase(reaction.actionSnapshot.name)}`
      ](
        reaction.characterSnapshot,
        reaction.itemSnapshot
          ? calculateItemStats(reaction.itemSnapshot)
          : undefined,
        reaction.rollResult ? reaction.rollResult.successes : undefined,
        reaction.tile ? reaction.tile : undefined,
      );

      if (results.reducedSuccesses) {
        reducedSuccesses += results.reducedSuccesses;
      }

      const targetBlockData =
        phaseAction.targetId && blockDataMap
          ? blockDataMap.get(`character ${phaseAction.targetId}`)
          : undefined;

      const { blockedDamage, blockedSanityDamage, armorIds } = targetBlockData
        ? await parseBlockData(reaction.id, targetBlockData)
        : { blockedDamage: 0, blockedSanityDamage: 0, armorIds: [] };

      if (reaction.itemSnapshot) {
        itemIds = [...itemIds, reaction.itemId, ...armorIds];
      } else {
        itemIds = [...itemIds, ...armorIds];
      }

      if (reaction.targetSnapshot && (results.damage || results.sanityDamage)) {
        await applyDamage(
          reaction.targetSnapshot,
          results.damage * results.instances - blockedDamage,
          results.sanityDamage * results.instances - blockedSanityDamage,
        );
        characterIds.push(reaction.targetId);
      }
    }

    const actionResults = await actionFuncs[
      `${camelCase(phaseAction.actionSnapshot.name)}`
    ](
      phaseAction.characterSnapshot,
      phaseAction.itemSnapshot
        ? calculateItemStats(phaseAction.itemSnapshot)
        : undefined,
      phaseAction.rollResult
        ? phaseAction.rollResult.successes - reducedSuccesses
        : undefined,
      phaseAction.tile ? phaseAction.tile : undefined,
    );

    const targetBlockData =
      phaseAction.targetId && blockDataMap
        ? blockDataMap.get(`character ${phaseAction.targetId}`)
        : undefined;

    const { blockedDamage, blockedSanityDamage, armorIds } = targetBlockData
      ? await parseBlockData(phaseAction.id, targetBlockData)
      : { blockedDamage: 0, blockedSanityDamage: 0, armorIds: [] };

    if (phaseAction.itemSnapshot) {
      itemIds = [...itemIds, phaseAction.itemId, ...armorIds];
    } else {
      itemIds = [...itemIds, ...armorIds];
    }

    if (
      phaseAction.targetSnapshot &&
      (actionResults.damage || actionResults.sanityDamage)
    ) {
      await applyDamage(
        phaseAction.targetSnapshot,
        actionResults.damage * actionResults.instances - blockedDamage,
        actionResults.sanityDamage * actionResults.instances -
          blockedSanityDamage,
      );
      characterIds.push(phaseAction.targetId);
    }

    io.to(`encounter ${encounter.id}`).emit('encounterHistory', encounter.id);
    io.to(`encounter ${encounter.id}`).emit('resetBoard');

    if (characterIds.length > 0) {
      for (const characterId of characterIds) {
        io.to(`campaign ${encounter.campaignId}`).emit(
          'character',
          characterId,
        );
      }
    }

    if (itemIds.length > 0) {
      for (const itemId of itemIds) {
        io.to(`campaign ${encounter.campaignId}`).emit('item', itemId);
      }
    }
  },

  createEncounterHistory: async (
    campaignId: number,
    encounterId: number,
    formData: {
      character: Character;
      target?: Character;
      action: Action;
      item?: Item;
      tile?: {
        start: { row: number; col: number };
        end: { row: number; col: number };
      };
      rollResult?: {
        result: number[];
        successes: number;
        modifiers: string[];
      };
    },
  ) => {
    const data = {
      campaignId,
      encounterId,
      characterSnapshot: formData.character,
      characterId: formData.character.id,
      actionSnapshot: formData.action,
      actionId: formData.action.id,
    };

    if (formData.target) {
      data.targetSnapshot = formData.target;
      data.targetId = formData.target.id;
    }

    if (formData.item) {
      data.itemSnapshot = formData.item;
      data.itemId = formData.item.id;
    }

    if (formData.rollResult) {
      data.rollResult = formData.rollResult;
    }

    if (formData.tile) {
      data.tile = formData.tile;
    }

    const history = await prisma.history.create({
      data,
    });

    return history;
  },

  setPhaseAction: async (encounterId: number, phaseAction: History) => {
    const phaseHistory = await prisma.phaseHistory.findFirst({
      where: { encounterId },
      orderBy: { createdAt: 'desc' },
    });

    if (!phaseHistory) {
      throw new Error(
        `Failed to find latest phase history entry for encounter ${encounterId}`,
      );
    }

    await prisma.phaseHistory.update({
      where: { id: phaseHistory.id },
      data: {
        action: { connect: { id: phaseAction.id } },
      },
    });
  },

  setPhaseReaction: async (encounterId: number, phaseReaction: History) => {
    const phaseHistory = await prisma.phaseHistory.findFirst({
      where: { encounterId },
      orderBy: { createdAt: 'desc' },
    });

    if (!phaseHistory) {
      throw new Error(
        `Failed to find latest phase history entry for encounter ${encounterId}`,
      );
    }

    await prisma.phaseHistory.update({
      where: { id: phaseHistory.id },
      data: {
        reactions: { connect: { id: phaseReaction.id } },
      },
    });
  },

  createOrUpdateEncounter: async (
    campaignId: number,
    mapId: number,
    formData: {
      id?: number;
      name: string;
    },
  ) => {
    const existingEncounter = await prisma.encounter.findFirst({
      where: { mapId, combatPhase: { not: 'completed' } },
    });

    if (existingEncounter && formData.id !== existingEncounter.id) {
      throw new Error(
        'You cannot create an encounter on a map which already belongs to another encounter',
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        date: true,
        time: true,
      },
    });

    const map = await prisma.map.findUnique({
      where: { id: mapId },
      select: {
        name: true,
        locations: {
          select: { characterId: true },
          orderBy: { character: { name: 'asc' } },
        },
      },
    });

    if (!campaign || !map) throw new Error('No campaign or map found');

    const turnOrder = map.locations
      .filter((location) => typeof location.characterId === 'number')
      .map((location) => location.characterId);

    if (turnOrder.length < 2) {
      throw new Error(
        'You cannot create an encounter with less than 2 participating characters',
      );
    }

    const eventData = { name: `Encounter at ${map.name}` } as {
      name: string;
      month: $Enums.Month;
      day: number;
      time?: { hour: number; minute: number; second: number };
    };

    if (campaign.date && 'month' in campaign.date) {
      eventData.month = campaign.date.month;
    }
    if (campaign.date && 'day' in campaign.date) {
      eventData.day = campaign.date.day;
    }
    if (campaign.time) {
      eventData.time = campaign.time;
    }

    const encounter = await prisma.encounter.upsert({
      where: { id: formData?.id || 0 },
      update: {
        name: formData.name,
        campaign: { connect: { id: campaignId } },
        map: { connect: { id: mapId } },
        characters: {
          set: turnOrder.map((id) => ({ id })),
        },
        turnOrder,
      },
      create: {
        name: formData.name,
        campaign: { connect: { id: campaignId } },
        map: { connect: { id: mapId } },
        characters: {
          connect: turnOrder.map((id) => ({ id })),
        },
        turnOrder,
        event: {
          create: { campaign: { connect: { id: campaignId } }, ...eventData },
        },
      },
      include: encounterInclude,
    });

    return encounter;
  },

  deleteEncounter: async (encounterId: number) => {
    const encounter = await prisma.encounter.findUnique({
      where: { id: encounterId },
    });

    if (!encounter) {
      throw new Error('Failed to find encounter');
    }

    await prisma.encounter.delete({
      where: {
        id: Number(encounterId),
      },
    });
  },
};

export default encounterServices;

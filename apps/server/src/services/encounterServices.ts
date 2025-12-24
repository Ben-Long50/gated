// @ts-nocheck

import { $Enums, CombatPhase, Encounter, History } from '@prisma/client';
import prisma from '../config/database.js';
import itemServices from './itemServices.js';
import {
  applyDamage,
  calculateActionQueueSuccesses,
  calculateCosts,
  calculateDamage,
  calculateRoll,
} from '../utils/rollUtilities.js';
import { getIO } from '../sockets/socket.js';
import characterServices from './characterServices.js';
import actionServices from './actionServices.js';

const encounterServices = {
  getEncounters: async (campaignId: number) => {
    try {
      const encounters = await prisma.encounter.findMany({
        where: {
          campaignId,
        },
        include: {
          characters: { select: { id: true, userId: true } },
          history: {
            include: {
              character: true,
              target: true,
              action: true,
              item: true,
            },
          },
          phaseHistory: {
            include: {
              action: {
                include: {
                  character: true,
                  target: true,
                  action: true,
                  item: true,
                },
              },
              reactions: {
                include: {
                  character: true,
                  target: true,
                  action: true,
                  item: true,
                },
              },
            },
          },
        },
        orderBy: { id: 'asc' },
      });

      return encounters;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch owner encounters');
    }
  },

  getEncounterById: async (encounterId: number) => {
    try {
      const encounter = await prisma.encounter.findUnique({
        where: { id: Number(encounterId) },
        include: {
          campaign: { select: { ownerId: true } },
          characters: { select: { id: true, userId: true } },
          history: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              character: true,
              target: true,
              action: true,
              item: true,
            },
          },
          phaseHistory: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              action: {
                include: {
                  character: true,
                  target: {
                    include: { conditions: { include: { condition: true } } },
                  },
                  action: true,
                  item: true,
                },
              },
              reactions: {
                include: {
                  character: true,
                  target: {
                    include: { conditions: { include: { condition: true } } },
                  },
                  action: true,
                  item: true,
                },
              },
            },
          },
        },
      });

      if (!encounter) {
        throw new Error('Failed to find encounter');
      }

      return encounter;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch encounter');
    }
  },

  getBatchEncounters: async (encounterIds: number[]) => {
    try {
      const encounters = await prisma.encounter.findMany({
        where: {
          id: { in: encounterIds },
        },
        include: {
          characters: true,
          map: { select: { picture: true, name: true } },
          phaseHistory: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              action: {
                include: {
                  character: true,
                  target: true,
                  action: true,
                  item: true,
                },
              },
              reactions: {
                include: {
                  character: true,
                  target: true,
                  action: true,
                  item: true,
                },
              },
            },
          },
        },
      });

      return encounters;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch encounters');
    }
  },

  getEncounterHistory: async (encounterId: number) => {
    try {
      const history = await prisma.history.findMany({
        where: {
          encounterId,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          character: true,
          target: true,
          action: true,
          item: true,
        },
      });

      return history;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch encounter history');
    }
  },

  activateEncounter: async (encounterId: number) => {
    try {
      const io = getIO();

      const encounter = await prisma.encounter.findUnique({
        where: { id: encounterId },
      });

      if (!encounter) {
        throw new Error('Failed to find encounter');
      }

      await prisma.encounter.update({
        where: {
          id: encounterId,
        },
        data: {
          combatPhase:
            encounter.combatPhase === 'pending'
              ? 'initiative'
              : encounter.combatPhase,
          active: encounter ? !encounter?.active : true,
        },
      });

      io.to(`campaign ${encounter.campaignId}`).emit(
        'campaign',
        encounter.campaignId,
      );

      io.to(`campaign ${encounter.campaignId}`).emit('encounter', encounterId);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to activate encounter');
    }
  },

  advancePhase: async (encounterId: number) => {
    try {
      const io = getIO();

      const encounter = await encounterServices.getEncounterById(encounterId);

      if (!encounter) {
        throw new Error('Failed to find encounter');
      }

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

      if (nextPhase === 'action') {
        await prisma.encounter.update({
          where: { id: encounterId },
          data: {
            combatPhase: nextPhase,
            reactions: [],
            passes: [],
            phaseHistory: { create: phaseHistoryData },
          },
        });
      } else {
        await prisma.encounter.update({
          where: { id: encounterId },
          data: {
            combatPhase: nextPhase,
            reactions: [],
            passes: [],
          },
        });
      }

      const updatedEncounter =
        await encounterServices.getEncounterById(encounterId);

      io.to(`encounter ${encounterId}`).emit(
        'updateEncounter',
        updatedEncounter,
      );

      if (nextPhase === 'action') {
        io.to(`encounter ${encounterId}`).emit('resetBoard');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance encounter phase');
    }
  },

  advanceTurn: async (encounter: Encounter, encounterId: number) => {
    try {
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

      io.to(`encounter ${encounterId}`).emit(
        'updateEncounter',
        updatedEncounter,
      );

      io.to(`encounter ${encounterId}`).emit('resetBoard');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  rollInitiative: async (encounterId: number) => {
    try {
      const io = getIO();

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
    } catch (error) {
      console.error(error);
      throw new Error('Failed to roll initiative');
    }
  },

  rollAction: async (
    campaignId: number,
    encounterId: number,
    actionData: {
      activeCharacterId: number;
      targetCharacterId?: number;
      actionId: number;
      modifiers: string[];
      extraDice: number;
      itemId?: number;
    },
  ) => {
    try {
      const io = getIO();
      const activeCharacterPromise = characterServices.getCharacterById(
        actionData.activeCharacterId,
      );

      const actionPromise = actionServices.getActionById(actionData.actionId);

      const targetCharacterPromise = actionData.targetCharacterId
        ? characterServices.getCharacterById(actionData.targetCharacterId)
        : Promise.resolve(null);

      const itemPromise = actionData.itemId
        ? itemServices.getItemById(actionData.itemId)
        : Promise.resolve(null);

      const [activeCharacter, targetCharacter, action, item] =
        await Promise.all([
          activeCharacterPromise,
          targetCharacterPromise,
          actionPromise,
          itemPromise,
        ]);

      const rollResults =
        //@ts-ignore
        action && action.roll.length > 0
          ? calculateRoll(
              activeCharacter?.attributes,
              //@ts-ignore
              { name: action.name, roll: action.roll },
              actionData.modifiers,
              actionData.extraDice,
            ) || { result: [], successes: 0 }
          : null;

      const rolls = new Map();

      const { damage } =
        rollResults && item
          ? //@ts-ignore
            calculateDamage(item, action, rollResults.successes)
          : { damage: null };

      if (rollResults) {
        rolls.set(activeCharacter?.id, {
          characterId: activeCharacter?.id,
          name: `${activeCharacter?.firstName} ${activeCharacter?.lastName}`,
          playerCharacter: activeCharacter?.playerCharacter,
          diceArray: rollResults.result,
          successes: rollResults.successes,
          modifiers: actionData.modifiers,
        });
      }

      const rollsArray = rollResults ? Array.from(rolls.entries()) : null;

      await calculateCosts(activeCharacter, item, action);

      const historyData = {
        characterId: activeCharacter?.id,
        actionId: action?.id,
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
          modifiers: actionData.modifiers,
          damage: damage || 0,
        };
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
        await itemServices.setItemNotAvailable(item.id);
        io.to(`campaign ${campaignId}`).emit('item', item.id);
      }

      io.to(`campaign ${campaignId}`).emit('character', activeCharacter.id);

      return phaseAction;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to roll action');
    }
  },

  rollReaction: async (
    campaignId: number,
    encounterId: number,
    reactionData: {
      reactiveCharacterId: number;
      targetCharacterId?: number;
      reactionId: number;
      modifiers: string[];
      extraDice: number;
      itemId?: number;
    },
  ) => {
    try {
      const io = getIO();

      const reactiveCharacterPromise = characterServices.getCharacterById(
        reactionData.reactiveCharacterId,
      );

      const reactionPromise = actionServices.getActionById(
        reactionData.reactionId,
      );

      const targetCharacterPromise = reactionData.targetCharacterId
        ? characterServices.getCharacterById(reactionData.targetCharacterId)
        : Promise.resolve(null);

      const itemPromise = reactionData.itemId
        ? itemServices.getItemById(reactionData.itemId)
        : Promise.resolve(null);

      const [reactiveCharacter, targetCharacter, reaction, item] =
        await Promise.all([
          reactiveCharacterPromise,
          targetCharacterPromise,
          reactionPromise,
          itemPromise,
        ]);

      const rollResults =
        //@ts-ignore
        reaction && reaction.roll.length > 0
          ? calculateRoll(
              reactiveCharacter?.attributes,
              //@ts-ignore
              { name: reaction.name, roll: reaction.roll },
              reactionData.modifiers,
              reactionData.extraDice,
            ) || { result: [], successes: 0 }
          : null;

      const rolls = new Map();

      if (rollResults) {
        rolls.set(reactiveCharacter?.id, {
          characterId: reactiveCharacter?.id,
          name: `${reactiveCharacter?.firstName} ${reactiveCharacter?.lastName}`,
          playerCharacter: reactiveCharacter?.playerCharacter,
          diceArray: rollResults.result,
          successes: rollResults.successes,
          modifiers: reactionData.modifiers,
        });
      }

      const rollsArray = rollResults ? Array.from(rolls.entries()) : null;

      await calculateCosts(reactiveCharacter, item, reaction);

      const historyData = {
        characterId: reactiveCharacter?.id,
        actionId: reaction?.id,
      } as {
        characterId: number;
        targetId?: number;
        actionId: number;
        itemId?: number;
        rollResult?: {
          result: number[];
          successes: number;
          modifiers: string[];
          damage?: number;
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
          modifiers: reactionData.modifiers,
        };
      }

      const phaseReaction = await encounterServices.createEncounterHistory(
        campaignId,
        encounterId,
        historyData,
      );

      if (rollResults) {
        io.to(`encounter ${encounterId}`).emit('reactionRoll', {
          encounterId,
          rollsArray,
        });
      } else {
        io.to(`encounter ${encounterId}`).emit('reactionRoll', {
          encounterId,
        });
      }

      if (reactiveCharacter) {
        io.to(`campaign ${campaignId}`).emit('character', reactiveCharacter.id);
      }

      if (item) {
        io.to(`campaign ${campaignId}`).emit('item', item.id);
      }

      return phaseReaction;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to roll reaction');
    }
  },

  scheduleReaction: async (encounterId: number, characterId: number) => {
    try {
      const io = getIO();

      const updaptedEncounter = await prisma.encounter.update({
        where: {
          id: encounterId,
        },
        data: {
          reactions: { push: characterId },
        },
        include: {
          characters: true,
          map: { select: { picture: true, name: true } },
          phaseHistory: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              action: {
                include: {
                  character: true,
                  target: true,
                  action: true,
                  item: true,
                },
              },
              reactions: {
                include: {
                  character: true,
                  target: true,
                  action: true,
                  item: true,
                },
              },
            },
          },
        },
      });

      io.to(`encounter ${encounterId}`).emit(
        'updateEncounter',
        updaptedEncounter,
      );
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  passReaction: async (encounterId: number, characterId: number) => {
    try {
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

      io.to(`encounter ${encounterId}`).emit(
        'updateEncounter',
        updatedEncounter,
      );
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  finishReaction: async (encounterId: number, characterId: number) => {
    try {
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

      io.to(`encounter ${encounterId}`).emit(
        'updateEncounter',
        updatedEncounter,
      );
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  passAllReactions: async (encounterId: number) => {
    try {
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

      io.to(`encounter ${encounterId}`).emit(
        'updateEncounter',
        updatedEncounter,
      );
      io.to(`encounter ${encounterId}`).emit('resetBoard');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  confirmActionQueueResults: async (
    encounter: Encounter,
    blockData: { damage: number; blockedDamage: number; armorIds: number[] }[],
  ) => {
    try {
      const io = getIO();

      const phaseHistory = encounter?.phaseHistory[0];

      if (!phaseHistory) {
        throw new Error('Failed to find phase history');
      }
      if (!encounter) {
        throw new Error('Failed to find encounter');
      }

      if (phaseHistory.action?.rollResult) {
        const successes = calculateActionQueueSuccesses(
          encounter?.phaseHistory[0],
        );

        const { damage } =
          phaseHistory.action.item && phaseHistory.action.action
            ? calculateDamage(
                //@ts-ignore
                phaseHistory.action.item,
                phaseHistory.action.action,
                successes,
              )
            : { damage: 0 };

        let blockedDamage = blockData.reduce(
          (sum, data) => sum + data.blockedDamage,
          0,
        );

        const armorCosts = new Map();

        if (blockData) {
          for (const data of blockData) {
            data.armorIds.forEach((id) => {
              const currentValue = armorCosts.get(id);
              if (currentValue) {
                armorCosts.set(id, currentValue + 1);
              } else {
                armorCosts.set(id, 1);
              }
            });
          }

          for (const id of armorCosts.keys()) {
            const armor = await itemServices.getItemById(id);
            await calculateCosts(undefined, armor, {
              costs: {
                currentBlock: armorCosts.get(id),
              },
            });
          }

          const armorIds = Array.from(armorCosts.keys()) || [];

          if (armorIds.length > 0) {
            for (const itemId of armorIds) {
              io.to(`campaign ${encounter.campaignId}`).emit('item', itemId);
            }
          }
        }

        const finalDamage =
          damage - blockedDamage > 0 ? damage - blockedDamage : 0;

        if (phaseHistory.action.target) {
          //@ts-ignore
          await applyDamage(phaseHistory.action.target, finalDamage);

          io.to(`campaign ${encounter.campaignId}`).emit(
            'character',
            phaseHistory.action.target.id,
          );
        }
      }

      io.to(`encounter ${encounter.id}`).emit('resetBoard');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to confirm action queue results');
    }
  },

  createEncounterHistory: async (
    campaignId: number,
    encounterId: number,
    formData: {
      characterId: number;
      targetId?: number;
      actionId: number;
      itemId?: number;
      rollResult?: {
        result: number[];
        successes: number;
        modifiers: string[];
        damage?: number;
      };
    },
  ) => {
    try {
      const history = await prisma.history.create({
        data: {
          campaignId,
          encounterId,
          ...formData,
        },
      });

      return history;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create encounter history entry');
    }
  },

  setPhaseAction: async (encounterId: number, phaseAction: History) => {
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error('Failed to connect phase action');
    }
  },

  setPhaseReaction: async (encounterId: number, phaseReaction: History) => {
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error('Failed to connect phase reaction');
    }
  },

  createOrUpdateEncounter: async (
    campaignId: number,
    mapId: number,
    formData: {
      id?: number;
      name: string;
      turnOrder: number[];
      turnPosition: number;
    },
  ) => {
    const existingEncounter = await prisma.encounter.findFirst({
      where: { mapId },
    });

    if (existingEncounter && formData.id !== existingEncounter.id) {
      throw new Error(
        'You cannot create an encounter on a map which already belongs to another active or pending encounter',
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
      select: { name: true },
    });

    if (!campaign || !map) throw new Error('No campaign or map found');

    const eventData = { name: `Encounter at ${map.name}` } as {
      name: string;
      month: $Enums.Month;
      day: number;
      time?: { hour: number; minute: number; second: number };
    };

    //@ts-ignore
    if (campaign.date && 'month' in campaign.date) {
      //@ts-ignore
      eventData.month = campaign.date.month;
    }
    //@ts-ignore
    if (campaign.date && 'day' in campaign.date) {
      //@ts-ignore
      eventData.day = campaign.date.day;
    }
    //@ts-ignore
    if (campaign.time) {
      //@ts-ignore
      eventData.time = campaign.time;
    }

    const oldEncounter = formData?.id
      ? await prisma.encounter.findUnique({
          where: { id: formData?.id },
        })
      : {};

    const {
      id,
      //@ts-ignore
      mapId: m,
      //@ts-ignore
      campaignId: c,
      ...data
    } = { ...oldEncounter, ...formData };

    try {
      const encounter = await prisma.encounter.upsert({
        where: { id: formData?.id || 0 },
        update: {
          ...data,
          campaign: { connect: { id: campaignId } },
          map: { connect: { id: mapId } },
          characters: {
            set: formData.turnOrder.map((id) => ({ id })),
          },
        },
        create: {
          ...data,
          campaign: { connect: { id: campaignId } },
          map: { connect: { id: mapId } },
          characters: {
            connect: formData.turnOrder.map((id) => ({ id })),
          },
          event: {
            create: { campaign: { connect: { id: campaignId } }, ...eventData },
          },
        },
      });

      return encounter;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create or update encounter');
    }
  },

  deleteEncounter: async (encounterId: number) => {
    try {
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
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to delete encounter');
    }
  },
};

export default encounterServices;

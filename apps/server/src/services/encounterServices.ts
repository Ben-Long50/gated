import { $Enums, History } from '@prisma/client';
import prisma from '../config/database.js';
import itemServices from './itemServices.js';

const encounterServices = {
  getEncounters: async (campaignId: number) => {
    try {
      const encounters = await prisma.encounter.findMany({
        where: {
          campaignId,
        },
        include: {
          characters: { select: { id: true } },
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
          characters: { select: { id: true } },
          history: {
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
        include: {
          character: true,
          target: true,
          action: true,
          item: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return history;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch encounter history');
    }
  },

  activateEncounter: async (encounterId: number) => {
    try {
      const encounter = await prisma.encounter.findUnique({
        where: { id: encounterId },
      });

      console.log(encounter?.active);

      await prisma.encounter.update({
        where: {
          id: encounterId,
        },
        data: {
          active: encounter ? !encounter?.active : true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to activate encounter');
    }
  },

  advanceTurn: async (encounterId: number) => {
    try {
      const encounter = await encounterServices.getEncounterById(encounterId);

      const newRound =
        encounter.turnPosition + 1 >= encounter.turnOrder.length - 1;

      const nextCharacterId = newRound
        ? encounter.turnOrder[0]
        : encounter.turnOrder[encounter.turnPosition + 1];

      const data = {
        turn: encounter.turn + 1,
        turnPosition: newRound ? 0 : encounter.turnPosition + 1,
        combatPhase: 'action',
        reactions: [],
        passes: [],
      } as any;

      const phaseHistoryData = {
        turn: encounter.turn + 1,
      } as any;

      if (newRound) {
        data.round = encounter.round + 1;
        phaseHistoryData.round = encounter.round + 1;
      }

      await prisma.encounter.update({
        where: {
          id: encounterId,
        },
        data: { phaseHistory: { create: phaseHistoryData }, ...data },
      });

      const itemIds =
        (await itemServices.setAllCharacterItemsAvailable(nextCharacterId)) ||
        [];

      return itemIds;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  setCombatPhase: async (encounterId: number, phase: $Enums.CombatPhase) => {
    try {
      await prisma.encounter.update({
        where: {
          id: encounterId,
        },
        data: {
          combatPhase: phase,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  scheduleReaction: async (encounterId: number, characterId: number) => {
    try {
      await prisma.encounter.update({
        where: {
          id: encounterId,
        },
        data: {
          reactions: { push: characterId },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  passReaction: async (encounterId: number, characterId: number) => {
    try {
      await prisma.encounter.update({
        where: {
          id: encounterId,
        },
        data: {
          passes: { push: characterId },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  finishReaction: async (encounterId: number, characterId: number) => {
    try {
      const encounter = await prisma.encounter.findUnique({
        where: { id: encounterId },
        select: { reactions: true, passes: true },
      });

      if (!encounter) throw new Error('Encounter not found');

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
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
    }
  },

  passAllReactions: async (encounterId: number) => {
    try {
      await prisma.encounter.update({
        where: {
          id: encounterId,
        },
        data: {
          reactions: [],
          passes: [],
          combatPhase: 'action',
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to advance turn');
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
        damage: number;
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
      mapId: m,
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

import prisma from '../config/database.js';
import { AffiliationInput } from '../validation/affiliationSchema.js';

const affiliationInclude = {
  factions: true,
  gangs: true,
  characters: true,
  campaign: { select: { ownerId: true } },
};

const affiliationServices = {
  getAffiliationById: async (affiliationId: number) => {
    try {
      const affiliation = await prisma.affiliation.findUnique({
        where: { id: affiliationId },
        include: affiliationInclude,
      });

      return affiliation;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create faction affiliation');
    }
  },

  getBatchAffiliations: async (affiliationIds: number[]) => {
    try {
      const affiliations = prisma.affiliation.findMany({
        where: {
          id: { in: affiliationIds },
        },
        include: affiliationInclude,
      });

      return affiliations;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch characters');
    }
  },

  createAffiliation: async (formData: AffiliationInput) => {
    try {
      const affiliation = await prisma.affiliation.create({
        data: {
          campaignId: formData.campaignId,
          factions: { connect: formData.factionIds.map((id) => ({ id })) },
          gangs: { connect: formData.gangIds.map((id) => ({ id })) },
          characters: { connect: formData.characterIds.map((id) => ({ id })) },
          value: formData.value,
        },
        include: affiliationInclude,
      });

      return affiliation;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create affiliation');
    }
  },

  updateAffiliationValue: async (affiliationId: number, value: number) => {
    try {
      const affiliation = await prisma.affiliation.update({
        where: { id: affiliationId },
        data: { value },
        include: affiliationInclude,
      });

      return affiliation;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update value');
    }
  },

  deleteAffiliation: async (affiliationId: number) => {
    try {
      await prisma.affiliation.delete({ where: { id: affiliationId } });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete affiliation');
    }
  },
};

export default affiliationServices;

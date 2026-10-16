import { AffiliationInput } from '@gated/shared/validation';
import prisma from '../config/database.js';

const affiliationInclude = {
  factions: true,
  gangs: true,
  characters: true,
  campaign: { select: { ownerId: true } },
};

const affiliationServices = {
  getAffiliationById: async (affiliationId: number) => {
    const affiliation = await prisma.affiliation.findUnique({
      where: { id: affiliationId },
      include: affiliationInclude,
    });

    return affiliation;
  },

  getBatchAffiliations: async (affiliationIds: number[]) => {
    const affiliations = prisma.affiliation.findMany({
      where: {
        id: { in: affiliationIds },
      },
      include: affiliationInclude,
    });

    return affiliations;
  },

  createAffiliation: async (formData: AffiliationInput) => {
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
  },

  updateAffiliationValue: async (affiliationId: number, value: number) => {
    const affiliation = await prisma.affiliation.update({
      where: { id: affiliationId },
      data: { value },
      include: affiliationInclude,
    });

    return affiliation;
  },

  deleteAffiliation: async (affiliationId: number) => {
    await prisma.affiliation.delete({ where: { id: affiliationId } });
  },
};

export default affiliationServices;

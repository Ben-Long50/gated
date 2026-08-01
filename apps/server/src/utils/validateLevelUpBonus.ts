import getUsedPoints from './getUsedPoints.js';
import calculateLevelBonus from './calculateLevelBonus.js';
import { Attributes } from '../validation/fieldSchemas.js';
import prisma from '../config/database.js';

const validateLevelUpBonus = async ({
  level,
  attributes,
  perkIds,
}: {
  level: number | undefined;
  attributes?: Attributes;
  perkIds?: number[];
}) => {
  if (!level) {
    return;
  }

  const perks =
    perkIds && perkIds.length > 0
      ? await prisma.perk.findMany({
          where: { id: { in: perkIds } },
          select: { id: true, name: true, attributes: true },
        })
      : [];

  const { attributePoints, skillPoints, perkPoints, masterPerkPoints } =
    calculateLevelBonus(level);

  if (attributes) {
    const { usedAttributePoints, usedSkillPoints } = getUsedPoints(attributes);

    if (usedAttributePoints > attributePoints) {
      throw new Error('Too many Attribute Points distributed');
    }
    if (usedAttributePoints < attributePoints) {
      throw new Error('Not enough Attribute Points distributed');
    }
    if (usedSkillPoints > skillPoints) {
      throw new Error('Too many Skill Points distributed');
    }
    if (usedSkillPoints < skillPoints) {
      throw new Error('Not enough Skill Points distributed');
    }
  }

  if (perks) {
    let selectedPerks = 0;
    let selectedMasterPerks = 0;

    for (const perk of perks) {
      const { usedAttributePoints, usedSkillPoints } = getUsedPoints(
        perk.attributes,
      );

      if (usedAttributePoints + usedSkillPoints < 4) {
        selectedPerks++;
      }
      if (usedAttributePoints + usedSkillPoints >= 4) {
        selectedMasterPerks++;
      }
    }

    if (selectedPerks > perkPoints) {
      throw new Error('Too many Perks chosen');
    }
    if (selectedPerks < perkPoints) {
      throw new Error('Not enough Perks chosen');
    }
    if (selectedMasterPerks > masterPerkPoints) {
      throw new Error('Too many Master Perks chosen');
    }
    if (selectedMasterPerks < masterPerkPoints) {
      throw new Error('Not enough Master Perks chosen');
    }
  }
};

export default validateLevelUpBonus;

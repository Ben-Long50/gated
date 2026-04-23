import { AttributeTree } from '../types/attributeTree';
import getUsedPoints from './getUsedPoints.js';
import calculateLevelBonus from './calculateLevelBonus.js';
import { Perk } from 'src/types/perk';

const validateLevelUpBonus = ({
  level,
  attributes,
  perks,
}: {
  level: number;
  attributes?: AttributeTree;
  perks?: Perk[];
}) => {
  const { attributePoints, skillPoints, perkPoints, masterPerkPoints } =
    calculateLevelBonus(level, attributes, perks);

  const failedValidation = { validated: false, errors: [] as string[] };

  if (attributes) {
    const { usedAttributePoints, usedSkillPoints } = getUsedPoints(attributes);

    if (usedAttributePoints > attributePoints) {
      failedValidation.errors.push(
        `subtract ${usedAttributePoints - attributePoints} Attribute Point(s)`,
      );
    }
    if (usedSkillPoints > skillPoints) {
      failedValidation.errors.push(
        `subtract ${usedSkillPoints - skillPoints} Skill Point(s)`,
      );
    }
    if (usedAttributePoints < attributePoints) {
      failedValidation.errors.push(
        `add ${(usedAttributePoints - attributePoints) * -1} Attribute Point(s)`,
      );
    }
    if (usedSkillPoints < skillPoints) {
      failedValidation.errors.push(
        `add ${(usedSkillPoints - skillPoints) * -1} Skill Point(s)`,
      );
    }
  }

  if (perks) {
    const masterPerks = perks
      ? perks.filter((perk) => {
          const { usedAttributePoints, usedSkillPoints } = getUsedPoints(
            perk.attributes,
          );

          return usedAttributePoints + usedSkillPoints >= 4;
        })
      : [];

    const regularPerks = perks
      ? perks.filter((perk) => !masterPerks.some((p) => p.id === perk.id))
      : [];

    if (regularPerks.length > perkPoints) {
      failedValidation.errors.push(
        `subtract ${regularPerks.length - perkPoints} Perk Point(s)`,
      );
    }
    if (masterPerks.length > masterPerkPoints) {
      failedValidation.errors.push(
        `subtract ${masterPerks.length - masterPerkPoints} Master Perk(s)`,
      );
    }

    if (regularPerks.length < perkPoints) {
      failedValidation.errors.push(
        `add ${(regularPerks.length - perkPoints) * -1} Perk Point(s)`,
      );
    }
    if (masterPerks.length < masterPerkPoints) {
      failedValidation.errors.push(
        `add ${(masterPerks.length - masterPerkPoints) * -1} Master Perk(s)`,
      );
    }
  }

  if (failedValidation.errors.length > 0) {
    return failedValidation;
  }

  return { validated: true };
};

export default validateLevelUpBonus;

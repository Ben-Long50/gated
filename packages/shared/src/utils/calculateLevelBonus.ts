import { AttributeTree } from '../types/attributeTree.js';
import type { Perk } from '../types/perk.js';
import { getUsedPoints } from './getUsedPoints.js';

export const calculateLevelBonus = (level: number) => {
  let levelBonus = null;

  switch (level) {
    case 1:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 12,
        perkPoints: 1,
        masterPerkPoints: 0,
      };
      break;
    case 2:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 1,
        perkPoints: 0,
        masterPerkPoints: 0,
      };
      break;
    case 3:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 0,
        perkPoints: 1,
        masterPerkPoints: 0,
      };
      break;
    case 4:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 1,
        perkPoints: 0,
        masterPerkPoints: 0,
      };
      break;
    case 5:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 0,
        perkPoints: 1,
        masterPerkPoints: 0,
      };
      break;
    case 6:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 0,
        perkPoints: 0,
        masterPerkPoints: 1,
      };
      break;
    case 7:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 1,
        perkPoints: 0,
        masterPerkPoints: 0,
      };
      break;
    case 8:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 0,
        perkPoints: 1,
        masterPerkPoints: 0,
      };
      break;
    case 9:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 1,
        perkPoints: 0,
        masterPerkPoints: 0,
      };
      break;
    case 10:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 0,
        perkPoints: 1,
        masterPerkPoints: 0,
      };
      break;
    case 11:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 1,
        perkPoints: 0,
        masterPerkPoints: 0,
      };
      break;
    case 12:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 0,
        perkPoints: 0,
        masterPerkPoints: 1,
      };
      break;
    default:
      levelBonus = {
        attributePoints: 16,
        skillPoints: 64,
        perkPoints: 10,
        masterPerkPoints: 4,
      };
      break;
  }

  return {
    attributePoints: levelBonus.attributePoints,
    skillPoints: levelBonus.skillPoints,
    perkPoints: levelBonus.perkPoints,
    masterPerkPoints: levelBonus.masterPerkPoints,
  };
};

export default calculateLevelBonus;

export const calculateTotalLevelBonus = (level: number) => {
  let attributePoints = 0;
  let skillPoints = 0;
  let perkPoints = 0;
  let masterPerkPoints = 0;

  for (let i = 1; i <= level; i++) {
    const {
      attributePoints: a,
      skillPoints: s,
      perkPoints: p,
      masterPerkPoints: m,
    } = calculateLevelBonus(i);

    attributePoints += a;
    skillPoints += s;
    perkPoints += p;
    masterPerkPoints += m;
  }

  return {
    attributePoints,
    skillPoints,
    perkPoints,
    masterPerkPoints,
  };
};

export const calculateUsedPoints = (
  attributes?: AttributeTree,
  perks?: Perk[],
) => {
  let attributePoints = 0;
  let skillPoints = 0;
  let perkPoints = 0;
  let masterPerkPoints = 0;

  if (attributes) {
    const { usedAttributePoints, usedSkillPoints } = getUsedPoints(attributes);
    attributePoints += usedAttributePoints;
    skillPoints += usedSkillPoints;
  }

  if (perks) {
    for (const perk of perks) {
      const { usedAttributePoints, usedSkillPoints } = getUsedPoints(
        perk.attributes,
      );

      if (usedAttributePoints + usedSkillPoints < 4) {
        perkPoints++;
      }
      if (usedAttributePoints + usedSkillPoints >= 4) {
        masterPerkPoints++;
      }
    }
  }

  return {
    usedAttributePoints: attributePoints,
    usedSkillPoints: skillPoints,
    usedPerkPoints: perkPoints,
    usedMasterPerkPoints: masterPerkPoints,
  };
};

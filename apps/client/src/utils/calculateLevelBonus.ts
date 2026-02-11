//@ts-nocheck

import { Perk } from '@prisma/client';
import { AttributeTree } from '../types/attributeTree';
import getUsedPoints from './getUsedPoints.js';

const calculateLevelBonus = (
  level: number,
  attributeTree: AttributeTree,
  perks: Perk[],
) => {
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
        attributePoints: 6,
        skillPoints: 13,
        perkPoints: 1,
        masterPerkPoints: 0,
      };
      break;
    case 3:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 13,
        perkPoints: 2,
        masterPerkPoints: 0,
      };
      break;
    case 4:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 14,
        perkPoints: 2,
        masterPerkPoints: 0,
      };
      break;
    case 5:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 14,
        perkPoints: 3,
        masterPerkPoints: 0,
      };
      break;
    case 6:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 14,
        perkPoints: 3,
        masterPerkPoints: 1,
      };
      break;

    case 7:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 15,
        perkPoints: 3,
        masterPerkPoints: 1,
      };
      break;
    case 8:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 15,
        perkPoints: 4,
        masterPerkPoints: 1,
      };
      break;
    case 9:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 16,
        perkPoints: 4,
        masterPerkPoints: 1,
      };
      break;
    case 10:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 16,
        perkPoints: 5,
        masterPerkPoints: 1,
      };
      break;
    case 11:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 17,
        perkPoints: 5,
        masterPerkPoints: 1,
      };
      break;
    case 12:
      levelBonus = {
        attributePoints: 6,
        skillPoints: 17,
        perkPoints: 5,
        masterPerkPoints: 2,
      };
      break;
    default:
      levelBonus = {
        attributePoints: 0,
        skillPoints: 0,
        perkPoints: 0,
        masterPerkPoints: 0,
      };
      break;
  }

  const { usedAttributePoints, usedSkillPoints } = getUsedPoints(attributeTree);

  let usedPerkPoints = 0;
  let usedMasterPerkPoints = 0;

  perks.forEach((perk) => {
    const { usedAttributePoints, usedSkillPoints } = getUsedPoints(
      perk.attributes,
    );

    usedAttributePoints + usedSkillPoints >= 4
      ? usedMasterPerkPoints++
      : usedPerkPoints++;
  });

  return {
    attributePoints: levelBonus.attributePoints,
    skillPoints: levelBonus.skillPoints,
    perkPoints: levelBonus.perkPoints,
    masterPerkPoints: levelBonus.masterPerkPoints,
    usedAttributePoints,
    usedSkillPoints,
    usedPerkPoints,
    usedMasterPerkPoints,
    availableAttributePoints:
      levelBonus.attributePoints - usedAttributePoints < 0
        ? 0
        : levelBonus.attributePoints - usedAttributePoints,
    availableSkillPoints:
      levelBonus.skillPoints - usedSkillPoints < 0
        ? 0
        : levelBonus.skillPoints - usedSkillPoints,
    availablePerkPoints:
      levelBonus.perkPoints - usedPerkPoints < 0
        ? 0
        : levelBonus.perkPoints - usedPerkPoints,
    availableMasterPerkPoints:
      levelBonus.masterPerkPoints - usedMasterPerkPoints < 0
        ? 0
        : levelBonus.masterPerkPoints - usedMasterPerkPoints,
  };
};

export default calculateLevelBonus;

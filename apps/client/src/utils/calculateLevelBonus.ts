//@ts-nocheck

import { Perk } from '@prisma/client';
import { AttributeTree } from '../types/attributeTree';
import { getUsedPoints } from './getUsedPoints.js';

const calculateLevelBonus = (
  level: number,
  attributeTree?: AttributeTree,
  perk?: Perk,
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
        attributePoints: 0,
        skillPoints: 0,
        perkPoints: 0,
        masterPerkPoints: 0,
      };
      break;
  }

  const { usedAttributePoints, usedSkillPoints } = attributeTree
    ? getUsedPoints(attributeTree)
    : { usedAttributePoints: 0, usedSkillPoints: 0 };

  let usedPerkPoints = 0;
  let usedMasterPerkPoints = 0;

  if (perk) {
    const { usedAttributePoints, usedSkillPoints } = getUsedPoints(
      perk.attributes,
    );

    usedAttributePoints + usedSkillPoints >= 4
      ? usedMasterPerkPoints++
      : usedPerkPoints++;
  }

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

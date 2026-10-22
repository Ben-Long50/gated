import {
  AttributeName,
  AttributeTree,
  SkillName,
} from '../types/attributeTree.js';
import { getAttributePoints, getSkillPoints } from './getUsedPoints.js';

export const calculateBestRoll = (
  attributes: AttributeTree,
  rolls: { attribute: AttributeName; skill: SkillName }[],
  modifiers: string[],
  extraDice?: number,
) => {
  const diceCounts = rolls.map((roll) => {
    const attributeDice = getAttributePoints(attributes, roll.attribute);
    const skillDice = getSkillPoints(attributes, roll.skill) ?? 0;

    return { roll, diceCount: attributeDice + skillDice };
  });

  const bestRoll = diceCounts.sort((a, b) => b.diceCount - a.diceCount)[0];

  if (modifiers.includes('push')) {
    bestRoll.diceCount += 2;
  }

  if (extraDice) {
    bestRoll.diceCount += extraDice;
  }

  return bestRoll;
};

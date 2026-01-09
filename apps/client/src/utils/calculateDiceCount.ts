import { Action } from 'src/types/action';
import {
  AttributeName,
  AttributeTree,
  SkillName,
} from 'src/types/attributeTree';

const calculateDiceCount = (
  attributes: AttributeTree,
  action: Partial<Action>,
  modifiers: string[],
  extraDice?: number,
) => {
  if (!action.roll || action.roll.length === 0) {
    return { diceCount: 'N/A' };
  }
  const calculatedRolls =
    action.roll?.map((roll) => {
      const attributePoints =
        attributes[roll.attribute as AttributeName].points;
      const skillPoints =
        attributes[roll.attribute as AttributeName].skills[
          roll.skill as SkillName
        ].points;
      return {
        diceCount: attributePoints + skillPoints,
        roll,
      };
    }) || [];

  const bestRoll = calculatedRolls.sort((a, b) => b.diceCount - a.diceCount)[0];

  if (modifiers.includes('push')) {
    bestRoll.diceCount += 2;
  }

  if (action.name && (action.name === 'Salvo' || action.name === 'Flurry')) {
    bestRoll.diceCount += 2;
  }

  if (extraDice) {
    bestRoll.diceCount += extraDice;
  }

  return bestRoll;
};

export default calculateDiceCount;

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
) => {
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

  if (
    action.name &&
    (action.name === 'Salvo Fire' || action.name === 'Flurry')
  ) {
    bestRoll.diceCount += 2;
  }

  return bestRoll;
};

export default calculateDiceCount;

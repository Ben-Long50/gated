import { ActionRoll } from '../types/action.js';
import { AttributeTree } from '../types/attributeTree.js';

export const calculateRoll = (
  attributes: AttributeTree,
  actionName: string,
  rolls: ActionRoll[],
  modifiers: string[],
  extraDice: number,
) => {
  const { diceCount, extraDiceCount, roll } = calculateDiceCount(
    attributes,
    actionName,
    rolls,
    modifiers,
    extraDice,
  );

  const diceArray = makeRandomDiceArray(diceCount + extraDiceCount);

  const successes = calculateSuccesses(diceArray, modifiers);

  return { diceArray, successes, roll };
};

export const makeRandomDiceArray = (diceCount: number) =>
  Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);

export const calculateDiceCount = (
  attributes: AttributeTree,
  actionName: string,
  rolls: ActionRoll[],
  modifiers: string[],
  extraDice: number,
) => {
  const { roll, diceCount } = calculateBestRoll(attributes, rolls);

  let extraDiceCount = 0;

  if (modifiers.includes('push')) {
    extraDiceCount += 2;
  }

  if (actionName && (actionName === 'Salvo' || actionName === 'Flurry')) {
    extraDiceCount += 2;
  }

  extraDiceCount += extraDice;

  return { roll, diceCount, extraDiceCount };
};

export const calculateBestRoll = (
  attributes: AttributeTree,
  rolls: ActionRoll[],
) => {
  const calculatedRolls =
    rolls.map((roll) => {
      const attributePoints = attributes[roll.attribute].points;
      const skillPoints = attributes[roll.attribute].skills[roll.skill].points;
      return {
        diceCount:
          attributePoints + skillPoints > 0 ? attributePoints + skillPoints : 1,
        roll,
      };
    }) || [];

  return calculatedRolls.sort((a, b) => b.diceCount - a.diceCount)[0];
};

export const calculateSuccesses = (
  diceArray: number[],
  modifiers: string[],
) => {
  let successes = 0;
  successes += diceArray.filter((number) => number >= 5).length;
  if (modifiers.includes('booming')) {
    successes += diceArray.filter((number) => number === 6).length;
  }
  if (modifiers.includes('dooming')) {
    successes -= diceArray.filter((number) => number === 1).length;
  }
  if (modifiers.includes('lucky') && !modifiers.includes('unlucky')) {
    successes += diceArray.filter((number) => number === 4).length;
  }
  if (modifiers.includes('unlucky') && !modifiers.includes('lucky')) {
    successes -= diceArray.filter((number) => number === 5).length;
  }

  return successes;
};

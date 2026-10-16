import { capitalCase } from 'change-case';
import { Character } from '../types/character.js';
import { Item } from '../types/item.js';

export const calculateCosts = (
  costs: Record<string, number>,
  character: Character,
  item?: Item,
) => {
  const characterCosts = {} as Record<string, number>;
  const itemCosts = {} as Record<string, number>;
  const errors = [] as string[];

  Object.entries(costs).forEach(([stat, value]) => {
    if (character.stats[stat] < value) {
      errors.push(`Insufficient ${capitalCase(stat)}`);
    } else {
      characterCosts[stat] = character.stats[stat] - value;
    }
    if (item) {
      if (item.stats[stat] < value) {
        errors.push(`Insufficient ${capitalCase(stat)}`);
      } else {
        itemCosts[stat] = item.stats[stat] - value;
      }
    }
  });

  return { characterCosts, itemCosts, errors };
};

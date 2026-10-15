import { capitalCase } from 'change-case';
import { Character } from 'src/types/character';
import { Item } from 'src/types/item';

const calculateCosts = (
  costs: Record<string, number>,
  character: Character,
  item?: Item,
) => {
  const characterCosts = {};
  const itemCosts = {};
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

export default calculateCosts;

import { noCase } from 'change-case';
import { Action } from 'src/types/action';
import { Character } from 'src/types/character';
import { Item } from 'src/types/item';

const calculateCosts = (character: Character, action: Action, item?: Item) => {
  const costs = action
    ? action.name === 'Salvo Fire'
      ? {
          ...action.costs,
          currentAmmoCount: item?.stats.salvo,
        }
      : action.costs
    : null;

  if (item) {
    if (item?.keywords.some((keyword) => keyword.keyword.name === '2H')) {
      costs.currentHands = 2;
    }

    if (item?.keywords.some((keyword) => keyword.keyword.name === '1H')) {
      costs.currentHands = 1;
    }
  }

  const characterCosts = {};
  const itemCosts = {};
  const errors = [] as string[];

  Object.entries(costs).forEach(([stat, value]) => {
    if (character.stats[stat] < value) {
      errors.push(
        `Your character does not have enough ${noCase(stat)} to complete this action`,
      );
    } else {
      characterCosts[stat] = character.stats[stat] - value;
    }
    if (item?.stats[stat] < value) {
      errors.push(
        `Your item does not have enough ${noCase(stat)} to complete this action`,
      );
    } else {
      itemCosts[stat] = item?.stats[stat] - value;
    }
  });

  return { characterCosts, itemCosts, errors };
};

export default calculateCosts;

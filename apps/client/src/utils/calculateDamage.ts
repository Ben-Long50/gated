import { Action } from 'src/types/action';
import { Item } from 'src/types/item';

export const calculateDamage = (
  item: Item,
  action: Action,
  successes: number,
) => {
  if (
    (action.name === 'Salvo Fire' || action.name === 'Flurry') &&
    successes > 0
  ) {
    const maxSuccesses = item.stats.salvo || item.stats.flurry || 0;
    if (successes < maxSuccesses) {
      return successes * item.stats.damage;
    } else {
      return maxSuccesses * item.stats.damage;
    }
  } else if (action && action.name === 'Haymaker' && successes > 0) {
    return item.keywords.some((keyword) => keyword.keyword.name === '2H')
      ? item.stats.damage + 3
      : item.stats.damage + 2;
  } else if (successes > 0) {
    return item.stats.damage;
  } else {
    return 0;
  }
};

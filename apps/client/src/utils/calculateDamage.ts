import { Action } from 'src/types/action';
import { Item } from 'src/types/item';

export const calculateDamage = (
  item: Item,
  action: Action,
  successes: number,
) => {
  let damage = 0;
  let instances = 0;
  if (
    (action.name === 'Salvo Fire' || action.name === 'Flurry') &&
    successes > 0
  ) {
    const maxSuccesses = item.stats.salvo || item.stats.flurry || 0;
    if (successes < maxSuccesses) {
      damage = successes * item.stats.damage;
      instances = successes;
    } else {
      damage = maxSuccesses * item.stats.damage;
      instances = maxSuccesses;
    }
  } else if (action && action.name === 'Haymaker' && successes > 0) {
    damage = item.keywords.some((keyword) => keyword.keyword.name === '2H')
      ? item.stats.damage + 3
      : item.stats.damage + 2;
    instances = 1;
  } else if (successes > 0) {
    damage = item.stats.damage;
    instances = 1;
  }

  return { damage, instances };
};

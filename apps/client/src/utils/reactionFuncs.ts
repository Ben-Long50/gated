import { Character, getHandsAndFeetCosts } from '@gated/shared';
import { Item } from '@gated/shared';
import statColorMap from '../../../../apps/client/src/utils/statColorMap';

const reactionFuncs = {
  parry: (
    actionCosts: Record<string, number>,
    character?: Character,
    item?: Item,
    successes?: number,
  ) => {
    const requirements = ['character', 'item', 'roll'];
    const range = item ? item.stats.range : 0;
    const color = statColorMap.DMG;
    const costs = { ...actionCosts };
    if (item) {
      const { hands, feet } = getHandsAndFeetCosts(item);
      if (hands) {
        costs.currentHands = hands;
      }
      if (feet) {
        costs.currentFeet = feet;
      }
    }

    return { range, color, costs, requirements, reducedSuccesses: successes };
  },
  opportunityAttack: (
    actionCosts: Record<string, number>,
    character?: Character,
    item?: Item,
    successes?: number,
  ) => {
    const requirements = ['character', 'target', 'item', 'roll'];
    const range = item ? item.stats.range : 0;
    const color = statColorMap.DMG;
    const costs = { ...actionCosts };
    if (item) {
      const { hands, feet } = getHandsAndFeetCosts(item);
      if (hands) {
        costs.currentHands = hands;
      }
      if (feet) {
        costs.currentFeet = feet;
      }
    }

    let damage = item ? item.stats.damage : 0;
    let sanityDamage = item ? item.stats.sanityDamage : 0;
    let instances = 0;

    if (successes && successes > 0) {
      instances = 1;
    }

    return {
      range,
      color,
      costs,
      requirements,
      damage,
      sanityDamage,
      instances,
    };
  },
};

export default reactionFuncs;

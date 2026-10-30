import { Character, getHandsAndFeetCosts } from '@gated/shared';
import { Item } from '@gated/shared';
import statColorMap from './statColorMap';

const actionFuncs = {
  move: (
    actionCosts: Record<string, number>,
    character?: Character,
    item?: Item,
  ) => {
    const requirements = ['character', 'tile'];
    const range = character ? character.stats.speed : 0;
    const color = statColorMap.RNG;
    const costs = { ...actionCosts };

    return { range, color, costs, requirements };
  },
  strike: (
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
  haymaker: (
    actionCosts: Record<string, number>,
    character?: Character,
    item?: Item,
    successes?: number,
  ) => {
    const requirements = ['character', 'target', 'item', 'roll'];
    const range = item ? item.stats.range : 1;
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

    if (damage > 0 && item && item.keywords.length > 0) {
      if (item.keywords.some((keyword) => keyword.keyword.name === '2H')) {
        damage += 3;
      } else {
        damage += 2;
      }
    }

    if (sanityDamage > 0 && item && item.keywords.length > 0) {
      if (item.keywords.some((keyword) => keyword.keyword.name === '2H')) {
        sanityDamage += 3;
      } else {
        sanityDamage += 2;
      }
    }

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
  flurry: (
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
      const maxSuccesses = item ? item.stats.flurry : 1;
      if (successes < maxSuccesses) {
        instances = successes;
      } else {
        instances = maxSuccesses;
      }
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
  charge: (
    actionCosts: Record<string, number>,
    character?: Character,
    item?: Item,
    successes?: number,
  ) => {
    const requirements = ['character', 'target', 'item', 'roll'];
    const range = character ? character.stats.speed + 2 : 0;
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
  throw: (
    actionCosts: Record<string, number>,
    character?: Character,
    item?: Item,
    successes?: number,
  ) => {
    const requirements = ['character', 'target', 'item', 'roll'];
    const range = character
      ? character.attributes.violence.skills.assault.points + 4
      : 4;
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
  singleShot: (
    actionCosts: Record<string, number>,
    character?: Character,
    item?: Item,
    successes?: number,
  ) => {
    const requirements = ['character', 'target', 'item', 'roll'];
    let range = item ? item.stats.range : 0;
    const color = statColorMap.DMG;
    const costs = { ...actionCosts, currentAmmoCount: 1 };
    if (item) {
      const { hands, feet } = getHandsAndFeetCosts(item);
      if (hands) {
        costs.currentHands = hands;
      }
      if (feet) {
        costs.currentFeet = feet;
      }
    }

    const isRifle = item
      ? item.keywords.some((keyword) => keyword.keyword.name === 'Rifle')
      : false;
    const isBraced = item
      ? item.conditions.some(
          (condition) => condition.condition.name === 'Braced',
        )
      : false;
    if (isRifle && isBraced) {
      range = range * 1.5;
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
  salvo: (
    actionCosts: Record<string, number>,
    character?: Character,
    item?: Item,
    successes?: number,
  ) => {
    const requirements = ['character', 'target', 'item', 'roll'];
    let range = item ? item.stats.range : 0;
    const color = statColorMap.DMG;
    const costs = { ...actionCosts, currentAmmoCount: item?.stats.salvo };
    if (item) {
      const { hands, feet } = getHandsAndFeetCosts(item);
      if (hands) {
        costs.currentHands = hands;
      }
      if (feet) {
        costs.currentFeet = feet;
      }
    }

    const isRifle = item
      ? item.keywords.some((keyword) => keyword.keyword.name === 'Rifle')
      : false;
    const isBraced = item
      ? item.conditions.some(
          (condition) => condition.condition.name === 'Braced',
        )
      : false;
    if (isRifle && isBraced) {
      range = range * 1.5;
    }
    let damage = item ? item.stats.damage : 0;
    let sanityDamage = item ? item.stats.sanityDamage : 0;
    let instances = 0;

    if (successes && successes > 0) {
      const maxSuccesses = item ? item.stats.salvo : 1;
      if (successes < maxSuccesses) {
        instances = successes;
      } else {
        instances = maxSuccesses;
      }
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
  block: (
    blockData: {
      blockedDamage: number;
      blockedSanityDamage: number;
      armorIds: number[];
    }[],
    actionQueueResults: {
      successes: number;
      reducedSuccesses: number;
      damage: number;
      sanityDamage: number;
      instances: number;
      blockedDamage: number;
      blockedSanityDamage: number;
      resultingSuccesses: number;
      resultingInstances: number;
    },
  ) => {
    const blockedDamage = blockData.reduce((sum, data) => {
      if (data.blockedDamage < actionQueueResults.damage) {
        return sum + data.blockedDamage;
      } else {
        return sum + actionQueueResults.damage;
      }
    }, 0);

    const armorPoints = blockData.reduce(
      (sum, data) => (data.blockedDamage ? sum + data.blockedDamage : sum),
      0,
    );

    const wardPoints = blockData.reduce(
      (sum, data) =>
        data.blockedSanityDamage ? sum + data.blockedSanityDamage : sum,
      0,
    );

    const blockedSanityDamage = blockData.reduce((sum, data) => {
      if (data.blockedSanityDamage < actionQueueResults.sanityDamage) {
        return sum + data.blockedSanityDamage;
      } else {
        return sum + actionQueueResults.sanityDamage;
      }
    }, 0);

    return { blockedDamage, blockedSanityDamage, armorPoints, wardPoints };
  },
};

export default actionFuncs;

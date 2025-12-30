import { Item } from 'src/types/item';

const actionFuncs = {
  strike: (item: Item, successes: number) => {
    let damage = item.stats.damage || 0;
    let sanityDamage = item.stats.sanityDamage || 0;
    let instances = 0;

    if (successes > 0) {
      instances = 1;
    }

    return { damage, sanityDamage, instances };
  },
  haymaker: (item: Item, successes: number) => {
    let damage =
      item && item.keywords.length > 0
        ? item.keywords.some((keyword) => keyword.keyword.name === '2H')
          ? item.stats.damage + 3
          : item.stats.damage + 2
        : 0;
    let sanityDamage =
      item && item.keywords.length > 0
        ? item.keywords.some((keyword) => keyword.keyword.name === '2H')
          ? item.stats.sanityDamage + 3
          : item.stats.sanityDamage + 2
        : 0;
    let instances = 0;

    if (successes > 0) {
      instances = 1;
    }

    return { damage, sanityDamage, instances };
  },
  flurry: (item: Item, successes: number) => {
    let damage = item.stats.damage || 0;
    let sanityDamage = item.stats.sanityDamage || 0;
    let instances = 0;

    if (successes > 0) {
      const maxSuccesses = item.stats.flurry || 1;
      if (successes < maxSuccesses) {
        instances = successes;
      } else {
        instances = maxSuccesses;
      }
    }

    return { damage, sanityDamage, instances };
  },
  charge: (item: Item, successes: number) => {
    return actionFuncs.strike(item, successes);
  },
  throw: (item: Item, successes: number) => {
    return actionFuncs.strike(item, successes);
  },
  singleShot: (item: Item, successes: number) => {
    let damage = item.stats.damage || 0;
    let sanityDamage = item.stats.sanityDamage || 0;
    let instances = 0;

    if (successes > 0) {
      instances = 1;
    }

    return { damage, sanityDamage, instances };
  },
  salvo: (item: Item, successes: number) => {
    let damage = item.stats.damage || 0;
    let sanityDamage = item.stats.sanityDamage || 0;
    let instances = 0;

    if (successes > 0) {
      const maxSuccesses = item.stats.salvo || 1;
      if (successes < maxSuccesses) {
        instances = successes;
      } else {
        instances = maxSuccesses;
      }
    }

    return { damage, sanityDamage, instances };
  },
  block: (
    blockData: {
      damage: number;
      blockedDamage: number;
      blockedSanityDamage: number;
      armorIds: number[];
    }[],
  ) => {
    const blockedDamage = blockData.reduce(
      (sum, data) => sum + data.blockedDamage,
      0,
    );

    const blockedSanityDamage = blockData.reduce(
      (sum, data) => sum + data.blockedSanityDamage,
      0,
    );

    return { blockedDamage, blockedSanityDamage };
  },
};

export default actionFuncs;

//@ts-nocheck

import { Character, Item } from '@prisma/client';
import itemServices from '../services/itemServices.js';

const reactionFuncs = {
  parry: async (
    character?: Character,
    item?: Item,
    successes?: number,
    tile?: {
      start: { row: number; col: number };
      end: { row: number; col: number };
    },
  ) => {
    if (item) {
      await itemServices.setItemNotAvailable(item.id);
    }

    return { reducedSuccesses: successes };
  },
  opportunityAttack: async (
    character?: Character,
    item?: Item,
    successes?: number,
    tile?: {
      start: { row: number; col: number };
      end: { row: number; col: number };
    },
  ) => {
    let damage = item.stats.damage || 0;
    let sanityDamage = item.stats.sanityDamage || 0;
    let instances = 0;

    if (successes && successes > 0) {
      instances = 1;
    }

    if (item) {
      await itemServices.setItemNotAvailable(item.id);
    }

    return { damage, sanityDamage, instances };
  },
};

export default reactionFuncs;

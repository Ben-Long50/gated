import { Item } from '@prisma/client';
import itemServices from '../services/itemServices.js';

const reactionFuncs = {
  parry: async (item: Item, successes: number) => {
    if (item) {
      await itemServices.setItemNotAvailable(item.id);
    }

    return { reducedSuccesses: successes };
  },
};

export default reactionFuncs;

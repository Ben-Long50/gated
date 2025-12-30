import { Item } from 'src/types/item';

const reactionFuncs = {
  parry: (item: Item, successes: number) => {
    return { reducedSuccesses: successes };
  },
};

export default reactionFuncs;

import { Item } from '../types/item.js';

export const getHandsAndFeetCosts = (item: Item) => {
  let hands = 0;
  let feet = 0;

  if (item?.keywords.some((keyword) => keyword.keyword.name === '2H')) {
    hands = 2;
  } else if (item?.keywords.some((keyword) => keyword.keyword.name === '1H')) {
    hands = 1;
  }

  if (item?.keywords.some((keyword) => keyword.keyword.name === '2F')) {
    feet = 2;
  } else if (item?.keywords.some((keyword) => keyword.keyword.name === '1F')) {
    feet = 1;
  }

  return { hands, feet };
};

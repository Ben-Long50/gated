import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import { KeywordReference } from 'src/types/keyword';

export const extractItemListIds = (itemList: Item[] | Action[]) => {
  return itemList.map((item) => item.id);
};

export const extractKeywordListIds = (keywordList: KeywordReference[]) => {
  return keywordList.map(({ keyword, value }) => ({
    keywordId: keyword.id,
    value,
  }));
};

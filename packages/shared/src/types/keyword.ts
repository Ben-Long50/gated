export type Keyword = {
  id: number;
  name: string;
  description: string;
  keywordType: KeywordType;
  gpCost: number;
};

export type KeywordReference = {
  id: number;
  itemId: number | null;
  modifiedItemId: number | null;
  actionId: number | null;
  keywordId: number;
  keyword: Keyword;
  value: number | null;
};

export enum KeywordType {
  weapon = 'weapon',
  armor = 'armor',
  cybernetic = 'cybernetic',
}

import { Action } from '../types/action.js';
import { Item } from '../types/item.js';
import { Keyword } from '../types/keyword.js';

export const calculateItemStats = (item: Item) => {
  if (!item?.stats && !item?.modifiedStats) return item;

  const modifierObj = {} as Record<string, number>;

  const modifierKeywords = [] as { keyword: Keyword; value: number | null }[];

  const activeActions = item?.linkedActions?.filter(
    (action: Action) => action.active,
  );

  activeActions?.forEach((action: Action) => {
    if (action.modifiers) {
      Object.entries(action.modifiers).forEach(([stat, value]) => {
        if (!modifierObj[stat]) {
          modifierObj[stat] = value;
        } else {
          const currentStat = modifierObj[stat];
          modifierObj[stat] = currentStat + value;
        }
      });
    }
    if (action.keywordModifiers) {
      for (const keyword of action.keywordModifiers) {
        modifierKeywords.push(keyword);
      }
    }
  });

  const combined: Record<string, number> = { ...item.stats };

  const modifiedStats = item?.modifiedStats || {};

  for (const [key, value] of Object.entries(modifiedStats)) {
    if (combined[key]) {
      combined[key] = combined[key] + value;
    } else {
      combined[key] = value;
    }
  }

  for (const [key, value] of Object.entries(modifierObj)) {
    if (combined[key]) {
      combined[key] = combined[key] + value;
    } else {
      combined[key] = value;
    }
  }

  if (item.linkedItems.length > 0) {
    combined.currentSlots = item.linkedItems.length;
  }

  return {
    ...item,
    stats: combined,
    keywords: [...item.keywords, ...modifierKeywords],
  };
};

export default calculateItemStats;

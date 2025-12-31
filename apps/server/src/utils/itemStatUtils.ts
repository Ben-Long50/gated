import { Action, Item } from '@prisma/client';
import { Keyword } from '../types/keyword';

const calculateItemStats = (items: Item[]) => {
  const calculatedItems = items.map((item) => {
    if (!item?.stats && !item?.modifiedStats) return item;

    const modifierObj = {} as Record<string, number>;

    const modifierKeywords = [] as { keyword: Keyword; value: number | null }[];

    const activeActions = item?.itemLinkReference?.actions?.filter(
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
        console.log(action.keywordModifiers);

        for (const keyword of action.keywordModifiers) {
          modifierKeywords.push(keyword);
        }
      }
    });

    const combined: Record<string, number> = {};

    const baseStats = item?.stats || {};
    const modifiedStats = item?.modifiedStats || {};

    for (const [key, value] of Object.entries(baseStats)) {
      combined[key] = value;
    }

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

    return {
      ...item,
      stats: combined,
      keywords: [...item.keywords, ...modifierKeywords],
    };
  });

  return calculatedItems;
};

export default calculateItemStats;

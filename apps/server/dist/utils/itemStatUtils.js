const calculateItemsStats = (items) => {
    const calculatedItems = items.map((item) => calculateItemStats(item));
    return calculatedItems;
};
export const calculateItemStats = (item) => {
    if (!item?.stats && !item?.modifiedStats)
        return item;
    const modifierObj = {};
    const modifierKeywords = [];
    const activeActions = item?.linkedActions.filter((action) => action.active);
    activeActions?.forEach((action) => {
        if (action.modifiers) {
            Object.entries(action.modifiers).forEach(([stat, value]) => {
                if (!modifierObj[stat]) {
                    modifierObj[stat] = value;
                }
                else {
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
    const combined = item.stats;
    const modifiedStats = item?.modifiedStats || {};
    for (const [key, value] of Object.entries(modifiedStats)) {
        if (combined[key]) {
            combined[key] = combined[key] + value;
        }
        else {
            combined[key] = value;
        }
    }
    for (const [key, value] of Object.entries(modifierObj)) {
        if (combined[key]) {
            combined[key] = combined[key] + value;
        }
        else {
            combined[key] = value;
        }
    }
    return {
        ...item,
        stats: combined,
        keywords: [...item.keywords, ...modifierKeywords],
    };
};
export default calculateItemsStats;

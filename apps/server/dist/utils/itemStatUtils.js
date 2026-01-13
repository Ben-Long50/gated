// @ts-nocheck
const calculateItemStats = (items) => {
    const calculatedItems = items.map((item) => {
        var _a, _b;
        if (!(item === null || item === void 0 ? void 0 : item.stats) && !(item === null || item === void 0 ? void 0 : item.modifiedStats))
            return item;
        const modifierObj = {};
        const modifierKeywords = [];
        const activeActions = (_b = (_a = item === null || item === void 0 ? void 0 : item.itemLinkReference) === null || _a === void 0 ? void 0 : _a.actions) === null || _b === void 0 ? void 0 : _b.filter((action) => action.active);
        activeActions === null || activeActions === void 0 ? void 0 : activeActions.forEach((action) => {
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
                console.log(action.keywordModifiers);
                for (const keyword of action.keywordModifiers) {
                    modifierKeywords.push(keyword);
                }
            }
        });
        const combined = {};
        const baseStats = (item === null || item === void 0 ? void 0 : item.stats) ? Object.assign({}, item.stats) : {};
        const modifiedStats = (item === null || item === void 0 ? void 0 : item.modifiedStats) || {};
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
        return Object.assign(Object.assign({}, item), { stats: combined, keywords: [...item.keywords, ...modifierKeywords] });
    });
    return calculatedItems;
};
export default calculateItemStats;

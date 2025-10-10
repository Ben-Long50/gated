export const calculateRoll = (attributes, action, modifiers) => {
    if (!action.roll) {
        return;
    }
    const calculateDiceCount = (attributes, action, modifiers) => {
        var _a;
        const calculatedRolls = ((_a = action.roll) === null || _a === void 0 ? void 0 : _a.map((roll) => {
            const attributePoints = attributes[roll.attribute].points;
            const skillPoints = attributes[roll.attribute].skills[roll.skill].points;
            return {
                diceCount: attributePoints + skillPoints,
                roll,
            };
        })) || [];
        const bestRoll = calculatedRolls.sort((a, b) => b.diceCount - a.diceCount)[0];
        if (modifiers.includes('push')) {
            bestRoll.diceCount += 2;
        }
        if (action.name &&
            (action.name === 'Salvo Fire' || action.name === 'Flurry')) {
            bestRoll.diceCount += 2;
        }
        return bestRoll;
    };
    const bestRoll = calculateDiceCount(attributes, action, modifiers);
    const result = Array.from({ length: bestRoll.diceCount }, () => Math.floor(Math.random() * 6) + 1);
    let successes = 0;
    successes += result.filter((number) => number >= 5).length;
    if (modifiers.includes('booming')) {
        successes += result.filter((number) => number === 6).length;
    }
    if (modifiers.includes('dooming')) {
        successes -= result.filter((number) => number === 1).length;
    }
    if (modifiers.includes('lucky') && !modifiers.includes('unlucky')) {
        successes += result.filter((number) => number === 4).length;
    }
    if (modifiers.includes('unlucky') && !modifiers.includes('lucky')) {
        successes -= result.filter((number) => number === 5).length;
    }
    return { result, successes };
};

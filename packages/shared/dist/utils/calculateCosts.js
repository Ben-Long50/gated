import { capitalCase } from 'change-case';
export const calculateCosts = (costs, character, item) => {
    const characterCosts = {};
    const itemCosts = {};
    const errors = [];
    Object.entries(costs).forEach(([stat, value]) => {
        if (character.stats[stat] < value) {
            errors.push(`Insufficient ${capitalCase(stat)}`);
        }
        else {
            characterCosts[stat] = character.stats[stat] - value;
        }
        if (item) {
            if (item.stats[stat] < value) {
                errors.push(`Insufficient ${capitalCase(stat)}`);
            }
            else {
                itemCosts[stat] = item.stats[stat] - value;
            }
        }
    });
    return { characterCosts, itemCosts, errors };
};

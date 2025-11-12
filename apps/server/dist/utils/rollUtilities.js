import characterServices from '../services/characterServices.js';
import characterStatServices from '../services/characterStatServices.js';
import conditionServices from '../services/conditionServices.js';
import itemStatServices from '../services/itemStatServices.js';
export const calculateRoll = (attributes, action, modifiers, extraDice) => {
    if (!action.roll) {
        return;
    }
    const calculateDiceCount = (attributes, action, modifiers, extraDice) => {
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
        if (extraDice) {
            bestRoll.diceCount += extraDice;
        }
        return bestRoll;
    };
    const bestRoll = calculateDiceCount(attributes, action, modifiers, extraDice);
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
export const calculateActionQueueSuccesses = (phaseHistory) => {
    const actionSuccesses = phaseHistory.action.rollResult.successes;
    const parries = phaseHistory.reactions.filter((reaction) => reaction.name === 'Parry') ||
        [];
    const parrySuccesses = parries.length > 0
        ? parries.reduce((sum, reaction) => sum + reaction.rollResult.successes, 0)
        : 0;
    return actionSuccesses - parrySuccesses;
};
export const calculateDamage = (item, action, successes) => {
    let damage = 0;
    let instances = 0;
    if ((action.name === 'Salvo Fire' || action.name === 'Flurry') &&
        successes > 0) {
        const maxSuccesses = item.stats.salvo || item.stats.flurry || 0;
        if (successes < maxSuccesses) {
            damage = successes * item.stats.damage;
            instances = successes;
        }
        else {
            damage = maxSuccesses * item.stats.damage;
            instances = maxSuccesses;
        }
    }
    else if (action && action.name === 'Haymaker' && successes > 0) {
        damage = item.keywords
            ? item.keywords.some((keyword) => keyword.keyword.name === '2H')
                ? item.stats.damage + 3
                : item.stats.damage + 2
            : item.stats.damage;
        instances = 1;
    }
    else if (successes > 0) {
        damage = item.stats.damage;
        instances = 1;
    }
    return { damage, instances };
};
export const calculateBlockedDamage = (damage, instances, armorData) => {
    const blockedDamagePerInstance = [];
    const sortedArmorData = [...armorData].sort((a, b) => a.armor.stats.armor - b.armor.stats.armor);
    if (instances) {
        for (let i = 0; i < instances; i++) {
            let blockedDamage = 0;
            sortedArmorData.forEach((data) => {
                if (data.blocks > i && blockedDamage < damage / instances) {
                    blockedDamage += data.armor.stats.armor;
                }
            });
            blockedDamagePerInstance.push(blockedDamage > damage / instances ? damage / instances : blockedDamage);
        }
    }
    const totalBlockedDamage = blockedDamagePerInstance.reduce((sum, damage) => sum + damage, 0);
    return totalBlockedDamage;
};
export const calculateArmorDamage = async (item, target, instances) => {
    var _a;
    const equippedArmor = target.characterInventory.items.filter((item) => item.itemTypes.includes('armor') && item.equipped);
    const sortedArmor = equippedArmor
        .filter((armor) => armor.stats.armor && armor.stats.currentBlock)
        .sort((a, b) => b.stats.armor - a.stats.armor);
    const sortedWardArmor = equippedArmor
        .filter((armor) => armor.stats.ward && armor.stats.currentBlock)
        .sort((a, b) => b.stats.ward - a.stats.ward);
    const requiredArmor = (_a = item.stats) === null || _a === void 0 ? void 0 : _a.damage;
    const selectedArmor = [];
    let index = 0;
    let totalSelectedArmorValue = 0;
    while (totalSelectedArmorValue < requiredArmor &&
        index < sortedArmor.length) {
        totalSelectedArmorValue += sortedArmor[index].stats.armor;
        selectedArmor.push(sortedArmor[index]);
        index++;
    }
    const overflowDamage = requiredArmor > totalSelectedArmorValue
        ? requiredArmor - totalSelectedArmorValue
        : 0;
    const itemPromises = [];
    for (const armor of selectedArmor) {
        itemPromises.push(itemStatServices.editItemBlock(armor.id, instances * -1, armor.userId));
    }
    await Promise.all(itemPromises);
    return {
        armorIds: selectedArmor.map((armor) => armor.id),
        overflowDamage,
    };
};
export const calculateCosts = async (character, item, action) => {
    const costs = action
        ? action.name === 'Salvo Fire'
            ? Object.assign(Object.assign({}, action.costs), { currentAmmoCount: item === null || item === void 0 ? void 0 : item.stats.salvo }) : action.costs
        : null;
    if (item) {
        if (item.keywords.some((keyword) => keyword.keyword.name === '2H')) {
            costs.currentHands = 2;
        }
        if (item.keywords.some((keyword) => keyword.keyword.name === '1H')) {
            costs.currentHands = 1;
        }
    }
    const characterCosts = {};
    const itemCosts = {};
    Object.entries(costs).forEach(([stat, value]) => {
        if (character && character.stats[stat]) {
            const costInfo = {
                stat,
                available: character.stats[stat],
                required: value,
            };
            if (costInfo.required > costInfo.available) {
                alert(`Your character does not have enough ${stat} to complete this action`);
            }
            characterCosts[costInfo.stat] = costInfo.available - costInfo.required;
        }
        if (item && item.stats[stat]) {
            const costInfo = {
                stat,
                available: item.stats[stat],
                required: value,
            };
            console.log(costInfo);
            if (costInfo.required > costInfo.available) {
                alert(`Your item does not have enough ${stat} to complete this action`);
            }
            itemCosts[costInfo.stat] = costInfo.available - costInfo.required;
        }
    });
    if (Object.keys(characterCosts).length > 0) {
        await characterStatServices.resetCharacterStat(character.id, characterCosts);
    }
    if (Object.keys(itemCosts).length > 0) {
        await itemStatServices.resetItemStats(item.id, itemCosts);
    }
};
export const applyDamage = async (targetCharacter, damage) => {
    var _a;
    if (!targetCharacter) {
        throw new Error('Target character not found');
    }
    if (((_a = targetCharacter.stats) === null || _a === void 0 ? void 0 : _a.currentHealth) - damage <= 0) {
        if (!!targetCharacter.conditions.some((condition) => condition.condition.name === 'Wounded')) {
            await characterStatServices.editCharacterStat(targetCharacter.id, {
                injuries: 1,
                currentHealth: targetCharacter.stats.currentHealth * -1,
            });
        }
        else {
            const wounded = await conditionServices.getConditionByName('Wounded');
            await characterStatServices.resetCharacterStat(targetCharacter.id, {
                currentHealth: 10,
            });
            await characterServices.createCharacterConditions(targetCharacter.id, [
                { conditionId: wounded === null || wounded === void 0 ? void 0 : wounded.id },
            ]);
        }
    }
    else {
        await characterStatServices.editCharacterStat(targetCharacter.id, {
            currentHealth: damage * -1,
        });
    }
};

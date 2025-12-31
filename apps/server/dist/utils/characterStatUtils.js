// @ts-nocheck
const calculateCharacterStats = (character) => {
    var _a, _b;
    const equipment = ((_a = character.characterInventory) === null || _a === void 0 ? void 0 : _a.items.filter((item) => item.equipped)) || [];
    const actions = ((_b = character.characterInventory) === null || _b === void 0 ? void 0 : _b.actions) || [];
    const attributeTree = character.attributes;
    const perks = character.perks;
    const stats = character.stats;
    const armors = equipment.filter((equip) => equip.itemTypes.includes('armor')) || [];
    const nonArmors = equipment.filter((equip) => !equip.itemTypes.includes('armor')) || [];
    const augmentations = equipment.filter((equip) => equip.itemTypes.includes('augmentation')) || [];
    const armorWeight = armors.reduce((sum, armor) => {
        if (armor.stats && armor.stats.weight && !armor.stats.currentPower) {
            return sum + armor.stats.weight;
        }
        return sum;
    }, 0) || 0;
    const nonArmorWeight = nonArmors.reduce((sum, item) => {
        if (item.stats && item.stats.weight) {
            return sum + item.stats.weight;
        }
        return sum;
    }, 0) || 0;
    const armorValue = armors.reduce((sum, armor) => {
        if (armor.stats && armor.stats.armor && armor.stats.currentBlock) {
            return sum + armor.stats.armor;
        }
        return sum;
    }, 0) || 0;
    const wardValue = armors.reduce((sum, armor) => {
        if (armor.stats && armor.stats.ward && armor.stats.currentBlock) {
            return sum + armor.stats.ward;
        }
        return sum;
    }, 0) || 0;
    const equippedCyber = augmentations.reduce((sum, cybernetic) => {
        if (cybernetic.stats && cybernetic.stats.cyber) {
            return sum + cybernetic.stats.cyber;
        }
        return sum;
    }, 0) || 0;
    const baseStats = {
        maxHealth: 10 + (attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.violence.skills.threshold.points) * 2,
        maxSanity: 5 + (attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.esoterica.skills.mysticism.points) * 2,
        maxEquip: 10 + (attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.violence.skills.threshold.points) * 2,
        maxCyber: 5 + (attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.cybernetica.skills.chromebits.points) * 2,
        speed: 4 + (attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.violence.skills.assault.points) * 1,
        armor: 0 + armorValue,
        ward: 0 + wardValue,
        evasion: 1,
        weight: 0 + nonArmorWeight + armorWeight,
        cyber: 0 + equippedCyber,
        permanentInjuries: (stats === null || stats === void 0 ? void 0 : stats.permanentInjuries) || 5,
        permanentInsanities: (stats === null || stats === void 0 ? void 0 : stats.permanentInsanities) || 5,
        actions: 3,
        reactions: 1,
        hands: 2,
        feet: 2,
        chomebitsTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.cybernetica.skills.chromebits.points,
        hardwiredTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.cybernetica.skills.hardwired.points,
        motorizedTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.cybernetica.skills.motorized.points,
        networkedTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.cybernetica.skills.networked.points,
        gestaltTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.esoterica.skills.gestalt.points,
        godheadTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.esoterica.skills.godhead.points,
        mysticismTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.esoterica.skills.mysticism.points,
        outerworldTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.esoterica.skills.outerworld.points,
        barterTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.peace.skills.barter.points,
        rhetoricTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.peace.skills.rhetoric.points,
        eruditionTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.peace.skills.erudition.points,
        treatmentTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.peace.skills.treatment.points,
        assaultTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.violence.skills.assault.points,
        shootingTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.violence.skills.shooting.points,
        subterfugeTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.violence.skills.subterfuge.points,
        thresholdTn: attributeTree === null || attributeTree === void 0 ? void 0 : attributeTree.violence.skills.threshold.points,
    };
    const calculateBonus = (base, modifiers) => {
        const updated = Object.assign({}, base);
        Object.entries(modifiers).forEach(([stat, value]) => {
            const currentValue = updated[stat] || 0;
            if (typeof value === 'number') {
                updated[stat] = currentValue + value;
            }
            else if (['chromebits', 'hardwired', 'motorized', 'networked'].includes(value)) {
                updated[stat] =
                    currentValue +
                        attributeTree.cybernetica.skills[value].points;
            }
            else if (['gestalt', 'godhead', 'mysticism', 'outerworld'].includes(value)) {
                updated[stat] =
                    currentValue +
                        attributeTree.esoterica.skills[value].points;
            }
            else if (['barter', 'rhetoric', 'erudition', 'treatment'].includes(value)) {
                updated[stat] =
                    currentValue +
                        attributeTree.peace.skills[value].points;
            }
            else if (['assault', 'shooting', 'subterfuge', 'threshold'].includes(value)) {
                updated[stat] =
                    currentValue +
                        attributeTree.violence.skills[value].points;
            }
        });
        return updated;
    };
    let finalStats = Object.assign({}, baseStats);
    if (actions && actions.length > 0) {
        actions.forEach((action) => {
            if (action.active && action.modifiers) {
                finalStats = calculateBonus(finalStats, action.modifiers);
            }
        });
    }
    if (perks && perks.length > 0) {
        perks === null || perks === void 0 ? void 0 : perks.forEach((perk) => {
            if (perk.modifiers) {
                finalStats = calculateBonus(finalStats, perk.modifiers);
            }
        });
    }
    return Object.assign(Object.assign({}, finalStats), stats);
};
export default calculateCharacterStats;

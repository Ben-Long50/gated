import getUsedPoints from './getUsedPoints.js';
import calculateLevelBonus from './calculateLevelBonus.js';
const validateLevelUpBonus = ({ level, attributes, perks, }) => {
    const { attributePoints, skillPoints, perkPoints, masterPerkPoints } = calculateLevelBonus(level, attributes, perks);
    if (attributes) {
        const { usedAttributePoints, usedSkillPoints } = getUsedPoints(attributes);
        if (usedAttributePoints > attributePoints) {
            return false;
        }
        if (usedSkillPoints > skillPoints) {
            return false;
        }
    }
    if (perks) {
        const masterPerks = perks
            ? perks.filter((perk) => {
                const { usedAttributePoints, usedSkillPoints } = getUsedPoints(perk.attributes);
                return usedAttributePoints + usedSkillPoints >= 4;
            })
            : [];
        const regularPerks = perks
            ? perks.filter((perk) => !masterPerks.some((p) => p.id === perk.id))
            : [];
        if (regularPerks.length > perkPoints) {
            return false;
        }
        if (masterPerks.length > masterPerkPoints) {
            return false;
        }
    }
    return true;
};
export default validateLevelUpBonus;

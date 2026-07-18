const calculateLevelBonus = (level) => {
    let levelBonus = null;
    switch (level) {
        case 1:
            levelBonus = {
                attributePoints: 6,
                skillPoints: 12,
                perkPoints: 1,
                masterPerkPoints: 0,
            };
            break;
        case 2:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 1,
                perkPoints: 0,
                masterPerkPoints: 0,
            };
            break;
        case 3:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 0,
                perkPoints: 1,
                masterPerkPoints: 0,
            };
            break;
        case 4:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 1,
                perkPoints: 0,
                masterPerkPoints: 0,
            };
            break;
        case 5:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 0,
                perkPoints: 1,
                masterPerkPoints: 0,
            };
            break;
        case 6:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 0,
                perkPoints: 0,
                masterPerkPoints: 1,
            };
            break;
        case 7:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 1,
                perkPoints: 0,
                masterPerkPoints: 0,
            };
            break;
        case 8:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 0,
                perkPoints: 1,
                masterPerkPoints: 0,
            };
            break;
        case 9:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 1,
                perkPoints: 0,
                masterPerkPoints: 0,
            };
            break;
        case 10:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 0,
                perkPoints: 1,
                masterPerkPoints: 0,
            };
            break;
        case 11:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 1,
                perkPoints: 0,
                masterPerkPoints: 0,
            };
            break;
        case 12:
            levelBonus = {
                attributePoints: 0,
                skillPoints: 0,
                perkPoints: 0,
                masterPerkPoints: 1,
            };
            break;
        default:
            levelBonus = {
                attributePoints: 16,
                skillPoints: 64,
                perkPoints: 10,
                masterPerkPoints: 4,
            };
            break;
    }
    return {
        attributePoints: levelBonus.attributePoints,
        skillPoints: levelBonus.skillPoints,
        perkPoints: levelBonus.perkPoints,
        masterPerkPoints: levelBonus.masterPerkPoints,
    };
};
export default calculateLevelBonus;

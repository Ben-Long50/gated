//@ts-nocheck
const getUsedPoints = (tree) => {
    let usedAttributePoints = 0;
    let usedSkillPoints = 0;
    Object.entries(tree).forEach(([_, details]) => {
        usedAttributePoints += details.points;
        Object.entries(details.skills).forEach(([_, details]) => {
            usedSkillPoints += details.points;
        });
    });
    return { usedAttributePoints, usedSkillPoints };
};
export default getUsedPoints;

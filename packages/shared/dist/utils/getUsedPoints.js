export const getAttributePoints = (tree, attributeName) => {
    return tree[attributeName]?.points ?? 0;
};
export const getSkillPoints = (tree, skillName) => {
    for (const attribute of Object.values(tree)) {
        if (skillName in attribute.skills) {
            return (attribute.skills[skillName].points ?? 0);
        }
    }
};
export const getUsedPoints = (tree) => {
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
export const getAttributeValue = (tree, attribute) => {
    return tree[attribute].points;
};
export const getSkillValue = (tree, attribute, skill) => {
    return tree[attribute].skills[skill].points;
};

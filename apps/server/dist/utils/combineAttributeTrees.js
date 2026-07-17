import emptyAttributeTree from './constants/emptyAttributeTree.js';
export const combineAttributeTrees = (trees) => {
    if (trees.length === 0) {
        return emptyAttributeTree;
    }
    const result = structuredClone(trees[0]);
    for (const attrKey of Object.keys(result)) {
        result[attrKey].points = 0;
        for (const skillKey of Object.keys(result[attrKey].skills)) {
            result[attrKey].skills[skillKey].points = 0;
        }
    }
    for (const tree of trees) {
        for (const attrKey of Object.keys(tree)) {
            const attr = tree[attrKey];
            result[attrKey].points += attr.points;
            for (const skillKey of Object.keys(attr.skills)) {
                result[attrKey].skills[skillKey].points += attr.skills[skillKey].points;
            }
        }
    }
    return result;
};

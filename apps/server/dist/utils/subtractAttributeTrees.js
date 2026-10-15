//@ts-nocheck
const subtractAttributeTrees = (treeA, treeB) => {
    const result = {};
    for (const key in treeA) {
        const nodeA = treeA[key];
        const nodeB = treeB[key];
        result[key] = {
            points: nodeA.points - nodeB.points,
            ...(nodeA.skills && nodeB.skills
                ? {
                    skills: subtractAttributeTrees(nodeA.skills, nodeB.skills),
                }
                : {}),
        };
    }
    return result;
};
export default subtractAttributeTrees;

//@ts-nocheck

import { AttributeTree } from '../types/attributeTree';

const subtractAttributeTrees = (treeA: AttributeTree, treeB: AttributeTree) => {
  const result = {} as AttributeTree;

  for (const key in treeA) {
    const nodeA = treeA[key];
    const nodeB = treeB[key];

    result[key] = {
      points: nodeA.points - nodeB.points,
      ...(nodeA.skills && nodeB.skills
        ? {
            skills: subtractAttributeTrees(
              nodeA.skills as AttributeTree,
              nodeB.skills as AttributeTree,
            ),
          }
        : {}),
    };
  }

  return result;
};

export default subtractAttributeTrees;

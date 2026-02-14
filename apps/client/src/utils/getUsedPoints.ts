import {
  AttributeName,
  AttributeTree,
  SkillName,
} from 'src/types/attributeTree';

const getUsedPoints = (tree: AttributeTree) => {
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

export const getAttributeValue = (
  tree: AttributeTree,
  attribute: AttributeName,
) => {
  return tree[attribute].points;
};

export const getSkillValue = (
  tree: AttributeTree,
  attribute: AttributeName,
  skill: SkillName,
) => {
  return tree[attribute].skills[skill].points;
};

export const subtractAttributeTrees = (
  treeA: AttributeTree,
  treeB: AttributeTree,
) => {
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
    } as T[typeof key];
  }

  return result;
};

export default getUsedPoints;

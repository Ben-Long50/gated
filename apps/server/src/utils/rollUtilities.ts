export const calculateRoll = (
  attributes: AttributeTree,
  action: Partial<Action>,
  modifiers: string[],
) => {
  if (!action.roll) {
    return;
  }

  const calculateDiceCount = (
    attributes: AttributeTree,
    action: Partial<Action>,
    modifiers: string[],
  ) => {
    const calculatedRolls =
      action.roll?.map((roll) => {
        const attributePoints =
          attributes[roll.attribute as AttributeName].points;
        const skillPoints =
          attributes[roll.attribute as AttributeName].skills[
            roll.skill as SkillName
          ].points;
        return {
          diceCount: attributePoints + skillPoints,
          roll,
        };
      }) || [];

    const bestRoll = calculatedRolls.sort(
      (a, b) => b.diceCount - a.diceCount,
    )[0];

    if (modifiers.includes('push')) {
      bestRoll.diceCount += 2;
    }

    if (
      action.name &&
      (action.name === 'Salvo Fire' || action.name === 'Flurry')
    ) {
      bestRoll.diceCount += 2;
    }

    return bestRoll;
  };

  const bestRoll = calculateDiceCount(attributes, action, modifiers);

  const result = Array.from(
    { length: bestRoll.diceCount },
    () => Math.floor(Math.random() * 6) + 1,
  );

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

import characterServices from '../services/characterServices.js';
import characterStatServices from '../services/characterStatServices.js';
import conditionServices from '../services/conditionServices.js';
import itemStatServices from '../services/itemStatServices.js';
import { Character } from '../types/character.js';

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

    console.log(action.name);

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

export const calculateDamage = (
  item: Item,
  action: Action,
  successes: number,
) => {
  if (
    (action.name === 'Salvo Fire' || action.name === 'Flurry') &&
    successes > 0
  ) {
    const maxSuccesses = item.stats.salvo || item.stats.flurry || 0;
    if (successes < maxSuccesses) {
      return successes * item.stats.damage;
    } else {
      return maxSuccesses * item.stats.damage;
    }
  } else if (action && action.name === 'Haymaker' && successes > 0) {
    return item.keywords.some((keyword) => keyword.keyword.name === '2H')
      ? item.stats.damage + 3
      : item.stats.damage + 2;
  } else if (successes > 0) {
    return item.stats.damage;
  } else {
    return 0;
  }
};

export const calculateCosts = async (character, item, action) => {
  const costs = action
    ? action.name === 'Salvo Fire'
      ? {
          ...action.costs,
          currentAmmoCount: item?.stats.salvo,
        }
      : action.costs
    : null;

  if (item) {
    if (item.keywords.some((keyword) => keyword.keyword.name === '2H')) {
      costs.currentHands = 2;
    }

    if (item.keywords.some((keyword) => keyword.keyword.name === '1H')) {
      costs.currentHands = 1;
    }
  }

  const characterCosts = {};
  const itemCosts = {};

  Object.entries(costs).forEach(([stat, value]) => {
    if (character && character.stats[stat]) {
      const costInfo = {
        stat,
        available: character.stats[stat],
        required: value,
      };
      if (costInfo.required > costInfo.available) {
        alert(
          `Your character does not have enough ${stat} to complete this action`,
        );
      }
      characterCosts[costInfo.stat] = costInfo.available - costInfo.required;
    }
    if (item && item.stats[stat]) {
      const costInfo = {
        stat,
        available: item.stats[stat],
        required: value,
      };
      if (costInfo.required > costInfo.available) {
        alert(`Your item does not have enough ${stat} to complete this action`);
      }
      itemCosts[costInfo.stat] = costInfo.available - costInfo.required;
    }
  });

  if (Object.keys(characterCosts).length > 0) {
    await characterStatServices.resetCharacterStat(
      character.id,
      characterCosts,
    );
  }

  if (Object.keys(itemCosts).length > 0) {
    await itemStatServices.resetItemStats(item.id, itemCosts);
  }
};

export const applyDamage = async (
  targetCharacter: Character,
  damage: number,
) => {
  if (!targetCharacter) {
    throw new Error('Target character not found');
  }

  if (targetCharacter.stats?.currentHealth - damage <= 0) {
    if (
      !!targetCharacter.conditions.some(
        (condition) => condition.condition.name === 'Wounded',
      )
    ) {
      await characterStatServices.editCharacterStat(targetCharacter.id, {
        injuries: 1,
        currentHealth: targetCharacter.stats.currentHealth * -1,
      });
    } else {
      const wounded = await conditionServices.getConditionByName('Wounded');
      await characterStatServices.resetCharacterStat(targetCharacter.id, {
        currentHealth: targetCharacter.stats.maxHealth,
      });
      await characterServices.createCharacterConditions(targetCharacter.id, [
        { conditionId: wounded?.id },
      ]);
    }
  } else {
    await characterStatServices.editCharacterStat(targetCharacter.id, {
      currentHealth: damage * -1,
    });
  }
};

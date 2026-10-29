//@ts-nocheck

import {
  Action,
  AttributeName,
  AttributeTree,
  Character,
  Item,
  SkillName,
} from '@gated/shared';
import characterServices from '../services/characterServices.js';
import characterStatServices from '../services/characterStatServices.js';
import conditionServices from '../services/conditionServices.js';
import itemStatServices from '../services/itemStatServices.js';

export const calculateActionQueueSuccesses = (phaseHistory) => {
  const actionSuccesses = phaseHistory.action.rollResult.successes;

  const parries =
    phaseHistory.reactions.filter((reaction) => reaction.name === 'Parry') ||
    [];

  const parrySuccesses =
    parries.length > 0
      ? parries.reduce(
          (sum, reaction) => sum + reaction.rollResult.successes,
          0,
        )
      : 0;

  return actionSuccesses - parrySuccesses;
};

export const calculateDamage = (
  item: Item,
  action: Action,
  successes: number,
) => {
  let damage = 0;
  let instances = 0;
  if (
    (action.name === 'Salvo Fire' || action.name === 'Flurry') &&
    successes > 0
  ) {
    const maxSuccesses = item.stats.salvo || item.stats.flurry || 0;
    if (successes < maxSuccesses) {
      damage = successes * item.stats.damage;
      instances = successes;
    } else {
      damage = maxSuccesses * item.stats.damage;
      instances = maxSuccesses;
    }
  } else if (action && action.name === 'Haymaker' && successes > 0) {
    damage =
      item.keywords.length > 0
        ? item.keywords.some((keyword) => keyword.keyword.name === '2H')
          ? item.stats.damage + 3
          : item.stats.damage + 2
        : item.stats.damage;
    instances = 1;
  } else if (successes > 0) {
    damage = item.stats.damage;
    instances = 1;
  }

  return { damage, instances };
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
  sanityDamage: number,
) => {
  if (!targetCharacter) {
    throw new Error('Target character not found');
  }

  if (targetCharacter.stats?.currentHealth - damage <= 0) {
    const isWounded = targetCharacter.conditions.some(
      (condition) => condition.condition.name === 'Wounded',
    );

    if (isWounded) {
      if (
        targetCharacter.stats.injuries + 1 >=
        targetCharacter.stats.permanentInjuries
      ) {
        const deadForGood =
          await conditionServices.getConditionByName('Dead for Good');
        await characterServices.createCharacterConditions(targetCharacter.id, [
          { conditionId: deadForGood?.id },
        ]);
      } else {
        await characterStatServices.editCharacterStat(targetCharacter.id, {
          injuries: 1,
          currentHealth: targetCharacter.stats.currentHealth * -1,
        });
      }
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

  if (targetCharacter.stats?.currentSanity - sanityDamage <= 0) {
    const isDeranged = targetCharacter.conditions.some(
      (condition) => condition.condition.name === 'Deranged',
    );

    if (isDeranged) {
      if (
        targetCharacter.stats.insanities + 1 >=
        targetCharacter.stats.permanentInsanities
      ) {
        const insane = await conditionServices.getConditionByName('Insane');
        await characterServices.createCharacterConditions(targetCharacter.id, [
          { conditionId: insane?.id },
        ]);
      } else {
        await characterStatServices.editCharacterStat(targetCharacter.id, {
          insanities: 1,
          currentSanity: targetCharacter.stats.currentSanity * -1,
        });
      }
    } else {
      const deranged = await conditionServices.getConditionByName('Deranged');
      await characterStatServices.resetCharacterStat(targetCharacter.id, {
        currentSanity: targetCharacter.stats.maxSanity,
      });
      await characterServices.createCharacterConditions(targetCharacter.id, [
        { conditionId: deranged?.id },
      ]);
    }
  } else {
    await characterStatServices.editCharacterStat(targetCharacter.id, {
      currentSanity: sanityDamage * -1,
    });
  }
};

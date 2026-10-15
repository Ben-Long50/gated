import { PhaseHistory } from 'src/types/encounter';
import actionFuncs from '../../../../apps/client/src/utils/actionFuncs';
import { camelCase } from 'change-case';
import reactionFuncs from './reactionFuncs';
import calculateItemStats from './calculateItemStats';

const mergeActionResults = (target, source) => {
  for (const key in source) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (typeof srcVal === 'number' && typeof tgtVal === 'number') {
      target[key] = tgtVal + srcVal;
    } else if (tgtVal === undefined) {
      target[key] = srcVal;
    } else {
      target[key] = srcVal;
    }
  }
};

const parsePhaseAction = (
  phaseHistory: PhaseHistory,
  blockData?: {
    blockedDamage: number;
    blockedSanityDamage: number;
    armorIds: number[];
  }[],
) => {
  if (!phaseHistory || !phaseHistory.action) {
    return;
  }

  const phaseAction = phaseHistory.action;
  const phaseReactions = phaseHistory.reactions;

  const phaseActionSuccesses = phaseAction.rollResult
    ? phaseAction.rollResult.successes
    : 0;

  const actionResults = actionFuncs[
    `${camelCase(phaseAction.actionSnapshot.name)}`
  ](
    phaseAction.actionSnapshot.costs,
    phaseAction.characterSnapshot,
    calculateItemStats(phaseAction.itemSnapshot),
    phaseActionSuccesses,
  );

  const armorCosts = new Map();

  if (blockData) {
    const data = actionFuncs.block(blockData, actionResults);
    mergeActionResults(actionResults, data);

    for (const data of blockData) {
      data.armorIds.forEach((id) => {
        const currentValue = armorCosts.get(id);
        if (currentValue) {
          armorCosts.set(id, currentValue + 1);
        } else {
          armorCosts.set(id, 1);
        }
      });
    }
  }

  const reactionResults = phaseReactions.map((reaction) => {
    const phaseReactionSuccesses = reaction.rollResult
      ? reaction.rollResult.successes
      : 0;

    const results = reactionFuncs[`${camelCase(reaction.actionSnapshot.name)}`](
      phaseAction.actionSnapshot.costs,
      phaseAction.characterSnapshot,
      calculateItemStats(phaseAction.itemSnapshot),
      phaseReactionSuccesses,
    );

    return results;
  });

  return { actionResults, reactionResults };
};

export default parsePhaseAction;

import { PhaseHistory } from 'src/types/encounter';
import actionFuncs from './actionFuncs';
import { camelCase } from 'change-case';
import reactionFuncs from './reactionFuncs';

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
  const actionQueueResults = {
    successes: 0,
    reducedSuccesses: 0,
    damage: 0,
    sanityDamage: 0,
    instances: 0,
    blockedDamage: 0,
    blockedSanityDamage: 0,
    resultingSuccesses: 0,
    resultingInstances: 0,
    armorPoints: 0,
    wardPoints: 0,
  };

  if (!phaseHistory) {
    return actionQueueResults;
  }

  if (phaseHistory.action?.rollResult) {
    actionQueueResults.successes = phaseHistory.action?.rollResult.successes;

    const actionResults = actionFuncs[
      `${camelCase(phaseHistory.action.actionSnapshot.name)}`
    ](
      phaseHistory.action.itemSnapshot,
      phaseHistory.action.rollResult.successes,
    );

    mergeActionResults(actionQueueResults, actionResults);

    for (const reaction of phaseHistory.reactions) {
      const reactionResults = reactionFuncs[
        `${camelCase(reaction.actionSnapshot.name)}`
      ](reaction.itemSnapshot, reaction.rollResult.successes);

      mergeActionResults(actionQueueResults, reactionResults);
    }

    const armorCosts = new Map();

    if (blockData) {
      const data = actionFuncs.block(blockData, actionQueueResults);
      mergeActionResults(actionQueueResults, data);

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

    const results = {
      resultingSuccesses:
        actionQueueResults.successes - actionQueueResults.reducedSuccesses,
      resultingInstances:
        actionQueueResults.successes - actionQueueResults.reducedSuccesses <
        actionQueueResults.instances
          ? actionQueueResults.successes - actionQueueResults.reducedSuccesses
          : actionQueueResults.instances,
    };

    mergeActionResults(actionQueueResults, results);
  }

  return actionQueueResults;
};

export default parsePhaseAction;

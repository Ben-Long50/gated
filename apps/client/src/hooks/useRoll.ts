import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Action } from 'src/types/action';
import {
  AttributeName,
  AttributeTree,
  SkillName,
} from 'src/types/attributeTree';

const useRoll = () => {
  const [rolling, setRolling] = useState(false);
  const [rollCounter, setRollCounter] = useState(0);
  const [rollComplete, setRollComplete] = useState(false);
  const rollRef = useRef(new Map());
  const timeoutRef = useRef<number | null>(null);
  const queryClient = useQueryClient();

  const animateRoll = (rollMap, setRolls): Promise<number> => {
    setRollComplete(false);
    setRolling(true);

    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      let count = 1;
      const maxRolls = 18;

      const rollOnce = () => {
        const fakeRollMap = new Map();
        for (const [key, value] of rollMap) {
          const fakeDiceArray = Array.from(
            { length: value.diceArray.length },
            () => Math.floor(Math.random() * 6) + 1,
          );

          fakeRollMap.set(key, { ...value, diceArray: fakeDiceArray });
        }

        if (count < maxRolls) {
          setRolls(fakeRollMap);
          count++;
        }

        if (count >= maxRolls) {
          const sortedRollMap = new Map(
            [...rollMap.entries()].sort(
              (a, b) => b[1].successes - a[1].successes,
            ),
          );

          setRolls(sortedRollMap);
          setRollComplete(true);
          setRolling(false);
          setRollCounter((prev) => prev + 1);
          resolve(rollMap);

          return;
        }

        const delay = count * 15;
        timeoutRef.current = setTimeout(rollOnce, delay);
      };

      rollOnce();
    });
  };

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

  const calculateRoll = (
    attributes: AttributeTree,
    action: Partial<Action>,
    modifiers: string[],
  ) => {
    if (!action.roll) {
      return;
    }

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

  const resetRolls = () => {
    rollRef.current = new Map();
    setRollCounter(0);
  };

  return {
    rollData: rollRef.current,
    rolling,
    calculateDiceCount,
    calculateRoll,
    animateRoll,
    rollComplete,
    rollCounter,
    resetRolls,
  };
};

export default useRoll;
